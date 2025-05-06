"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useOracleStore } from "@/lib/store/oracles"
import { Badge } from "@/components/ui/badge"
import { useOracles } from "@/hooks/use-oracles"
import { Skeleton } from "@/components/ui/skeleton"

// Number of oracles to show in the carousel
const CAROUSEL_SIZE = 6

export function OracleCarousel() {
  const { oracles, isLoading, error } = useOracles()
  const { selectedOracle, setSelectedOracle } = useOracleStore()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Calculate how many cards to show based on screen width
  const [cardsToShow, setCardsToShow] = useState(4)

  // Get random selection of oracles
  const randomOracles = useMemo(() => {
    if (!oracles.length) return []
    
    // Create a copy of the oracles array
    const shuffled = [...oracles]
    // Fisher-Yates shuffle algorithm
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    // Return first CAROUSEL_SIZE items
    return shuffled.slice(0, CAROUSEL_SIZE)
  }, [oracles])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCardsToShow(1)
      } else if (window.innerWidth < 1024) {
        setCardsToShow(2)
      } else if (window.innerWidth < 1280) {
        setCardsToShow(3)
      } else {
        setCardsToShow(4)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Auto-scroll functionality
  useEffect(() => {
    if (isHovering || !randomOracles.length) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1
        return nextIndex >= randomOracles.length - cardsToShow + 1 ? 0 : nextIndex
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [isHovering, cardsToShow, randomOracles.length])

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => {
      return prevIndex === 0 ? randomOracles.length - cardsToShow : prevIndex - 1
    })
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      return prevIndex >= randomOracles.length - cardsToShow ? 0 : prevIndex + 1
    })
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="bg-black/40 backdrop-blur-md border-zinc-800">
            <div className="aspect-square relative">
              <Skeleton className="h-full w-full" />
            </div>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-500/10 rounded-lg border border-red-500/20">
        <p className="text-red-400">{error}</p>
      </div>
    )
  }

  if (!randomOracles.length) {
    return null
  }

  return (
    <>
      <div className="relative" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
        {/* Navigation Buttons */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 border-zinc-700 text-white hover:bg-black/80 -ml-4 md:ml-0"
          onClick={handlePrev}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 border-zinc-700 text-white hover:bg-black/80 -mr-4 md:mr-0"
          onClick={handleNext}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        {/* Carousel Container */}
        <div className="overflow-hidden px-6 md:px-10">
          <div
            ref={carouselRef}
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * (100 / cardsToShow)}%)` }}
          >
            {randomOracles.map((oracle) => {
              const imageUrl = oracle.metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/')

              return (
                <div key={oracle.id} className="flex-shrink-0" style={{ width: `${100 / cardsToShow}%` }}>
                  <div className="p-2">
                    <Card 
                      className="bg-black/40 backdrop-blur-md border-zinc-800 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/10 h-full cursor-pointer"
                      onClick={() => setSelectedOracle(oracle)}
                    >
                      <div className="aspect-square relative">
                        <Image 
                          src={imageUrl} 
                          alt={oracle.metadata.name || `Oracle #${oracle.id}`} 
                          fill 
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = "/placeholder.png"
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-white">
                              {oracle.metadata.name || `Oracle #${oracle.id}`}
                            </h3>
                            <span className="px-2 py-1 bg-black/60 rounded-full text-xs font-medium text-emerald-400 border border-emerald-500/30">
                              {oracle.owner.slice(0, 6)}...{oracle.owner.slice(-4)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <p className="text-zinc-300 text-xs line-clamp-2">{oracle.metadata.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: randomOracles.length - cardsToShow + 1 }).map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                currentIndex === index ? "bg-emerald-400 w-4" : "bg-zinc-600",
              )}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>

      {/* Large Display Modal */}
      {selectedOracle && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 bg-black/60 hover:bg-black/80"
              onClick={() => setSelectedOracle(null)}
            >
              <X className="h-6 w-6" />
            </Button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              <div className="relative aspect-square rounded-lg overflow-hidden">
                <Image
                  src={selectedOracle.metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/')}
                  alt={selectedOracle.metadata.name || `Oracle #${selectedOracle.id}`}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.png"
                  }}
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {selectedOracle.metadata.name || `Oracle #${selectedOracle.id}`}
                  </h2>
                  <p className="text-zinc-300">{selectedOracle.metadata.description}</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-emerald-400">Owner</h3>
                  <Badge variant="outline" className="text-emerald-400 border-emerald-400">
                    {selectedOracle.owner}
                  </Badge>
                </div>

                {selectedOracle.metadata.attributes && selectedOracle.metadata.attributes.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-emerald-400">Attributes</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedOracle.metadata.attributes.map((attr, index) => (
                        <div key={index} className="bg-zinc-800/50 rounded-lg p-2">
                          <p className="text-xs text-zinc-400">{attr.trait_type}</p>
                          <p className="text-sm text-white">{attr.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
