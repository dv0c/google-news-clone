import { prisma as db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import Fuse from "fuse.js";

function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function highlight(text: string, query: string) {
  if (!query) return text;
  const escaped = query.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const rawQuery = searchParams.get("q") || "";
  const query = normalize(rawQuery);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  if (query.length < 2) {
    return NextResponse.json({
      articles: [],
      websites: [],
      categories: [],
      totalArticles: 0,
      totalCategories: 0,
      page,
      limit,
    });
  }

  // 1. Fetch all articles and websites (limit for performance)
  const [articlesRaw, websitesRaw, allArticles] = await Promise.all([
    db.article.findMany({
      select: {
        id: true,
        title: true,
        websiteName: true,
        link: true,
        thumbnail: true,
        categories: true,
      },
      take: 300,
    }),
    db.website.findMany({
      select: {
        id: true,
        name: true,
        url: true,
        favicon: true,
      },
      take: 100,
    }),
    db.article.findMany({
      select: { categories: true },
      take: 500,
    }),
  ]);

  // 2. Fuzzy search on articles
  const fuseArticles = new Fuse(articlesRaw, {
    keys: ["title", "websiteName", "categories", "content", "contentSnippet", "contentEncoded"],
    threshold: 0.2, // adjust sensitivity
    includeScore: true,
  });

  const filteredArticles = fuseArticles.search(rawQuery).map((result) => result.item);

  // Paginate articles
  const paginatedArticles = filteredArticles.slice((page - 1) * limit, page * limit);

  const articles = paginatedArticles.map((a) => ({
    ...a,
    title: highlight(a.title, rawQuery),
    websiteName: a.websiteName ? highlight(a.websiteName, rawQuery) : null,
  }));

  // 3. Fuzzy search on websites
  const fuseWebsites = new Fuse(websitesRaw, {
    keys: ["name", "url"],
    threshold: 0.4,
  });

  const websites = fuseWebsites.search(rawQuery).slice(0, 5).map((r) => r.item);

  // 4. Fuzzy search on categories
  const categoriesSet = new Set<string>();
  allArticles.forEach(({ categories }) => {
    if (!categories) return;
    categories.forEach((cat) => {
      const catNorm = normalize(cat);
      if (catNorm.includes(query)) categoriesSet.add(cat);
    });
  });

  const categoriesArray = Array.from(categoriesSet);
  const paginatedCategories = categoriesArray.slice((page - 1) * limit, page * limit);
  const categories = paginatedCategories.map((cat) => highlight(cat, rawQuery));

  return NextResponse.json({
    articles,
    websites,
    categories,
    totalArticles: filteredArticles.length,
    totalCategories: categoriesArray.length,
    page,
    limit,
  });
}
