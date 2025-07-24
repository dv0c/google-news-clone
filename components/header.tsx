import { Menu, Search, Settings, User, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchBar } from "./search-bar"
import { Navigation } from "./navigation"
import Link from "next/link"
import { AuthPopup } from "./AuthPopup"
import { NotificationPopup } from "./NotificationPopup"

interface HeaderProps {
  activeTab: string
}

export function Header({ activeTab }: HeaderProps) {
  return (
    <header className="bg-[#202124] border-b border-gray-700 sticky top-0 z-50">
      <div className=" px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Button size="icon" className="md:hidden text-white hover:bg-gray-700">
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <h1 className="text-xl font-normal text-white">Meindesk</h1>
              <Link href="/" className="text-xl font-normal text-white hover:underline">Ειδήσεις</Link>
            </div>
          </div>

          <SearchBar />

          {/* Profile & Settings */}
          <div className="flex items-center gap-2">
            <div className="flex justify-end p-4 gap-4">
              <NotificationPopup />
              {/* Optional: <AuthPopup /> */}
            </div>
            {/* <Button variant="ghost" size="icon" className="text-white rounded-full hover:bg-gray-700">
              <Settings className="w-5 h-5" />
            </Button> */}
            <div className="flex justify-end p-4">
              <AuthPopup />
            </div>
          </div>
        </div>

        <Navigation activeTab={activeTab} />
      </div>
    </header>
  )
}
