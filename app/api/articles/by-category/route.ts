import { prisma as db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { categories } = await req.json();

    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      return NextResponse.json({ error: "Categories are required" }, { status: 400 });
    }

    // Normalize categories (trim and lowerCase for consistency)
    const normalized = categories.map((cat: string) => cat.trim());

    // Find all articles that match at least one of these categories
    const articles = await db.article.findMany({
      where: {
        categories: {
          hasSome: normalized, // Prisma condition for arrays
        },
      },
      orderBy: { pubDate: "desc" },
      include: {
        Website: true,
      },
    });

    return NextResponse.json({ articles });
  } catch (error) {
    console.error("Error in category route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
