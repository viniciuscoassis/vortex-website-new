import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, TrendingUp } from "lucide-react"
import { TraitPercentages, TraitStats } from "@/hooks/use-minted-explorers"
import { cn } from "@/lib/utils"

interface TraitPercentageDisplayProps {
  traitPercentages: TraitPercentages | null
  loading: boolean
}

export function TraitPercentageDisplay({ traitPercentages, loading }: TraitPercentageDisplayProps) {
  if (loading) {
    return (
      <Card className="bg-black/40 backdrop-blur-md border-zinc-800">
        <CardHeader>
          <CardTitle className="text-emerald-400">Trait Rarity Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-zinc-400">Loading trait statistics...</div>
        </CardContent>
      </Card>
    )
  }

  if (!traitPercentages) {
    return (
      <Card className="bg-black/40 backdrop-blur-md border-zinc-800">
        <CardHeader>
          <CardTitle className="text-emerald-400">Trait Rarity Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-zinc-400">No data available</div>
        </CardContent>
      </Card>
    )
  }

  const getRarityColor = (percentage: number) => {
    if (percentage >= 10) return 'text-gray-400'
    if (percentage >= 5) return 'text-blue-400'
    if (percentage >= 2) return 'text-purple-400'
    if (percentage >= 1) return 'text-orange-400'
    return 'text-red-400'
  }

  const getRarityLabel = (percentage: number) => {
    if (percentage >= 10) return 'Common'
    if (percentage >= 5) return 'Rare'
    if (percentage >= 2) return 'Epic'
    if (percentage >= 1) return 'Legendary'
    return 'Mythic'
  }

  const renderTraitList = (traits: TraitStats[], title: string) => {
    return (
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-zinc-300 mb-3">{title}</h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {traits.map((trait, index) => (
            <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/50 border border-zinc-700">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-zinc-300 truncate">
                    {trait.trait.split(" – ")[0]}
                  </span>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-xs px-2 py-0.5 border-zinc-600",
                      getRarityColor(trait.percentage)
                    )}
                  >
                    <Star className="h-3 w-3 mr-1" />
                    {getRarityLabel(trait.percentage)}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2 text-right">
                <span className="text-sm text-zinc-400">
                  {trait.count} minted
                </span>
                <span className={cn(
                  "text-sm font-medium",
                  getRarityColor(trait.percentage)
                )}>
                  {trait.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Card className="bg-black/40 backdrop-blur-md border-zinc-800">
      <CardHeader>
        <CardTitle className="text-emerald-400 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Trait Rarity Analysis
          <Badge variant="outline" className="ml-2 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            {traitPercentages.totalMinted} Total Minted
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="species" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-zinc-900 border border-zinc-800">
            <TabsTrigger value="species">Species</TabsTrigger>
            <TabsTrigger value="hats">Hats</TabsTrigger>
            <TabsTrigger value="weapons">Weapons</TabsTrigger>
            <TabsTrigger value="backgrounds">Backgrounds</TabsTrigger>
            <TabsTrigger value="outfits">Outfits</TabsTrigger>
          </TabsList>
          
          <TabsContent value="species" className="mt-4">
            {renderTraitList(traitPercentages.species, "Species Distribution")}
          </TabsContent>
          
          <TabsContent value="hats" className="mt-4">
            {renderTraitList(traitPercentages.hats, "Hat Distribution")}
          </TabsContent>
          
          <TabsContent value="weapons" className="mt-4">
            {renderTraitList(traitPercentages.weapons, "Weapon Distribution")}
          </TabsContent>
          
          <TabsContent value="backgrounds" className="mt-4">
            {renderTraitList(traitPercentages.backgrounds, "Background Distribution")}
          </TabsContent>
          
          <TabsContent value="outfits" className="mt-4">
            {renderTraitList(traitPercentages.outfits, "Outfit Distribution")}
          </TabsContent>
        </Tabs>
        
        <div className="mt-4 p-3 rounded-lg border border-zinc-700 bg-zinc-900/50">
          <div className="text-sm text-zinc-300 mb-2">Rarity Guide:</div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs px-2 py-0.5 text-gray-400 border-gray-600">
              <Star className="h-3 w-3 mr-1" />
              Common (≥10%)
            </Badge>
            <Badge variant="outline" className="text-xs px-2 py-0.5 text-blue-400 border-blue-600">
              <Star className="h-3 w-3 mr-1" />
              Rare (≥5%)
            </Badge>
            <Badge variant="outline" className="text-xs px-2 py-0.5 text-purple-400 border-purple-600">
              <Star className="h-3 w-3 mr-1" />
              Epic (≥2%)
            </Badge>
            <Badge variant="outline" className="text-xs px-2 py-0.5 text-orange-400 border-orange-600">
              <Star className="h-3 w-3 mr-1" />
              Legendary (≥1%)
            </Badge>
            <Badge variant="outline" className="text-xs px-2 py-0.5 text-red-400 border-red-600">
              <Star className="h-3 w-3 mr-1" />
              Mythic (1%)
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 