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
export const getContractAddress = (type: 'oracles' | 'explorers' | 'vortex') => {
  const prefix = isTestnet ? 'NEXT_PUBLIC_TESTNET' : 'NEXT_PUBLIC_MAINNET'
  return process.env[`${prefix}_${type.toUpperCase()}_CONTRACT_ADDRESS`] as `0x${string}`
} 