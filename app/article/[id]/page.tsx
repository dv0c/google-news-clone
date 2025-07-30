import { ArticleContent } from '@/components/ArticleContent'
import Footer from '@/components/Footer'
import { Header } from '@/components/header'
import TabWrapper from '@/components/TabWrapper'
import { Button } from '@/components/ui/button'
import WeatherWidget from '@/components/weather-widget'
import { formatDateGR } from '@/lib/formatDateGR'
import { prisma } from '@/lib/prisma'
import { ArrowLeft, Globe } from 'lucide-react'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import RelatedArticles from './_comps/related-articles'

interface PageProps {
  params: { id: string }
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params

  // Fetch main article server-side
  const article = await prisma.article.findUnique({
    where: { id },
    include: { Website: true },
  })

  if (!article) return notFound()

  if (!article.content || article.content.length <= 200) {
    return redirect(article.link || '/')
  }

  return (
    <div className="min-h-screen bg-[#1e1f23] text-white">
      <Header activeTab="" />

      {/* HERO IMAGE */}
      <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
        <img
          src={article.thumbnail || '/placeholder.jpg'}
          alt={article.title}
          className="w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

        {/* Title */}
        <div className="absolute bottom-6 md:bottom-12 left-6 md:left-12 max-w-4xl">
          <span className="uppercase text-red-500 font-bold text-sm">
            {article.categories?.[0] || 'Ειδήσεις'}
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-3">
            {article.title}
          </h1>
          <div className="text-sm text-gray-300">
            Δημοσιεύτηκε {formatDateGR(article.createdAt || article.pubDate)}
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT */}
        <main className="lg:col-span-2">
          <ArticleContent html={article.content} />

          <div className="flex flex-col sm:flex-row items-center justify-between mt-10 gap-4">
            <Link href="/" passHref>
              <Button
                variant="outlined"
                size={'sm'}
                className="bg-transparent text-white border-white hover:bg-white hover:text-black"
              >
                <ArrowLeft size={16} className="mr-2" />
                Επιστροφή στις ειδήσεις
              </Button>
            </Link>
            <Link href={article.link || '#'} target="_blank" passHref>
              <Button
                variant={'ghost'}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Globe size={16} className="mr-2" />
                Επίσκεψη στην Ιστοσελίδα{' '}
                {article.Website?.name || article.websiteName || null}
              </Button>
            </Link>
          </div>
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="space-y-6">
          <WeatherWidget />
          <TabWrapper title="Σχετικά Άρθρα">
            <RelatedArticles articleId={id} />
          </TabWrapper>
        </aside>
      </div>

      <Footer />
    </div>
  )
}

export default Page
