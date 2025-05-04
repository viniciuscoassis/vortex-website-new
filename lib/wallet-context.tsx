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
  connect: () => Promise<void>
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast()
  const [address, setAddress] = useState<Address>()
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [walletClient, setWalletClient] = useState<WalletClient | null>(null)

  // Initialize wallet client when ethereum is available
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return

    const client = createWalletClient({
      transport: custom(window.ethereum)
    })
    setWalletClient(client)
  }, [])

  // Check if wallet is already connected
  useEffect(() => {
    if (typeof window === 'undefined') return

    const checkConnection = async () => {
      if (!window.ethereum) return

      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
          setAddress(accounts[0] as Address)
          setIsConnected(true)
        }
      } catch (error) {
        console.error('Failed to check wallet connection:', error)
      }
    }

    checkConnection()

    // Listen for account changes
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
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {})
      }
    }
  }, [])

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
    toast({
      title: "Disconnected",
      description: "Wallet disconnected",
    })
  }

  return (
    <WalletContext.Provider value={{ address, isConnected, isConnecting, walletClient, connect, disconnect }}>
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