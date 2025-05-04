"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TravelsDashboard } from "@/components/travels/travels-dashboard"
import { TravelsExplorer } from "@/components/travels/travels-explorer"
import { TravelsHistory } from "@/components/travels/travels-history"
import { TravelsInfo } from "@/components/travels/travels-info"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

export function TravelsInterface() {
  const [selectedTab, setSelectedTab] = useState("dashboard")

  return (
    <div className="space-y-8 animate-pulse-slow">
      {/* Info Cards */}
      <TravelsInfo />

      {/* Main Interface */}
      <Card className="bg-black/40 backdrop-blur-md border-zinc-800">
        <CardContent className="p-6">
          <Tabs defaultValue="dashboard" value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList className="bg-zinc-900 border border-zinc-800">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="explorer">Select Explorer</TabsTrigger>
              <TabsTrigger value="history">Travel History</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard" className="space-y-4">
              <TravelsDashboard />
            </TabsContent>
            <TabsContent value="explorer" className="space-y-4">
              <TravelsExplorer onSelectExplorer={() => setSelectedTab("dashboard")} />
            </TabsContent>
            <TabsContent value="history" className="space-y-4">
              <TravelsHistory />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Testnet Notice */}
      {process.env.NEXT_PUBLIC_NETWORK === "testnet" && (
        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 flex items-start">
          <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-yellow-500">Testnet Mode</h3>
            <p className="text-zinc-300 text-sm">
              You are currently in testnet mode. Travels in testnet use test $DUST tokens and do not affect mainnet
              balances.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
