import { create } from 'zustand'
import { type Address } from 'viem'

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
}

export const useOracleStore = create<OracleStore>((set) => ({
  oracles: [],
  isLoading: false,
  error: null,
  selectedOracle: null,
  setOracles: (oracles) => set({ oracles }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setSelectedOracle: (oracle) => set({ selectedOracle: oracle })
}))