import { useFetch } from "@/hooks/useFetch"
import TabWrapper from "./TabWrapper"
import { ArticleItem } from "./Article"
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Button } from "./ui/button";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

const Sources = () => {
    const { websites, isLoading } = useFetch({ mode: 'websites', limit: 5, page: 1 })

    if (isLoading) {
        return <div>
            <SkeletonSources />
        </div>
    }

    if (!websites || websites.length === 0) {
        return null
    }

    return <Swiper autoplay spaceBetween={10} slidesPerView={1} breakpoints={{
        640: {
            slidesPerView: 1,
        },
        768: {
            slidesPerView: 2,
        },
        1024: {
            slidesPerView: 3,
        },
    }}>
        {websites.map((website) => (
            <SwiperSlide key={website.id} className="w-full">
                <TabWrapper
                    compactActionIcon={
                        <CompactButton href={'/rss/' +website.id} />
                    }
                    action={<ActionButton href={'/rss/' +website.id} />} className="" image={website.favicon} titleColor="text-white" title={website.name} border={false}>
                    {website.articles.map((article) => (
                        <ArticleItem article={article} key={article.id} variant="tab" />
                    ))}
                </TabWrapper>
            </SwiperSlide>
        ))}
    </Swiper>
}

export default Sources

const ActionButton = ({ href }: { href: string }) => {
    return (
        <Link href={href}>
            <Button variant={'filled'} size={'sm'} className="!rounded-2xl !h-8 !px-4">
                Διάβασε περισσότερα
            </Button>
        </Link>
    )
}

const CompactButton = ({ href }: { href: string }) => {
    return (
        <Link href={href}>
            <Button size={"icon"} variant={"filled"} className="!rounded-full !h-8 !w-8">
                <ArrowRightIcon className="w-5 h-5" />
            </Button>
        </Link>
    )
}

const SkeletonSources = () => {
    return (
        <Swiper
            spaceBetween={10}
            slidesPerView={1}
            breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
            }}
        >
            {[...Array(3)].map((_, i) => (
                <SwiperSlide key={i} className="w-full">
                    {/* TabWrapper container mimic */}
                    <div className="flex flex-col gap-3 rounded-2xl p-4 bg-[#1f1f1f] animate-pulse min-h-[280px]">

                        {/* Mimic the header with border bottom */}
                        <div className="flex items-center justify-between border-b pb-5 border-neutral-600">
                            <div className="flex items-center gap-2">
                                {/* favicon skeleton */}
                                <div className="w-6 h-6 rounded object-contain bg-neutral-700" />
                                {/* title skeleton */}
                                <div className="h-6 rounded bg-neutral-700 w-24" />
                            </div>
                            {/* action placeholder (optional, empty here) */}
                            <div />
                        </div>

                        {/* Children skeleton - articles */}
                        <div className="flex flex-col gap-4 flex-grow">
                            {[...Array(3)].map((__, j) => (
                                <div key={j} className="flex gap-3 items-center">
                                    {/* article thumbnail skeleton */}
                                    <div className="w-[70px] h-[70px] rounded-xl bg-neutral-700 flex-shrink-0" />
                                    {/* article text skeleton */}
                                    <div className="flex flex-col gap-2 flex-grow">
                                        <div className="h-4 rounded bg-neutral-700 w-full" />
                                        <div className="h-3 rounded bg-neutral-700 w-5/6" />
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
};
