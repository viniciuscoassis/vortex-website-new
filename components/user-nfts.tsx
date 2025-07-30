"use client"

import { useEffect, useState } from "react"
import { useWallet } from "@/lib/wallet-context"
import { getClientForNetwork } from "@/lib/public-clients"
import { explorersABI } from "@/data/abi/explorers"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { NFTCard } from "@/components/nft-card"
import { WalletIcon, Loader2, AlertCircle } from "lucide-react"

interface ExplorerNFT {
  tokenId: string
  name: string
  image: string
  traits: {
    [key: string]: string
  }
}

// Function to convert IPFS URLs to HTTP URLs
const convertIpfsToHttp = (url: string): string => {
  if (url.startsWith('ipfs://')) {
    // Remove 'ipfs://' prefix and use IPFS gateway
    const ipfsHash = url.replace('ipfs://', '')
    return `https://ipfs.io/ipfs/${ipfsHash}`
  }
  return url
}

export function UserNFTs() {
  const { isConnected, connect, address, walletChainId, isNetworkMismatch } = useWallet()
  const [nfts, setNfts] = useState<ExplorerNFT[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUserNFTs = async () => {
    if (!address) return

    setLoading(true)
    setError(null)

    try {
      const network = process.env.NEXT_PUBLIC_NETWORK === 'testnet' ? 'testnet' : 'mainnet'
      const client = getClientForNetwork(network)
      
      const explorerAdresses = {
        testnet: process.env.NEXT_PUBLIC_TESTNET_EXPLORERS_CONTRACT_ADDRESS as `0x${string}`,
        mainnet: process.env.NEXT_PUBLIC_MAINNET_EXPLORERS_CONTRACT_ADDRESS as `0x${string}`
      }

      const contractAddress = explorerAdresses[network]
      console.log('contractAddress', contractAddress)
      if (!contractAddress) {
        throw new Error('Explorers contract address not configured. Please check your environment variables.')
      }

      // Get all token IDs owned by the user
      const tokenIds = await client.readContract({
        address: contractAddress,
        abi: explorersABI,
        functionName: 'getTokensByOwner',
        args: [address]
      }) as bigint[]

      if (tokenIds.length === 0) {
        setNfts([])
        return
      }

      // Fetch metadata for each token
      const nftPromises = tokenIds.map(async (tokenId) => {
        try {
          const tokenURI = await client.readContract({
            address: contractAddress,
            abi: explorersABI,
            functionName: 'tokenURI',
            args: [tokenId]
          }) as string

          console.log(`Token ${tokenId} URI:`, tokenURI)

          // Convert IPFS URI to HTTP if needed
          const httpURI = convertIpfsToHttp(tokenURI)
          console.log(`Token ${tokenId} HTTP URI:`, httpURI)

          // Fetch metadata from IPFS or HTTP
          const response = await fetch(httpURI)
          if (!response.ok) {
            throw new Error(`Failed to fetch metadata: ${response.status} ${response.statusText}`)
          }
          
          const metadata = await response.json()
          console.log(`Token ${tokenId} metadata:`, metadata)

          // Convert image URL to HTTP if it's IPFS
          const imageUrl = metadata.image ? convertIpfsToHttp(metadata.image) : '/placeholder.png'

          return {
            tokenId: tokenId.toString(),
            name: metadata.name || `Explorer #${tokenId}`,
            image: imageUrl,
            traits: metadata.attributes || {}
          }
        } catch (err) {
          console.error(`Failed to fetch metadata for token ${tokenId}:`, err)
          return {
            tokenId: tokenId.toString(),
            name: `Explorer #${tokenId}`,
            image: '/placeholder.png',
            traits: {}
          }
        }
      })

      const nftResults = await Promise.all(nftPromises)
      setNfts(nftResults)
    } catch (err) {
      console.error('Failed to fetch user NFTs:', err)
      setError(err instanceof Error ? err.message : 'Failed to load your NFTs. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Refetch NFTs when wallet connection, address, or network changes
  useEffect(() => {
    if (isConnected && address && !isNetworkMismatch) {
      fetchUserNFTs()
    } else {
      // Clear NFTs when disconnected or network mismatch
      setNfts([])
      setError(null)
    }
  }, [isConnected, address, walletChainId, isNetworkMismatch])

  if (!isConnected) {
    return (
      <Card className="bg-black/40 backdrop-blur-md border-zinc-800">
        <CardContent className="p-12 flex flex-col items-center justify-center text-center">
          <WalletIcon className="h-16 w-16 text-zinc-600 mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h3>
          <p className="text-zinc-400 mb-6">Connect your wallet to view your Explorers NFTs</p>
          <Button
            onClick={connect}
            className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
          >
            Connect Wallet
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (isNetworkMismatch) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6 text-emerald-400">Your Cosmic Collection</h2>
        <div className="grid place-items-center py-12">
          <Card className="bg-black/40 backdrop-blur-md border-zinc-800 max-w-md">
            <CardContent className="p-12 flex flex-col items-center justify-center text-center">
              <AlertCircle className="h-16 w-16 text-yellow-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Wrong Network</h3>
              <p className="text-zinc-400 mb-6">
                Please switch to the correct network to view your Explorers NFTs.
              </p>
              <p className="text-sm text-zinc-500">
                Current Network: {walletChainId} | Expected: {process.env.NEXT_PUBLIC_NETWORK === 'testnet' ? '57054 (Testnet)' : '146 (Mainnet)'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6 text-emerald-400">Your Cosmic Collection</h2>
        <div className="grid place-items-center py-12">
          <Card className="bg-black/40 backdrop-blur-md border-zinc-800 max-w-md">
            <CardContent className="p-12 flex flex-col items-center justify-center text-center">
              <Loader2 className="h-16 w-16 text-emerald-400 animate-spin mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Loading Your NFTs</h3>
              <p className="text-zinc-400">Searching the cosmos for your Explorers...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6 text-emerald-400">Your Cosmic Collection</h2>
        <div className="grid place-items-center py-12">
          <Card className="bg-black/40 backdrop-blur-md border-zinc-800 max-w-md">
            <CardContent className="p-12 flex flex-col items-center justify-center text-center">
              <AlertCircle className="h-16 w-16 text-red-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Error Loading NFTs</h3>
              <p className="text-zinc-400 mb-6">{error}</p>
              <Button
                onClick={fetchUserNFTs}
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-emerald-400">Your Cosmic Collection</h2>
        {nfts.length > 0 && (
          <Button
            onClick={fetchUserNFTs}
            variant="outline"
            size="sm"
            className="border-emerald-500 text-emerald-400 hover:bg-emerald-500/10"
          >
            Refresh
          </Button>
        )}
      </div>

      {nfts.length === 0 ? (
        <div className="grid place-items-center py-12">
          <Card className="bg-black/40 backdrop-blur-md border-zinc-800 max-w-md">
            <CardContent className="p-12 flex flex-col items-center justify-center text-center">
              <h3 className="text-xl font-bold text-white mb-2">No NFTs Found</h3>
              <p className="text-zinc-400 mb-6">
                You don't own any Explorers NFTs yet. Mint your first cosmic entity to start your collection!
              </p>
              <Button
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Mint Your First NFT
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {nfts.map((nft) => (
            <NFTCard
              key={nft.tokenId}
              name={nft.name}
              image={nft.image}
              traits={nft.traits}
            />
          ))}
        </div>
      )}
    </div>
  )
}
