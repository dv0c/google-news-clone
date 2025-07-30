'use client'

import { useState, useEffect, useRef } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import clsx from "clsx"
import { cn } from "@/lib/utils"

interface ArticleResult {
  id: string
  title: string
  websiteName?: string | null
  link: string
  thumbnail?: string | null
  categories: string[]
}

interface WebsiteResult {
  id: string
  name: string
  url: string
  favicon?: string | null
}

export function SearchBar() {
  const [query, setQuery] = useState("")
  const [articles, setArticles] = useState<ArticleResult[]>([])
  const [websites, setWebsites] = useState<WebsiteResult[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (query.trim().length < 2) {
      setArticles([])
      setWebsites([])
      setCategories([])
      setShowDropdown(false)
      setLoading(false)
      return
    }

    setLoading(true)
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setArticles(data.articles || [])
        setWebsites(data.websites || [])
        setCategories(data.categories || [])
        setShowDropdown(true)
        setActiveIndex(0)
      } catch (err) {
        console.error("Search failed", err)
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timeout)
  }, [query])

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", onClickOutside)
    return () => document.removeEventListener("mousedown", onClickOutside)
  }, [])

  const combinedResults = [
    ...articles,
    ...websites,
    ...categories.map((cat, i) => ({ id: `cat-${i}`, category: cat })),
  ]

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || combinedResults.length === 0) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((prev) => (prev + 1) % combinedResults.length)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((prev) => (prev - 1 + combinedResults.length) % combinedResults.length)
    } else if (e.key === "Enter") {
      e.preventDefault()
      const item = combinedResults[activeIndex]
      if ("link" in item && item.link) {
        window.location.href = item.link
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false)
    }
  }

  const handleClear = () => {
    setQuery("")
    setArticles([])
    setWebsites([])
    setCategories([])
    setShowDropdown(false)
  }

  const renderHTML = (html: string) => (
    <span dangerouslySetInnerHTML={{ __html: html }} />
  )

  // Skeleton loader item for articles/websites/categories
  const SkeletonItem = ({ height = 48 }: { height?: number }) => (
    <div
      className="animate-pulse rounded"
      style={{
        height,
        margin: "0.375rem 1rem",
        width: "calc(100% - 2rem)", // avoids overflow
        backgroundColor: "#3c404",
      }}
    />
  )

  return (
    <div className="flex-1 max-w-2xl mx-8 hidden md:block relative" ref={containerRef}>
      <div className={cn("flex items-center bg-[#3c4043] h-[48px] border border-[#3c4043] px-4 relative", query && !loading ? "rounded-t-lg" : "rounded-lg")}>
        <Search className="h-5 w-5 text-slate-200 mr-3" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Αναζητήστε θέματα, τοποθεσίες και πηγές"
          className="flex-1 bg-transparent border-0 text-slate-200 placeholder:text-slate-300 focus-visible:ring-0 focus-visible:ring-offset-0 !text-[16px] px-0"
          aria-label="Search"
        />
        {loading && (
          <div className="mr-2 animate-spin">
            <svg
              className="h-5 w-5 text-slate-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          </div>
        )}
        {query && !loading && (
          <button
            onClick={handleClear}
            className="ml-2 text-slate-300 hover:text-white transition"
            aria-label="Clear"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute w-full  rounded-b-lg bg-[#3c4043] border border-[#3c4043] shadow-lg z-[100] max-h-[520px] overflow-y-auto text-white text-sm">
          {/* Loading Skeletons */}
          {loading && (
            <>
              <div className="px-4 py-2 font-semibold border-b border-[#505356]">Άρθρα</div>
              {[...Array(3)].map((_, i) => (
                <SkeletonItem key={`skeleton-article-${i}`} />
              ))}
              <div className="px-4 py-2 font-semibold border-t border-b border-[#505356]">Ιστοσελίδες</div>
              {[...Array(2)].map((_, i) => (
                <SkeletonItem key={`skeleton-site-${i}`} height={36} />
              ))}
              <div className="px-4 py-2 font-semibold border-t border-[#505356]">Κατηγορίες</div>
              {[...Array(2)].map((_, i) => (
                <SkeletonItem key={`skeleton-cat-${i}`} height={24} />
              ))}
            </>
          )}

          {/* Actual results */}
          {!loading && (
            <>
              {/* Articles */}
              {articles.length > 0 && (
                <>
                  <div className="px-4 py-2 font-semibold border-b border-[#505356]">Άρθρα</div>
                  {articles.map((item, i) => {
                    const isActive = activeIndex === i
                    return (
                      <Link
                        key={item.id}
                        href={item.link || "#"}
                        className={clsx(
                          "flex items-center gap-3 px-4 py-3 hover:bg-[#505356] transition-colors",
                          isActive && "bg-[#505356]"
                        )}
                        onClick={() => setShowDropdown(false)}
                      >
                        {item.thumbnail ? (
                          <img
                            src={item.thumbnail}
                            alt="thumb"
                            className="w-10 h-10 rounded object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded bg-slate-600 flex items-center justify-center text-sm text-white">
                            📰
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium line-clamp-1">{renderHTML(item.title)}</div>
                          {item.websiteName && (
                            <div className="text-xs text-slate-300 line-clamp-1">
                              {renderHTML(item.websiteName)}
                            </div>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </>
              )}

              {/* Websites */}
              {websites.length > 0 && (
                <>
                  <div className="px-4 py-2 font-semibold border-t border-[#505356]">Ιστοσελίδες</div>
                  {websites.map((site, i) => {
                    const idx = i + articles.length
                    const isActive = activeIndex === idx
                    return (
                      <Link
                        key={site.id}
                        href={'/rss/'+site.id}
                        className={clsx(
                          "flex items-center gap-3 px-4 py-3 hover:bg-[#505356] transition-colors",
                          isActive && "bg-[#505356]"
                        )}
                        onClick={() => setShowDropdown(false)}
                      >
                        {site.favicon ? (
                          <img
                            src={site.favicon}
                            alt="favicon"
                            className="w-8 h-8 rounded"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded bg-slate-600 flex items-center justify-center text-xs text-white">
                            🌐
                          </div>
                        )}
                        <div className="flex-1 min-w-0 line-clamp-1 font-medium">{site.name}</div>
                      </Link>
                    )
                  })}
                </>
              )}

              {/* Categories */}
              {categories.length > 0 && (
                <>
                  <div className="px-4 py-2 font-semibold border-t border-[#505356]">Κατηγορίες</div>
                  {categories.map((cat, i) => {
                    const idx = i + articles.length + websites.length
                    const isActive = activeIndex === idx
                    return (
                      <div
                        key={cat}
                        className={clsx(
                          "px-4 py-3 hover:bg-[#505356] transition-colors cursor-pointer",
                          isActive && "bg-[#505356]"
                        )}
                        onClick={() => {
                          setQuery(cat)
                          setShowDropdown(false)
                        }}
                      >
                        {renderHTML(cat)}
                      </div>
                    )
                  })}
                </>
              )}

              {/* No results */}
              {articles.length === 0 && websites.length === 0 && categories.length === 0 && (
                <div className="px-4 py-6 text-center text-slate-400 flex flex-col items-center gap-4">
                  {/* Ghost SVG */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 opacity-50"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 2C7.58 2 4 5.58 4 10v4c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4v-4c0-4.42-3.58-8-8-8zM8 14h.01M16 14h.01"
                    />
                  </svg>
                  <div>Δεν βρέθηκαν αποτελέσματα.</div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
