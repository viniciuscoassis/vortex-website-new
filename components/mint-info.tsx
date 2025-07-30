"use client"

import { useState, useEffect, useImperativeHandle, forwardRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getClientForNetwork } from "@/lib/public-clients"
import { explorersABI } from "@/data/abi/explorers"
import { formatEther } from "viem"

export interface MintInfoRef {
  refetch: () => Promise<void>
}

export const MintInfo = forwardRef<MintInfoRef>((props, ref) => {
  const [totalMinted, setTotalMinted] = useState<number>(0)
  const [maxSupply, setMaxSupply] = useState<number>(2222)
  const [mintPrice, setMintPrice] = useState<string>("0")
  const [loading, setLoading] = useState(false)

  // Check if minting is enabled via environment variable
  const isMintingEnabled = process.env.NEXT_PUBLIC_MINTING_ENABLED === 'true'

  const fetchMintData = async () => {
    setLoading(true)
    try {
      const network = process.env.NEXT_PUBLIC_NETWORK === 'testnet' ? 'testnet' : 'mainnet'
      const client = getClientForNetwork(network)
      
      const explorerAddresses = {
        testnet: process.env.NEXT_PUBLIC_TESTNET_EXPLORERS_CONTRACT_ADDRESS as `0x${string}`,
        mainnet: process.env.NEXT_PUBLIC_MAINNET_EXPLORERS_CONTRACT_ADDRESS as `0x${string}`
      }

      const contractAddress = explorerAddresses[network]
      
      if (!contractAddress) {
        console.error('Explorers contract address not configured')
        return
      }

      // Fetch total minted
      const totalMintedResult = await client.readContract({
        address: contractAddress,
        abi: explorersABI,
        functionName: 'totalMinted'
      }) as bigint

      // Fetch max supply
      const maxSupplyResult = await client.readContract({
        address: contractAddress,
        abi: explorersABI,
        functionName: 'MAX_SUPPLY'
      }) as bigint

      // Fetch mint price
      const mintPriceResult = await client.readContract({
        address: contractAddress,
        abi: explorersABI,
        functionName: 'MINT_PRICE'
      }) as bigint

      setTotalMinted(Number(totalMintedResult))
      setMaxSupply(Number(maxSupplyResult))
      setMintPrice(formatEther(mintPriceResult))

      console.log('Mint data fetched:', {
        totalMinted: Number(totalMintedResult),
        maxSupply: Number(maxSupplyResult),
        mintPrice: formatEther(mintPriceResult)
      })
    } catch (error) {
      console.error('Failed to fetch mint data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Expose refetch function to parent components
  useImperativeHandle(ref, () => ({
    refetch: fetchMintData
  }), [])

  // Fetch data on component mount
  useEffect(() => {
    fetchMintData()
  }, [])

  // Calculate progress percentage
  const progressPercentage = maxSupply > 0 ? (totalMinted / maxSupply) * 100 : 0

  return (
    <div className="space-y-4">
      {/* Minting Status Banner */}
      <Card className={`backdrop-blur-md border ${isMintingEnabled ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
        <CardContent className="p-4 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <span className={`text-2xl ${isMintingEnabled ? 'text-emerald-400' : 'text-yellow-400'}`}>
              {isMintingEnabled ? '✅' : '⚠️'}
            </span>
            <div className="text-center">
              <h3 className={`font-semibold ${isMintingEnabled ? 'text-emerald-400' : 'text-yellow-400'}`}>
                {isMintingEnabled ? 'Minting is Live!' : 'Minting Coming Soon'}
              </h3>
              <p className="text-sm text-zinc-300">
                {isMintingEnabled 
                  ? 'Galaxy Explorers are now available for minting' 
                  : 'Stay tuned for the launch of Galaxy Explorers'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mint Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-black/40 backdrop-blur-md border-zinc-800">
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <h3 className="text-lg font-medium text-zinc-400">Mint Price</h3>
            <p className="text-3xl font-bold text-emerald-400">
              {loading ? "..." : `${mintPrice} $S`}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-md border-zinc-800">
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <h3 className="text-lg font-medium text-zinc-400">Total Supply</h3>
            <p className="text-3xl font-bold text-emerald-400">
              {loading ? "..." : maxSupply.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 backdrop-blur-md border-zinc-800">
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <h3 className="text-lg font-medium text-zinc-400">Minted</h3>
            <p className="text-3xl font-bold text-emerald-400">
              {loading ? "..." : totalMinted.toLocaleString()}
            </p>
            <div className="w-full bg-zinc-800 h-2 rounded-full mt-2">
              <div
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            {/* <p className="text-xs text-zinc-400 mt-1">
              {progressPercentage.toFixed(1)}% Complete
            </p> */}
          </CardContent>
        </Card>
      </div>
    </div>
  )
})

MintInfo.displayName = 'MintInfo'
