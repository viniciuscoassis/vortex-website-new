"use client"

import { createContext, useContext, type ReactNode } from "react"
import { type PublicClient } from "viem"
import { mainnetClient, testnetClient } from "./public-clients"

type NetworkType = "mainnet" | "testnet"

interface NetworkContextType {
  network: NetworkType
  client: PublicClient
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined)

export function NetworkProvider({ children }: { children: ReactNode }) {
  // Get network from environment variable
  const network = (process.env.NEXT_PUBLIC_NETWORK || "mainnet") as NetworkType
  const client = network === "mainnet" ? mainnetClient : testnetClient

  return (
    <NetworkContext.Provider value={{ network, client }}>
      {children}
    </NetworkContext.Provider>
  )
}

export function useNetwork() {
  const context = useContext(NetworkContext)
  if (context === undefined) {
    throw new Error("useNetwork must be used within a NetworkProvider")
  }
  return context
}
