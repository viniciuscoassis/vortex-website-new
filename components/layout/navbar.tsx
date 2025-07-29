"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Frame, Menu, X } from "lucide-react"
import { ConnectWalletButton } from "@/components/wallet/connect-wallet-button"
import { NetworkSwitcher } from "@/components/wallet/network-switcher"
import { cn } from "@/lib/utils"

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Mint", path: "/mint" },
  { name: "Oracles", path: "/oracles" },
  { name: "Explorers", path: "/explorers" },
  { name: "Travels", path: "/travels" },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-black/80 backdrop-blur-md border-b border-zinc-800" : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center md:items-center justify-between h-auto md:h-20 py-2 md:py-0 gap-y-2 md:gap-y-0">
          {/* Logo with text on desktop, only logo on mobile */}
          <Link href="/" className="flex items-center justify-center w-full md:w-auto gap-2">
            <Image 
              src="/logo.png" 
              alt="Vortex Foundation Logo" 
              width={32} 
              height={32} 
              className="w-8 h-8"
            />
            <span className="text-white text-lg font-semibold hidden md:inline">Vortex Foundation</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-emerald-400",
                  pathname === link.path ? "text-emerald-400" : "text-zinc-300",
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Network Switcher and Wallet Button - always visible, stacked on mobile */}
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 w-full md:w-auto justify-center md:justify-end">
            <NetworkSwitcher />
            <ConnectWalletButton />
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden absolute right-4 top-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-md border-b border-zinc-800">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={cn(
                    "text-sm font-medium py-2 transition-colors hover:text-emerald-400",
                    pathname === link.path ? "text-emerald-400" : "text-zinc-300",
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
