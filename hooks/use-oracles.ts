import { useEffect, useState } from 'react'
import { useOracleStore } from '@/lib/store/oracles'
import { type Address } from 'viem'

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
  const { oracles, isLoading, error, setOracles, setLoading, setError } = useOracleStore()
  const [totalSupply, setTotalSupply] = useState<number | null>(null)

  const fetchOracles = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/oracles')
      if (!response.ok) {
        throw new Error('Failed to fetch oracles')
      }
      const data = await response.json()

      setOracles(data.oracles)
      setTotalSupply(data.totalSupply)
    } catch (error) {
      console.error('Error loading oracles:', error)
      setError(error instanceof Error ? error.message : 'Failed to load oracles')
    } finally {
      setLoading(false)
    }
  }

  // Load oracles on mount
  useEffect(() => {
    fetchOracles()
  }, [])

  return { 
    oracles, 
    isLoading, 
    error,
    totalSupply,
    refetch: fetchOracles
  }
} 