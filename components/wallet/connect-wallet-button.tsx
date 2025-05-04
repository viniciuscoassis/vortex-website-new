"use client"

import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"
import { useWallet } from "@/lib/wallet-context"

export function ConnectWalletButton() {
  const { address, isConnecting, isConnected, connect, disconnect } = useWallet()

  if (isConnected && address) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
        onClick={disconnect}
      >
        <Wallet className="mr-2 h-4 w-4" />
        {`${address.slice(0, 6)}...${address.slice(-4)}`}
      </Button>
    )
  }

  return (
    <Button
      variant="default"
      size="sm"
      className="bg-emerald-500 hover:bg-emerald-600 text-white"
      onClick={connect}
      disabled={isConnecting}
    >
      <Wallet className="mr-2 h-4 w-4" />
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  )
}
