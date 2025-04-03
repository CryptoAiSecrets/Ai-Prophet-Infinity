"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUp, ArrowDown, TrendingUp, TrendingDown, BarChart2, LineChart, Zap } from "lucide-react"
import { useState, useEffect } from "react"

// Mock data for top prediction assets
const topPredictions = [
  {
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    price: 437.53,
    change: 5.15,
    prediction: {
      direction: "up",
      target: 480.0,
      confidence: 92,
      timeframe: "1 month",
    },
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corp.",
    price: 345.24,
    change: 2.39,
    prediction: {
      direction: "up",
      target: 370.0,
      confidence: 87,
      timeframe: "2 months",
    },
  },
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 187.3,
    change: 2.62,
    prediction: {
      direction: "up",
      target: 200.0,
      confidence: 78,
      timeframe: "3 months",
    },
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: 237.49,
    change: -1.21,
    prediction: {
      direction: "down",
      target: 210.0,
      confidence: 65,
      timeframe: "1 month",
    },
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    price: 131.27,
    change: 2.76,
    prediction: {
      direction: "up",
      target: 145.0,
      confidence: 83,
      timeframe: "2 months",
    },
  },
]

interface TopPredictionsProps {
  setActiveTab?: (tab: string) => void
}

export function TopPredictions({ setActiveTab }: TopPredictionsProps) {
  // Add state for live updates
  const [predictions, setPredictions] = useState(topPredictions)
  const [lastUpdated, setLastUpdated] = useState(new Date("2025-03-27T21:11:23"))
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // Simulate live updates
  useEffect(() => {
    // Initial load with a slight delay to ensure rendering
    const initialTimer = setTimeout(() => {
      setIsInitialLoad(false)
    }, 500)

    // Live updates
    const interval = setInterval(() => {
      // Update prices with small random changes
      const updatedPredictions = predictions.map((asset) => {
        const priceChange = asset.price * (Math.random() * 0.01 - 0.005) // -0.5% to +0.5%
        const newPrice = asset.price + priceChange
        const newChange = asset.change + (Math.random() * 0.2 - 0.1) // Small adjustment to change percentage

        return {
          ...asset,
          price: newPrice,
          change: Number.parseFloat(newChange.toFixed(2)),
          prediction: {
            ...asset.prediction,
            target: asset.prediction.target * (1 + (Math.random() * 0.004 - 0.002)), // Small adjustment to target
            confidence: Math.min(99, Math.max(60, Math.round(asset.prediction.confidence + (Math.random() * 2 - 1)))), // Adjust confidence slightly and round to integer
          },
        }
      })

      setPredictions(updatedPredictions)
      setLastUpdated(new Date())
    }, 5000) // Update every 5 seconds

    return () => {
      clearTimeout(initialTimer)
      clearInterval(interval)
    }
  }, [predictions])

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <div>
          <h3 className="text-base md:text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Top Prediction Assets
          </h3>
          <div className="text-xs text-white/60">Last updated: {lastUpdated.toLocaleTimeString()}</div>
        </div>

        <div className="flex flex-wrap gap-1 sm:gap-2">
          <Button
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-blue-400 text-black hover:from-blue-700 hover:to-blue-500 shadow-md shadow-blue-600/20 flex items-center gap-1 h-8 text-xs px-2"
            onClick={() => setActiveTab && setActiveTab("analyze")}
          >
            <BarChart2 className="h-3 w-3" />
            Analyze
          </Button>
          <Button
            size="sm"
            className="bg-gradient-to-r from-amber-500 to-yellow-400 text-black hover:from-amber-600 hover:to-yellow-500 shadow-md shadow-amber-500/20 flex items-center gap-1 h-8 text-xs px-2"
            onClick={() => setActiveTab && setActiveTab("predict")}
          >
            <LineChart className="h-3 w-3" />
            Predict
          </Button>
          <Button
            size="sm"
            className="bg-gradient-to-r from-red-600 to-red-400 text-black hover:from-red-700 hover:to-red-500 shadow-md shadow-red-600/20 flex items-center gap-1 h-8 text-xs px-2"
            onClick={() => setActiveTab && setActiveTab("variables")}
          >
            <Zap className="h-3 w-3" />
            Variables
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {predictions.map((asset) => (
          <Card
            key={asset.symbol}
            className={`bg-black/60 border-white/20 overflow-hidden group hover:border-[#00DC82]/50 transition-all duration-300 shadow-lg ${isInitialLoad ? "opacity-0" : "opacity-100"}`}
          >
            <CardContent className="p-3">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-bold text-base flex items-center gap-1">
                    {asset.symbol}
                    {asset.change >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-400" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-400" />
                    )}
                  </div>
                  <div className="text-sm text-white/80">{asset.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-base">{formatCurrency(asset.price)}</div>
                  <div
                    className={`text-sm flex items-center justify-end ${asset.change >= 0 ? "text-green-400" : "text-red-400"} font-medium`}
                  >
                    {asset.change >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                    {asset.change >= 0 ? "+" : ""}
                    {asset.change}%
                  </div>
                </div>
              </div>

              <div
                className={`p-3 rounded-lg ${asset.prediction.direction === "up" ? "bg-green-500/30" : "bg-red-500/30"} border ${asset.prediction.direction === "up" ? "border-green-500/40" : "border-red-500/40"} shadow-inner`}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm font-medium text-white">AI Prediction</div>
                  <div
                    className={`text-xs ${asset.prediction.direction === "up" ? "text-green-400" : "text-red-400"} font-medium`}
                  >
                    {asset.prediction.timeframe}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    {asset.prediction.direction === "up" ? (
                      <TrendingUp className="h-4 w-4 text-green-400" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-400" />
                    )}
                    <span className="font-bold text-sm text-white">{formatCurrency(asset.prediction.target)}</span>
                  </div>
                  <div className="text-xs px-2 py-1 rounded-full bg-black/30 text-white font-medium">
                    {Math.round(asset.prediction.confidence)}% confidence
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

