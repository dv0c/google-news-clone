"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export function GoogleSignInPopup() {
    const router = useRouter()
    const [open, setOpen] = useState(true)
    const session = useSession()

    if (!open) return null
    if (!session.data?.user) return null


    const handleClick = async () => {
        await signIn("google", {
            callbackUrl: "/",
        }).then(() => {
            router.push("/")
        })
    }

    return (
        <div
            className="fixed top-5 right-4 z-[999999] w-[420px] bg-white rounded-lg shadow-lg p-4"
            role="dialog"
            aria-modal="true"
        >
            {/* Close Button */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-gray-900">Sign in with Google</h2>
                <button
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                    className=" p-1 rounded hover:bg-gray-100 transition"
                >
                    <X className="w-5 h-5 text-gray-600" />
                </button>

            </div>

            {/* Content */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 leading-tight mb-1">
                    Use your Google Account
                    <br />
                    to sign in to Meindesk
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                    No more passwords to remember. Signing in is fast, simple and secure.
                </p>
            </div>

            {/* Decorative SVG shapes */}
            <div className="absolute top-5 right-5 pointer-events-none select-none opacity-20" style={{ width: 72, height: 72 }}>
                <svg
                    width="72"
                    height="72"
                    viewBox="0 0 80 80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle cx="40" cy="40" r="40" fill="#F4B400" />
                    <circle cx="25" cy="55" r="10" fill="#0F9D58" />
                    <circle cx="55" cy="25" r="10" fill="#DB4437" />
                    <rect x="35" y="35" width="10" height="10" fill="#4285F4" />
                </svg>
            </div>

            {/* Continue Button */}
            <button
                type="button"
                className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
                onClick={handleClick}
            >
                Continue
            </button>
        </div>
    )
}
