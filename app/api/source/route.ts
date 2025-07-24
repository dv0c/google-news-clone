import { prisma as db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { log } from "node:console";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const skip = (page - 1) * limit;

  try {
    const total = await db.website.count();

    const rawWebsites = await db.website.findMany({
      skip,
      take: limit,
      orderBy: {
        id: "desc", // Use the unique field for pagination
      },
      include: {
        articles: {
          orderBy: {
            createdAt: "desc",
          },
          take: 3,
        },
      },
    });

    const fallbackFavicon =
      "https://cdn-icons-png.flaticon.com/512/124/124033.png";

    const websites = rawWebsites.map((website) => {
      const favicon = website.favicon || fallbackFavicon;

      return {
        ...website,
        articles: website.articles.map((article) => ({
          ...article,
          websiteName: website.name,
          favicon,
        })),
      };
    });

    return NextResponse.json({
      websites,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching websites with articles:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
