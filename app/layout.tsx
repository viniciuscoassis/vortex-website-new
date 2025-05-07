import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import SiteLayout from "@/components/layout/site-layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Vortex Foundation",
  description: "Explore the cosmic unknown with Vortex Foundation NFTs",
  icons: {
    icon: [
      {
        url: '/logo.png',
        type: 'image/png',
      }
    ],
    apple: [
      {
        url: '/logo.png',
        type: 'image/png',
      }
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <SiteLayout>{children}</SiteLayout>
        </ThemeProvider>
      </body>
    </html>
  )
}
