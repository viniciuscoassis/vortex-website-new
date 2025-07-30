import { http } from 'viem'
import { createConfig } from 'wagmi'
import { sonic, sonicBlazeTestnet } from 'viem/chains'

const isTestnet = process.env.NEXT_PUBLIC_NETWORK === 'testnet'

const testnetConfig = {
  chains: [sonicBlazeTestnet] as const,
  transports: {
    [sonicBlazeTestnet.id]: http()
  }
}

const mainnetConfig = {
  chains: [sonic] as const,
  transports: {
    [sonic.id]: http()
  }
}

export const config = createConfig(isTestnet ? testnetConfig : mainnetConfig)

// Helper function to get the current network's contract address
export const getContractAddress = (type: 'oracles' | 'explorers' | 'vortex'): `0x${string}` | undefined => {
  const prefix = isTestnet ? 'NEXT_PUBLIC_TESTNET' : 'NEXT_PUBLIC_MAINNET'
  const envKey = `${prefix}_${type.toUpperCase()}_CONTRACT_ADDRESS`
  
  // Access the environment variable using bracket notation
  const contractAddress = process.env[envKey]
  if (!contractAddress) {
    console.warn(`Contract address not found for ${type} on ${isTestnet ? 'testnet' : 'mainnet'}`)
    return undefined
  }
  
  return contractAddress as `0x${string}`
} 