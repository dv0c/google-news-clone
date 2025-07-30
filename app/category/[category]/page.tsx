"use client";

import { ArticleItem } from "@/components/Article";
import Footer from "@/components/Footer";
import { ArticleListItemSkeleton } from "@/components/news-feed";
import TabWrapper from "@/components/TabWrapper";
import { Button } from "@/components/ui/button";
import WeatherWidget from "@/components/weather-widget";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CategoryPage({ params }: { params: { category: string } }) {
    const [articles, setArticles] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const categories = decodeURIComponent(params.category)
        .split(",")
        .map((cat) => cat.trim());

    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            try {
                const res = await axios.post("/api/articles/by-category", {
                    categories,
                    page,
                    limit: 8,
                });
                setArticles(res.data.articles);
                setTotalPages(res.data.totalPages);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, [page, params.category]);

    return (
        <div className="min-h-screen mt-[60px] bg-[#292a2d]">
            {/* Header Section */}
            <div className="mb-6 max-w-[1140px] flex-wrap gap-5 px-4 sm:px-2 lg:px-0 py-6 mx-auto flex items-center justify-between">
                <div className="space-y-5">
                    <Link href={"/"}>
                        <Button
                            variant="tonal"
                            className="text-white bg-transparent hover:bg-blue-400/10 p-0 hover:p-2 transition-all hover:text-blue-500 rounded-xl"
                        >
                            <ArrowLeft size={16} />
                            Όλες οι ειδήσεις
                        </Button>
                    </Link>
                    {articles.length > 0 && (
                        <h1 className="text-white capitalize text-xl font-extrabold md:text-6xl text-[1.75rem] mb-2">
                            {articles[0].categories.join(", ")}
                        </h1>
                    )}
                </div>
                <div>
                    <WeatherWidget />
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-[1140px] mx-auto px-4 sm:px-2 lg:px-0">
                <TabWrapper className="max-w-3xl px-4 sm:px-2 lg:px-0">
                    {loading ? (
                        <ArticleListItemSkeleton />
                    ) : articles.length > 0 ? (
                        articles.map((article, index) => (
                            <div key={index} className="rounded-2xl px-4 py-2 bg-[#1f1f1f]">
                                <ArticleItem
                                    article={article}
                                    isFirst={index === 0}
                                    variant="list_bigger_thumbnail"
                                />
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-300">Δεν βρέθηκαν άρθρα για αυτή την πηγή.</p>
                    )}
                </TabWrapper>

                {/* Pagination */}
                {!loading && (
                    <div className="flex justify-center items-center gap-4 mt-6">
                        <Button
                            variant="tonal"
                            disabled={page <= 1}
                            onClick={() => {
                                setPage((p) => p - 1);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                        >
                            Προηγούμενη
                        </Button>
                        <span className="text-gray-300">
                            Σελίδα {page} από {totalPages}
                        </span>
                        <Button
                            variant="tonal"
                            disabled={page >= totalPages}
                            onClick={() => {
                                setPage((p) => p + 1);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                        >
                            Επόμενη
                        </Button>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
