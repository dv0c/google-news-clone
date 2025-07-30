"use client";

import { useEffect, useState } from "react";
import { formatDateGR } from "@/lib/formatDateGR";
import Image from "next/image";
import Link from "next/link";
import { Article } from "@prisma/client";

type ApiResponse = {
  featured: Article;
  relatedArticles: Article[];
};

const Heading = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch("/api/articles/heading"); // fixed fetch
        if (!res.ok) throw new Error("Failed to fetch");
        const json: ApiResponse = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  if (loading) return <LoadingSkeleton />;
  if (error || !data) return <p>Error: {error || "No data"}</p>;

  const { featured, relatedArticles } = data;
  const article = featured;

  return (
    <div className="relative w-full z-1 h-full md:h-[70vh] pb-10 overflow-hidden">
      {/* Background image with blur effect */}
      <div className="absolute inset-0">
        <Image
          src={article.thumbnail || ""}
          alt={article.title}
          fill
          draggable={false}
          className={`object-cover brightness-75 transition-all duration-700 ${
            imageLoaded ? "blur-0 scale-100" : "blur-lg scale-105"
          }`}
          priority
          onLoadingComplete={() => setImageLoaded(true)}
        />
      </div>

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

      {/* Top fade overlay */}
      <div
        className="absolute top-0 left-0 w-full h-24 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, #292a2d, transparent)",
        }}
      />

      {/* Bottom fade overlay */}
      <div
        className="absolute bottom-0 left-0 w-full h-24 pointer-events-none"
        style={{
          background: "linear-gradient(to top, #292a2d, transparent)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto flex flex-col justify-end h-full px-6 py-8 text-white">
        {/* Category */}
        <div className="text-xs uppercase tracking-wide text-gray-300 mb-2">
          {article.categories.map((cat, index) => (
            <Link className="hover:underline" href={"/" + cat} key={cat + index}>
              {cat}
              {index < article.categories.length - 1 && ", "}
            </Link>
          ))}
        </div>

        {/* Main headline */}
        <Link href={"/article/" + article.id} target="_blank" className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl hover:underline font-extrabold leading-snug mb-4">
            {article.title}
          </h1>

          {/* Date */}
          <p className="text-sm text-gray-300 mb-4">
            {formatDateGR(article.pubDate as string)}
          </p>
        </Link>

        {/* Related news */}
        <div className="mt-4 pt-4 border-t border-gray-600 flex flex-wrap gap-6 text-sm">
          {relatedArticles.map((rel) => (
            <Link
              target="_blank"
              href={"/article/" + rel.id}
              key={rel.id}
              className=" group max-w-xs"
            >
              <p className="text-gray-300 mb-1 group-hover:underline">{rel.title}</p>
              <span className="text-xs text-gray-400">
                {formatDateGR(rel.pubDate as string)}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Heading;

const LoadingSkeleton = () => (
  <div className="relative w-full h-full md:h-[70vh] pb-10 overflow-hidden bg-gray-800 animate-pulse">
    {/* Background gray block */}
    <div className="absolute inset-0 bg-gray-700" />

    {/* Top fade overlay */}
    <div
      className="absolute top-0 left-0 w-full h-24 pointer-events-none"
      style={{ background: "linear-gradient(to bottom, #292a2d, transparent)" }}
    />
    {/* Bottom fade overlay */}
    <div
      className="absolute bottom-0 left-0 w-full h-24 pointer-events-none"
      style={{ background: "linear-gradient(to top, #292a2d, transparent)" }}
    />

    {/* Content skeleton */}
    <div className="relative z-10 max-w-6xl mx-auto flex flex-col justify-end h-full px-6 py-8">
      <div className="h-4 w-48 mb-3 bg-gray-600 rounded" />
      <div className="h-10 w-3/4 mb-4 bg-gray-600 rounded" />
      <div className="h-4 w-32 mb-10 bg-gray-600 rounded" />

      <div className="flex flex-wrap gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="max-w-xs">
            <div className="h-5 w-full mb-1 bg-gray-600 rounded" />
            <div className="h-3 w-24 bg-gray-600 rounded" />
          </div>
        ))}
      </div>
    </div>
  </div>
);
