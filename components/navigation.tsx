"use client"

import Link from "next/link"

interface NavigationProps {
  activeTab: string
}

export function Navigation({ activeTab }: NavigationProps) {
  const navigationItems = [
    { id: "/", label: "Home" },
    { id: "following", label: "Following" },
    { id: "showcase", label: "Showcase" },
    { id: "greece", label: "Greece" },
    { id: "world", label: "World" },
    { id: "local", label: "Local" },
    { id: "ανδραβίδα", label: "Ανδραβίδα" },
    { id: "tech", label: "Tech" },
    { id: "entertainment", label: "Entertainment" },
    { id: "sports", label: "Sports" },
  ]

  return (
    <div className=" border-gray-700">
      <nav className="flex justify-center space-x-8 overflow-x-auto py-3">
        {navigationItems.map((item) => (
          <Link href={'/' + item.id} key={item.id}
            className={`whitespace-nowrap text-sm font-medium transition-colors ${
              activeTab === item.id
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-[#CCCCCC] hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
