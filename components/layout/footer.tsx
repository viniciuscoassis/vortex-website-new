import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Frame, Twitter, MessageCircle, ExternalLink, BookOpen, BarChart3 } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-black/80 backdrop-blur-md border-t border-zinc-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold mb-4">
              <Image 
                src="/logo.png" 
                alt="Vortex Foundation Logo" 
                width={32} 
                height={32} 
                className="w-8 h-8"
              />
              <span>Vortex Foundation</span>
            </Link>
            <p className="text-zinc-400 text-sm">
              Explore the cosmic unknown with Vortex Foundation NFTs
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-emerald-400">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-zinc-400 hover:text-emerald-400 text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/mint" className="text-zinc-400 hover:text-emerald-400 text-sm">
                  Mint
                </Link>
              </li>
              <li>
                <Link href="/oracles" className="text-zinc-400 hover:text-emerald-400 text-sm">
                  Oracles
                </Link>
              </li>
              <li>
                <Link href="/explorers" className="text-zinc-400 hover:text-emerald-400 text-sm">
                  Explorers
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-emerald-400">Community</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://discord.gg/Frf25j3w"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-emerald-400 text-sm flex items-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  Discord
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/vortexfdn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-emerald-400 text-sm flex items-center gap-2"
                >
                  <Twitter className="h-4 w-4" />
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/oraclefantom"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-emerald-400 text-sm flex items-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  Telegram
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="md:col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-emerald-400">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://vortex-foundation.gitbook.io/vortex-ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-emerald-400 text-sm flex items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="https://equalizer.exchange/swap?fromToken=0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE&toToken=0xf316A1cB7376021ad52705c1403DF86C7A7A18d0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-emerald-400 text-sm flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Buy Vortex Token
                </a>
              </li>
              <li>
                <a
                  href="https://dexscreener.com/sonic/0xB8801468a4a5778a1A4F0dFBf1170258d9a8BA39"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-emerald-400 text-sm flex items-center gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  Token Chart
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-zinc-500 text-sm">
            &copy; {new Date().getFullYear()} Vortex Foundation. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-emerald-400">
              Terms
            </Button>
            <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-emerald-400">
              Privacy
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}
