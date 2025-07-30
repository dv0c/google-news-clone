import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Ensure you have prisma client initialized

// GET /api/articles/related?id=ARTICLE_ID
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const articleId = searchParams.get("id");

  if (!articleId) {
    return NextResponse.json({ error: "Article ID is required" }, { status: 400 });
  }

  try {
    // Get the original article's categories
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: { categories: true },
    });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Query for related articles that share at least one category
    const relatedArticles = await prisma.article.findMany({
      where: {
        id: { not: articleId }, // Exclude current article
        categories: {
          hasSome: article.categories, // Match any of the categories
        },
      },
      orderBy: { createdAt: "desc" },
      take: 6, // Limit the number of related articles
      select: {
        id: true,
        title: true,
        thumbnail: true,
        pubDate: true,
        createdAt: true,
        websiteName: true,
      },
    });

    return NextResponse.json({ relatedArticles });
  } catch (error) {
    console.error("Error fetching related articles:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
