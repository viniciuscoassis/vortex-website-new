"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react"
import Confetti from "react-confetti"
import { useEffect, useState } from "react"

interface TravelResultsProps {
  result: {
    success: boolean
    amount: number
    message: string
  }
  onClose: () => void
}

export function TravelResults({ result, onClose }: TravelResultsProps) {
  const [showConfetti, setShowConfetti] = useState(result.success && result.amount > 100)
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        })
      }

      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [])

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [showConfetti])

  return (
    <div className="relative">
      {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} />}

      <Card className="bg-black/60 backdrop-blur-md border-zinc-800 max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <div className="h-20 w-20 rounded-full mx-auto mb-6 flex items-center justify-center">
            {result.success ? (
              <CheckCircle2
                className={`h-20 w-20 ${
                  result.amount > 1000 ? "text-yellow-400" : result.amount > 100 ? "text-purple-400" : "text-green-400"
                }`}
              />
            ) : (
              <XCircle className="h-20 w-20 text-red-400" />
            )}
          </div>

          <h3 className="text-2xl font-bold text-white mb-2">
            {result.success ? "Travel Successful!" : "Travel Failed"}
          </h3>
          <p className="text-zinc-300 mb-6">{result.message}</p>

          {result.success && (
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg py-4 px-6 mb-6">
              <p className="text-sm text-purple-300 mb-1">You received</p>
              <p className="text-3xl font-bold text-purple-400">{result.amount} $DUST</p>
            </div>
          )}

          <Button
            className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
            onClick={onClose}
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
