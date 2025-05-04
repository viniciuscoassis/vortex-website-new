"use client"

import { useWallet } from "@/lib/wallet-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { WalletIcon } from "lucide-react"

export function UserNFTs() {
  const { isConnected, connect } = useWallet()

  if (!isConnected) {
    return (
      <Card className="bg-black/40 backdrop-blur-md border-zinc-800">
        <CardContent className="p-12 flex flex-col items-center justify-center text-center">
          <WalletIcon className="h-16 w-16 text-zinc-600 mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h3>
          <p className="text-zinc-400 mb-6">Connect your wallet to view your Vortex Foundation NFTs</p>
          <Button
            onClick={connect}
            className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
          >
            Connect Wallet
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-emerald-400">Your Cosmic Collection</h2>
      <div className="grid place-items-center py-12">
        <Card className="bg-black/40 backdrop-blur-md border-zinc-800 max-w-md">
          <CardContent className="p-12 flex flex-col items-center justify-center text-center">
            <h3 className="text-xl font-bold text-white mb-2">No NFTs Found</h3>
            <p className="text-zinc-400 mb-6">
              You don't own any Vortex Foundation NFTs yet. Mint your first cosmic entity to start your collection!
            </p>
            <Button
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Mint Your First NFT
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
