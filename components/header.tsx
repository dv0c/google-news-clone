"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "./search-bar";
import { Navigation } from "./navigation";
import Link from "next/link";
import { AuthPopup } from "./AuthPopup";
import { NotificationPopup } from "./NotificationPopup";
import { cn } from "@/lib/utils";

interface HeaderProps {
  activeTab: string;
}

export function Header({ activeTab }: HeaderProps) {
  const [navSticky, setNavSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setNavSticky(window.scrollY > 80); // adjust scroll offset as needed
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="bg-[#202124] border-b border-gray-700 sticky top-0 z-50">
      <div className={cn("px-4 sm:px-6 lg:px-8 transition-all", navSticky && '-translate-y-[100%]')}>
        <div className="flex items-center justify-between h-16">
          {/* Logo and Menu button */}
          <div className="flex items-center gap-4">
            <Button size="icon" className="md:hidden text-white hover:bg-gray-700">
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <h1 className="text-xl font-normal text-white">Meindesk</h1>
              <Link href="/" className="text-xl font-normal text-white hover:underline">
                Ειδήσεις
              </Link>
            </div>
          </div>

          {/* Search */}
          <SearchBar />

          {/* Profile & Settings */}
          <div className="flex items-center gap-2">
            <div className="flex justify-end p-4 gap-4">
              <NotificationPopup />
              {/* Optional: <AuthPopup /> */}
            </div>
            <div className="flex justify-end p-4">
              <AuthPopup />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation - sticky on scroll */}
      <nav
        className={`border-t border-gray-700 fixed left-0 w-full shadow-md bg-[#202124] z-50 transition-all duration-300 ${
          navSticky && "-translate-y-[3.5rem] border-none" 
        }`}
        style={{ backdropFilter: navSticky ? "saturate(180%) blur(10px)" : "none" }}
      >
        <div className="px-4 sm:px-6 lg:px-8 flex items-center gap-4 h-14 max-w-[1280px] mx-auto">
          {/* Show logo on sticky navigation */}
            <div className={cn("flex items-center gap-2 transition-all duration-500 -translate-y-[500%] flex-shrink-0", navSticky ? "translate-y-[0%] opacity-100 hidden sm:flex" : "opacity-0 w-0 duration-0")}>
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">M</span>
              </div>
              <Link href="/" className="text-white font-semibold hover:underline text-lg">
                Meindesk
              </Link>
            </div>

          {/* Navigation links */}
          <div className="flex-1 overflow-auto">
            <Navigation activeTab={activeTab} />
          </div>
        </div>
      </nav>
    </header>
  );
}
