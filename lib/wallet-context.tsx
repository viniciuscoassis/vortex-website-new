"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type Address, type WalletClient, createWalletClient, custom } from "viem"
import { useToast } from "@/hooks/use-toast"

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>
      on: (event: string, callback: (accounts: string[]) => void) => void
      removeListener: (event: string, callback: () => void) => void
    }
  }
}

interface WalletContextType {
  address: Address | undefined
  isConnected: boolean
  isConnecting: boolean
  walletClient: WalletClient | null
  walletChainId: number | null
  isNetworkMismatch: boolean
  connect: () => Promise<void>
  disconnect: () => void
  switchNetwork: () => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast()
  const [address, setAddress] = useState<Address>()
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [walletClient, setWalletClient] = useState<WalletClient | null>(null)
  const [walletChainId, setWalletChainId] = useState<number | null>(null)
  const [isNetworkMismatch, setIsNetworkMismatch] = useState(false)

  // Get expected chainId from env
  const expectedChainId = process.env.NEXT_PUBLIC_NETWORK === 'testnet' ? 57054 : 146

  // Helper to check wallet's chainId
  const checkChainId = async () => {
    if (!window.ethereum) return
    try {
      const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' })
      const chainId = parseInt(chainIdHex, 16)
      setWalletChainId(chainId)
      setIsNetworkMismatch(chainId !== expectedChainId)
      return chainId
    } catch (err) {
      setWalletChainId(null)
      setIsNetworkMismatch(false)
    }
  }

  // Initialize wallet client when ethereum is available
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return
    const client = createWalletClient({
      transport: custom(window.ethereum)
    })
    setWalletClient(client)
  }, [])

  // Check if wallet is already connected and check network
  useEffect(() => {
    if (typeof window === 'undefined') return
    const checkConnection = async () => {
      if (!window.ethereum) return
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
          setAddress(accounts[0] as Address)
          setIsConnected(true)
          await checkChainId()
        }
      } catch (error) {
        console.error('Failed to check wallet connection:', error)
      }
    }
    checkConnection()
    // Listen for account and chain changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0] as Address)
          setIsConnected(true)
        } else {
          setAddress(undefined)
          setIsConnected(false)
        }
      })
      window.ethereum.on('chainChanged', () => {
        checkChainId()
      })
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {})
        window.ethereum.removeListener('chainChanged', () => {})
      }
    }
  }, [])

  // Show toast if network mismatch after connecting
  useEffect(() => {
    if (isConnected && isNetworkMismatch) {
      toast({
        title: 'Wrong Network',
        description: `Please switch your wallet to the correct network.`,
        variant: 'destructive',
      })
    }
  }, [isConnected, isNetworkMismatch, toast])

  const connect = async () => {
    if (!window.ethereum) {
      toast({
        title: "Error",
        description: "No wallet found. Please install MetaMask or another Web3 wallet.",
        variant: "destructive",
      })
      return
    }
    setIsConnecting(true)
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      if (accounts.length > 0) {
        setAddress(accounts[0] as Address)
        setIsConnected(true)
        await checkChainId()
        toast({
          title: "Connected",
          description: "Wallet connected successfully",
        })
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      toast({
        title: "Error",
        description: "Failed to connect wallet",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    setAddress(undefined)
    setIsConnected(false)
    setWalletChainId(null)
    setIsNetworkMismatch(false)
    toast({
      title: "Disconnected",
      description: "Wallet disconnected",
    })
  }

  // Function to switch network
  const switchNetwork = async () => {
    if (!window.ethereum) return
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x' + expectedChainId.toString(16) }],
      })
      await checkChainId()
      toast({
        title: 'Network Switched',
        description: 'Wallet network switched successfully.',
      })
    } catch (err: any) {
      if (err.code === 4902) {
        toast({
          title: 'Network Not Found',
          description: 'Please add the network to your wallet first.',
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Failed to Switch Network',
          description: err.message || 'Unknown error',
          variant: 'destructive',
        })
      }
    }
  }

  return (
    <WalletContext.Provider value={{ address, isConnected, isConnecting, walletClient, walletChainId, isNetworkMismatch, connect, disconnect, switchNetwork }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
} 