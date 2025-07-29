'use client'
import { Suspense, useEffect, useState } from "react"
import TabWrapper from "./TabWrapper"
import { ArticleItem } from "./Article"


interface FeedSidebarProps {
    // Probably accepting articles or other data to display in the sidebar
    // This can be adjusted based on your needs
    // For example, you might want to pass breaking news articles or other relevant data
    // WIP
    extras?: any
}

const FeedSidebar = ({extras}: FeedSidebarProps) => {
    const [brakingArticles, setBrakingArticles] = useState<any[]>([])

    useEffect(() => {
        fetch(process.env.NEXT_PUBLIC_URL + "/api/breaking?all=true&hours=72")
            .then((response) => response.json())
            .then((data) => {
                console.log("Breaking news data:", data)
                if (data.breaking) {
                    setBrakingArticles(data.breaking)
                } else {
                    setBrakingArticles([])
                }
            })
            .catch((error) => {
                console.error("Error fetching breaking news:", error)
                setBrakingArticles([])
            })
    }, [])

    return <div className="col-span-1 lg:col-span-4 gap-4">
        {
            brakingArticles.length > 0 && (
                <TabWrapper border={false} title="Breaking News" className="mb-4">
                    {/* Sidebar content here */}
                    {brakingArticles.slice(0, 4).map((article) =>
                        <ArticleItem key={article.id} article={article} variant="list2" />
                    )}
                </TabWrapper>
            )}
        <TabWrapper border={false} title="Επιλογές για εσάς">
            {extras.slice(0, 3).map((article:any) =>
                <ArticleItem key={article.id} article={article} variant="list2" />
            )}
        </TabWrapper>
    </div>
}

export default FeedSidebar