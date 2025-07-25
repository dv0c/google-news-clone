import { ArticleItem } from '@/components/Article'
import Footer from '@/components/Footer'
import { Header } from '@/components/header'
import TabWrapper from '@/components/TabWrapper'
import { Button } from '@/components/ui/button'
import WeatherWidget from '@/components/weather-widget'
import { formatDateGR } from '@/lib/formatDateGR'
import { Website } from '@prisma/client'
import axios from 'axios'
import { ArrowLeft, Info } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FC } from 'react'

interface pageProps {
    params: {
        website: string
    }
}

const page: FC<pageProps> = async ({ params }) => {
    const { website } = await params
    if (!website) return notFound()
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_URL || ''}/api/rss?websiteId=${website}`)


    return <div className='min-h-screen bg-[#292a2d]'>
        <Header activeTab={data.website.name} />

        <div className="mb-6 max-w-[1140px] flex-wrap gap-5 px-4 sm:px-2 lg:px-0 py-6 mx-auto flex items-center justify-between">
            <div className='space-y-5'>
                <Link href={'/'}>
                    <Button variant="tonal" className="text-white bg-transparent hover:bg-blue-400/10 p-0 hover:p-2 transition-all hover:text-blue-500 rounded-xl">
                        <ArrowLeft size={16} />
                        Όλες οι ειδήσεις
                    </Button>
                </Link>
                <img className='h-12 w-12' src={data.website.favicon || 'https://cdn-icons-png.flaticon.com/512/124/124033.png'} alt='Website' />
                <Link target='_blank' href={data.website.url} className="text-white hover:underline font-semibold text-[1.75rem] mb-2">
                    {data.website.name}
                </Link>
                <p className="text-gray-300 text-sm">{formatDateGR()}</p>
            </div>
            <div>
                <WeatherWidget />
            </div>
        </div>

        <main className='max-w-[1140px] mx-auto px-4 sm:px-2 lg:px-0'>
            <TabWrapper className="max-w-3xl px-4 sm:px-2 lg:px-0">
                {data.articles.length > 0 ? (
                    data.articles.map((article: any, index: number) => (
                        <div key={index} className='rounded-2xl px-4 py-2 bg-[#1f1f1f]'>
                            <ArticleItem article={article} isFirst={index === 0} variant='list_bigger_thumbnail' />
                        </div>
                    ))
                ) : (
                    <p className="text-gray-300">Δεν βρέθηκαν άρθρα για αυτή την πηγή.</p>
                )}
            </TabWrapper>
        </main>

        <Footer />
    </div>
}

export default page