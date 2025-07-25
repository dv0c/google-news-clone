import { prisma as db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { URL } from "url";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeContent = searchParams.get("include") === "content";
    const articleId = searchParams.get("id");

    // Fetch single article with full content if query is provided
    if (includeContent && articleId) {
      const article = await db.article.findUnique({
        where: { id: articleId },
        select: {
          Website: true,
          categories: true,
          createdAt: true,
          creator: true,
          dcCreator: true,
          favicon: true,
          guid: true,
          id: true,
          isoDate: true,
          link: true,
          pubDate: true,
          thumbnail: true,
          title: true,
          updatedAt: true,
          websiteId: true,
          websiteName: true,
          content: true,
          contentEncoded: true,
        },
      });

      if (!article) {
        return NextResponse.json(
          { error: "Article not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ article });
    }

    // Normal layout response
    const totalCount = await db.article.count();
    if (totalCount === 0) {
      return NextResponse.json({ error: "No articles found" }, { status: 404 });
    }

    const featuredSkip = Math.floor(Math.random() * totalCount);
    const featured = await db.article.findFirst({
      skip: featuredSkip,
      orderBy: { createdAt: "desc" },
      select: {
        Website: true,
        categories: true,
        createdAt: true,
        creator: true,
        dcCreator: true,
        favicon: true,
        guid: true,
        id: true,
        isoDate: true,
        link: true,
        pubDate: true,
        thumbnail: true,
        title: true,
        updatedAt: true,
        websiteId: true,
        websiteName: true,
      },
    });

    if (!featured) {
      return NextResponse.json({ error: "No articles found" }, { status: 404 });
    }

    const relatedPool = await db.article.findMany({
      where: {
        id: { not: featured.id },
        categories: { hasSome: featured.categories },
      },
      select: {
        Website: true,
        categories: true,
        createdAt: true,
        creator: true,
        dcCreator: true,
        favicon: true,
        guid: true,
        id: true,
        isoDate: true,
        link: true,
        pubDate: true,
        thumbnail: true,
        title: true,
        updatedAt: true,
        websiteId: true,
        websiteName: true,
      },
      take: 10,
    });
    const related = relatedPool.sort(() => 0.5 - Math.random()).slice(0, 7);

    const excludeIds = [featured.id, ...related.map((a) => a.id)];

    const othersPool = await db.article.findMany({
      where: {
        id: { notIn: excludeIds },
        NOT: { websiteName: featured.websiteName },
      },
      select: {
        Website: true,
        categories: true,
        createdAt: true,
        creator: true,
        dcCreator: true,
        favicon: true,
        guid: true,
        id: true,
        isoDate: true,
        link: true,
        pubDate: true,
        thumbnail: true,
        title: true,
        updatedAt: true,
        websiteId: true,
        websiteName: true,
      },
      take: 10,
    });
    const others = othersPool.sort(() => 0.5 - Math.random()).slice(0, 10);
    excludeIds.push(...others.map((a) => a.id));

    const youPool = await db.article.findMany({
      where: {
        id: { notIn: excludeIds },
      },
      select: {
        Website: true,
        categories: true,
        createdAt: true,
        creator: true,
        dcCreator: true,
        favicon: true,
        guid: true,
        id: true,
        isoDate: true,
        link: true,
        pubDate: true,
        thumbnail: true,
        title: true,
        updatedAt: true,
        websiteId: true,
        websiteName: true,
      },
      take: 10,
    });
    const you = youPool
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 3) + 3); // 3–5

    return NextResponse.json({
      featured,
      related,
      others,
      you,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      title,
      content,
      contentSnippet,
      creator,
      pubDate,
      dcCreator,
      link,
      guid,
      isoDate,
      thumbnail,
      favicon,
      websiteName,
      categories = [],
      contentEncoded,
    } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Check for existing article with same title
    const existingArticle = await db.article.findFirst({
      where: {
        title: {
          equals: title,
          mode: "insensitive",
        },
      },
    });

    if (existingArticle) {
      return NextResponse.json(
        { error: "Article with this title already exists" },
        { status: 409 }
      );
    }

    let websiteId: string | null = null;

    if (link) {
      const parsedUrl = new URL(link);
      const baseUrl = `${parsedUrl.protocol}//${parsedUrl.hostname}`;

      let existingWebsite = await db.website.findFirst({
        where: { url: baseUrl },
      });

      if (!existingWebsite) {
        existingWebsite = await db.website.create({
          data: {
            url: baseUrl,
            name: websiteName || parsedUrl.hostname,
            favicon: favicon || null,
          },
        });
      }

      websiteId = existingWebsite.id;
    }

    const mainArticle = await db.article.create({
      data: {
        title: title || "Untitled",
        content: content || "",
        contentSnippet: contentSnippet || "",
        creator: creator || "RSS Feed",
        pubDate: pubDate ?? new Date().toISOString(),
        dcCreator: dcCreator || null,
        link: link || null,
        guid: typeof guid === "string" ? guid : guid?._ || null,
        isoDate: isoDate || null,
        favicon: favicon || null,
        websiteName: websiteName || null,
        thumbnail: thumbnail || null,
        categories,
        contentEncoded: contentEncoded || "",
        websiteId,
      },
    });

    return NextResponse.json(mainArticle, { status: 201 });
  } catch (error) {
    console.error("Failed to create article:", error);
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 }
    );
  }
}

export async function PATCH() {
  try {
    const result = await db.article.deleteMany();
    return NextResponse.json({
      message: "All articles deleted",
      deletedCount: result.count,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete articles" },
      { status: 500 }
    );
  }
}
