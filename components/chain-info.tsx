"use client"

import { useNetwork } from "@/lib/network-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"
import Link from "next/link"
import { sonic, sonicBlazeTestnet } from "@/lib/chains"

export function ChainInfo() {
  const { network } = useNetwork()
  const chain = network === "mainnet" ? sonic : sonicBlazeTestnet

  return (
    <Card className="bg-black/40 backdrop-blur-md border-zinc-800">
      <CardHeader>
        <CardTitle className="text-emerald-400">Current Network</CardTitle>
        <CardDescription>Connected to {chain.name}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="text-zinc-400">Chain ID</div>
          <div className="text-right">
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
              {chain.id}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="text-zinc-400">Native Currency</div>
          <div className="text-right">
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
              {chain.nativeCurrency.symbol}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="text-zinc-400">Explorer</div>
          <div className="text-right">
            <Link
              href={chain.blockExplorers?.default?.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:underline inline-flex items-center"
            >
              {chain.blockExplorers?.default?.name}
              <ExternalLink className="ml-1 h-3 w-3" />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
