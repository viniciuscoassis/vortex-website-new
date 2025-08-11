"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@/lib/wallet-context"
import { getClientForNetwork, getWalletClientForNetwork } from "@/lib/public-clients"
import { explorersABI } from "@/data/abi/explorers"
import { parseEther } from "viem"
import { sonic, sonicBlazeTestnet } from "viem/chains"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { NFTCard } from "@/components/nft-card"
import { MintInfo } from "@/components/mint-info"
import { UserNFTs } from "@/components/user-nfts"
import { useToast } from "@/hooks/use-toast"
import { useMintStore } from "@/lib/store/mint-store"
import { useMintedExplorers } from "@/hooks/use-minted-explorers"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Shuffle, Crown, Gift, Clock, Users, Zap, Lock } from "lucide-react"
import traits from "@/data/traits.json"

type TraitItem = {
  name: string
  category: 'default' | 'old' | 'new' | 'coming-soon'
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic'
  available: boolean
  collabPartner?: string
}

type TraitCategory = {
  species: TraitItem[]
  hats: TraitItem[]
  weapons: TraitItem[]
  backgrounds: TraitItem[]
  outfits: TraitItem[]
}

type SelectedTraits = {
    species: string
    background: string
    hat: string
    outfit: string
    weapon: string
}

// Example explorers data
const exampleExplorers = [
  {
    id: 1,
    name: "Saturnian Explorer",
    image: "/explorers/2.jpeg",
    traits: {
      species: "Saturnian – translucent blue, tentacles, luminescent eyes.",
      background: "ringed gas giant",
      hat: "stellar cowboy hat",
      outfit: "casual martian colony wear",
      weapon: "water gun"
    },
  },
  {
    id: 2,
    name: "Cryon Explorer",
    image: "/explorers/19.png",
    traits: {
      species: "Cryon – crystalline ice body, cold vapors, brittle movements.",
      background: "frozen moon surface",
      hat: "steampunk bronze diving helmet",
      outfit: "retro astronaut suit",
      weapon: "dimensional flashlight"
    },
  },
  {
    id: 3,
    name: "Voidborn Explorer",
    image: "/explorers/3.jpeg",
    traits: {
      species: "Voidborn – distorted silhouette, living shadow, born near black holes.",
      background: "bioluminescent low-gravity forest",
      hat: "wormhole halo",
      outfit: "tribal wear with bioluminescent fibers",
      weapon: "cosmic ice spear"
    },
  },
  {
    id: 4,
    name: "Techniderm Explorer",
    image: "/explorers/20.png",
    traits: {
      species: "Techniderm – metallic skin with circuits, symbiotic AI.",
      background: "ringed gas giant",
      hat: "animated binary crown",
      outfit: "synthetic leather jacket with LEDs",
      weapon: "quantum screwdriver"
    },
  },
]

