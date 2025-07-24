"use client"

import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

interface Article {
  id: number
  headline: string
  summary: string
  source: string
  timestamp: string
  image: string
  relatedNews: Array<{
    id: number
    headline: string
    source: string
    timestamp: string
  }>
}

interface NewsCardProps {
  article: Article
  onArticleClick: (id: number) => void
}

export function NewsCard({ article, onArticleClick }: NewsCardProps) {
  return (
    <Card
      className="bg-[#1f1f1f] border-gray-600 hover:shadow-lg transition-all duration-200 cursor-pointer rounded-lg mb-6"
      onClick={() => onArticleClick(article.id)}
    >
      <CardContent className="p-4">
        <div className="flex gap-4 max-w-2xl    ">
          {/* Left side - Main article with image */}
          <div className="flex-1">
            {article.image && (
              <div className="mb-4">
                <Image
                  src={article.image || "/placeholder.svg"}
                  alt={article.headline}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}

            <div className="mb-2">
              <span className="text-sm font-bold text-[#CCCCCC]">{article.source}</span>
            </div>

            <h2 className="text-white font-bold text-xl mb-3 leading-tight">{article.headline}</h2>

            <div className="text-[#CCCCCC] text-sm">{article.timestamp}</div>
          </div>

          {/* Right side - Related news */}
          {article.relatedNews && article.relatedNews.length > 0 && (
            <div className="w-80 flex-shrink-0 space-y-4">
              {article.relatedNews.map((relatedArticle) => (
                <div key={relatedArticle.id} className="border-l-2 border-gray-600 pl-4">
                  <div className="mb-1">
                    <span className="text-xs font-bold text-[#CCCCCC]">{relatedArticle.source}</span>
                  </div>
                  <h3 className="text-white text-sm font-medium mb-2 leading-snug">{relatedArticle.headline}</h3>
                  <div className="text-[#CCCCCC] text-xs">{relatedArticle.timestamp}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
