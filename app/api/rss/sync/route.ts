import { NextRequest, NextResponse } from "next/server";
import Parser from "rss-parser";
import { prisma } from "@/lib/prisma";
import ARTICLE_KEYWORDS from '@/lib/ARTICLE_KEYWORDS.json'
import RSS_FEEDS from "@/lib/RSS_FEEDS.json";

const FEEDS = RSS_FEEDS.feeds

const ACCESS_KEY = "90b5327d-86b0-41fe-adee-0699e4062f36";

type CustomItem = {
  creator?: string;
  title: string;
  link: string;
  pubDate?: string;
  dcCreator?: string;
  content: string;
  contentSnippet?: string;
  guid?: string | { _: string };
  isoDate?: string;
  categories?: string[];
  "content:encoded"?: string;
  thumbnail?: string;
};

const parser: Parser<{}, CustomItem> = new Parser();

function getMatchingCategories(text: string): string[] {
  if (!text) return [];

  const lowerText = text.toLowerCase();
  const matched: Set<string> = new Set();

  for (const [category, keywords] of Object.entries(ARTICLE_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        matched.add(category);
        break;
      }
    }
  }

  return Array.from(matched);
}

async function fetchFavicon(siteUrl: string): Promise<string | null> {
  try {
    const origin = new URL(siteUrl).origin;
    const res = await fetch(origin);
    const html = await res.text();

    const match =
      html.match(/<link[^>]+rel=["'](?:shortcut icon|icon)["'][^>]*href=["']([^"']+)["']/i) ||
      html.match(/<link[^>]+href=["']([^"']+)["'][^>]*rel=["'](?:shortcut icon|icon)["']/i);

    if (match?.[1]) {
      const href = match[1];
      if (href.startsWith("http")) return href;
      return origin + (href.startsWith("/") ? href : `/${href}`);
    }

    return `${origin}/favicon.ico`;
  } catch {
    return null;
  }
}

async function fetchOgImage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    const html = await res.text();
    const ogMatch =
      html.match(/<meta\s+property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
      html.match(/<meta\s+content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
    return ogMatch?.[1] || null;
  } catch {
    return null;
  }
}

async function createArticle(data: {
  title: string;
  content: string;
  contentSnippet?: string;
  creator?: string;
  pubDate?: string | null;
  dcCreator?: string | null;
  link?: string | null;
  guid?: string | null;
  isoDate?: string | null;
  favicon?: string | null;
  websiteName?: string | null;
  thumbnail?: string | null;
  categories?: string[];
  contentEncoded?: string;
  websiteId?: string | null;
}) {
  const orConditions = [];

  if (data.guid) orConditions.push({ guid: data.guid });
  if (data.link) orConditions.push({ link: data.link });
  if (data.title && data.pubDate) {
    orConditions.push({
      title: { equals: data.title, mode: "insensitive" },
      pubDate: data.pubDate,
    });
  }

  const existingArticle = await prisma.article.findFirst({
    where: { OR: orConditions },
  });

  if (existingArticle) {
    return { exists: true, article: existingArticle };
  }

  const article = await prisma.article.create({
    data: {
      title: data.title,
      content: data.content,
      contentSnippet: data.contentSnippet || "",
      creator: data.creator || "RSS Feed",
      pubDate: data.pubDate ?? new Date().toISOString(),
      dcCreator: data.dcCreator || null,
      link: data.link || null,
      guid: data.guid || null,
      isoDate: data.isoDate || null,
      favicon: data.favicon || null,
      websiteName: data.websiteName || null,
      thumbnail: data.thumbnail || null,
      categories: data.categories || [],
      contentEncoded: data.contentEncoded || "",
      websiteId: data.websiteId || null,
    },
  });

  return { exists: false, article };
}

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");

  if (key !== ACCESS_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const allWebsites = await prisma.website.findMany({
      select: { id: true, url: true, name: true, favicon: true },
    });

    const websiteMap = new Map(allWebsites.map((w) => [w.url, w]));

    for (const feedUrl of FEEDS) {
      try {
        const feed = await parser.parseURL(feedUrl);
        const siteOrigin = new URL(feed.link || feedUrl).origin;

        let website = websiteMap.get(siteOrigin);

        if (!website) {
          const favicon = await fetchFavicon(siteOrigin);
          const categories = getMatchingCategories(feed.title || siteOrigin);

          website = await prisma.website.create({
            data: {
              url: siteOrigin,
              name: feed.title || siteOrigin,
              favicon: favicon,
              category: categories,
            },
          });

          websiteMap.set(siteOrigin, website);
        }

        for (const item of feed.items) {
          if (!item.title) continue;

          const thumbnail =
            item.thumbnail ||
            (item.link ? await fetchOgImage(item.link) : null) ||
            null;

          const guidValue =
            typeof item.guid === "string" ? item.guid : item.guid?._ || null;

          const { exists } = await createArticle({
            title: item.title,
            content: item.content || "",
            contentSnippet: item.contentSnippet || "",
            creator: item.creator || "RSS Feed",
            pubDate: item.pubDate || null,
            dcCreator: item.dcCreator || null,
            link: item.link || null,
            guid: guidValue,
            isoDate: item.isoDate || null,
            favicon: website.favicon || null,
            websiteName: website.name || null,
            thumbnail,
            categories: item.categories || [],
            contentEncoded: item["content:encoded"] || "",
            websiteId: website.id,
          });

          if (exists) {
            console.log(`[RSS] Skipped existing article: ${item.title}`);
          }
        }
      } catch (err) {
        console.error(`[RSS] Failed to parse or handle feed: ${feedUrl}`, err);
      }
    }

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("RSS sync error:", error);
    return NextResponse.json(
      { error: "Failed to sync RSS feeds" },
      { status: 500 }
    );
  }
}
