import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Keywords in English & Greek
const breakingKeywords = [
  "breaking",
  "urgent",
  "live",
  "just in",
  "alert",
  "developing",
  "έκτακτο",
  "τώρα",
  "ζωντανά",
  "άμεσο",
  "επείγον",
  "ενημέρωση",
  "σοκ",
  "έκτακτη είδηση",
  "ανακοίνωση",
  "καταστροφή",
];

export async function GET(req: NextRequest) {
  try {
    // Get hours from query param or fallback to 24
    const hoursParam = req.nextUrl.searchParams.get("hours");
    const hours = hoursParam ? parseInt(hoursParam, 10) : 24;
    const returnAllArticles = req.nextUrl.searchParams.get("all") === "true";

    // Validate hours (min 1h, max 72h)
    const hoursWindow = Math.max(1, Math.min(hours, 72));

    const cutoffTime = new Date(Date.now() - hoursWindow * 60 * 60 * 1000);

    // Fetch articles from the last X hours
    const recentArticles = await prisma.article.findMany({
      where: {
        createdAt: {
          gte: cutoffTime,
        },
      },
      include: {
        Website: true,
      },
      orderBy: { createdAt: "desc" },
      take: 50, // check up to 50 recent articles
    });

    // Filter by keywords in title, content or snippet
    const filtered = recentArticles.filter((article) => {
      const text = `${article.title} ${article.contentSnippet || ""} ${
        article.content || ""
      }`.toLowerCase();
      return breakingKeywords.some((kw) => text.includes(kw));
    });

    // Get the latest one that matches
    const latestBreaking = returnAllArticles ? filtered : filtered[0] || null;

    return NextResponse.json({
      breaking: latestBreaking,
      hours: hoursWindow,
      totalChecked: recentArticles.length,
      totalMatches: filtered.length,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch breaking news" },
      { status: 500 }
    );
  }
}
