import axios from 'axios'

export interface Article {
  id: string
  title: string
  thumbnail?: string
  createdAt: string
}

export interface Website {
  id: string
  name: string
  url: string
  favicon?: string
  articles: Article[]
}

export interface UseArticlesQueryOptions {
  linkContains?: string
  category?: string
  keyphrase?: string
  page?: number
  limit?: number
  mode?: 'articles' | 'websites' | 'byWebsite'
  websiteId?: string
  url?: string
}

export interface ArticlesResponse {
  featured: Article | null
  related: Article[]
  others: Article[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export async function getFetch(options: UseArticlesQueryOptions = {}) {
  const {
    linkContains,
    category,
    keyphrase,
    page = 1,
    limit = 10,
    mode = 'articles',
    websiteId,
    url,
  } = options

  if (mode === 'websites') {
    const res = await axios.get<{ websites: Website[] }>(`${process.env.API_BASE_URL || ''}/api/source`)
    return { websites: res.data.websites, data: null }
  } else if (mode === 'byWebsite') {
    const params = new URLSearchParams()
    if (websiteId) params.append('websiteId', websiteId)
    else if (url) params.append('url', url)
    params.append('page', page.toString())
    params.append('limit', limit.toString())

    const response = await axios.get(`${process.env.API_BASE_URL || ''}/api/rss?${params.toString()}`)
    const articles: Article[] = response.data.articles

    return {
      websites: null,
      data: {
        featured: articles[0] ?? null,
        related: articles.slice(1, 4),
        others: articles.slice(4),
        meta: {
          total: response.data.total,
          page: response.data.page,
          limit: response.data.limit,
          totalPages: response.data.totalPages,
        },
      },
    }
  } else {
    const params = new URLSearchParams()
    if (linkContains) params.append('link', linkContains)
    if (category) params.append('category', category)
    if (keyphrase) params.append('keyphrase', keyphrase)
    params.append('page', page.toString())
    params.append('limit', limit.toString())

    const response = await axios.get<ArticlesResponse>(`${process.env.API_BASE_URL || ''}/api/region?${params.toString()}`)
    return { websites: null, data: response.data }
  }
}
