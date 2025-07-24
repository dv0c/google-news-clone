import { Article } from "@prisma/client"
import Link from "next/link"
import clsx from "clsx"
import { formatRelativeGR } from "@/lib/formatRelativeGR"

interface ArticleItemProps {
  article: Article
  variant: "big" | "small" | "list" | "list2" | "tab" | "list_bigger_thumbnail"
  isFirst?: boolean
}

export function ArticleItem({ article, variant, isFirst }: ArticleItemProps) {
  
  return (
    <Link href={article.link} target="_blank" className="group cursor-pointer">
      {variant === "big" && (
        <article className="md:max-w-[280px] transition-all active:scale-[0.99]">
          <img
            className="md:w-[280px] w-full h-[300px] md:h-[168px] object-cover rounded-xl"
            src={article.thumbnail || ""}
            alt="thumbnail"
          />
          <div className="flex flex-col gap-2 mt-3">
            <div className="flex items-center gap-2">
              <img
                className="w-4 h-4 object-cover"
                src={article.favicon || null}
                alt="favicon"
              />
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
            <div className="flex items-center gap-2">
              <img
                className="w-4 h-4 object-cover"
                src={article.Website?.favicon || ""}
                alt="favicon"
              />
              <span className="text-gray-400 text-xs">{article.Website?.name}</span>
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
          <div className="flex items-center gap-2">
            <img
              className="w-4 h-4 object-cover"
              src={article.Website?.favicon || ""}
              alt="favicon"
            />
            <span className="text-gray-400 text-xs">{article.Website?.name}</span>
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
          <div className="flex items-center gap-2">
            <img
              className="w-4 h-4 object-cover"
              src={article.favicon || article.Website?.favicon || "https://cdn-icons-png.flaticon.com/512/124/124033.png"}
              alt="favicon"
            />
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
          <div className="flex items-center gap-2 pb-0">
            <img
              className="w-4 h-4 object-cover"
              src={article.favicon || article.Website?.favicon || "https://cdn-icons-png.flaticon.com/512/124/124033.png"}
              alt="favicon"
            />
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
          <div className="flex items-center gap-2 pb-0">
            <img
              className="w-4 h-4 object-cover"
              src={article.favicon || article.Website?.favicon || "https://cdn-icons-png.flaticon.com/512/124/124033.png"}
              alt="favicon"
            />
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
