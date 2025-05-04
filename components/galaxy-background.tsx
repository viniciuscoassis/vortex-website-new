"use client"

import { useEffect, useRef } from "react"

export function GalaxyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Star properties
    const stars: { x: number; y: number; radius: number; opacity: number; speed: number }[] = []
    const starCount = 200

    // Create stars
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        opacity: Math.random(),
        speed: 0.05 + Math.random() * 0.1,
      })
    }

    // Animation
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "#0f0f1a")
      gradient.addColorStop(1, "#000000")

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw stars
      stars.forEach((star) => {
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
        ctx.fill()

        // Move stars
        star.y += star.speed

        // Reset stars that go off screen
        if (star.y > canvas.height) {
          star.y = 0
          star.x = Math.random() * canvas.width
        }
      })

      // Draw nebula-like clouds
      for (let i = 0; i < 3; i++) {
        const centerX = canvas.width * (0.2 + i * 0.3)
        const centerY = canvas.height * (0.3 + i * 0.2)
        const radius = canvas.width * 0.15

        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)

        if (i === 0) {
          gradient.addColorStop(0, "rgba(64, 0, 128, 0.2)")
          gradient.addColorStop(1, "rgba(64, 0, 128, 0)")
        } else if (i === 1) {
          gradient.addColorStop(0, "rgba(0, 128, 128, 0.1)")
          gradient.addColorStop(1, "rgba(0, 128, 128, 0)")
        } else {
          gradient.addColorStop(0, "rgba(0, 64, 128, 0.15)")
          gradient.addColorStop(1, "rgba(0, 64, 128, 0)")
        }

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
        ctx.fill()
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full -z-10" />
}
