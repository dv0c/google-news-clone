"use client"

import { useState, useMemo } from "react"
import { Clock, ExternalLink, Filter, Search, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface NewsArticle {
  id: string
  title: string
  excerpt: string
  imageUrl: string
  source: string
  category: string
  publishedAt: string
  readTime: string
  featured?: boolean
  url?: string
}

interface NewsGridProps {
  articles: NewsArticle[]
  title?: string
  showFilters?: boolean
  showSearch?: boolean
  columns?: {
    mobile: number
    tablet: number
    desktop: number
  }
  onArticleClick?: (article: NewsArticle) => void
  className?: string
}

export default function NewsGrid({
  articles,
  title = "Latest News",
  showFilters = true,
  showSearch = true,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  onArticleClick,
  className = "",
}: NewsGridProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "popular">("newest")

  // Get unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(articles.map((article) => article.category)))
    return cats.sort()
  }, [articles])

  // Filter and sort articles
  const filteredArticles = useMemo(() => {
    const filtered = articles.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || article.category === selectedCategory
      return matchesSearch && matchesCategory
    })

    // Sort articles
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        case "oldest":
          return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
        case "popular":
          // For demo purposes, sort by title length as popularity metric
          return b.title.length - a.title.length
        default:
          return 0
      }
    })

    return filtered
  }, [articles, searchTerm, selectedCategory, sortBy])

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const published = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - published.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours} hours ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} days ago`

    const diffInWeeks = Math.floor(diffInDays / 7)
    return `${diffInWeeks} weeks ago`
  }

  const handleArticleClick = (article: NewsArticle) => {
    if (onArticleClick) {
      onArticleClick(article)
    } else if (article.url) {
      window.open(article.url, "_blank")
    }
  }

  return (
    <div className={`w-full space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
          <ChevronRight className="h-5 w-5 text-gray-400" />
        </div>
        <Badge variant="secondary" className="text-sm">
          {filteredArticles.length} articles
        </Badge>
      </div>

      {/* Filters and Search */}
      {(showSearch || showFilters) && (
        <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          {showSearch && (
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                aria-label="Search articles"
              />
            </div>
          )}

          {showFilters && (
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value: "newest" | "oldest" | "popular") => setSortBy(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="popular">Popular</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}

      {/* Articles Grid */}
      <div
        className={`grid gap-6 ${`grid-cols-${columns.mobile} sm:grid-cols-${columns.tablet} lg:grid-cols-${columns.desktop}`}`}
        role="grid"
        aria-label="News articles"
      >
        {filteredArticles.map((article, index) => (
          <article
            key={article.id}
            className={`group cursor-pointer bg-white dark:bg-gray-900 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-200 dark:border-gray-700 ${
              article.featured ? "sm:col-span-2 lg:col-span-2" : ""
            }`}
            onClick={() => handleArticleClick(article)}
            role="gridcell"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                handleArticleClick(article)
              }
            }}
            aria-label={`Read article: ${article.title}`}
          >
            {/* Image */}
            <div className="relative overflow-hidden">
              <img
                src={article.imageUrl || "/placeholder.svg"}
                alt={article.title}
                className={`w-full object-cover transition-transform duration-200 group-hover:scale-105 ${
                  article.featured ? "h-48 sm:h-64" : "h-48"
                }`}
                loading="lazy"
              />
              <div className="absolute top-3 left-3">
                <Badge variant="secondary" className="bg-white/90 text-gray-900">
                  {article.category}
                </Badge>
              </div>
              {article.featured && (
                <div className="absolute top-3 right-3">
                  <Badge className="bg-red-500 text-white">Featured</Badge>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              {/* Source and Time */}
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-sm flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{article.source.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="font-medium">{article.source}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatTimeAgo(article.publishedAt)}</span>
                </div>
              </div>

              {/* Title */}
              <h3
                className={`font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 ${
                  article.featured ? "text-xl" : "text-lg"
                }`}
              >
                {article.title}
              </h3>

              {/* Excerpt */}
              <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">{article.excerpt}</p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">{article.readTime} read</span>
                <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                  Read more
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Empty State */}
      {filteredArticles.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Filter className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No articles found</h3>
          <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  )
}
