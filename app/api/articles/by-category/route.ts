import { prisma as db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { categories, page = 1, limit = 10 } = await req.json();

    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      return NextResponse.json({ error: "Categories are required" }, { status: 400 });
    }

    const normalized = categories.map((cat: string) => cat.trim());

    const totalArticles = await db.article.count({
      where: {
        categories: {
          hasSome: normalized,
        },
      },
    });

    const articles = await db.article.findMany({
      where: {
        categories: {
          hasSome: normalized,
        },
      },
      orderBy: { pubDate: "desc" },
      include: { Website: true },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({
      articles,
      totalArticles,
      page,
      totalPages: Math.ceil(totalArticles / limit),
    });
  } catch (error) {
    console.error("Error in category route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
