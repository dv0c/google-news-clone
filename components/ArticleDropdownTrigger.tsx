"use client"

import { MoreVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DropdownProps {
  articleId: string
  link: string
}

export default function ArticleDropdown({ articleId, link }: DropdownProps) {
  const copyLink = async () => {
    await navigator.clipboard.writeText(link)
    alert("Link copied!")
  }

  return (
    <div className="">
      <DropdownMenu>
        <DropdownMenuTrigger className="p-2 transition-all hover:bg-gray-600 dark:hover:bg-gray-800 rounded-full">
            <MoreVertical className="w-5 h-5 text-white" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64">
          <DropdownMenuItem onClick={copyLink}>
            📋 Αντιγραφή συνδέσμου (Copy Link)
          </DropdownMenuItem>
          <DropdownMenuItem>
            📢 Περισσότερες ειδήσεις σαν αυτήν
          </DropdownMenuItem>
          <DropdownMenuItem>
            🙅‍♂️ Λιγότερες ειδήσεις σαν αυτήν
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
