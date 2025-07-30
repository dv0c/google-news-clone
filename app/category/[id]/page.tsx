
import { ArticlesByCategory } from "@/components/ArticlesByCategory";
import { Article } from "@prisma/client";
import { Suspense } from "react";

interface ApiResponse {
    articles: Article[];
}

export default async function CategoryPage({ params }: { params: { id: string } }) {
    const category = await params;

    return (
        <div className="max-w-6xl mx-auto mt-[60px] p-6">
            <Suspense fallback={<div className="p-4"><h2 className="text-lg text-gray-500">Loading articles...</h2></div>}>
                <ArticlesByCategory
                    title={`Άρθρα στην κατηγορία: ${category}`}
                    subtitle=""
                    categories={[category.id]}
                />
            </Suspense>
        </div>
    );
}
