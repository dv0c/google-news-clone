"use client";

import { useEffect, useState } from "react";
import { Article } from "@prisma/client";
import { ArticleItem, ArticleItemSkeleton } from "./Article";

interface ArticlesByCategoryProps {
  title?: string;
  subtitle?: string;
  categories: string[];
}

export function ArticlesByCategory({ title = "Για εσάς", subtitle = "Προτεινόμενα βάσει των ενδιαφερόντων σας", categories }: ArticlesByCategoryProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticles() {
      try {
        setLoading(true);
        const res = await fetch("/api/articles/by-category", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ categories }),
        });
        if (!res.ok) throw new Error("Failed to load articles");
        const json = await res.json();
        setArticles(json.articles || []);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, [categories]);

  if (loading) return null
  if (error) return null
  if (articles.length === 0) return null

  return (
    <div className="mt-10">
      <h1 className="text-white text-[1.75rem] mb-2">{title}</h1>
      <p className="text-gray-300 text-sm">{subtitle}</p>

      <div className="mt-6 bg-[#1f1f1f] p-3 rounded-2xl grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2 border-r border-neutral-700 pr-4">
          {articles.slice(0, 3).map((article, index) => (
            <ArticleItem
              key={article.id}
              isFirst={index === 0}
              article={article as any}
              variant="list2"
            />
          ))}
        </div>
        <div className="lg:col-span-2">
          {articles.slice(4, 7).map((article, index) => (
            <ArticleItem
              key={article.id}
              isFirst={index === 0}
              article={article as any}
              variant="list2"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
