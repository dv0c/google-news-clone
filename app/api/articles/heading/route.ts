// /app/api/articles/heading/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Get featured article (latest by pubDate)
    const featured = await prisma.article.findFirst({
      orderBy: { pubDate: "desc" },
      // no filter on categories since Prisma MongoDB doesn't support empty array check
    });

    if (!featured) {
      return NextResponse.json({ message: "No featured article found" }, { status: 404 });
    }

    // 2. Get 3 related articles that share categories with featured, excluding the featured itself
    const relatedArticles = await prisma.article.findMany({
      where: {
        id: {
          not: featured.id,
        },
        categories: {
          hasSome: featured.categories,
        },
      },
      take: 3,
      orderBy: { pubDate: "desc" },
    });

    // 3. Return JSON response
    return NextResponse.json({
      featured,
      relatedArticles,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
