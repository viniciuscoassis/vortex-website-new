import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Rocket } from "lucide-react"

export function ExplorersComingSoon() {
  return (
    <div className="absolute inset-0 flex justify-center items-center">
      <Card className="bg-black/80 backdrop-blur-xl border-emerald-500/30 max-w-lg w-full animate-float shadow-lg shadow-emerald-500/10">
        <CardHeader className="pb-2">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Rocket className="h-8 w-8 text-emerald-400" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-white text-center">Galaxy Explorers</CardTitle>
          <CardDescription className="text-zinc-300 text-center text-lg mt-2">
            Coming Soon to the Vortex Universe
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-400">X</p>
              <p className="text-zinc-400 text-sm">Days</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-400">X</p>
              <p className="text-zinc-400 text-sm">Hours</p>
            </div>
          </div>

          <div className="bg-zinc-900/50 rounded-lg p-4">
            <p className="text-zinc-300 text-sm">
              Stay tuned to our Twitter and Telegram channels for the latest updates and announcements about Galaxy Explorers launch!
            </p>
          </div>

          <div className="text-center text-zinc-500 text-xs">
            {process.env.NEXT_PUBLIC_NETWORK === "testnet" ? "Testnet" : "Mainnet"} • Vortex Foundation
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 