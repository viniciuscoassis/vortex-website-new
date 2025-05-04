import { Card, CardContent } from "@/components/ui/card"
import { Rocket, Clock, Award } from "lucide-react"

export function TravelsInfo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-black/40 backdrop-blur-md border-zinc-800">
        <CardContent className="p-6 flex items-center">
          <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center mr-4">
            <Rocket className="h-6 w-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">Travel Cost</h3>
            <p className="text-purple-400 font-bold text-xl">50 $DUST</p>
            <p className="text-zinc-400 text-sm">Per journey</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black/40 backdrop-blur-md border-zinc-800">
        <CardContent className="p-6 flex items-center">
          <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center mr-4">
            <Award className="h-6 w-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">Potential Rewards</h3>
            <p className="text-purple-400 font-bold text-xl">20 - 10,000 $DUST</p>
            <p className="text-zinc-400 text-sm">Per successful journey</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black/40 backdrop-blur-md border-zinc-800">
        <CardContent className="p-6 flex items-center">
          <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center mr-4">
            <Clock className="h-6 w-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">Travel Limit</h3>
            <p className="text-purple-400 font-bold text-xl">5 Travels</p>
            <p className="text-zinc-400 text-sm">8-hour rest period after</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
