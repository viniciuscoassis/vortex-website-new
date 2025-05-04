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
  return (
    <Card className="bg-black/40 backdrop-blur-md border-zinc-800 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/10">
      <div className="aspect-square relative">
        <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
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
