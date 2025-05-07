"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { NFTCard } from "@/components/nft-card"
import { MintInfo } from "@/components/mint-info"
import { UserNFTs } from "@/components/user-nfts"
import Image from "next/image"
import { cn } from "@/lib/utils"
import traits from "@/data/traits.json"

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
  const [selectedTraits, setSelectedTraits] = useState({
    species: traits.species[0],
    background: traits.backgrounds[0],
    hat: traits.hats[0],
    outfit: traits.outfits[0],
    weapon: "none"
  })

  const handleTraitChange = (trait: string, value: string) => {
    setSelectedTraits((prev) => ({ ...prev, [trait]: value }))
  }

  const handleMint = () => {
    // Log the selected traits
    console.log("Selected traits for minting:", {
      species: selectedTraits.species,
      background: selectedTraits.background,
      hat: selectedTraits.hat,
      outfit: selectedTraits.outfit,
      weapon: selectedTraits.weapon
    })
    
    // Mint logic would go here
    alert(`Explorer minting initiated with selected traits: ${JSON.stringify(selectedTraits)}`)
  }

  return (
    <div>
      <MintInfo />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        <Card className="bg-black/40 backdrop-blur-md border-zinc-800 h-full">
          <CardContent className="p-6 flex flex-col h-full">
            <h2 className="text-2xl font-bold mb-4 text-emerald-400">Mint Your Custom Explorer</h2>

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

            <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-yellow-400 text-sm text-center">
                ⚠️ Minting is not available yet. Stay tuned for the launch of Galaxy Explorers!
              </p>
            </div>

            <Button
              onClick={handleMint}
              className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white"
              size="lg"
              disabled
            >
              Mint for 50 $S
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
          <UserNFTs />
        </TabsContent>
      </Tabs>
    </div>
  )
}
