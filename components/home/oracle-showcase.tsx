"use client"

import { useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const featuredOracles = [
  {
    id: 1,
    name: "Cosmic Seer",
    image: "/cosmic-oracle.png",
    rarity: "Legendary",
  },
  {
    id: 2,
    name: "Nebula Whisperer",
    image: "/nebula-oracle.png",
    rarity: "Epic",
  },
  {
    id: 3,
    name: "Void Walker",
    image: "/dark-oracle-stars-blackhole.png",
    rarity: "Rare",
  },
  {
    id: 4,
    name: "Stellar Guardian",
    image: "/guardian-oracle-starshield.png",
    rarity: "Epic",
  },
]

export function OracleShowcase() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="relative">
      {/* Large featured oracle */}
      <div className="relative h-[400px] md:h-[500px] w-full rounded-xl overflow-hidden border border-zinc-800 mb-8">
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10"></div>
        <Image
          src={featuredOracles[activeIndex].image || "/placeholder.svg"}
          alt={featuredOracles[activeIndex].name}
          fill
          className="object-cover"
        />
        <div className="absolute bottom-6 left-6 z-20">
          <h3 className="text-2xl font-bold text-white mb-2">{featuredOracles[activeIndex].name}</h3>
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            {featuredOracles[activeIndex].rarity}
          </Badge>
        </div>
      </div>

      {/* Oracle thumbnails */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {featuredOracles.map((oracle, index) => (
          <div
            key={oracle.id}
            className={cn(
              "relative h-24 rounded-lg overflow-hidden border cursor-pointer transition-all duration-300",
              activeIndex === index ? "border-emerald-500 ring-2 ring-emerald-500/50" : "border-zinc-800 opacity-70",
            )}
            onClick={() => setActiveIndex(index)}
          >
            <Image src={oracle.image || "/placeholder.svg"} alt={oracle.name} fill className="object-cover" />
          </div>
        ))}
      </div>

      <div className="mt-8 bg-black/40 backdrop-blur-md border border-zinc-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-emerald-400 mb-4">Oracle Benefits</h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center mr-3 mt-0.5">
              <span className="text-emerald-400 text-sm">✓</span>
            </div>
            <span className="text-zinc-300">Receive 5% of all $VORTEX sell taxes</span>
          </li>
          <li className="flex items-start">
            <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center mr-3 mt-0.5">
              <span className="text-emerald-400 text-sm">✓</span>
            </div>
            <span className="text-zinc-300">Early access to new features and drops</span>
          </li>
          <li className="flex items-start">
            <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center mr-3 mt-0.5">
              <span className="text-emerald-400 text-sm">✓</span>
            </div>
            <span className="text-zinc-300">Governance rights in the Vortex ecosystem</span>
          </li>
          <li className="flex items-start">
            <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center mr-3 mt-0.5">
              <span className="text-emerald-400 text-sm">✓</span>
            </div>
            <span className="text-zinc-300">Exclusive access to future airdrops</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
