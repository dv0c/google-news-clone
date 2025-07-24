import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

interface Article {
  id: string
  title: string
  thumbnail?: string
  createdAt: string
}

interface Website {
  id: string
  name: string
  url: string
  favicon?: string
  articles: Article[]
}

interface UseArticlesQueryOptions {
  linkContains?: string
  category?: string
  keyphrase?: string
  page?: number
  limit?: number
  mode?: 'articles' | 'websites' | 'byWebsite'
  websiteId?: string
  url?: string
}

interface ArticlesResponse {
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

export function useFetch(options: UseArticlesQueryOptions = {}) {
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

  const [data, setData] = useState<ArticlesResponse | null>(null)
  const [websites, setWebsites] = useState<Website[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setIsError(false)

    try {
      if (mode === 'websites') {
        const res = await axios.get<{ websites: Website[] }>('/api/source')
        setWebsites(res.data.websites)
        setData(null)
      } else if (mode === 'byWebsite') {
        const params = new URLSearchParams()
        if (websiteId) params.append('websiteId', websiteId)
        else if (url) params.append('url', url)
        params.append('page', page.toString())
        params.append('limit', limit.toString())

        const response = await axios.get(`/api/rss?${params.toString()}`)
        const articles: Article[] = response.data.articles

        setData({
          featured: articles[0] ?? null,
          related: articles.slice(1, 4),
          others: articles.slice(4),
          meta: {
            total: response.data.total,
            page: response.data.page,
            limit: response.data.limit,
            totalPages: response.data.totalPages,
          },
        })
        setWebsites(null)
      } else {
        const params = new URLSearchParams()
        if (linkContains) params.append('link', linkContains)
        if (category) params.append('category', category)
        if (keyphrase) params.append('keyphrase', keyphrase)
        params.append('page', page.toString())
        params.append('limit', limit.toString())

        const response = await axios.get<ArticlesResponse>(`/api/region?${params.toString()}`)
        setData(response.data)
        setWebsites(null)
      }
    } catch (error) {
      setIsError(true)
      setData(null)
      setWebsites(null)
    } finally {
      setIsLoading(false)
    }
  }, [mode, linkContains, category, keyphrase, page, limit, websiteId, url])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    featured: data?.featured ?? null,
    related: data?.related ?? [],
    others: data?.others ?? [],
    meta: data?.meta,
    websites,
    isLoading,
    isError,
    refetch: fetchData,
  }
}
