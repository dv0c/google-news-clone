import { NextResponse } from 'next/server'
import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const linkContains = searchParams.get('link') || undefined
  const category = searchParams.get('category') || undefined
  const keyphrase = searchParams.get('keyphrase') || undefined
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '10', 10)
  const skip = (page - 1) * limit

  const filters: Prisma.ArticleWhereInput[] = []

  if (linkContains) {
    filters.push({
      link: {
        contains: linkContains,
        mode: 'insensitive',
      },
    })
  }

  if (category) {
    filters.push({
      categories: {
        has: category,
      },
    })
  }

  if (keyphrase) {
    filters.push({
      OR: [
        { title: { contains: keyphrase, mode: 'insensitive' } },
        { content: { contains: keyphrase, mode: 'insensitive' } },
        { contentSnippet: { contains: keyphrase, mode: 'insensitive' } },
      ],
    })
  }

  const where: Prisma.ArticleWhereInput = filters.length > 0 ? { AND: filters } : {}

  // Fetch articles with some extra to allow splitting featured + related + others
  const articles = await prisma.article.findMany({
    where,
    orderBy: {
      pubDate: 'desc',
    },
    take: skip + limit, // get enough for pagination + featured/related split
  })

  // Define featured (first article)
  const featured = articles.length > 0 ? articles[0] : null

  // Related articles (next up to 3 articles that share category)
  const related = articles
    .slice(1)
    .filter(article => category ? article.categories.includes(category) : true)
    .slice(0, 3)

  // Others: all remaining articles after featured + related
  const relatedIds = new Set(related.map(a => a.id))
  const others = articles.filter(
    a => a.id !== featured?.id && !relatedIds.has(a.id)
  )

  // Count total articles for pagination metadata
  const total = await prisma.article.count({ where })

  return NextResponse.json({
    featured,
    related,
    others,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  })
}
