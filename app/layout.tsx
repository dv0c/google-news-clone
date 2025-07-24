import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import './globals.css'
import { AuthPopup } from '@/components/AuthPopup'
import { GoogleSignInPopup } from '@/components/GoogleSignInPopup'
import SessionProvider from '@/components/providers/SessionProvider'

export const metadata: Metadata = {
  title: 'Google News Clone',
  description: 'Created with NextJS',
}

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <SessionProvider>
        <body className={openSans.className + "min-h-screen bg-[#292a2d]"}>
          <GoogleSignInPopup />
          {children}
        </body>
      </SessionProvider>
    </html>
  )
}
