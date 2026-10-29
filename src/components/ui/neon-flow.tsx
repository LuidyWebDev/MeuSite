import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// Helper for random colors
const randomColors = (count: number) => {
  return new Array(count)
    .fill(0)
    .map(() => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'))
}

interface TubesBackgroundProps {
  children?: React.ReactNode
  className?: string
  enableClickInteraction?: boolean
  isDarkMode?: boolean
}

export function TubesBackground({ 
  children, 
  className,
  enableClickInteraction = true,
  isDarkMode = true
}: TubesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const tubesRef = useRef<any>(null)

  useEffect(() => {
    let mounted = true
    let cleanup: (() => void) | undefined

    const initTubes = async () => {
      if (!canvasRef.current) return

      try {
        // We use the specific build from the CDN as it contains the exact effect requested
        // Using native dynamic import which works in modern browsers
        // @ts-ignore
        const module = await import('https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js')
        const TubesCursor = module.default

        if (!mounted) return

        const app = TubesCursor(canvasRef.current, {
          tubes: {
            colors: ["#3B82F6", "#0EA5E9", "#00D2FF"],
            lights: {
              intensity: 200,
              colors: ["#1D4ED8", "#38BDF8", "#7DD3FC", "#00D2FF"]
            }
          }
        })

        tubesRef.current = app
        setIsLoaded(true)

        // Handle resize if the library doesn't automatically
        const handleResize = () => {
          // The library might handle it, but typically we ensure canvas matches container
        }

        window.addEventListener('resize', handleResize)
        
        cleanup = () => {
          window.removeEventListener('resize', handleResize)
        }

      } catch (error) {
        console.error("Failed to load TubesCursor:", error)
      }
    }

    initTubes()

    return () => {
      mounted = false
      if (cleanup) cleanup()
    }
  }, [])

  const handleClick = () => {
    if (!enableClickInteraction || !tubesRef.current) return
    
    const bluePalettes = [
      ["#3B82F6", "#0EA5E9", "#00D2FF"],
      ["#00B4FF", "#0066FF", "#38BDF8"],
      ["#2563EB", "#0284C7", "#7DD3FC"],
    ]
    const palette = bluePalettes[Math.floor(Math.random() * bluePalettes.length)]
    const lightsColors = ["#1D4ED8", "#38BDF8", "#7DD3FC", "#00D2FF"]
    
    tubesRef.current.tubes.setColors(palette)
    tubesRef.current.tubes.setLightsColors(lightsColors)
  }

  return (
    <div 
      className={cn(
        "relative w-full h-full min-h-[400px] overflow-hidden transition-colors duration-300",
        isDarkMode ? "bg-black" : "bg-white",
        className
      )}
      onClick={handleClick}
    >
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full block transition-[filter] duration-300"
        style={{ 
          touchAction: 'none',
          filter: isDarkMode ? 'none' : 'invert(1) hue-rotate(180deg)'
        }}
      />
      
      {/* Content Overlay */}
      <div className="relative z-10 w-full h-full pointer-events-none">
        {children}
      </div>
    </div>
  )
}

// Default export
export default TubesBackground