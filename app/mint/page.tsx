import MintPage from "@/components/mint-page"
import { Badge } from "@/components/ui/badge"
import { GalaxyBackground } from "@/components/galaxy-background"

export default function Mint() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden text-white">
      <GalaxyBackground />

      <main className="container relative z-10 mx-auto px-4 py-24">
        <div className="mb-12 text-center">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-4 py-1 text-sm mb-4">
            NFT Collection
          </Badge>
          <h1 className="mb-4 text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            Mint Your Galaxy Explorer 🚀
          </h1>
          <p className="text-xl text-zinc-300 max-w-2xl mx-auto">
            Create your unique explorer with custom traits and embark on cosmic journeys across the Vortex universe.
          </p>
        </div>

        <MintPage />
      </main>
    </div>
  )
}
