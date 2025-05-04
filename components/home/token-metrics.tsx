"use client"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowUp, ArrowDown, Users, Coins, BarChart3, Wallet } from "lucide-react"
import { useEffect, useState } from "react"

interface DexScreenerPair {
  chainId: string
  dexId: string
  url: string
  pairAddress: string
  baseToken: {
    address: string
    name: string
    symbol: string
  }
  quoteToken: {
    address: string
    name: string
    symbol: string
  }
  priceNative: string
  priceUsd: string
  txns: {
    h24: {
      buys: number
      sells: number
    }
  }
  volume: {
    h24: number
  }
  priceChange: {
    h24: number
  }
  liquidity: {
    usd: number
  }
  fdv: number
  marketCap: number
}

export function TokenMetrics() {
  const [metrics, setMetrics] = useState({
    price: 0,
    priceChange: 0,
    marketCap: 0,
    liquidity: 0,
    holders: 0,
    transactions: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch(
          "https://api.dexscreener.com/tokens/v1/sonic/0xf316A1cB7376021ad52705c1403DF86C7A7A18d0"
        )
        const data = await response.json()
        
        if (!data || data.length === 0) {
          throw new Error("No trading pairs found")
        }

        // Get the pair with the highest liquidity
        const mainPair = data.reduce((prev: DexScreenerPair, current: DexScreenerPair) => {
          return (prev.liquidity?.usd || 0) > (current.liquidity?.usd || 0) ? prev : current
        })

        setMetrics({
          price: parseFloat(mainPair.priceUsd),
          priceChange: mainPair.priceChange?.h24 || 0,
          marketCap: mainPair.marketCap || parseFloat(mainPair.priceUsd) * 10000000, // Use provided marketCap or calculate
          liquidity: mainPair.liquidity?.usd || 0,
          holders: 0, // DexScreener doesn't provide holder count
          transactions: (mainPair.txns?.h24?.buys || 0) + (mainPair.txns?.h24?.sells || 0),
        })
      } catch (err) {
        console.error("Error fetching token metrics:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch token metrics")
      } finally {
        setIsLoading(false)
      }
    }

    fetchMetrics()
    // Refresh every 30 seconds
    const interval = setInterval(fetchMetrics, 30000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="bg-black/40 backdrop-blur-md border-zinc-800">
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <div className="animate-pulse h-12 w-12 rounded-full bg-zinc-800 mb-3" />
                <div className="animate-pulse h-4 w-24 bg-zinc-800 rounded mb-2" />
                <div className="animate-pulse h-8 w-32 bg-zinc-800 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="bg-black/40 backdrop-blur-md border-zinc-800">
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <p className="text-red-500">Error: {error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-black/40 backdrop-blur-md border-zinc-800">
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-emerald-500/20 mb-3">
              <Coins className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-medium text-zinc-400">Current Price</h3>
            <p className="text-3xl font-bold text-emerald-400">${metrics.price.toFixed(6)}</p>
            <div className="flex items-center mt-1">
              {metrics.priceChange >= 0 ? (
                <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={metrics.priceChange >= 0 ? "text-green-500" : "text-red-500"}>
                {Math.abs(metrics.priceChange).toFixed(2)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-md border-zinc-800">
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-emerald-500/20 mb-3">
              <BarChart3 className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-medium text-zinc-400">Market Cap</h3>
            <p className="text-3xl font-bold text-emerald-400">${metrics.marketCap.toLocaleString()}</p>
            <p className="text-sm text-zinc-500 mt-1">Fully Diluted</p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-md border-zinc-800">
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-emerald-500/20 mb-3">
              <Wallet className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-medium text-zinc-400">Liquidity</h3>
            <p className="text-3xl font-bold text-emerald-400">${metrics.liquidity.toLocaleString()}</p>
            <p className="text-sm text-zinc-500 mt-1">Equalizer Pool</p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-md border-zinc-800">
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-emerald-500/20 mb-3">
              <Users className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-medium text-zinc-400">24h Transactions</h3>
            <p className="text-3xl font-bold text-emerald-400">{metrics.transactions}</p>
            <p className="text-sm text-zinc-500 mt-1">Buy + Sell</p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-md border-zinc-800 sm:col-span-2 lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-emerald-500/20 mr-4">
                <BarChart3 className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">Price Chart</h3>
                <p className="text-sm text-zinc-400">
                  View detailed chart on{" "}
                  <a
                    href="https://dexscreener.com/sonic/0xf316A1cB7376021ad52705c1403DF86C7A7A18d0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:underline"
                  >
                    DexScreener
                  </a>
                </p>
              </div>
            </div>
            <div className="h-[120px] bg-zinc-900/50 rounded-lg flex items-center justify-center">
              <p className="text-zinc-500">Chart preview coming soon</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
