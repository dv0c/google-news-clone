import { Article } from "@prisma/client"
import { ArticleItem } from "./Article"
import TabWrapper from "./TabWrapper"

interface NewsFeedProps {
  featured?: Article;
  related?: Article[];
  others?: Article[];
}

export function NewsFeed({ featured, related = [], others = [] }: NewsFeedProps) {
  const hasFeatured = !!featured;
  const hasRelated = related.length >= 1;
  const hasOthers = others.length >= 1;

  const renderOnlyList = !hasFeatured && !hasRelated;

  return (
    <TabWrapper title="Ειδήσεις" icon={<IconSVG />}>
      {renderOnlyList ? (
        <div className="flex flex-col">
          {[...related, ...others].map((article) => (
            <div key={article.id}>
              <ArticleItem article={article} variant="list" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Featured + Related */}
          <div className="flex md:flex-row flex-col gap-4">
            {hasFeatured && (
              <div>
                <ArticleItem article={featured} variant="big" />
              </div>
            )}
            {hasRelated && (
              <div className="flex flex-col gap-2">
                {related.slice(0, 3).map((article) => (
                  <div key={article.id}>
                    <ArticleItem article={article} variant="small" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Other Articles (list layout) */}
          {others.length > 0 && (
            <div className="flex flex-col mt-5">
              {others.slice(0, 3).map((article) => (
                <div key={article.id}>
                  <ArticleItem article={article} variant="list" />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </TabWrapper>
  );
}


const IconSVG = () => (
  <svg width="24" height="24" className="fill-[#8BB8F8] size-6" viewBox="0 0 24 24" focusable="false">
    <path d="M7.59 18.59L9 20l8-8-8-8-1.41 1.41L14.17 12"></path>
  </svg>
)


export function SkeletonNewsFeed() {
  return (
    <div className="bg-[#1a1a1a] p-4 rounded-2xl animate-pulse">
      {/* Header Title & Icon */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 bg-neutral-700 rounded" />
        <div className="h-4 w-28 bg-neutral-700 rounded" />
      </div>

      {/* Featured + Related */}
      <div className="flex md:flex-row flex-col gap-4">
        {/* Featured */}
        <div className="md:max-w-[280px] w-full">
          <div className="w-full h-[300px] md:h-[168px] bg-neutral-800 rounded-xl" />
          <div className="flex flex-col gap-2 mt-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-neutral-700" />
              <div className="h-3 w-20 bg-neutral-700 rounded" />
            </div>
            <div className="h-5 w-full bg-neutral-700 rounded" />
            <div className="h-3 w-16 bg-neutral-700 rounded" />
          </div>
        </div>

        {/* Related (3x small items) */}
        <div className="flex flex-col gap-4 flex-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-full max-w-[450px]">
              <div className="flex flex-col gap-2 mt-3">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-neutral-700" />
                  <div className="h-3 w-20 bg-neutral-700 rounded" />
                </div>
                <div className="h-4 w-full bg-neutral-700 rounded" />
                <div className="h-3 w-16 bg-neutral-700 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Others (3x list items) */}
      <div className="flex flex-col mt-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-3 pt-5 pb-5 border-t border-neutral-700"
          >
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-neutral-700" />
              <div className="h-3 w-24 bg-neutral-700 rounded" />
            </div>

            <div className="flex justify-between gap-4">
              <div className="flex-1">
                <div className="h-4 w-full bg-neutral-700 rounded mt-2" />
                <div className="h-3 w-16 bg-neutral-700 rounded mt-3" />
              </div>
              <div className="h-[100px] w-[100px] bg-neutral-800 rounded-xl" />
            </div>

            <div className="h-3 w-16 bg-neutral-700 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
