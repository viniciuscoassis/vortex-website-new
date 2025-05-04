import { useEffect, useRef, useState } from 'react'
import { useNetwork } from '@/lib/network-context'
import { useOracleStore } from '@/lib/store/oracles'
import { oraclesABI } from '@/data/abi/oracles'
import { type Address } from 'viem'

const ORACLE_CONTRACT_ADDRESS = {
  mainnet: process.env.NEXT_PUBLIC_MAINNET_ORACLES_CONTRACT_ADDRESS as `0x${string}`,
  testnet: process.env.NEXT_PUBLIC_TESTNET_ORACLES_CONTRACT_ADDRESS as `0x${string}`
}

const CACHE_KEY = 'oracles_cache'
const CACHE_EXPIRY = 1000 * 60 * 60 // 1 hour in milliseconds

interface CacheData {
  oracles: Oracle[]
  totalSupply: number
  timestamp: number
  network: string
}

interface OracleMetadata {
  name: string
  description: string
  image: string
  attributes?: Array<{
    trait_type: string
    value: string | number
  }>
}

interface Oracle {
  id: number
  owner: Address
  uri: string
  metadata: OracleMetadata
}

export function useOracles() {
  const { client, network } = useNetwork()
  const { oracles, isLoading, error, setOracles, setLoading, setError } = useOracleStore()
  const previousTotalSupply = useRef<number | null>(null)
  const [totalSupply, setTotalSupply] = useState<number | null>(null)

  const getCachedData = (): CacheData | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (!cached) return null

      const data = JSON.parse(cached) as CacheData
      
      // Check if cache is expired or from different network
      if (
        Date.now() - data.timestamp > CACHE_EXPIRY ||
        data.network !== network
      ) {
        localStorage.removeItem(CACHE_KEY)
        return null
      }

      return data
    } catch (error) {
      console.error('Error reading cache:', error)
      return null
    }
  }

  const setCachedData = (data: Omit<CacheData, 'timestamp' | 'network'>) => {
    try {
      const cacheData: CacheData = {
        ...data,
        timestamp: Date.now(),
        network
      }
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
    } catch (error) {
      console.error('Error setting cache:', error)
    }
  }

  const getTotalSupply = async (): Promise<number | null> => {
    if (!client) {
      setError('No network client available')
      return null
    }

    try {
      const contractAddress = ORACLE_CONTRACT_ADDRESS[network]
      if (!contractAddress) {
        throw new Error('Contract address not configured for this network')
      }

      const totalSupply = await client.readContract({
        address: contractAddress,
        abi: oraclesABI,
        functionName: 'totalSupply'
      })

      const totalSupplyNumber = Number(totalSupply)
      setTotalSupply(totalSupplyNumber)
      return totalSupplyNumber
    } catch (error) {
      console.error('Error fetching total supply:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch total supply')
      return null
    }
  }

  const fetchOracleMetadata = async (uri: string): Promise<OracleMetadata> => {
    try {
      if (!uri) {
        return {
          name: "Unknown Oracle",
          description: "No metadata available",
          image: "/placeholder.png"
        }
      }

      const ipfsUrl = uri.replace('ipfs://', 'https://ipfs.io/ipfs/')
      const response = await fetch(ipfsUrl)
      if (!response.ok) throw new Error('Failed to fetch metadata')
      const metadata = await response.json()
      
      // Ensure image is never empty
      if (!metadata.image) {
        metadata.image = "/placeholder.png"
      }
      
      return metadata
    } catch (error) {
      console.error('Error fetching metadata:', error)
      return {
        name: "Unknown Oracle",
        description: "Failed to load metadata",
        image: "/placeholder.png"
      }
    }
  }

  const fetchOracles = async () => {
    if (!client) {
      setError('No network client available')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const totalSupplyNumber = await getTotalSupply()
      if (totalSupplyNumber === null) {
        setLoading(false)
        return
      }

      // Check cache first
      const cachedData = getCachedData()
      if (cachedData && cachedData.totalSupply === totalSupplyNumber) {
        setOracles(cachedData.oracles)
        setLoading(false)
        return
      }

      // Skip fetching if total supply hasn't changed and we have existing oracles
      const currentOracles = useOracleStore.getState().oracles
      if (previousTotalSupply.current === totalSupplyNumber && currentOracles.length > 0) {
        setLoading(false)
        return
      }

      previousTotalSupply.current = totalSupplyNumber

      // Fetch all oracles
      const oraclesPromises = Array.from({ length: totalSupplyNumber }, async (_, index) => {
        const tokenId = index
        
        try {
          // Fetch owner and URI in parallel
          const [owner, uri] = await Promise.all([
            client.readContract({
              address: ORACLE_CONTRACT_ADDRESS[network],
              abi: oraclesABI,
              functionName: 'ownerOf',
              args: [tokenId]
            }),
            client.readContract({
              address: ORACLE_CONTRACT_ADDRESS[network],
              abi: oraclesABI,
              functionName: 'tokenURI',
              args: [tokenId]
            })
          ])

          // Fetch metadata
          const metadata = await fetchOracleMetadata(uri as string)
          
          return {
            id: tokenId,
            owner: owner as Address,
            uri: uri as string,
            metadata
          } as Oracle
        } catch (error) {
          console.error(`Error fetching oracle ${tokenId}:`, error)
          return {
            id: tokenId,
            owner: '0x0000000000000000000000000000000000000000' as Address,
            uri: '',
            metadata: {
              name: `Oracle #${tokenId}`,
              description: "Failed to load oracle data",
              image: "/placeholder.png"
            }
          } as Oracle
        }
      })

      const oracles = await Promise.all(oraclesPromises)
      setOracles(oracles)
      
      // Cache the new data
      setCachedData({ oracles, totalSupply: totalSupplyNumber })
    } catch (error) {
      console.error('Error fetching oracles:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch oracles')
    } finally {
      setLoading(false)
    }
  }

  // Fetch oracles when network changes
  useEffect(() => {
    if (client) {
      fetchOracles()
    }
  }, [client, network])

  return { 
    oracles, 
    isLoading, 
    error,
    totalSupply,
    refetch: fetchOracles,
    getTotalSupply
  }
} 