import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

// Sample explorer data
const explorers = [
  {
    id: 1,
    name: "Cosmic Wanderer #42",
    description: "A seasoned explorer who has mapped countless nebulae and discovered rare cosmic phenomena.",
    image: "/futuristic-space-explorer.png",
    rarity: "Legendary",
    traits: {
      race: "Celestial",
      gear: "Quantum Suit",
      specialty: "Navigation",
    },
  },
  {
    id: 2,
    name: "Nebula Navigator #17",
    description: "Specializes in traversing the most dangerous cosmic clouds, collecting valuable stellar dust.",
    image: "/blue-space-explorer.png",
    rarity: "Epic",
    traits: {
      race: "Human",
      gear: "Nebula Breather",
      specialty: "Resource Collection",
    },
  },
  {
    id: 3,
    name: "Void Voyager #93",
    description:
      "A mysterious explorer who has ventured closer to black holes than any other and lived to tell the tale.",
    image: "/dark-space-explorer.png",
    rarity: "Rare",
    traits: {
      race: "Void-Touched",
      gear: "Gravity Disruptor",
      specialty: "Black Hole Research",
    },
  },
  {
    id: 4,
    name: "Star Seeker #128",
    description: "An expert in identifying habitable planets and establishing outposts for future exploration.",
    image: "/explorer-star-map.png",
    rarity: "Epic",
    traits: {
      race: "Synthetic",
      gear: "Terraforming Kit",
      specialty: "Colonization",
    },
  },
  {
    id: 5,
    name: "Quantum Jumper #56",
    description:
      "Can navigate quantum realms and parallel dimensions, bringing back artifacts from alternate realities.",
    image: "/quantum-explorer.png",
    rarity: "Legendary",
    traits: {
      race: "Quantum Entity",
      gear: "Dimensional Anchor",
      specialty: "Reality Hopping",
    },
  },
  {
    id: 6,
    name: "Astral Nomad #72",
    description: "A spiritual explorer who communes with cosmic energies and can predict celestial events.",
    image: "/mystical-space-explorer.png",
    rarity: "Uncommon",
    traits: {
      race: "Astral Being",
      gear: "Energy Conduit",
      specialty: "Cosmic Prediction",
    },
  },
]

export function ExplorersGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {explorers.map((explorer) => (
        <Card
          key={explorer.id}
          className="bg-black/40 backdrop-blur-md border-zinc-800 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/10"
        >
          <div className="aspect-square relative">
            <Image src={explorer.image || "/placeholder.svg"} alt={explorer.name} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">{explorer.name}</h3>
                <span className="px-2 py-1 bg-black/60 rounded-full text-xs font-medium text-emerald-400 border border-emerald-500/30">
                  {explorer.rarity}
                </span>
              </div>
            </div>
          </div>
          <CardContent className="p-4">
            <p className="text-zinc-300 text-sm mb-3">{explorer.description}</p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">Race:</span>
                <span className="text-emerald-400">{explorer.traits.race}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">Gear:</span>
                <span className="text-emerald-400">{explorer.traits.gear}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">Specialty:</span>
                <span className="text-emerald-400">{explorer.traits.specialty}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
