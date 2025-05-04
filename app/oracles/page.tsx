"use client"

import { useEffect } from "react"
import { GalaxyBackground } from "@/components/galaxy-background"
import { OraclesGrid } from "@/components/oracles/oracles-grid"
import { Badge } from "@/components/ui/badge"
import { useOracleStore } from "@/lib/store/oracles"
import { useOracles } from "@/hooks/use-oracles"

export default function Oracles() {
  const { oracles } = useOracleStore()
  const { totalSupply } = useOracles()

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-white">
      <GalaxyBackground />

      <main className="container relative z-10 mx-auto px-4 py-24">
        <div className="mb-12 text-center">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-4 py-1 text-sm mb-4">
            Cosmic Entities
          </Badge>
          <h1 className="mb-4 text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            Oracles: Guides of the Cosmos 🔮
          </h1>
          <p className="text-xl text-zinc-300 max-w-2xl mx-auto">
            Discover our collection of cosmic oracles, each with unique powers to guide you through the universe.
          </p>
          <div className="flex justify-center mt-4">
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
              {totalSupply} Oracles Minted
            </Badge>
          </div>
        </div>

        <OraclesGrid />
      </main>
    </div>
  )
}
