"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";

interface NavigationProps {
  activeTab: string;
  className?: string;
}

export function Navigation({ activeTab, className }: NavigationProps) {
  const navigationItems = [
    { id: "", label: "Home" },
    { id: "following", label: "Following" },
    { id: "showcase", label: "Showcase" },
    { id: "greece", label: "Greece" },
    { id: "world", label: "World" },
    { id: "local", label: "Local" },
    { id: "ανδραβίδα", label: "Ανδραβίδα" },
    { id: "tech", label: "Tech" },
    { id: "entertainment", label: "Entertainment" },
    { id: "sports", label: "Sports" },
  ];

  return (
    <nav
      className={cn("border-gray-700  whitespace-nowrap", className)}
      aria-label="Primary"
      tabIndex={0}
    >
      <div className="flex justify-center space-x-8 py-3 min-w-max">
        {navigationItems.map((item) => {
          const isActive = activeTab === item.id;
          const href = item.id === "" ? "/" : `/${item.id}`;

          return (
            <Link
              href={href}
              key={item.id}
              scroll={false}
              aria-current={isActive ? "page" : undefined}
              className={`text-sm font-medium transition-colors ${
                isActive
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-[#CCCCCC] hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
