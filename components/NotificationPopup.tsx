"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Bell } from "lucide-react"
import formatDistanceToNow from "date-fns/formatDistanceToNow"
import { el } from "date-fns/locale"

interface Notification {
  id: string
  message: string
  createdAt: string
  read: boolean
}

const hardcodedNotifications: Notification[] = [
  {
    id: "1",
    message: "RSS Feed 'Newsit.gr' synced with 5 new articles.",
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 mins ago
    read: false,
  },
  {
    id: "2",
    message: "Article 'New Smartphone Review' was updated.",
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 mins ago
    read: false,
  },
  {
    id: "3",
    message: "RSS Feed 'Protothema' synced with 10 new articles.",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    read: true,
  },
]

export function NotificationPopup() {
  const [open, setOpen] = useState(false)
  const popupRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // No fetching here; just use hardcoded notifications
  const notifications = hardcodedNotifications

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open])

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-full p-2 hover:bg-gray-700 transition relative"
      >
        <Bell className="w-5 h-5 text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={popupRef}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-[380px] bg-white shadow-xl rounded-xl border z-50"
          >
            <div className="px-5 py-3 border-b">
              <p className="font-semibold text-gray-700">Notifications</p>
            </div>

            <ul className="max-h-[300px] overflow-auto divide-y text-sm">
              {notifications.length === 0 && (
                <li className="px-5 py-4 text-gray-500 text-center">No notifications</li>
              )}
              {notifications.map((notif) => (
                <li key={notif.id} className="px-5 py-4 hover:bg-gray-50 cursor-pointer">
                  <p className="text-gray-800">{notif.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(notif.createdAt), {
                      addSuffix: true,
                      locale: el,
                    })}
                  </p>
                </li>
              ))}
            </ul>

            <div className="px-5 py-3 border-t text-sm text-blue-600 hover:underline cursor-pointer">
              View all
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
