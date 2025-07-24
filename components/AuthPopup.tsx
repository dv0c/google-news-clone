"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"

export function AuthPopup() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        ref.current &&
        !ref.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open])

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setOpen(prev => !prev)}
        className="rounded-full border p-1 hover:bg-gray-100 transition"
      >
        <img
          src="https://www.gstatic.com/images/branding/product/1x/avatar_circle_blue_512dp.png"
          alt="Avatar"
          className="w-9 h-9 rounded-full"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.98, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute right-0 mt-2 w-[320px] bg-white shadow-xl rounded-xl border z-50",
              "overflow-hidden text-sm"
            )}
          >
            <div className="px-5 py-4">
              <div className="font-medium text-gray-800">Tasos Meintanis</div>
              <div className="text-gray-500 text-sm">tasos@example.com</div>
            </div>
            <hr />
            <button className="w-full text-left px-5 py-3 hover:bg-gray-100 text-gray-700">
              Manage your Meindesk Account
            </button>
            <hr />
            <button className="w-full text-left px-5 py-3 hover:bg-gray-100 text-gray-700">
              Add another account
            </button>
            <button className="w-full text-left px-5 py-3 hover:bg-gray-100 text-gray-700">
              Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
