import { create } from 'zustand'
import { oraclesABI } from '@/data/abi/oracles'
import { type PublicClient, type Address } from 'viem'

export interface OracleMetadata {
  name: string
  description: string
  image: string
  attributes?: Array<{
    trait_type: string
    value: string | number
  }>
}

export interface Oracle {
  id: number
  owner: Address
  uri: string
  metadata: OracleMetadata
}

interface OracleStore {
  oracles: Oracle[]
  isLoading: boolean
  error: string | null
  selectedOracle: Oracle | null
  setOracles: (oracles: Oracle[]) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  setSelectedOracle: (oracle: Oracle | null) => void
  fetchOracles: (client: PublicClient) => Promise<void>
}

const ORACLE_CONTRACT_ADDRESS = {
  mainnet: process.env.NEXT_PUBLIC_MAINNET_ORACLES_CONTRACT_ADDRESS as `0x${string}`,
  testnet: process.env.NEXT_PUBLIC_TESTNET_ORACLES_CONTRACT_ADDRESS as `0x${string}`
}

export const useOracleStore = create<OracleStore>((set) => ({
  oracles: [],
  isLoading: false,
  error: null,
  selectedOracle: null,
  setOracles: (oracles) => set({ oracles }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setSelectedOracle: (oracle) => set({ selectedOracle: oracle }),

  fetchOracles: async (client: PublicClient) => {
    if (!client) {
      set({ error: 'No network client available', isLoading: false })
      return
    }

    set({ isLoading: true, error: null })
    try {
      // Get network from environment variable
      const network = process.env.NEXT_PUBLIC_NETWORK as 'mainnet' | 'testnet'
      const contractAddress = ORACLE_CONTRACT_ADDRESS[network]

      if (!contractAddress) {
        throw new Error('Contract address not configured for this network')
      }

      // Get total supply
      const totalSupply = await client.readContract({
        address: contractAddress,
        abi: oraclesABI,
        functionName: 'totalSupply'
      })

      // Fetch all oracles
      const oraclesPromises = Array.from({ length: Number(totalSupply) }, async (_, index) => {
        const tokenId = index + 1 // Token IDs start from 1
        const [owner, uri] = await Promise.all([
          client.readContract({
            address: contractAddress,
            abi: oraclesABI,
            functionName: 'ownerOf',
            args: [tokenId]
          }),
          client.readContract({
            address: contractAddress,
            abi: oraclesABI,
            functionName: 'tokenURI',
            args: [tokenId]
          })
        ])

        // Fetch metadata from IPFS
        const response = await fetch((uri as string).replace('ipfs://', 'https://ipfs.io/ipfs/'))
        const metadata = await response.json() as OracleMetadata
        
        return {
          id: tokenId,
          image: metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/'),
          owner: owner as Address,
          uri: uri as string,
          metadata: metadata
        }
      })

      const oracles = await Promise.all(oraclesPromises)
      set({ oracles, isLoading: false })
    } catch (error) {
      console.error('Error fetching oracles:', error)
      set({ error: 'Failed to fetch oracles', isLoading: false })
    }
  }
}))