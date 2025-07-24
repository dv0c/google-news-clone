import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'
import './globals.css'

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
      <body className={openSans.className + "min-h-screen bg-[#292a2d]"}>{children}</body>
    </html>
  )
}
