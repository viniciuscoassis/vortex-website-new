"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TravelDestination } from "@/components/travels/travel-destination"
import { TravelResults } from "@/components/travels/travel-results"
import { Sparkles, Clock, AlertCircle } from "lucide-react"
import Image from "next/image"

// Mock data for the selected explorer
const mockExplorer = {
  id: 1,
  name: "Atlas Reed",
  image: "/explorers/1.jpeg",
  travelsRemaining: 3,
  isResting: false,
  restEndTime: null,
  level: 2,
  experience: 340,
  nextLevelExperience: 500,
}

// Mock data for the selected oracle (if any)
const mockOracle = {
  id: 1,
  name: "The Fall",
  image: "/oracles/32.png",
}

const destinations = [
  {
    id: 1,
    name: "Nebula Cluster",
    description: "A dense cluster of young stars and cosmic dust. Medium risk, medium reward.",
    image: "/colorful-nebula.png",
    minReward: 30,
    maxReward: 500,
    difficulty: "medium",
    duration: 2, // hours
  },
  {
    id: 2,
    name: "Black Hole Proximity",
    description: "The dangerous edge of a supermassive black hole. High risk, high reward.",
    image: "/black-hole-accretion-disk.png",
    minReward: 0,
    maxReward: 2000,
    difficulty: "hard",
    duration: 4, // hours
  },
  {
    id: 3,
    name: "Stellar Nursery",
    description: "A peaceful region where new stars are born. Low risk, low reward.",
    image: "/stellar-nursery-forming-stars.png",
    minReward: 40,
    maxReward: 200,
    difficulty: "easy",
    duration: 1, // hours
  },
  {
    id: 4,
    name: "Quantum Void",
    description: "A mysterious region where the laws of physics break down. Extreme risk, extreme reward.",
    image: "/quantum-void-strange-physics.png",
    minReward: 0,
    maxReward: 10000,
    difficulty: "extreme",
    duration: 8, // hours
  },
]

export function TravelsDashboard() {
  const [selectedDestination, setSelectedDestination] = useState<number | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [travelResult, setTravelResult] = useState<{
    success: boolean
    amount: number
    message: string
  } | null>(null)

  const handleStartTravel = () => {
    if (selectedDestination === null) return

    // Simulate travel result
    const destination = destinations.find((d) => d.id === selectedDestination)
    if (!destination) return

    // Random result between min and max reward, with possibility of 0 (failure)
    const isSuccess = Math.random() > 0.4 // 60% success rate
    const amount = isSuccess
      ? Math.floor(Math.random() * (destination.maxReward - destination.minReward + 1)) + destination.minReward
      : 0

    setTravelResult({
      success: isSuccess,
      amount,
      message: isSuccess
        ? `Your explorer discovered ${amount} $DUST in the ${destination.name}!`
        : `Your explorer found nothing in the ${destination.name}. Better luck next time!`,
    })

    setShowResults(true)
  }

  const handleCloseResults = () => {
    setShowResults(false)
    setSelectedDestination(null)
  }

  if (showResults && travelResult) {
    return <TravelResults result={travelResult} onClose={handleCloseResults} />
  }

  if (!mockExplorer) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-bold text-white mb-4">No Explorer Selected</h3>
        <p className="text-zinc-400 mb-6">Please select an explorer to begin your cosmic journey.</p>
        <Button variant="outline" className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
          Select Explorer
        </Button>
      </div>
    )
  }

  if (mockExplorer.isResting) {
    const now = new Date()
    const restEnd = mockExplorer.restEndTime ? new Date(mockExplorer.restEndTime) : null
    const timeRemaining = restEnd ? Math.max(0, restEnd.getTime() - now.getTime()) : 0
    const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60))
    const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))

    return (
      <div className="text-center py-12">
        <div className="h-24 w-24 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-6">
          <Clock className="h-12 w-12 text-purple-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">{mockExplorer.name} is Resting</h3>
        <p className="text-zinc-400 mb-6">Your explorer needs to rest after their journeys.</p>
        <div className="max-w-md mx-auto mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-zinc-400">Rest Progress</span>
            <span className="text-purple-400">
              {hoursRemaining}h {minutesRemaining}m remaining
            </span>
          </div>
          <Progress value={(8 - hoursRemaining - minutesRemaining / 60) * 12.5} className="h-2 bg-zinc-800" />
        </div>
        <Button disabled className="bg-zinc-800 text-zinc-500">
          Resting...
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Explorer Info */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3">
          <Card className="bg-black/40 backdrop-blur-md border-zinc-800 h-full">
            <CardContent className="p-6">
              <div className="aspect-square relative rounded-lg overflow-hidden border border-zinc-700 mb-4">
                <Image
                  src={mockExplorer.image || "/placeholder.svg"}
                  alt={mockExplorer.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{mockExplorer.name}</h3>
              <div className="flex justify-between items-center mb-4">
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                  Level {mockExplorer.level}
                </Badge>
                <span className="text-zinc-400 text-sm">{mockExplorer.travelsRemaining} / 5 Travels Remaining</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Experience</span>
                  <span className="text-purple-400">
                    {mockExplorer.experience} / {mockExplorer.nextLevelExperience}
                  </span>
                </div>
                <Progress
                  value={(mockExplorer.experience / mockExplorer.nextLevelExperience) * 100}
                  className="h-2 bg-zinc-800"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-full md:w-2/3">
          <Card className="bg-black/40 backdrop-blur-md border-zinc-800 h-full">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-4">Select Destination</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {destinations.map((destination) => (
                  <TravelDestination
                    key={destination.id}
                    destination={destination}
                    selected={selectedDestination === destination.id}
                    onSelect={() => setSelectedDestination(destination.id)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Oracle Boost Section */}
      <Card className="bg-black/40 backdrop-blur-md border-zinc-800">
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <Sparkles className="h-5 w-5 text-purple-400 mr-2" />
            <h3 className="text-lg font-bold text-white">Oracle Boost</h3>
          </div>

          {mockOracle ? (
            <div className="flex items-center">
              <div className="h-16 w-16 relative rounded-lg overflow-hidden border border-purple-500/30 mr-4">
                <Image
                  src={mockOracle.image || "/placeholder.svg"}
                  alt={mockOracle.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="text-white font-medium">{mockOracle.name}</h4>
                <p className="text-purple-400 text-sm">Guaranteed minimum reward: 50 $DUST</p>
              </div>
            </div>
          ) : (
            <div className="bg-zinc-900/50 rounded-lg p-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-zinc-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-zinc-300 text-sm">
                  Combine your explorer with an Oracle NFT to guarantee a minimum reward of 50 $DUST on every travel.
                  You'll never lose your investment!
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                >
                  Select Oracle
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" className="border-zinc-700 text-zinc-400 hover:bg-zinc-800">
          Change Explorer
        </Button>
        <div className="space-x-3">
          {mockExplorer.travelsRemaining === 0 ? (
            <Button className="bg-purple-500 hover:bg-purple-600 text-white">
              <Clock className="mr-2 h-4 w-4" />
              Send to Rest
            </Button>
          ) : (
            <Button
              className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
              disabled={selectedDestination === null}
              onClick={handleStartTravel}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Start Travel ({selectedDestination !== null ? "50" : "0"} $DUST)
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
