"use client"

import { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useMintStore } from "@/lib/store/mint-store"

export function MintInfo() {
  const { 
    totalMinted, 
    maxSupply, 
    mintPrice, 
    loading, 
    lastMintTime,
    fetchMintData 
  } = useMintStore()

  // Check if minting is enabled via environment variable
  const isMintingEnabled = process.env.NEXT_PUBLIC_MINTING_ENABLED === 'true'

  // Fetch data on component mount and when lastMintTime changes
  useEffect(() => {
    fetchMintData()
  }, [fetchMintData, lastMintTime])

  // Calculate progress percentage
  const progressPercentage = maxSupply > 0 ? (totalMinted / maxSupply) * 100 : 0

  return (
    <div className="space-y-4">
      {/* Minting Status Banner */}
      <Card className={`backdrop-blur-md border ${isMintingEnabled ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
        <CardContent className="p-4 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <span className={`text-2xl ${isMintingEnabled ? 'text-emerald-400' : 'text-yellow-400'}`}>
              {isMintingEnabled ? '✅' : '⚠️'}
            </span>
            <div className="text-center">
              <h3 className={`font-semibold ${isMintingEnabled ? 'text-emerald-400' : 'text-yellow-400'}`}>
                {isMintingEnabled ? 'Minting is Live!' : 'Minting Coming Soon'}
              </h3>
              <p className="text-sm text-zinc-300">
                {isMintingEnabled 
                  ? 'Galaxy Explorers are now available for minting' 
                  : 'Stay tuned for the launch of Galaxy Explorers'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mint Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-black/40 backdrop-blur-md border-zinc-800">
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <h3 className="text-lg font-medium text-zinc-400">Mint Price</h3>
            <p className="text-3xl font-bold text-emerald-400">
              {loading ? "..." : `${mintPrice} $S`}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-md border-zinc-800">
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <h3 className="text-lg font-medium text-zinc-400">Total Supply</h3>
            <p className="text-3xl font-bold text-emerald-400">
              {loading ? "..." : maxSupply.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-md border-zinc-800">
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <h3 className="text-lg font-medium text-zinc-400">Minted</h3>
            <p className="text-3xl font-bold text-emerald-400">
              {loading ? "..." : totalMinted.toLocaleString()}
            </p>
            <div className="w-full bg-zinc-800 h-2 rounded-full mt-2">
              <div
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
