"use client"

import { useNetwork } from "@/lib/network-context"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import { sonic, sonicBlazeTestnet } from "viem/chains"

export function NetworkSwitcher() {
  const { network } = useNetwork()

  // Get the current chain
  const currentChain = network === "mainnet" ? sonic : sonicBlazeTestnet

  return (
    <Button variant="outline" size="sm" className="border-zinc-800 bg-black/40 text-zinc-300">
      <Globe className="mr-2 h-4 w-4 text-emerald-400" />
      {currentChain.name}
    </Button>
  )
}
