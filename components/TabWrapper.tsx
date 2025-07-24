'use client'
import { cn } from "@/lib/utils";
import { FC, ReactNode, useState, useEffect } from "react";

interface TabWrapperProps {
  children: ReactNode;
  title?: string;
  icon?: ReactNode;
  image?: string;
  action?: ReactNode;
  compactActionIcon?: ReactNode;
  border?: boolean;
  titleColor?: string;
  className?: string;
}

const TabWrapper: FC<TabWrapperProps> = ({
  children,
  title,
  icon,
  image,
  action,
  compactActionIcon,
  className,
  border = true,
  titleColor = "text-[#8BB8F8]",
}) => {
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsCompact(width < 400); // Adjust breakpoint as needed
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl p-4 bg-[#1f1f1f]",
        className
      )}
    >
      {(title || image || action) && (
        <div
          className={cn(
            "flex items-center justify-between gap-2 flex-nowrap overflow-hidden",
            border ? "border-b pb-5 border-neutral-600" : ""
          )}
        >
          <div className="flex items-center gap-2 min-w-0 overflow-hidden">
            {image && (
              <img
                src={image}
                alt={title || "Tab image"}
                className="w-6 h-6 object-contain rounded shrink-0"
              />
            )}
            {title && (
              <h1
                className={cn(
                  "text-xl flex items-center gap-2 truncate",
                  titleColor
                )}
              >
                {title} {icon}
              </h1>
            )}
          </div>

          {action && (
            <div className="shrink-0">
              {isCompact && compactActionIcon ? compactActionIcon : action}
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export default TabWrapper;
