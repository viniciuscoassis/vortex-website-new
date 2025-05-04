"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, ExternalLink } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function TokenomicsSection() {
  const [copied, setCopied] = useState(false)
  const contractAddress = "0xf316A1cB7376021ad52705c1403DF86C7A7A18d0"

  const copyToClipboard = () => {
    navigator.clipboard.writeText(contractAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="bg-black/40 backdrop-blur-md border-zinc-800">
        <CardHeader>
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center mr-3">
              <span className="text-emerald-400 font-bold">V</span>
            </div>
            <CardTitle className="text-2xl text-emerald-400">$VORTEX</CardTitle>
          </div>
          <CardDescription>The primary utility token of the Vortex ecosystem</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Launch Type</span>
              <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
                Fair Launch
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Total Supply</span>
              <span className="text-white font-bold">10,000,000</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Liquidity</span>
              <span className="text-white">Equalizer / Shadow (Soon)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Sell Tax</span>
              <span className="text-white">5% to Oracle Holders</span>
            </div>
          </div>

          <div className="pt-2">
            <p className="text-sm text-zinc-400 mb-2">Contract Address</p>
            <div className="flex items-center bg-zinc-900/50 rounded-md p-2 border border-zinc-800">
              <code className="text-xs text-zinc-300 flex-1 overflow-hidden text-ellipsis">{contractAddress}</code>
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 text-zinc-400 hover:text-emerald-400"
                onClick={copyToClipboard}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button
            className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white"
            asChild
          >
            <Link
              href="https://equalizer.exchange/swap?fromToken=0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE&toToken=0xf316A1cB7376021ad52705c1403DF86C7A7A18d0"
              target="_blank"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Buy on Equalizer
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-8">
        <Card className="bg-black/40 backdrop-blur-md border-zinc-800">
          <CardHeader>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                <span className="text-purple-400 font-bold">D</span>
              </div>
              <CardTitle className="text-2xl text-purple-400">$DUST</CardTitle>
            </div>
            <CardDescription>Coming soon to the Vortex ecosystem</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
              <h4 className="text-lg font-medium text-purple-400 mb-2">Cosmic Spoiler Alert</h4>
              <p className="text-zinc-300 text-sm">
                A new token is forming in the cosmic dust. $DUST will power the next phase of the Vortex ecosystem,
                enabling advanced features and deeper integration with the upcoming Galaxy Explorers NFTs.
              </p>
              <div className="mt-4 flex items-center">
                <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                  Coming Soon
                </Badge>
                <span className="text-zinc-500 text-xs ml-2">Stay tuned for the announcement</span>
              </div>
            </div>
          </CardContent>
        </Card>
{/* 
        <Card className="bg-black/40 backdrop-blur-md border-zinc-800">
          <CardHeader>
            <CardTitle className="text-xl text-emerald-400">Distribution & Utility</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="distribution">
              <TabsList className="bg-zinc-900 border border-zinc-800">
                <TabsTrigger value="distribution">Distribution</TabsTrigger>
                <TabsTrigger value="utility">Utility</TabsTrigger>
              </TabsList>
              <TabsContent value="distribution" className="pt-4">
                <div className="space-y-4">
                  <div className="bg-zinc-900/50 rounded-lg p-3">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-zinc-400">Liquidity</span>
                      <span className="text-sm text-emerald-400">20%</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2 rounded-full">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-2 rounded-full"
                        style={{ width: "70%" }}
                      ></div>
                    </div>
                  </div>
                  <div className="bg-zinc-900/50 rounded-lg p-3">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-zinc-400">Team</span>
                      <span className="text-sm text-emerald-400">10%</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2 rounded-full">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-2 rounded-full"
                        style={{ width: "10%" }}
                      ></div>
                    </div>
                  </div>
                  <div className="bg-zinc-900/50 rounded-lg p-3">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-zinc-400">Marketing</span>
                      <span className="text-sm text-emerald-400">10%</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2 rounded-full">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-2 rounded-full"
                        style={{ width: "10%" }}
                      ></div>
                    </div>
                  </div>
                  <div className="bg-zinc-900/50 rounded-lg p-3">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-zinc-400">Development</span>
                      <span className="text-sm text-emerald-400">10%</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2 rounded-full">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-2 rounded-full"
                        style={{ width: "10%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="utility" className="pt-4">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-emerald-400 text-sm">✓</span>
                    </div>
                    <span className="text-zinc-300">Governance voting rights</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-emerald-400 text-sm">✓</span>
                    </div>
                    <span className="text-zinc-300">Staking rewards and bonuses</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-emerald-400 text-sm">✓</span>
                    </div>
                    <span className="text-zinc-300">Access to premium features</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-emerald-400 text-sm">✓</span>
                    </div>
                    <span className="text-zinc-300">NFT minting currency</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-emerald-400 text-sm">✓</span>
                    </div>
                    <span className="text-zinc-300">Journey rewards in upcoming GameFi</span>
                  </li>
                </ul>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card> */}
      </div>
    </div>
  )
}
