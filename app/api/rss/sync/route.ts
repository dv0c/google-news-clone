import { NextResponse } from "next/server";
import Parser from "rss-parser";
import { prisma } from "@/lib/prisma"; // Adjust import path

const FEEDS = [
  "https://www.newsit.gr/feed",
  "https://feeds.feedburner.com/dikaiologitika/ZteV",
  "https://unboxholics.com/news?format=rss",
  "https://www.protothema.gr/rss",
  "https://www.naftemporiki.gr/feed/",
  "https://www.newsit.gr/feed",
  "https://ilia.news/feed/",
  "https://www.in.gr/feed",
  "https://www.ilialive.gr/newsfeed?format=feed",
  "https://www.autoblog.gr/feed/",
];

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

// Internal helper to create article (similar to your POST route logic)
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
  // Check if article exists by title (case insensitive)
  const existingArticle = await prisma.article.findFirst({
    where: {
      title: {
        equals: data.title,
        mode: "insensitive",
      },
    },
  });
  if (existingArticle) {
    return { exists: true, article: existingArticle };
  }

  // Create new article
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

export async function GET() {
  try {
    // Load all websites into map
    const allWebsites = await prisma.website.findMany({
      select: { id: true, url: true, name: true, favicon: true },
    });
    const websiteMap = new Map(allWebsites.map((w) => [w.url, w]));

    for (const feedUrl of FEEDS) {
      const feed = await parser.parseURL(feedUrl);
      const siteUrl = new URL(feed.link || feedUrl).origin;

      // Get or create website in memory map
      let website = websiteMap.get(siteUrl);
      if (!website) {
        website = await prisma.website.create({
          data: {
            url: siteUrl,
            name: feed.title || siteUrl,
            favicon: null,
          },
        });
        websiteMap.set(siteUrl, website);
      }

      for (const item of feed.items) {
        // Skip if no title
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
          console.log(`Article exists, skipping: ${item.title}`);
        }
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
