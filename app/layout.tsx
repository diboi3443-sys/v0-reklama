import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _inter = Inter({ subsets: ["latin", "cyrillic"] })
const _playfair = Playfair_Display({ subsets: ["latin", "cyrillic"] })

export const metadata: Metadata = {
  title: "SoulGen AI - Premium AI Creative Platform",
  description:
    "The most powerful AI creative platform. Generate stunning images, videos, audio and more with cutting-edge AI models.",
}

export const viewport: Viewport = {
  themeColor: "#050507",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}<Analytics /></body>
    </html>
  )
}
