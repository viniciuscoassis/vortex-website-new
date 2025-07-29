"use client"

import { useNetwork } from "@/lib/network-context"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import { sonic, sonicBlazeTestnet } from "viem/chains"
import { useWallet } from "@/lib/wallet-context"
import { Badge } from "@/components/ui/badge"

export function NetworkSwitcher() {
  const { network } = useNetwork()
  const { isNetworkMismatch, switchNetwork } = useWallet()
  // Get the current chain
  const currentChain = network === "mainnet" ? sonic : sonicBlazeTestnet

  return (
    <div className="flex flex-col items-end gap-2">
      {!isNetworkMismatch && (
        <Button variant="outline" size="sm" className="border-zinc-800 bg-black/40 text-emerald-300 font-semibold flex items-center gap-2">
          <Globe className="h-4 w-4 text-emerald-400" />
          {currentChain.name}
        </Button>
      )}
      {isNetworkMismatch && (
        <div className="flex flex-row items-center gap-2 mt-1">
          <Badge className="border border-yellow-400/40 text-yellow-400 bg-transparent px-3 py-1 text-xs font-medium rounded-full shadow-none">Wrong Network</Badge>
          <Button
            size="sm"
            variant="default"
            className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-md h-8 px-4 py-1 text-xs font-semibold shadow-none border-emerald-500/30"
            onClick={switchNetwork}
          >
            Switch Network
          </Button>
        </div>
      )}
    </div>
  )
}
