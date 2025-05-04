import { GalaxyBackground } from "@/components/galaxy-background"
import { ExplorersGrid } from "@/components/explorers/explorers-grid"
import { Badge } from "@/components/ui/badge"
import { ExplorersComingSoon } from "@/components/explorers/explorers-coming-soon"

export default function Explorers() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden text-white">
      <GalaxyBackground />

      <main className="container relative z-10 mx-auto px-4 py-24">
        <div className="mb-12 text-center">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-4 py-1 text-sm mb-4">
            Galaxy Explorers
          </Badge>
          <h1 className="mb-4 text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            Explorers: Brave the Cosmic Unknown 🚀
          </h1>
          <p className="text-xl text-zinc-300 max-w-2xl mx-auto">
            Meet our collection of Galaxy Explorers, each with unique traits and abilities to navigate the cosmos.
          </p>
        </div>

        <div className="relative">
          <div className="filter blur-md pointer-events-none">
            <ExplorersGrid />
          </div>

        </div>
      </main>
    </div>
  )
}
