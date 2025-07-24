import { prisma as db } from "@/lib/prisma";
import { NextResponse } from "next/server";

function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

// Simple highlight helper - wraps matched parts in <mark>
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
      total: 0,
      page,
      limit,
    });
  }

  // Build fuzzy regex for MongoDB (accent-insensitive handled by normalization)
  const regex = new RegExp(rawQuery, "i");

  // ARTICLES: fuzzy search in multiple fields
  const articleFilter = {
    OR: [
      { title: { contains: rawQuery, mode: "insensitive" } },
      { contentSnippet: { contains: rawQuery, mode: "insensitive" } },
      { contentEncoded: { contains: rawQuery, mode: "insensitive" } },
      { content: { contains: rawQuery, mode: "insensitive" } },
      { websiteName: { contains: rawQuery, mode: "insensitive" } },
      { categories: { hasSome: [rawQuery] } },
    ],
  };

  // Get total count for pagination
  const totalArticles = await db.article.count({
    where: articleFilter,
  });

  // Fetch paginated articles with highlight fields
  const articlesRaw = await db.article.findMany({
    where: articleFilter,
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
    select: {
      id: true,
      title: true,
      websiteName: true,
      link: true,
      thumbnail: true,
      categories: true,
    },
  });

  // Highlight matched substrings in titles & websiteName
  const articles = articlesRaw.map((a) => ({
    ...a,
    title: highlight(a.title, rawQuery),
    websiteName: a.websiteName ? highlight(a.websiteName, rawQuery) : null,
  }));

  // WEBSITES: fuzzy search
  const websiteFilter = {
    OR: [
      { name: { contains: rawQuery, mode: "insensitive" } },
      { url: { contains: rawQuery, mode: "insensitive" } },
      { language: { contains: rawQuery, mode: "insensitive" } },
      { description: { contains: rawQuery, mode: "insensitive" } },
    ],
  };
  const websites = await db.website.findMany({
    where: websiteFilter,
    take: 5,
    select: { id: true, name: true, url: true, favicon: true },
  });

  // CATEGORIES: get all categories, normalize & filter + pagination
  const allArticles = await db.article.findMany({
    select: { categories: true },
    take: 500, // Limit for performance
  });

  // Extract unique normalized categories containing query
  const categoriesSet = new Set<string>();
  allArticles.forEach(({ categories }) => {
    if (!categories) return;
    categories.forEach((cat) => {
      const catNorm = normalize(cat);
      if (catNorm.includes(query)) categoriesSet.add(cat);
    });
  });

  // Pagination on categories array
  const categoriesArray = Array.from(categoriesSet);
  const paginatedCategories = categoriesArray.slice((page - 1) * limit, page * limit);

  // Highlight matched substring in categories
  const categories = paginatedCategories.map((cat) => highlight(cat, rawQuery));

  return NextResponse.json({
    articles,
    websites,
    categories,
    totalArticles,
    totalCategories: categoriesArray.length,
    page,
    limit,
  });
}