export default function MintPage() {
  const { address, isConnected, walletClient } = useWallet()
  const { toast } = useToast()
  const { triggerNFTRefresh, triggerMintDataRefresh } = useMintStore()
  const { mintedExplorers, loading: explorersLoading } = useMintedExplorers()
  const [selectedTraits, setSelectedTraits] = useState<SelectedTraits>({
    species: traits.species.find(t => t.available)?.name || "",
    background: traits.backgrounds.find(t => t.available)?.name || "",
    hat: traits.hats.find(t => t.available)?.name || "",
    outfit: traits.outfits.find(t => t.available)?.name || "",
    weapon: "none"
  })
  const [isMinting, setIsMinting] = useState(false)
  const [isWhitelisted, setIsWhitelisted] = useState(false)
  const [hasClaimedFree, setHasClaimedFree] = useState(false)
  const [whitelistLoading, setWhitelistLoading] = useState(false)
  const [currentInspirationIndex, setCurrentInspirationIndex] = useState(0)


  // Check if minting is enabled via environment variable
  const isMintingEnabled = process.env.NEXT_PUBLIC_MINTING_ENABLED === 'true'

  // Check whitelist status when wallet connects
  useEffect(() => {
    const checkWhitelistStatus = async () => {
      if (!isConnected || !address) {
        setIsWhitelisted(false)
        setHasClaimedFree(false)
        return
      }

      setWhitelistLoading(true)
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

        // Check if user is whitelisted
        const whitelisted = await client.readContract({
          address: contractAddress,
          abi: explorersABI,
          functionName: 'whitelist',
          args: [address]
        }) as boolean

        setIsWhitelisted(whitelisted)

        // Check if user has already claimed free NFT
        const claimedFree = await client.readContract({
          address: contractAddress,
          abi: explorersABI,
          functionName: 'hasClaimedFree',
          args: [address]
        }) as boolean

        setHasClaimedFree(claimedFree)

        console.log('Whitelist status:', { whitelisted, claimedFree, address })
      } catch (error) {
        console.error('Failed to check whitelist status:', error)
        setIsWhitelisted(false)
        setHasClaimedFree(false)
      } finally {
        setWhitelistLoading(false)
      }
    }

    checkWhitelistStatus()
  }, [isConnected, address])

  const handleTraitChange = (trait: keyof SelectedTraits, value: string) => {
    setSelectedTraits((prev) => ({ ...prev, [trait]: value }))
  }

  const generateRandomTraits = () => {
    const availableSpecies = traits.species.filter(t => t.available)
    const availableBackgrounds = traits.backgrounds.filter(t => t.available)
    const availableHats = traits.hats.filter(t => t.available)
    const availableOutfits = traits.outfits.filter(t => t.available)
    const availableWeapons = traits.weapons.filter(t => t.available)
    
    const randomSpecies = availableSpecies[Math.floor(Math.random() * availableSpecies.length)]
    const randomBackground = availableBackgrounds[Math.floor(Math.random() * availableBackgrounds.length)]
    const randomHat = availableHats[Math.floor(Math.random() * availableHats.length)]
    const randomOutfit = availableOutfits[Math.floor(Math.random() * availableOutfits.length)]
    
    // 50% chance to have a weapon, 50% chance to have none
    const shouldHaveWeapon = Math.random() > 0.5
    const randomWeapon = shouldHaveWeapon 
      ? availableWeapons[Math.floor(Math.random() * availableWeapons.length)]
      : { name: "none", category: "new", rarity: "common", available: true }

    setSelectedTraits({
      species: randomSpecies?.name || "",
      background: randomBackground?.name || "",
      hat: randomHat?.name || "",
      outfit: randomOutfit?.name || "",
      weapon: randomWeapon?.name || "none"
    })

    console.log("🎲 Generated random traits:", {
      species: randomSpecies?.name,
      background: randomBackground?.name,
      hat: randomHat?.name,
      outfit: randomOutfit?.name,
      weapon: randomWeapon?.name
    })
  }

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'common': return { label: 'Common', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' }
      case 'rare': return { label: 'Rare', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' }
      case 'epic': return { label: 'Epic', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' }
      case 'legendary': return { label: 'Legendary', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' }
      default: return { label: 'Common', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' }
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'default': return <Crown className="h-3 w-3" />
      case 'new': return <Zap className="h-3 w-3" />
      case 'coming-soon': return <Clock className="h-3 w-3" />
      case 'old': return <Lock className="h-3 w-3" />
      default: return null
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'default': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'new': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      case 'coming-soon': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'old': return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  // Get random explorers from minted data
  const getRandomExplorers = () => {
    if (!mintedExplorers || mintedExplorers.length === 0) return exampleExplorers
    
    const shuffled = [...mintedExplorers].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, 4).map((explorer, index) => ({
      id: index + 1,
      name: explorer.Name || `Explorer #${explorer.TokenId}`,
      image: explorer.ImageIPFS || `/explorers/${index + 1}.jpeg`,
      traits: {
        species: explorer.Species || "Unknown",
        background: explorer.Background || "Unknown",
        hat: explorer.Hat || "None",
        outfit: explorer.Outfit || "Unknown",
        weapon: explorer.Weapon || "None"
      }
    }))
  }

  // State to store the current set of random explorers
  const [currentExplorers, setCurrentExplorers] = useState(() => getRandomExplorers())

  // Get next random inspiration
  const getNextInspiration = () => {
    const newExplorers = getRandomExplorers()
    setCurrentExplorers(newExplorers)
    setCurrentInspirationIndex(0) // Reset to first explorer in new set
  }

  // Cycle through current explorers without randomizing
  const cycleThroughExplorers = () => {
    setCurrentInspirationIndex((prevIndex) => (prevIndex + 1) % currentExplorers.length)
  }

  // Convert IPFS URL to HTTP gateway URL
  const getImageUrl = (ipfsUrl: string) => {
    if (!ipfsUrl) return "/placeholder.svg"
    
    // If it's already an HTTP URL, return as is
    if (ipfsUrl.startsWith('http')) return ipfsUrl
    
    // Convert IPFS URL to HTTP gateway
    if (ipfsUrl.startsWith('ipfs://')) {
      const hash = ipfsUrl.replace('ipfs://', '')
      return `https://ipfs.io/ipfs/${hash}`
    }
    
    // If it's just a hash, assume it's IPFS
    if (ipfsUrl.length > 40) {
      return `https://ipfs.io/ipfs/${ipfsUrl}`
    }
    
    return ipfsUrl
  }

  const renderTraitSelect = (traitType: keyof TraitCategory, traitKey: keyof SelectedTraits, label: string) => {
    const traitList = traits[traitType] as TraitItem[]

    return (
      <div className="space-y-2">
        <Label htmlFor={traitKey}>{label}</Label>
        <Select 
          value={selectedTraits[traitKey as keyof SelectedTraits]} 
          onValueChange={(value) => handleTraitChange(traitKey, value)}
        >
          <SelectTrigger id={traitKey} className="bg-zinc-900 border-zinc-700">
            <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-700 max-h-60">
            {traitList.map((trait) => (
              <SelectItem 
                key={trait.name} 
                value={trait.name}
                disabled={!trait.available}
                className={cn(
                  !trait.available && "opacity-50 cursor-not-allowed"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="truncate">{trait.name.split(" – ")[0]}</span>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-xs px-2 py-0.5",
                      getCategoryColor(trait.category)
                    )}
                  >
                    {getCategoryIcon(trait.category)}
                    <span className="ml-1 capitalize">{trait.category}</span>
                  </Badge>
                  {trait.collabPartner && (
                    <Badge 
                      variant="outline" 
                      className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-400 border-purple-500/30"
                    >
                      <Users className="h-3 w-3 mr-1" />
                      {trait.collabPartner}
                    </Badge>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Rarity Badge only */}
        {selectedTraits[traitKey as keyof SelectedTraits] && (
          <div className="flex justify-end">
            {(() => {
              const selectedTrait = traitList.find(t => t.name === selectedTraits[traitKey as keyof SelectedTraits])
              if (!selectedTrait) return null
              
              const rarityBadge = getRarityBadge(selectedTrait.rarity)
              return (
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-xs px-2 py-0.5",
                    rarityBadge.color
                  )}
                >
                  {rarityBadge.label}
                </Badge>
              )
            })()}
          </div>
        )}
      </div>
    )
  }

  const handleMint = async () => {
    if (!isConnected || !address || !walletClient) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet first",
        variant: "destructive",
      })
      return
    }

    setIsMinting(true)

    try {
      // Create traits JSON string
      const traitsJson = JSON.stringify(selectedTraits)
      
      console.log("🚀 Starting mint process with traits:", selectedTraits)

      // Step 1: Get signature from the API
      const signResponse = await fetch('/api/sign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          traitsJson,
          userAddress: address
        }),
      })

      if (!signResponse.ok) {
        const errorData = await signResponse.json()
        throw new Error(`Failed to get signature: ${errorData.error}`)
      }

      const { signature } = await signResponse.json()
      console.log("✅ Received signature:", signature)

      // Step 2: Verify signature on the contract before minting
      console.log("🔍 Verifying signature on contract...")
      
      const network = process.env.NEXT_PUBLIC_NETWORK === 'testnet' ? 'testnet' : 'mainnet'
      const client = getClientForNetwork(network)
      const chain = network === 'testnet' ? sonicBlazeTestnet : sonic
      
      const explorerAddresses = {
        testnet: process.env.NEXT_PUBLIC_TESTNET_EXPLORERS_CONTRACT_ADDRESS as `0x${string}`,
        mainnet: process.env.NEXT_PUBLIC_MAINNET_EXPLORERS_CONTRACT_ADDRESS as `0x${string}`
      }

      const contractAddress = explorerAddresses[network]
      
      if (!contractAddress) {
        throw new Error('Explorers contract address not configured')
      }

      // Step 3: Call the contract's mintWithTraits function
      console.log("🎯 Calling mintWithTraits on contract...")
      
      // Determine mint value based on whitelist status
      let mintValue = BigInt(0)
      if (isWhitelisted && !hasClaimedFree) {
        // Free mint for whitelisted users who haven't claimed
        mintValue = BigInt(0)
        console.log("🎁 Free mint for whitelisted user")
      } else {
        // Paid mint - get price from contract
        const mintPrice = await client.readContract({
          address: contractAddress,
          abi: explorersABI,
          functionName: 'MINT_PRICE'
        }) as bigint
        mintValue = mintPrice
        console.log("💰 Paid mint - price:", mintPrice.toString())
      }

      // Call the mint function
      const hash = await walletClient.writeContract({
        address: contractAddress,
        abi: explorersABI,
        functionName: 'mintWithTraits',
        args: [traitsJson, signature],
        value: mintValue,
        chain,
        account: address
      })

      console.log("📝 Transaction hash:", hash)

      // Wait for transaction confirmation
      console.log("⏳ Waiting for transaction confirmation...")
      const receipt = await client.waitForTransactionReceipt({ hash })
      
      console.log("✅ Transaction confirmed:", receipt)

      // Check if the transaction was successful
      if (receipt.status === 'success') {
        const mintType = isWhitelisted && !hasClaimedFree ? "FREE" : "PAID"
        
        toast({
          title: "🎉 Explorer Minted Successfully!",
          description: `Your ${mintType.toLowerCase()} Explorer has been minted. Transaction: ${hash.slice(0, 10)}...${hash.slice(-8)}`,
          variant: "default",
        })
        
        // Update whitelist status after successful mint
        if (isWhitelisted && !hasClaimedFree) {
          setHasClaimedFree(true)
        }
        
        // Trigger refreshes via Zustand store
        console.log("🔄 Triggering refreshes via Zustand...")
        triggerNFTRefresh()
        triggerMintDataRefresh()
      } else {
        throw new Error("Transaction failed")
      }
      
    } catch (error) {
      console.error("❌ Minting failed:", error)
      
      // Provide more specific error messages
      let errorTitle = "Minting Failed"
      let errorDescription = "An unexpected error occurred during minting"
      
      if (error instanceof Error) {
        if (error.message.includes("insufficient funds")) {
          errorTitle = "Insufficient Funds"
          errorDescription = "You don't have enough funds to complete this transaction"
        } else if (error.message.includes("user rejected")) {
          errorTitle = "Transaction Cancelled"
          errorDescription = "You cancelled the transaction"
        } else if (error.message.includes("Invalid signature")) {
          errorTitle = "Signature Error"
          errorDescription = "Signature verification failed"
        } else {
          errorDescription = error.message
        }
      }
      
      toast({
        title: errorTitle,
        description: errorDescription,
        variant: "destructive",
      })
    } finally {
      setIsMinting(false)
    }
  }

  // Determine button text and status
  const getMintButtonText = () => {
    if (!isConnected) return "Connect Wallet"
    if (!isMintingEnabled) return "Minting Coming Soon"
    if (isMinting) return "Minting..."
    
    if (isWhitelisted && !hasClaimedFree) {
      return "Mint FREE (Whitelisted)"
    } else if (isWhitelisted && hasClaimedFree) {
      return "Mint for 50 $S (Whitelisted - Free Claimed)"
    } else {
      return "Mint for 50 $S"
    }
  }

  const getMintStatusMessage = () => {
    if (!isConnected) {
      return {
        type: "warning" as const,
        message: "⚠️ Please connect your wallet to mint an Explorer"
      }
    }
    
    if (!isMintingEnabled) {
      return {
        type: "warning" as const,
        message: "⚠️ Minting is not available yet. Stay tuned for the launch of Galaxy Explorers!"
      }
    }

    if (isWhitelisted && !hasClaimedFree) {
      return {
        type: "success" as const,
        message: "🎁 You're whitelisted! Claim your FREE Explorer NFT."
      }
    } else if (isWhitelisted && hasClaimedFree) {
      return {
        type: "info" as const,
        message: "👑 You're whitelisted! You've claimed your free NFT. Additional mints cost 50 $S."
      }
    } else {
      return {
        type: "success" as const,
        message: "✅ Minting is now live! Create your unique Galaxy Explorer."
      }
    }
  }

  const mintStatus = getMintStatusMessage()

  return (
    <div>
      <MintInfo />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 mt-8 sm:mt-12">
        <Card className="bg-black/40 backdrop-blur-md border-zinc-800 h-full">
          <CardContent className="p-4 sm:p-6 flex flex-col h-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
              <h2 className="text-xl sm:text-2xl font-bold text-emerald-400">Mint Your Custom Explorer</h2>
              <Button
                onClick={generateRandomTraits}
                variant="outline"
                size="sm"
                className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/50 w-full sm:w-auto"
              >
                <Shuffle className="h-4 w-4 mr-2" />
                Random
              </Button>
            </div>

            {/* Whitelist Status Display */}
            {isConnected && !whitelistLoading && (
              <div className="mb-4 p-3 rounded-lg border">
                {isWhitelisted ? (
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Crown className="h-4 w-4" />
                    <span className="text-sm font-medium">Whitelisted</span>
                    {!hasClaimedFree && (
                      <div className="flex items-center gap-1 ml-2">
                        <Gift className="h-4 w-4 text-yellow-400" />
                        <span className="text-xs text-yellow-400">Free NFT Available</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-zinc-400">
                    <span className="text-sm">Not whitelisted - Standard pricing applies</span>
                  </div>
                )}
              </div>
            )}

            {/* Rarity Legend */}
            <div className="mb-4 p-3 rounded-lg border border-zinc-700 bg-zinc-900/50">
              <div className="text-sm font-medium text-zinc-300 mb-2">Rarity Levels:</div>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                <Badge variant="outline" className="bg-gray-500/20 text-gray-400 border-gray-500/30 text-xs">
                  Common
                </Badge>
                <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                  Rare
                </Badge>
                <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                  Epic
                </Badge>
                <Badge variant="outline" className="bg-orange-500/20 text-orange-400 border-orange-500/30 text-xs">
                  Legendary
                </Badge>
              </div>
            </div>

            {/* Trait Categories Legend */}
            <div className="mb-4 p-3 rounded-lg border border-zinc-700 bg-zinc-900/50">
              <div className="text-sm font-medium text-zinc-300 mb-2">Trait Categories:</div>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                  <Crown className="h-3 w-3 mr-1" />
                  Default
                </Badge>
                <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                  <Zap className="h-3 w-3 mr-1" />
                  New
                </Badge>
                <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  Coming Soon
                </Badge>
                <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                  <Users className="h-3 w-3 mr-1" />
                  Collab
                </Badge>
                <Badge variant="outline" className="bg-gray-500/20 text-gray-400 border-gray-500/30 text-xs">
                  <Lock className="h-3 w-3 mr-1" />
                  Old/Disabled
                </Badge>
              </div>
            </div>

            

            <div className="space-y-4 flex-grow">
              {renderTraitSelect("species", "species", "Species")}
              {renderTraitSelect("backgrounds", "background", "Background")}
              {renderTraitSelect("hats", "hat", "Headgear")}
              {renderTraitSelect("outfits", "outfit", "Outfit")}
              {renderTraitSelect("weapons", "weapon", "Weapon")}
            </div>

            <div className={cn(
              "mt-4 p-4 rounded-lg border",
              mintStatus.type === "warning" && "bg-yellow-500/10 border-yellow-500/20",
              mintStatus.type === "success" && "bg-emerald-500/10 border-emerald-500/20",
              mintStatus.type === "info" && "bg-blue-500/10 border-blue-500/20"
            )}>
              <p className={cn(
                "text-sm text-center",
                mintStatus.type === "warning" && "text-yellow-400",
                mintStatus.type === "success" && "text-emerald-400",
                mintStatus.type === "info" && "text-blue-400"
              )}>
                {mintStatus.message}
              </p>
            </div>

            <Button
              onClick={handleMint}
              className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white"
              size="lg"
              disabled={!isConnected || !isMintingEnabled || isMinting || whitelistLoading}
            >
              {whitelistLoading ? "Checking Whitelist..." : getMintButtonText()}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-md border-zinc-800 h-full">
          <CardContent className="p-4 sm:p-6 flex flex-col h-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
              <h2 className="text-xl sm:text-2xl font-bold text-emerald-400">Explorer Inspirations</h2>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  onClick={cycleThroughExplorers}
                  variant="outline"
                  size="sm"
                  className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/50 flex-1 sm:flex-none"
                >
                  <Shuffle className="h-4 w-4 mr-2" />
                  Next
                </Button>
                <Button
                  onClick={getNextInspiration}
                  variant="outline"
                  size="sm"
                  className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/50 flex-1 sm:flex-none"
                >
                  <Shuffle className="h-4 w-4 mr-2" />
                  Random
                </Button>
              </div>
            </div>
            <p className="text-zinc-300 mb-4 text-sm sm:text-base">Get inspired by these unique explorers or create your own custom design.</p>

            {/* Single highlighted explorer */}
            <div className="flex-grow flex items-center justify-center p-2 sm:p-4 min-h-[300px] sm:min-h-[400px]">
              {(() => {
                if (explorersLoading) {
                  return (
                    <div className="flex flex-col items-center justify-center space-y-4 text-zinc-400">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                      <p className="text-sm">Loading explorers...</p>
                    </div>
                  )
                }

                const currentExplorer = currentExplorers[currentInspirationIndex] || currentExplorers[0]
                
                // Debug info
                console.log('Current explorer:', currentExplorer)
                console.log('Image URL:', getImageUrl(currentExplorer.image))
                console.log('Minted explorers count:', mintedExplorers?.length || 0)
                
                if (!currentExplorer) {
                  return (
                    <div className="flex flex-col items-center justify-center space-y-4 text-zinc-400">
                      <p className="text-sm">No explorers available</p>
                    </div>
                  )
                }
                
                return (
                  <div className="relative w-full h-full rounded-lg overflow-hidden border-2 border-emerald-500/50 shadow-lg shadow-emerald-500/20 min-h-[280px] sm:min-h-[380px]">
                    <Image 
                      src={getImageUrl(currentExplorer.image)} 
                      alt={currentExplorer.name} 
                      fill 
                      className="object-cover"
                      onError={(e) => {
                        console.error('Image failed to load:', e)
                        // Fallback to placeholder if IPFS image fails
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg"
                      }}
                      onLoad={() => console.log('Image loaded successfully')}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                    <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4">
                      <p className="text-white text-sm sm:text-lg font-bold mb-2 sm:mb-3">{currentExplorer.name}</p>
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {Object.entries(currentExplorer.traits).map(([key, value]) => (
                          <span 
                            key={key}
                            className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 bg-black/80 rounded-full text-emerald-400 border border-emerald-500/50 font-medium"
                          >
                            {value.split(" – ")[0]}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="owned" className="mt-16">
        <TabsList className="bg-zinc-900 border border-zinc-800">
          <TabsTrigger value="owned">Your Collection</TabsTrigger>
        </TabsList>
        <TabsContent value="owned" className="mt-6">
          <UserNFTs />
        </TabsContent>
      </Tabs>
    </div>
  )
}
