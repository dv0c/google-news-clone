'use client'
import Footer from '@/components/Footer';
import { Header } from '@/components/header';
import { NewsFeed, SkeletonNewsFeed } from '@/components/news-feed';
import { Button } from '@/components/ui/button';
import WeatherWidget from '@/components/weather-widget';
import { useFetch } from '@/hooks/useFetch';
import { formatDateGR } from '@/lib/formatDateGR';
import { Info } from 'lucide-react';
import { FC, use } from 'react'

interface pageProps {
    params: { location: string };
}

const page: FC<pageProps> = ({ params }) => {
    const location = use(params);

    const {
        featured,
        related,
        others,
        meta,
        isLoading,
        isError,
        refetch,
    } = useFetch({ keyphrase: location.location, page: 1, limit: 10 })


    return (
        <div className='min-h-screen bg-[#292a2d]'>
            <Header activeTab={location.location} />

            <div className="mb-6 max-w-6xl flex-wrap gap-5 px-4 sm:px-6 lg:px-8 py-6 mx-auto flex items-center justify-between">
                <div>
                    <Button variant="ghost" className="text-white bg-transparent hover:bg-blue-400/10 p-0 hover:p-2 transition-all hover:text-blue-500 rounded-xl">
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


            <main className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
                {isLoading ? <SkeletonNewsFeed /> : (
                    <NewsFeed
                        featured={featured}
                        related={related}
                        others={others}
                        onArticleClick={(id) => console.log(`Article clicked: ${id}`)}
                    />
                )}
            </main>
            <Footer />
        </div>
    )
}

export default page