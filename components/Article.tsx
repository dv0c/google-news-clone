import { Article, Website } from "@prisma/client"
import Link from "next/link"
import clsx from "clsx"
import { formatRelativeGR } from "@/lib/formatRelativeGR"
import ArticleDropdown from "./ArticleDropdownTrigger"

interface ArticleItemProps {
  article: Article & {
    Website: Website
  }
  variant: "big" | "small" | "list" | "list2" | "tab" | "list_bigger_thumbnail"
  isFirst?: boolean
}

export function ArticleItem({ article, variant, isFirst }: ArticleItemProps) {

  return (
    <Link href={'/article/' + article.id} target="_blank" className="group cursor-pointer">
      {variant === "big" && (
        <article className="md:max-w-[280px] group transition-all active:scale-[0.99]">
          <img
            className="md:w-[280px] w-full h-[300px] md:h-[168px] object-cover rounded-xl"
            src={article.thumbnail || ""}
            alt="thumbnail"
          />
          <div className="flex flex-col gap-2 mt-3">
            <div className="flex items-center gap-2 relative">
              <img
                className="w-4 h-4 object-cover"
                src={article.favicon || null}
                alt="favicon"
              />
              <div className="opacity-0 group-hover:opacity-100 absolute top-0 right-0 transition-all">
                <ArticleDropdown
                  articleId={article.id}
                  link={`/article/${article.id}`}
                />
              </div>

              <span className="text-gray-400 text-xs">{article.websiteName}</span>
            </div>
            <h2 className="text-[1.25rem] line-clamp-3 text-white group-hover:underline">
              {article.title}
            </h2>
            <span className="text-gray-300 text-xs">{formatRelativeGR(article.pubDate as string)}</span>
          </div>
        </article>
      )}

      {variant === "small" && (
        <article className="w-full max-w-[450px] transition-all active:scale-[0.99]">
          <div className="flex flex-col gap-2 mt-3">
            <div className="flex items-center gap-2 relative">
              <img
                className="w-4 h-4 object-cover"
                src={article.favicon || null}
                alt="favicon"
              />
              <div className="opacity-0 group-hover:opacity-100 absolute top-0 right-0 transition-all">
                <ArticleDropdown
                  articleId={article.id}
                  link={`/article/${article.id}`}
                />
              </div>
              <span className="text-gray-400 text-xs">{article.websiteName}</span>
            </div>
            <h2 className="text-[.875rem] line-clamp-4 text-[#c4c7c5] group-hover:underline">
              {article.title}
            </h2>
            <span className="text-gray-300 text-xs">{formatRelativeGR(article.pubDate as string)}</span>
          </div>
        </article>
      )}

      {variant === "list" && (
        <article
          className={clsx(
            "flex flex-col pt-5 pb-5 transition-all active:scale-[0.99]",
            isFirst ? "" : "border-t border-neutral-600"
          )}
        >
          <div className="flex items-center gap-2 relative">
            <img
              className="w-4 h-4 object-cover"
              src={article.favicon || null}
              alt="favicon"
            />
            <div className="opacity-0 group-hover:opacity-100 absolute top-0 right-[100px] transition-all">
              <ArticleDropdown
                articleId={article.id}
                link={`/article/${article.id}`}
              />
            </div>
            <span className="text-gray-400 text-xs">{article.websiteName}</span>
          </div>
          <div className="flex justify-between ">
            <h2 className="mt-2 text-xs md:text-[1.15rem] leading-6 md:line-clamp-3 max-w-lg text-white group-hover:underline">
              {article.title}
            </h2>
            <img
              className="h-[100px] w-[100px] object-cover rounded-xl"
              src={article.thumbnail || ""}
              alt="thumbnail"
            />
          </div>
          <span className="text-gray-300 text-xs">{formatRelativeGR(article.pubDate as string)}</span>
        </article>
      )}

      {variant === "list_bigger_thumbnail" && (
        <article
          className={clsx(
            "flex flex-col pt-2 pb-2 transition-all active:scale-[0.99]",
            isFirst ? "" : "border-t border-neutral-600"
          )}
        >
          <div className="flex items-center gap-2 relative">
            <img
              className="w-4 h-4 object-cover"
              src={article.favicon || article.Website?.favicon || "https://cdn-icons-png.flaticon.com/512/124/124033.png"}
              alt="favicon"
            />
            <div className="opacity-0 group-hover:opacity-100 absolute top-0 right-[250px] transition-all">
              <ArticleDropdown
                articleId={article.id}
                link={`/article/${article.id}`}
              />
            </div>
            <span className="text-gray-400 text-xs">{article.websiteName || article.Website?.name}</span>
          </div>
          <div className="flex justify-between ">
            <h2 className="mt-2 text-xs md:text-[1.15rem] leading-6 md:line-clamp-3 max-w-lg text-white group-hover:underline">
              {article.title}
            </h2>
            <img
              className="h-[112px] w-[200px] object-cover rounded-xl"
              src={article.thumbnail || ""}
              alt="thumbnail"
            />
          </div>
          <span className="text-gray-300 text-xs">{formatRelativeGR(article.pubDate as string)}</span>
        </article>
      )}

      {variant === "list2" && (
        <article
          className={clsx(
            "flex flex-col pt-5 pb-5 transition-all active:scale-[0.99]",
            isFirst ? "" : "border-t border-neutral-600"
          )}
        >
          <div className="flex items-center gap-2 pb-0 relative">
            <img
              className="w-4 h-4 object-cover"
              src={article.favicon || article.Website?.favicon || "https://cdn-icons-png.flaticon.com/512/124/124033.png"}
              alt="favicon"
            />
            <div className="opacity-0 group-hover:opacity-100 absolute top-0 right-[80px] transition-all">
              <ArticleDropdown
                articleId={article.id}
                link={`/article/${article.id}`}
              />
            </div>
            <span className="text-gray-400 text-xs">{article.websiteName || article.Website?.name || "RSS Feed"}</span>
          </div>
          <div className="flex justify-between gap-2">
            <div className="flex flex-col gap-2">
              <h2 className="mt-2 text-md line-clamp-3 md:line-clamp-3 max-w-lg h-[50px] text-white group-hover:underline">
                {article.title}
              </h2>
              <span className="text-gray-400 text-xs">{formatRelativeGR(article.pubDate as string)}</span>
            </div>
            <img
              className="h-[70px] w-[70px] object-cover rounded-xl"
              src={article.thumbnail || ""}
              alt="thumbnail"
            />
          </div>
        </article>
      )}

      {variant === "tab" && (
        <article
          className={clsx(
            "flex flex-col pt-2 transition-all active:scale-[0.99]",
            isFirst ? "" : "border-t border-neutral-600"
          )}
        >
          <div className="flex items-center gap-2 pb-0 relative">
            <img
              className="w-4 h-4 object-cover"
              src={article.favicon || article.Website?.favicon || "https://cdn-icons-png.flaticon.com/512/124/124033.png"}
              alt="favicon"
            />
            <div className="opacity-0 group-hover:opacity-100 absolute top-0 right-[70px] transition-all">
              <ArticleDropdown
                articleId={article.id}
                link={`/article/${article.id}`}
              />
            </div>
            <span className="text-gray-400 text-xs">{article.websiteName || article.Website?.name || "RSS Feed"}</span>
          </div>
          <div className="flex justify-between gap-2">
            <div className="flex flex-col gap-2">
              <h2 className="mt-2 text-md line-clamp-3 md:line-clamp-3 max-w-lg h-[50px] text-white group-hover:underline">
                {article.title}
              </h2>
              <span className="text-gray-400 text-xs">{formatRelativeGR(article.pubDate as string)}</span>
            </div>
            <img
              className="h-[70px] w-[70px] object-cover rounded-xl"
              src={article.thumbnail || ""}
              alt="thumbnail"
            />
          </div>
        </article>
      )}
    </Link>
  )
}





export function ArticleItemSkeleton({ isFirst }: { isFirst?: boolean }) {
  return (
    <article
      className={clsx(
        "flex flex-col pt-5 pb-5 animate-pulse",
        isFirst ? "" : "border-t border-neutral-600"
      )}
    >
      {/* Top bar with favicon & website name */}
      <div className="flex items-center gap-2 pb-0 relative">
        <div className="w-4 h-4 bg-gray-600 rounded-full" />
        <div className="h-3 w-20 bg-gray-600 rounded" />
      </div>

      {/* Content */}
      <div className="flex justify-between gap-2 mt-2">
        <div className="flex flex-col gap-2">
          {/* Title skeleton */}
          <div className="h-5 w-40 bg-gray-600 rounded" />
          <div className="h-5 w-32 bg-gray-600 rounded" />
          {/* Date skeleton */}
          <div className="h-3 w-16 bg-gray-600 rounded" />
        </div>

        {/* Thumbnail skeleton */}
        <div className="h-[70px] w-[70px] bg-gray-600 rounded-xl" />
      </div>
    </article>
  );
}
