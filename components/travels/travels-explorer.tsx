"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Clock } from "lucide-react"
import Image from "next/image"

interface TravelsExplorerProps {
  onSelectExplorer: () => void
}

// Mock data for explorers
const mockExplorers = [
  {
    id: 1,
    name: "Cosmic Wanderer #42",
    image: "/explorers/explorer-1.png",
    travelsRemaining: 3,
    isResting: false,
    restEndTime: null,
    level: 2,
  },
  {
    id: 2,
    name: "Nebula Navigator #17",
    image: "/placeholder.svg?height=300&width=300&query=space explorer with blue suit",
    travelsRemaining: 0,
    isResting: true,
    restEndTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), // 3 hours from now
    level: 3,
  },
  {
    id: 3,
    name: "Void Voyager #93",
    image: "/placeholder.svg?height=300&width=300&query=dark space explorer with mask",
    travelsRemaining: 5,
    isResting: false,
    restEndTime: null,
    level: 1,
  },
]

export function TravelsExplorer({ onSelectExplorer }: TravelsExplorerProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredExplorers = mockExplorers.filter((explorer) =>
    explorer.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <Input
          placeholder="Search explorers..."
          className="pl-10 bg-zinc-900/60 border-zinc-700 text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExplorers.map((explorer) => (
          <Card
            key={explorer.id}
            className="bg-zinc-900/50 border-zinc-800 cursor-pointer transition-all duration-300 hover:border-purple-500/30"
          >
            <CardContent className="p-4">
              <div className="aspect-square relative rounded-lg overflow-hidden border border-zinc-700 mb-3">
                <Image src={explorer.image || "/placeholder.svg"} alt={explorer.name} fill className="object-cover" />
                {explorer.isResting && (
                  <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                    <Clock className="h-8 w-8 text-purple-400 mb-2" />
                    <span className="text-white font-medium">Resting</span>
                    <span className="text-zinc-400 text-sm">
                      {new Date(explorer.restEndTime!).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      remaining
                    </span>
                  </div>
                )}
              </div>
              <h4 className="text-white font-medium">{explorer.name}</h4>
              <div className="flex justify-between items-center mt-2">
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Level {explorer.level}</Badge>
                <span className="text-zinc-400 text-sm">{explorer.travelsRemaining} / 5 Travels</span>
              </div>
              <Button
                className="w-full mt-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
                disabled={explorer.isResting}
                onClick={onSelectExplorer}
              >
                {explorer.isResting ? "Resting" : "Select Explorer"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredExplorers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-zinc-400">No explorers found matching your search.</p>
        </div>
      )}
    </div>
  )
}
