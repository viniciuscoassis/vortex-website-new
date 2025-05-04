"use client"

import type { ReactNode } from "react"
import Navbar from "@/components/layout/navbar"
import Footer from "@/components/layout/footer"
import { NetworkProvider } from "@/lib/network-context"
import { WalletProvider } from "@/lib/wallet-context"
import { Toaster } from "@/components/ui/toaster"

interface SiteLayoutProps {
  children: ReactNode
}

export default function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <NetworkProvider>
      <WalletProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex-grow">{children}</div>
          <Footer />
        </div>
        <Toaster />
      </WalletProvider>
    </NetworkProvider>
  )
}
