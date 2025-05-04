"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useOracles } from "@/hooks/use-oracles"

export function OraclesGrid() {
  const { oracles, isLoading, error } = useOracles()

  if (error) {
    return (
      <div className="text-center p-8 bg-red-500/10 rounded-lg border border-red-500/20">
        <p className="text-red-400">{error}</p>
      </div>
    )
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {oracles.map((oracle) => {
        const imageUrl = oracle.metadata.image
          ? oracle.metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/')
          : "/placeholder.png"

        return (
          <Card
            key={oracle.id}
            className="bg-black/40 backdrop-blur-md border-zinc-800 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/10"
          >
            <div className="aspect-square relative">
              <Image 
                src={imageUrl}
                alt={oracle.metadata.name || `Oracle #${oracle.id}`} 
                fill 
                className="object-cover" 
                onError={(e) => {
                  // If image fails to load, replace with placeholder
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.png"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-white">
                    {oracle.metadata.name || `Oracle #${oracle.id}`}
                  </h3>
                  <span className="px-2 py-1 bg-black/60 rounded-full text-xs font-medium text-emerald-400 border border-emerald-500/30">
                    {oracle.owner.slice(0, 6)}...{oracle.owner.slice(-4)}
                  </span>
                </div>
              </div>
            </div>
            <CardContent className="p-4">
              <p className="text-zinc-300 text-sm mb-2">{oracle.metadata.description}</p>
              {oracle.metadata.attributes && oracle.metadata.attributes.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {oracle.metadata.attributes.map((attr, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-zinc-800/50 rounded-full text-xs text-zinc-300"
                    >
                      {attr.trait_type}: {attr.value}
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
