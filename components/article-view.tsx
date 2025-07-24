"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface FullArticle {
  id: number
  headline: string
  summary: string
  content: string
  source: string
  timestamp: string
  author: string
  image: string
  readTime: string
}

interface ArticleViewProps {
  article: FullArticle
  onBack: () => void
}

export function ArticleView({ article, onBack }: ArticleViewProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-blue-400 hover:text-blue-300 hover:bg-gray-800"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to news
      </Button>

      <article className="bg-[#292A2D] rounded-lg p-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-[#CCCCCC] mb-4">
            <Badge variant="outline" className="bg-gray-700 text-white border-gray-600">
              {article.source}
            </Badge>
            <span>•</span>
            <span>{article.timestamp}</span>
            <span>•</span>
            <span>{article.readTime}</span>
          </div>

          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">{article.headline}</h1>

          <p className="text-xl text-[#CCCCCC] mb-6 leading-relaxed">{article.summary}</p>

          <div className="flex items-center gap-2 text-sm text-[#CCCCCC] mb-8">
            <span>By {article.author}</span>
          </div>
        </div>

        <div className="mb-8">
          <Image
            src={article.image || "/placeholder.svg"}
            alt={article.headline}
            width={800}
            height={400}
            className="w-full h-64 md:h-96 object-cover rounded-lg"
          />
        </div>

        <div
          className="prose prose-lg max-w-none text-[#CCCCCC] leading-relaxed prose-headings:text-white prose-strong:text-white prose-a:text-blue-400"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>
    </div>
  )
}
