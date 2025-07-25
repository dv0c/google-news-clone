import { ArticleItem } from '@/components/Article'
import { ArticleContent } from '@/components/ArticleContent'
import Footer from '@/components/Footer'
import { Header } from '@/components/header'
import TabWrapper from '@/components/TabWrapper'
import { Button } from '@/components/ui/button'
import WeatherWidget from '@/components/weather-widget'
import { formatDateGR } from '@/lib/formatDateGR'
import { Article, Website } from '@prisma/client'
import axios from 'axios'
import { ArrowLeft, Globe } from 'lucide-react'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { FC } from 'react'

interface pageProps {
    params: {
        id: string
    }
}

const page: FC<pageProps> = async ({ params }) => {
    const { id } = await params
    if (!id) return notFound()


    const data = await axios
        .get(`${process.env.NEXT_PUBLIC_URL || ''}/api/articles?include=content&id=${id}`)
        .then((res) => res.data.article) as Article & {
            Website: Website
        }

    if (!data || !data.id) {
        return notFound()
    }

    // Redirect if content is too short
    if (!data.content || data.content.length <= 200) {
        if (data.link) {
            return redirect(data.link)
        } else {
            return redirect('/')
        }
    }

    return (
        <div className="min-h-screen bg-[#1e1f23] text-white relative">
            <Header activeTab="" />

            {/* Hero Section */}
            <div className="max-w-5xl mx-auto px-4 py-8">
                <Link href="/" passHref>
                    <Button variant="ghost" size={'sm'} className="bg-transparent mb-5 text-white border-white hover:bg-white hover:text-black">
                        <ArrowLeft size={16} className="mr-2" />
                        Επιστροφή στις ειδήσεις
                    </Button>
                </Link>
                <div className="flex items-center gap-4 mb-2">
                    <img
                        src={data.favicon || 'https://cdn-icons-png.flaticon.com/512/124/124033.png'}
                        alt="Website"
                        className="h-10 w-10 rounded-md object-contain bg-white p-1"
                    />
                    <div>
                        <Link
                            href={data.link || '#'}
                            target="_blank"
                            className="text-lg font-semibold hover:underline"
                        >
                            {data.Website?.name || data.websiteName || 'Άγνωστο'}
                        </Link>
                        <div className="text-sm text-gray-400">
                            {formatDateGR(data.createdAt || data.pubDate)}
                        </div>
                    </div>
                </div>

                <h1 className="text-3xl font-bold mb-4 leading-tight">{data.title}</h1>
            </div>

            {/* Content */}
            <main className="max-w-3xl mx-auto px-4 mb-10">
                <ArticleContent html={data.content} />

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-between mt-10 gap-4">
                    <Link href="/" passHref>
                        <Button variant="outlined" size={'sm'} className="bg-transparent text-white border-white hover:bg-white hover:text-black">
                            <ArrowLeft size={16} className="mr-2" />
                            Επιστροφή στις ειδήσεις
                        </Button>
                    </Link>
                    <Link href={data.link || '#'} size={'sm'} target="_blank" passHref>
                        <Button variant={'ghost'} className="bg-blue-600 hover:bg-blue-700 text-white">
                            <Globe size={16} className="mr-2" />
                            Επίσκεψη στην Ιστοσελίδα {data.Website?.name || data.websiteName || null}
                        </Button>
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default page
