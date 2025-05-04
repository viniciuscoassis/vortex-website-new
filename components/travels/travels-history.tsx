import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock } from "lucide-react"

// Mock data for travel history
const mockHistory = [
  {
    id: 1,
    explorerName: "Cosmic Wanderer #42",
    destination: "Nebula Cluster",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    success: true,
    reward: 120,
  },
  {
    id: 2,
    explorerName: "Cosmic Wanderer #42",
    destination: "Black Hole Proximity",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    success: false,
    reward: 0,
  },
  {
    id: 3,
    explorerName: "Nebula Navigator #17",
    destination: "Stellar Nursery",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    success: true,
    reward: 75,
  },
  {
    id: 4,
    explorerName: "Void Voyager #93",
    destination: "Quantum Void",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 24 hours ago
    success: true,
    reward: 3500,
  },
]

export function TravelsHistory() {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white mb-4">Recent Travels</h3>

      {mockHistory.map((travel) => (
        <Card key={travel.id} className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-white font-medium">{travel.explorerName}</h4>
                <p className="text-zinc-400 text-sm">
                  Traveled to <span className="text-purple-400">{travel.destination}</span>
                </p>
              </div>
              <Badge
                className={
                  travel.success
                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                    : "bg-red-500/20 text-red-400 border-red-500/30"
                }
              >
                {travel.success ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                {travel.success ? "Success" : "Failed"}
              </Badge>
            </div>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-zinc-800">
              <div className="flex items-center text-zinc-500 text-xs">
                <Clock className="h-3 w-3 mr-1" />
                {formatTime(travel.timestamp)}
              </div>
              {travel.success && (
                <div className="text-purple-400 font-medium">
                  +{travel.reward} <span className="text-xs">$DUST</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {mockHistory.length === 0 && (
        <div className="text-center py-12">
          <p className="text-zinc-400">No travel history yet.</p>
        </div>
      )}
    </div>
  )
}
