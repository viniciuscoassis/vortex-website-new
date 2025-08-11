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
  const [showAllTraits, setShowAllTraits] = useState(false)

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

  const renderTraitSelect = (traitType: keyof TraitCategory, traitKey: keyof SelectedTraits, label: string) => {
    const traitList = traits[traitType] as TraitItem[]
    const availableTraits = traitList.filter(t => t.available)
    const allTraits = showAllTraits ? traitList : availableTraits

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
            {allTraits.map((trait) => (
              <SelectItem 
                key={trait.name} 
                value={trait.name}
                disabled={!trait.available}
                className={cn(
                  !trait.available && "opacity-50 cursor-not-allowed"
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="truncate">{trait.name.split(" – ")[0]}</span>
                  <div className="flex items-center gap-2 ml-2">
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
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Show trait info if selected */}
        {selectedTraits[traitKey as keyof SelectedTraits] && (
          <div className="text-xs text-zinc-400">
            {(() => {
              const selectedTrait = traitList.find(t => t.name === selectedTraits[traitKey as keyof SelectedTraits])
              if (!selectedTrait) return null
              
              return (
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-xs px-2 py-0.5",
                      getCategoryColor(selectedTrait.category)
                    )}
                  >
                    {getCategoryIcon(selectedTrait.category)}
                    <span className="ml-1 capitalize">{selectedTrait.category}</span>
                  </Badge>

                  {selectedTrait.collabPartner && (
                    <Badge 
                      variant="outline" 
                      className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-400 border-purple-500/30"
                    >
                      <Users className="h-3 w-3 mr-1" />
                      {selectedTrait.collabPartner}
                    </Badge>
                  )}
                </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        <Card className="bg-black/40 backdrop-blur-md border-zinc-800 h-full">
          <CardContent className="p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-emerald-400">Mint Your Custom Explorer</h2>
              <Button
                onClick={generateRandomTraits}
                variant="outline"
                size="sm"
                className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/50"
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

            {/* Trait Categories Legend */}
            <div className="mb-4 p-3 rounded-lg border border-zinc-700 bg-zinc-900/50">
              <div className="text-sm font-medium text-zinc-300 mb-2">Trait Categories:</div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  <Crown className="h-3 w-3 mr-1" />
                  Default
                </Badge>
                <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                  <Zap className="h-3 w-3 mr-1" />
                  New
                </Badge>
                <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                  <Clock className="h-3 w-3 mr-1" />
                  Coming Soon
                </Badge>
                <Badge variant="outline" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                  <Users className="h-3 w-3 mr-1" />
                  Collab
                </Badge>
                <Badge variant="outline" className="bg-gray-500/20 text-gray-400 border-gray-500/30">
                  <Lock className="h-3 w-3 mr-1" />
                  Old/Disabled
                </Badge>
              </div>
              </div>

            {/* Show All Traits Toggle */}
            <div className="mb-4">
              <Button
                onClick={() => setShowAllTraits(!showAllTraits)}
                variant="outline"
                size="sm"
                className="w-full border-zinc-600 text-zinc-400 hover:bg-zinc-800"
              >
                {showAllTraits ? "Hide" : "Show"} All Traits (Including Coming Soon & Disabled)
              </Button>
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
          <CardContent className="p-6 flex flex-col h-full">
            <h2 className="text-2xl font-bold mb-4 text-emerald-400">Explorer Inspirations</h2>
            <p className="text-zinc-300 mb-4">Get inspired by these unique explorers or create your own custom design.</p>

            <div className="grid grid-cols-2 gap-4 flex-grow">
              {exampleExplorers.map((explorer) => (
                <div
                  key={explorer.id}
                  className="relative aspect-[4/3] rounded-lg overflow-hidden border border-zinc-700 opacity-80 hover:opacity-100 hover:border-zinc-500 transition-all duration-300"
                >
                  <Image 
                    src={explorer.image || "/placeholder.svg"} 
                    alt={explorer.name} 
                    fill 
                    className="object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-white text-sm font-medium">{explorer.name}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {Object.entries(explorer.traits).map(([key, value]) => (
                        <span 
                          key={key}
                          className="text-[10px] px-1.5 py-0.5 bg-black/60 rounded-full text-emerald-400"
                        >
                          {value.split(" – ")[0]}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
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
