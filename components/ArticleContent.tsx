'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { TextCursorInput } from 'lucide-react'

interface ArticleContentProps {
  html: string
}

const proseSizes = ['prose-sm', 'prose', 'prose-lg', 'prose-xl']

export function ArticleContent({ html }: ArticleContentProps) {
  const [proseIndex, setProseIndex] = useState(1) // Default: prose

  const toggleProse = () => {
    setProseIndex((prev) => (prev + 1) % proseSizes.length)
  }

  return (
    <div className="w-full relative">
      {/* Floating Icon Button */}
      <Button
        size="icon"
        variant="ghost"
        onClick={toggleProse}
        className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50  hover:bg-black text-white border border-white"
        title="Εναλλαγή μεγέθους κειμένου"
      >
        <TextCursorInput size={20} />
      </Button>

      <div
        className={`p-6 rounded-2xl prose-invert max-w-none ${proseSizes[proseIndex]}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
