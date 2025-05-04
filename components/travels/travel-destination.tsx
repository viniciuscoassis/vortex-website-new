"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface TravelDestinationProps {
  destination: {
    id: number
    name: string
    description: string
    image: string
    minReward: number
    maxReward: number
    difficulty: string
    duration: number
  }
  selected: boolean
  onSelect: () => void
}

export function TravelDestination({ destination, selected, onSelect }: TravelDestinationProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "hard":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      case "extreme":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-zinc-500/20 text-zinc-400 border-zinc-500/30"
    }
  }

  return (
    <Card
      className={cn(
        "bg-zinc-900/50 border-zinc-800 cursor-pointer transition-all duration-300 hover:border-purple-500/30",
        selected && "border-purple-500 ring-1 ring-purple-500/50",
      )}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex gap-3">
          <div className="h-16 w-16 relative rounded-lg overflow-hidden border border-zinc-700 flex-shrink-0">
            <Image src={destination.image || "/placeholder.svg"} alt={destination.name} fill className="object-cover" />
          </div>
          <div className="flex-1">
            <h4 className="text-white font-medium">{destination.name}</h4>
            <div className="flex flex-wrap gap-2 mt-1 mb-2">
              <Badge className={getDifficultyColor(destination.difficulty)}>
                {destination.difficulty.charAt(0).toUpperCase() + destination.difficulty.slice(1)}
              </Badge>
              <Badge variant="outline" className="border-zinc-700 text-zinc-400">
                <Clock className="h-3 w-3 mr-1" />
                {destination.duration}h
              </Badge>
            </div>
            <p className="text-zinc-400 text-xs line-clamp-2">{destination.description}</p>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-zinc-800 flex justify-between text-xs">
          <span className="text-zinc-400">Potential Reward</span>
          <span className="text-purple-400 font-medium">
            {destination.minReward === 0 ? "0" : destination.minReward} - {destination.maxReward} $DUST
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
