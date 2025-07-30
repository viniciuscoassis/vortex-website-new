"use client"

import { MintInfo, MintInfoRef } from "@/components/mint-info"
import { NFTCard } from "@/components/nft-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserNFTs, UserNFTsRef } from "@/components/user-nfts"
import { explorersABI } from "@/data/abi/explorers"
import traits from "@/data/traits.json"
import { useToast } from "@/hooks/use-toast"
import { getClientForNetwork } from "@/lib/public-clients"
import { cn } from "@/lib/utils"
import { useWallet } from "@/lib/wallet-context"
import { Crown, Gift, Shuffle } from "lucide-react"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { sonic, sonicBlazeTestnet } from "viem/chains"

type Explorer = {
  id: number
  name: string
  image: string
  traits: {
    species: string
    background: string
    hat: string
    outfit: string
    weapon: string
  }
}

// Example explorers data
const exampleExplorers = [
  {
    id: 1,
    name: "Saturnian Explorer",
    image: "/explorers/2.jpeg",
    traits: {
      species: "Saturnian",
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
      species: "Cryon",
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
      species: "Voidborn",
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
      species: "Techniderm",
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
  const userNFTsRef = useRef<UserNFTsRef>(null)
  const mintInfoRef = useRef<MintInfoRef>(null)
  const [selectedTraits, setSelectedTraits] = useState({
    species: traits.species[0],
    background: traits.backgrounds[0],
    hat: traits.hats[0],
    outfit: traits.outfits[0],
    weapon: "none"
  })
  const [isMinting, setIsMinting] = useState(false)
  const [isWhitelisted, setIsWhitelisted] = useState(false)
  const [hasClaimedFree, setHasClaimedFree] = useState(false)
  const [whitelistLoading, setWhitelistLoading] = useState(false)

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

  const handleTraitChange = (trait: string, value: string) => {
    setSelectedTraits((prev) => ({ ...prev, [trait]: value }))
  }

  const generateRandomTraits = () => {
    const randomSpecies = traits.species[Math.floor(Math.random() * traits.species.length)]
    const randomBackground = traits.backgrounds[Math.floor(Math.random() * traits.backgrounds.length)]
    const randomHat = traits.hats[Math.floor(Math.random() * traits.hats.length)]
    const randomOutfit = traits.outfits[Math.floor(Math.random() * traits.outfits.length)]
    
    // 50% chance to have a weapon, 50% chance to have none
    const shouldHaveWeapon = Math.random() > 0.5
    const randomWeapon = shouldHaveWeapon 
      ? traits.weapons[Math.floor(Math.random() * traits.weapons.length)]
      : "none"

    setSelectedTraits({
      species: randomSpecies,
      background: randomBackground,
      hat: randomHat,
      outfit: randomOutfit,
      weapon: randomWeapon
    })

    console.log("🎲 Generated random traits:", {
      species: randomSpecies,
      background: randomBackground,
      hat: randomHat,
      outfit: randomOutfit,
      weapon: randomWeapon
    })
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

      // // Call the contract's verifySignature function
      // const isValid = await client.readContract({
      //   address: contractAddress,
      //   abi: explorersABI,
      //   functionName: 'verifySignature',
      //   args: [traitsJson, signature]
      // }) as boolean

      // if (!isValid) {
      //   throw new Error("Invalid signature - verification failed on contract")
      // }
      
      // console.log("✅ Signature verified successfully on contract")

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
        
        // Refresh the user's NFTs to show the newly minted NFT
        console.log("🔄 Refreshing user's NFT collection...")
        if (userNFTsRef.current) {
          await userNFTsRef.current.refetch()
        }
        
        // Refresh mint info to update statistics
        console.log("📊 Refreshing mint statistics...")
        if (mintInfoRef.current) {
          await mintInfoRef.current.refetch()
        }
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
      <MintInfo ref={mintInfoRef} />

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

            <div className="space-y-4 flex-grow">
              <div className="space-y-2">
                <Label htmlFor="species">Species</Label>
                <Select value={selectedTraits.species} onValueChange={(value) => handleTraitChange("species", value)}>
                  <SelectTrigger id="species" className="bg-zinc-900 border-zinc-700">
                    <SelectValue placeholder="Select species" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700">
                    {traits.species.map((species) => (
                      <SelectItem key={species} value={species}>
                        {species.split(" – ")[0]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="background">Background</Label>
                <Select value={selectedTraits.background} onValueChange={(value) => handleTraitChange("background", value)}>
                  <SelectTrigger id="background" className="bg-zinc-900 border-zinc-700">
                    <SelectValue placeholder="Select background" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700">
                    {traits.backgrounds.map((background) => (
                      <SelectItem key={background} value={background}>
                        {background}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hat">Headgear</Label>
                <Select value={selectedTraits.hat} onValueChange={(value) => handleTraitChange("hat", value)}>
                  <SelectTrigger id="hat" className="bg-zinc-900 border-zinc-700">
                    <SelectValue placeholder="Select headgear" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700">
                    {traits.hats.map((hat) => (
                      <SelectItem key={hat} value={hat}>
                        {hat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="outfit">Outfit</Label>
                <Select value={selectedTraits.outfit} onValueChange={(value) => handleTraitChange("outfit", value)}>
                  <SelectTrigger id="outfit" className="bg-zinc-900 border-zinc-700">
                    <SelectValue placeholder="Select outfit" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700">
                    {traits.outfits.map((outfit) => (
                      <SelectItem key={outfit} value={outfit}>
                        {outfit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weapon">Weapon</Label>
                <Select value={selectedTraits.weapon} onValueChange={(value) => handleTraitChange("weapon", value)}>
                  <SelectTrigger id="weapon" className="bg-zinc-900 border-zinc-700">
                    <SelectValue placeholder="Select weapon" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700">
                    <SelectItem value="none">None</SelectItem>
                    {traits.weapons.map((weapon) => (
                      <SelectItem key={weapon} value={weapon}>
                        {weapon}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
          {/* <TabsTrigger value="examples">Example Explorers</TabsTrigger> */}
          <TabsTrigger value="owned">Your Collection</TabsTrigger>
        </TabsList>
        <TabsContent value="examples" className="mt-6">
          <h2 className="text-2xl font-bold mb-6 text-emerald-400">Example Galaxy Explorers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <NFTCard
              name="Cosmic Wanderer #42"
              traits={{
                species: "Human",
                headgear: "Helmet",
                weapon: "Blaster",
                background: "Nebula",
                outfit: "Spacesuit",
              }}
              image="/futuristic-space-explorer.png"
            />
            <NFTCard
              name="Void Voyager #93"
              traits={{
                species: "Void-Touched",
                headgear: "None",
                weapon: "Staff",
                background: "Black Hole",
                outfit: "Robe",
              }}
              image="/dark-space-explorer.png"
            />
            <NFTCard
              name="Nebula Navigator #17"
              traits={{
                species: "Celestial",
                headgear: "Crown",
                weapon: "Sword",
                background: "Stars",
                outfit: "Armor",
              }}
              image="/blue-space-explorer.png"
            />
            <NFTCard
              name="Star Seeker #128"
              traits={{
                species: "Synthetic",
                headgear: "Cap",
                weapon: "Gauntlet",
                background: "Planet",
                outfit: "Stealth",
              }}
              image="/explorer-star-map.png"
            />
          </div>
        </TabsContent>
        <TabsContent value="owned" className="mt-6">
          <UserNFTs ref={userNFTsRef} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
