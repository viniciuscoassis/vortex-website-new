import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface NFTCardProps {
  name: string
  traits: {
    [key: string]: string
  }
  image: string
}

export function NFTCard({ name, traits, image }: NFTCardProps) {
  const isUnrevealed = name === "Unrevealed Explorer"
  const isVideo = image.toLowerCase().endsWith('.mp4') || image.toLowerCase().includes('.mp4')

  // Use local unrevealed.mp4 for unrevealed explorers
  const displayImage = isUnrevealed ? "/unrevealed.mp4" : image

  return (
    <Card className="bg-black/40 backdrop-blur-md border-zinc-800 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/10">
      <div className="aspect-square relative">
        {isUnrevealed ? (
          <video
            src={displayImage}
            autoPlay
            loop
            muted
            playsInline
            controls={false}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error('Video failed to load:', displayImage, e)
            }}
          />
        ) : (
          <Image 
            src={image || "/placeholder.svg"} 
            alt={name} 
            fill 
            className="object-cover" 
          />
        )}
        
        {/* Overlay for unrevealed explorers */}
        {isUnrevealed && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-bold text-white mb-2">{name}</h3>
        <div className="space-y-1">
          {Object.entries(traits).map(([key, value]) => (
            <div key={key} className="flex justify-between text-xs">
              <span className="text-zinc-400">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
              {key === "rarity" ? (
                <Badge variant="outline" className="text-xs py-0 h-4 text-emerald-400 border-emerald-400">
                  {value}
                </Badge>
              ) : (
                <span className="text-emerald-400">{value}</span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
