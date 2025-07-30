"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import clsx from "clsx"
import { ArticleItem } from "@/components/Article"

type RelatedArticle = {
  id: string
  title: string
  thumbnail?: string | null
  websiteName?: string | null
}

export default function RelatedArticles({ articleId }: { articleId: string }) {
  const [related, setRelated] = useState<RelatedArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [loadedImages, setLoadedImages] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(`/api/articles/related?id=${articleId}`)
        const json = await res.json()
        setRelated(json.relatedArticles || [])
      } catch (e) {
        console.error("Failed to fetch related articles", e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [articleId])

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-3 items-center animate-pulse">
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              <div className="h-3 bg-gray-700 rounded w-1/2"></div>
            </div>
            <div className="w-20 h-16 bg-gray-700 rounded-md"></div>
          </div>
        ))}
      </div>
    )
  }

  if (!related.length) {
    return <p className="text-gray-400 text-sm">Δεν βρέθηκαν σχετικά άρθρα</p>
  }

  return (
    <div className="space-y-3">
      {related.map((article) => (
        // <Link
        //   key={article.id}
        //   href={`/article/${article.id}`}
        //   className="flex gap-3 items-center hover:bg-white/5 p-2 rounded-md"
        // >
        //   <div className="relative w-20 h-16 flex-shrink-0 overflow-hidden rounded-md">
        //     <Image
        //       src={article.thumbnail || "/placeholder.jpg"}
        //       alt={article.title}
        //       fill
        //       sizes="80px"
        //       className={clsx(
        //         "object-cover transition-all duration-500",
        //         !loadedImages[article.id] && "blur-md scale-105"
        //       )}
        //       onLoadingComplete={() =>
        //         setLoadedImages((prev) => ({ ...prev, [article.id]: true }))
        //       }
        //     />
        //   </div>
        //   <div className="flex-1">
        //     <h3 className="font-semibold text-sm leading-snug">
        //       {article.title}
        //     </h3>
        //     <span className="text-xs text-gray-400">{article.websiteName}</span>
        //   </div>
        // </Link>
        <ArticleItem article={article} variant="tab" />
      ))}
    </div>
  )
}
