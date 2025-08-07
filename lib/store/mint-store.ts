import { create } from 'zustand'
import { getClientForNetwork } from '@/lib/public-clients'
import { explorersABI } from '@/data/abi/explorers'
import { formatEther } from 'viem'

interface MintState {
  // Contract data
  totalMinted: number
  maxSupply: number
  mintPrice: string
  loading: boolean
  
  // Refresh triggers
  lastMintTime: number
  lastNFTRefreshTime: number
  
  // Actions
  fetchMintData: () => Promise<void>
  triggerNFTRefresh: () => void
  triggerMintDataRefresh: () => void
}

export const useMintStore = create<MintState>((set, get) => ({
  // Initial state
  totalMinted: 0,
  maxSupply: 2222,
  mintPrice: "0",
  loading: false,
  lastMintTime: 0,
  lastNFTRefreshTime: 0,

  // Fetch mint data from contract
  fetchMintData: async () => {
    set({ loading: true })
    
    try {
      const network = process.env.NEXT_PUBLIC_NETWORK === 'testnet' ? 'testnet' : 'mainnet'
      const client = getClientForNetwork(network)
      
      const explorerAddresses = {
        testnet: process.env.NEXT_PUBLIC_TESTNET_EXPLORERS_CONTRACT_ADDRESS as `0x${string}`,
        mainnet: process.env.NEXT_PUBLIC_MAINNET_EXPLORERS_CONTRACT_ADDRESS as `0x${string}`
      }

      const contractAddress = explorerAddresses[network]
      
      if (!contractAddress) {
        console.error('Explorers contract address not configured')
        return
      }

      // Fetch all contract data in parallel
      const [totalMintedResult, maxSupplyResult, mintPriceResult] = await Promise.all([
        client.readContract({
          address: contractAddress,
          abi: explorersABI,
          functionName: 'totalMinted'
        }) as Promise<bigint>,
        client.readContract({
          address: contractAddress,
          abi: explorersABI,
          functionName: 'MAX_SUPPLY'
        }) as Promise<bigint>,
        client.readContract({
          address: contractAddress,
          abi: explorersABI,
          functionName: 'MINT_PRICE'
        }) as Promise<bigint>
      ])

      set({
        totalMinted: Number(totalMintedResult),
        maxSupply: Number(maxSupplyResult),
        mintPrice: formatEther(mintPriceResult),
        loading: false
      })

      console.log('Mint data fetched:', {
        totalMinted: Number(totalMintedResult),
        maxSupply: Number(maxSupplyResult),
        mintPrice: formatEther(mintPriceResult)
      })
    } catch (error) {
      console.error('Failed to fetch mint data:', error)
      set({ loading: false })
    }
  },

  // Trigger NFT collection refresh
  triggerNFTRefresh: () => {
    set({ lastNFTRefreshTime: Date.now() })
    console.log('🔄 NFT refresh triggered via Zustand')
  },

  // Trigger mint data refresh
  triggerMintDataRefresh: () => {
    set({ lastMintTime: Date.now() })
    console.log('📊 Mint data refresh triggered via Zustand')
  }
})) 