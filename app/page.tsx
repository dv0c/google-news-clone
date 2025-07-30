"use client"

import { ArticleItem } from "@/components/Article"
import { ArticlesByCategory } from "@/components/ArticlesByCategory"
import { BreakingNewsBanner } from "@/components/breaking-news"
import FeedSidebar from "@/components/feed-sidebar"
import Footer from "@/components/Footer"
import { Header } from "@/components/header"
import Heading from "@/components/Heading"
import { NewsFeed, SkeletonNewsFeed } from "@/components/news-feed"
import Sources from "@/components/sources"
import { SwiperSlider } from "@/components/SwiperSlider"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import WeatherWidget from "@/components/weather-widget"
import { formatDateGR } from "@/lib/formatDateGR"
import { Info } from "lucide-react"
import { Suspense, useEffect, useState } from "react"

export default function GoogleNewsClone() {
  const [articleData, setArticleData] = useState<{ featured: any, related: any[], others: any[], you: any[] }>({
    featured: null,
    related: [],
    others: [],
    you: [],
  })



  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_URL + "/api/articles")
      .then((response) => response.json())
      .then((data) => {
        setArticleData(data)

      })
      .catch((error) => {
        console.error("Error fetching articles:", error)
        setArticleData({ featured: null, related: [], others: [], you: [] })
      })
  }, [])



  return (
    <div className="min-h-screen mt-[70px] md:mt-[60px] bg-[#292a2d]">
      <BreakingNewsBanner />
      <Heading />
      <div className="mb-6 max-w-[1140px] flex-wrap gap-5 px-4 sm:px-2 lg:px-0 py-6 mx-auto flex items-center justify-between">
        <div>
          <Button className="text-white bg-transparent hover:bg-blue-400/10 p-0 hover:p-2 transition-all hover:text-blue-500 rounded-xl">
            <Info size={16} />
            Πως κατατάσσονται αυτές οι ειδήσεις;
          </Button>
          <h1 className="text-white text-[1.75rem] mb-2">Η ενημέρωσή σας</h1>
          <p className="text-gray-300 text-sm">{formatDateGR()}</p>
        </div>
        <div>
          <WeatherWidget />
        </div>
      </div>

      <main className="max-w-[1140px] mx-auto px-4 sm:px-2 lg:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8">
            {articleData.featured ? (
              <NewsFeed
                featured={articleData.featured}
                related={articleData.related}
                others={articleData.others}
              />
            ) : (
              <SkeletonNewsFeed />
            )
            }
          </div>
          {/* SIDEBAR CONTENT HERE */}
          <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
            <FeedSidebar extras={articleData.others} />
          </Suspense>
        </div>
        <div className="mt-10">
          <h1 className="text-white text-[1.75rem] mb-2">Για εσάς</h1>
          <p className="text-gray-300 text-sm">Προτεινόμενα βάσει των ενδιαφερόντων σας</p>

          <div className="mt-6 bg-[#1f1f1f] p-3 rounded-2xl grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-2 border-r border-neutral-700 pr-4">
              {articleData.you.slice(0, 3).map((article, index) =>
                <div>
                  <ArticleItem key={article.id} isFirst={index === 0} article={article} variant="list2" />
                </div>
              )}
            </div>
            <div className="lg:col-span-2">
              {articleData.others.slice(4, 7).map((article, index) =>
                <ArticleItem key={article.id} isFirst={index === 0} article={article} variant="list2" />
              )}
            </div>
          </div>
        </div>
        <div className="mt-10">
          <h1 className="text-white text-[1.75rem] mb-2">Πηγές</h1>
          <p className="text-gray-300 text-sm">
            Οι πηγές σας για ειδήσεις και άρθρα από όλο τον κόσμο
          </p>
          <div className="mt-6">
            <Sources />
          </div>
        </div>
        <div className="mt-6">
          <SwiperSlider>
            <ArticlesByCategory title="Σπορτς" subtitle="" categories={[
              "Ποδόσφαιρο",
              "Σπορ",
              "νόριτς",
              "ολυμπιακός",
              "ποδόσφαιρο",
              "φιλικό"
            ]} />
            <ArticlesByCategory title="Πολιτικη - Νεα" subtitle="" categories={[
              "Πολιτική",
              "ΓΙΩΡΓΟΣ ΦΛΩΡΙΔΗΣ",
              "ΔΗΜΗΤΡΗΣ ΚΟΥΤΣΟΥΜΠΑΣ",
              "ΙΣΡΑΗΛ",
              "ΚΚΕ",
              "ΠΑΛΑΙΣΤΙΝΗ"
            ]} />
          </SwiperSlider>
        </div>
      </main>

      <Footer />
    </div>
  )
}
