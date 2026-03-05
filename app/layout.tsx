import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: "--font-playfair",
  display: "swap",
})

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
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">{children}<Analytics /></body>
    </html>
  )
}
