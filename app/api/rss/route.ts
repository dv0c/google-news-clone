import { prisma as db } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const websiteId = searchParams.get('websiteId');
    const url = searchParams.get('url'); // fallback support

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    if (!websiteId && !url) {
      return NextResponse.json({ error: 'Missing websiteId or url' }, { status: 400 });
    }

    // Fetch the Website (via id or url)
    const website = await db.website.findFirst({
      where: websiteId
        ? { id: websiteId }
        : url
        ? { url }
        : undefined,
    });

    if (!website) {
      return NextResponse.json({ error: 'Website not found' }, { status: 404 });
    }

    // Fetch articles
    const [articles, total] = await Promise.all([
      db.article.findMany({
        where: { websiteId: website.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.article.count({
        where: { websiteId: website.id },
      }),
    ]);

    return NextResponse.json({
      website,
      articles,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching articles by website:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
