"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
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
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <Frame className="w-6 h-6 text-emerald-400" />
            <span className="text-white">Vortex Foundation</span>
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

          {/* Network Switcher and Wallet Button */}
          <div className="hidden md:flex items-center space-x-4">
            <NetworkSwitcher />
            <ConnectWalletButton />
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
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
              <div className="pt-4 flex flex-col space-y-3">
                <NetworkSwitcher />
                <ConnectWalletButton />
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
