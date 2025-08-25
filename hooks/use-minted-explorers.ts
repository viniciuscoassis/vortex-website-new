import { useState, useEffect } from 'react'

export interface MintedExplorer {
  row_number: number
  TokenId: number
  Species: string
  Hat: string
  Weapon: string
  Background: string
  Outfit: string
  User: string
  BlockNumber: number
  Status: string
  imageCID: string
  uriCID: string
  ImageIPFS: string
  TraitIPFS: string
  Name: string
  Description: string
  Metadata: string
}

export interface TraitStats {
  trait: string
  count: number
  percentage: number
  category: 'species' | 'hat' | 'weapon' | 'background' | 'outfit'
}

export interface TraitPercentages {
  species: TraitStats[]
  hats: TraitStats[]
  weapons: TraitStats[]
  backgrounds: TraitStats[]
  outfits: TraitStats[]
  totalMinted: number
}

export function useMintedExplorers() {
  const [mintedExplorers, setMintedExplorers] = useState<MintedExplorer[]>([])
  const [traitPercentages, setTraitPercentages] = useState<TraitPercentages | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMintedExplorers = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('https://webhook.vortexfdn.xyz/webhook/085ed6f0-21f8-4502-9162-76427aa49cd8')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      const explorers = data.data || []
      
      setMintedExplorers(explorers)
      calculateTraitPercentages(explorers)
      
    } catch (err) {
      console.error('Failed to fetch minted explorers:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const calculateTraitPercentages = (explorers: MintedExplorer[]) => {
    if (explorers.length === 0) return

    const totalMinted = explorers.length
    const traitCounts = {
      species: new Map<string, number>(),
      hats: new Map<string, number>(),
      weapons: new Map<string, number>(),
      backgrounds: new Map<string, number>(),
      outfits: new Map<string, number>()
    }

    // Count occurrences of each trait
    explorers.forEach(explorer => {
      // Count species
      if (explorer.Species) {
        traitCounts.species.set(explorer.Species, (traitCounts.species.get(explorer.Species) || 0) + 1)
      }
      
      // Count hats
      if (explorer.Hat) {
        traitCounts.hats.set(explorer.Hat, (traitCounts.hats.get(explorer.Hat) || 0) + 1)
      }
      
      // Count weapons
      if (explorer.Weapon) {
        traitCounts.weapons.set(explorer.Weapon, (traitCounts.weapons.get(explorer.Weapon) || 0) + 1)
      }
      
      // Count backgrounds
      if (explorer.Background) {
        traitCounts.backgrounds.set(explorer.Background, (traitCounts.backgrounds.get(explorer.Background) || 0) + 1)
      }
      
      // Count outfits
      if (explorer.Outfit) {
        traitCounts.outfits.set(explorer.Outfit, (traitCounts.outfits.get(explorer.Outfit) || 0) + 1)
      }
    })

    // Convert to TraitStats format and sort by count (descending)
    const createTraitStats = (traitMap: Map<string, number>, category: TraitStats['category']): TraitStats[] => {
      return Array.from(traitMap.entries())
        .map(([trait, count]) => ({
          trait,
          count,
          percentage: Math.round((count / totalMinted) * 100 * 100) / 100, // Round to 2 decimal places
          category
        }))
        .sort((a, b) => b.count - a.count)
    }

    const percentages: TraitPercentages = {
      species: createTraitStats(traitCounts.species, 'species'),
      hats: createTraitStats(traitCounts.hats, 'hat'),
      weapons: createTraitStats(traitCounts.weapons, 'weapon'),
      backgrounds: createTraitStats(traitCounts.backgrounds, 'background'),
      outfits: createTraitStats(traitCounts.outfits, 'outfit'),
      totalMinted
    }

    setTraitPercentages(percentages)
  }

  const getTraitPercentage = (traitName: string, category: TraitStats['category']): number => {
    if (!traitPercentages) return 0
    
    const categoryKey = category === 'hat' ? 'hats' : category
    const categoryStats = traitPercentages[categoryKey as keyof TraitPercentages] as TraitStats[]
    const traitStat = categoryStats.find((stat: TraitStats) => stat.trait === traitName)
    
    return traitStat ? traitStat.percentage : 0
  }

  const getTraitRarity = (percentage: number): 'common' | 'rare' | 'epic' | 'legendary' | 'mythic' => {
    if (percentage >= 10) return 'common'
    if (percentage >= 5) return 'rare'
    if (percentage >= 2) return 'epic'
    if (percentage >= 1) return 'legendary'
    return 'mythic'
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400'
      case 'rare': return 'text-blue-400'
      case 'epic': return 'text-purple-400'
      case 'legendary': return 'text-orange-400'
      case 'mythic': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  useEffect(() => {
    fetchMintedExplorers()
  }, [])

  return {
    mintedExplorers,
    traitPercentages,
    loading,
    error,
    fetchMintedExplorers,
    getTraitPercentage,
    getTraitRarity,
    getRarityColor
  }
} 