import { createPublicClient, http, createWalletClient, custom } from "viem"
import { sonic, sonicBlazeTestnet } from "viem/chains"

// Create public clients for each network
export const mainnetClient = createPublicClient({
  chain: sonic,
  transport: http(),
})

export const testnetClient = createPublicClient({
  chain: sonicBlazeTestnet,
  transport: http(),
})

// Get public client based on network
export function getClientForNetwork(network: "mainnet" | "testnet") {
  return network === "mainnet" ? mainnetClient : testnetClient
}
// Create wallet client using the connected wallet
export function getWalletClientForNetwork(network: "mainnet" | "testnet") {
  if (typeof window === 'undefined' || !window.ethereum) return null

  const chain = network === "mainnet" ? sonic : sonicBlazeTestnet
  return createWalletClient({
    chain,
    transport: custom(window.ethereum)
  })
}

