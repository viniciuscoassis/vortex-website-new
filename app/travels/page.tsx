import { GalaxyBackground } from "@/components/galaxy-background"
import { TravelsInterface } from "@/components/travels/travels-interface"
import { Badge } from "@/components/ui/badge"
import { TravelsComingSoon } from "@/components/travels/travels-coming-soon"

export default function Travels() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden text-white">
      <GalaxyBackground />

      <main className="container relative z-10 mx-auto px-4 py-24">
        <div className="mb-12 text-center">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-4 py-1 text-sm mb-4">
            GameFi
          </Badge>
          <h1 className="mb-4 text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            Cosmic Travels
          </h1>
          <p className="text-xl text-zinc-300 max-w-2xl mx-auto">
            Send your Galaxy Explorers on cosmic journeys to discover $DUST and rare treasures across the universe.
          </p>
        </div>

        {/* Wrap the interface with the coming soon overlay */}
        <div className="relative">
          <div className="filter blur-md pointer-events-none">
            <TravelsInterface />
          </div>
          <TravelsComingSoon />
        </div>
      </main>
    </div>
  )
}
