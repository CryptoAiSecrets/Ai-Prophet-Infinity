"use client"

import { useEffect, useState } from "react"
import { TrendingUp } from "lucide-react"

export function SplashScreen() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          return 100
        }
        return prev + 5
      })
    }, 100)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
      <div className="relative">
        {/* Animated hexagon background */}
        <div className="absolute -inset-20 opacity-30">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-40 w-40 bg-[#00DC82]/20 rounded-full animate-pulse"></div>
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-60 w-60 bg-[#00DC82]/10 rounded-full animate-pulse"
            style={{ animationDelay: "300ms" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 bg-[#00DC82]/5 rounded-full animate-pulse"
            style={{ animationDelay: "600ms" }}
          ></div>
        </div>

        {/* Logo */}
        <div
          className="relative h-24 w-24 rounded-full bg-gradient-to-br from-[#00DC82] to-[#36e4da] flex items-center justify-center shadow-lg shadow-[#00DC82]/20 animate-bounce"
          style={{ animationDuration: "2s" }}
        >
          <TrendingUp className="h-12 w-12 text-black" />
        </div>
      </div>

      <h1 className="mt-8 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00DC82] to-[#36e4da]">
        AI Prophet
      </h1>

      <p className="mt-2 text-white/70">Financial Intelligence Platform</p>

      {/* Progress bar */}
      <div className="mt-8 w-64 h-1 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#00DC82] to-[#36e4da] transition-all duration-100 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <p className="mt-2 text-xs text-white/50">Loading AI models...</p>
    </div>
  )
}

