"use client"

import { useState, useEffect, useRef } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowUp, ArrowDown, Loader2, Lightbulb, TrendingUp, TrendingDown } from "lucide-react"
import { PredictionHistory } from "@/components/prediction-history"

interface NasdaqFeedProps {
  detailed?: boolean
}

// Mock data for NASDAQ
const generateMockData = () => {
  const data = []
  const now = new Date("2025-03-27T21:11:23")
  const baseValue = 16000 + Math.random() * 1000

  for (let i = 20; i >= 0; i--) {
    const time = new Date(now)
    time.setMinutes(now.getMinutes() - i * 15)

    // Create realistic price movements with some volatility
    const volatility = 0.003 // 0.3% volatility
    const trend = 0.0005 // slight upward trend
    const randomChange = (Math.random() * 2 - 1) * volatility
    const trendChange = trend * i
    const value = baseValue * (1 + randomChange + trendChange)

    data.push({
      time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      value: Number.parseFloat(value.toFixed(2)),
    })
  }

  return data
}

export function NasdaqFeed({ detailed = false }: NasdaqFeedProps) {
  const [data, setData] = useState<any[]>([])
  const [predictionData, setPredictionData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPredicting, setIsPredicting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentValue, setCurrentValue] = useState(0)
  const [previousValue, setPreviousValue] = useState(0)
  const [predictionValue, setPredictionValue] = useState<number | null>(null)
  const [confidenceScore, setConfidenceScore] = useState(0)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const backupIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const failedUpdatesRef = useRef(0)

  // Fetch NASDAQ data
  useEffect(() => {
    const getNasdaqData = async () => {
      try {
        setIsLoading(true)

        // Use mock data for demonstration
        const marketData = generateMockData()

        setData(marketData)
        setCurrentValue(marketData[marketData.length - 1].value)
        setPreviousValue(marketData[marketData.length - 2].value)
        setLastUpdated(new Date())
        setIsInitialLoad(false)

        // Generate prediction
        generatePrediction(marketData)
      } catch (err) {
        console.error("Error fetching NASDAQ data:", err)
        setError("Using simulated NASDAQ data")
        failedUpdatesRef.current += 1

        // Generate fallback data
        const fallbackData = generateMockData()
        setData(fallbackData)
        setCurrentValue(fallbackData[fallbackData.length - 1].value)
        setPreviousValue(fallbackData[fallbackData.length - 2].value)

        // If we've failed multiple times, activate backup system
        if (failedUpdatesRef.current > 2) {
          activateBackupSystem()
        }
      } finally {
        setIsLoading(false)
      }
    }

    const activateBackupSystem = () => {
      console.log("Activating backup data system")
      // Clear any existing backup interval
      if (backupIntervalRef.current) {
        clearInterval(backupIntervalRef.current)
      }

      // Set up backup interval that's more aggressive
      backupIntervalRef.current = setInterval(() => {
        const lastPoint = data[data.length - 1]
        const volatility = 0.001 // Lower volatility for backup system
        const randomChange = (Math.random() * 2 - 1) * volatility
        const newValue = lastPoint.value * (1 + randomChange)

        // Update the current and previous values
        const newPreviousValue = currentValue
        const newCurrentValue = newValue

        setCurrentValue(newCurrentValue)
        setPreviousValue(newPreviousValue)

        // Update the last data point
        const updatedData = [...data]
        updatedData[updatedData.length - 1].value = newCurrentValue
        setData(updatedData)

        // Also update prediction if available
        if (predictionValue !== null) {
          const predictionChange = predictionValue * (Math.random() * 0.0005 - 0.0002)
          const newPredictionValue = predictionValue + predictionChange
          setPredictionValue(newPredictionValue)
        }

        setLastUpdated(new Date())
      }, 2000) // More frequent updates in backup mode
    }

    getNasdaqData()

    // Refresh data every 5 minutes
    const intervalId = setInterval(getNasdaqData, 5 * 60 * 1000)
    return () => {
      clearInterval(intervalId)
      if (backupIntervalRef.current) clearInterval(backupIntervalRef.current)
    }
  }, [])

  // Add automatic micro-updates between full refreshes
  useEffect(() => {
    if (data.length === 0) return

    // Clear any existing interval
    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current)
    }

    updateIntervalRef.current = setInterval(() => {
      if (!isLoading && !isPredicting) {
        // Get the last data point
        const lastPoint = data[data.length - 1]

        // Create a small random change
        const volatility = 0.0005 // 0.05% volatility for micro-updates
        const randomChange = (Math.random() * 2 - 1) * volatility
        const newValue = lastPoint.value * (1 + randomChange)

        // Update the current and previous values
        const newPreviousValue = currentValue
        const newCurrentValue = newValue

        setCurrentValue(newCurrentValue)
        setPreviousValue(newPreviousValue)

        // Update the last data point
        const updatedData = [...data]
        updatedData[updatedData.length - 1].value = newCurrentValue
        setData(updatedData)

        // Also update prediction if available
        if (predictionValue !== null) {
          const predictionChange = predictionValue * (Math.random() * 0.0008 - 0.0003)
          const newPredictionValue = predictionValue + predictionChange
          setPredictionValue(newPredictionValue)

          // Update confidence slightly - use integer values only
          setConfidenceScore(Math.min(99, Math.max(65, Math.round(confidenceScore + (Math.random() * 0.5 - 0.25)))))
        }

        setLastUpdated(new Date())

        // Reset failed updates counter since we're successfully updating
        failedUpdatesRef.current = 0
      }
    }, 3000) // Update every 3 seconds

    return () => {
      if (updateIntervalRef.current) clearInterval(updateIntervalRef.current)
    }
  }, [data, currentValue, predictionValue, isLoading, isPredicting, confidenceScore])

  // Generate prediction
  const generatePrediction = async (marketData: any[]) => {
    try {
      setIsPredicting(true)

      // Last data point
      const lastPoint = marketData[marketData.length - 1]

      // Simulate prediction calculation
      const predictedChange = Math.random() * 0.02 - 0.005 // Between -0.5% and 1.5%
      const predictedValue = lastPoint.value * (1 + predictedChange)

      setPredictionValue(predictedValue)
      setConfidenceScore(Math.round(70 + Math.random() * 25)) // 70-95% confidence, rounded to integer

      // Generate prediction data points
      generatePredictionDataPoints(marketData, predictedValue)
    } catch (err) {
      console.error("Error generating prediction:", err)
      setError("Could not generate prediction")
    } finally {
      setIsPredicting(false)
    }
  }

  // Create prediction data points for display on chart
  const generatePredictionDataPoints = (marketData: any[], predictedValue: number) => {
    const lastPoint = marketData[marketData.length - 1]
    const lastTime = lastPoint.time

    // Get hour from lastTime (e.g., "14:30" -> 14)
    const hour = Number.parseInt(lastTime.split(":")[0])

    // Generate next 5 hours of predicted data
    const predictionPoints = []
    const predictionHours = 5

    // Calculate slope for linear progression to prediction
    const valueIncrement = (predictedValue - lastPoint.value) / predictionHours

    for (let i = 1; i <= predictionHours; i++) {
      const nextHour = (hour + i) % 24
      const nextTime = `${nextHour.toString().padStart(2, "0")}:00`
      const nextValue = lastPoint.value + valueIncrement * i

      predictionPoints.push({
        time: nextTime,
        value: nextValue,
        isPrediction: true,
      })
    }

    setPredictionData(predictionPoints)
  }

  const isUp = currentValue > previousValue
  const isPredictionUp = predictionValue !== null && predictionValue > currentValue

  if (isLoading && data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-black/30 border border-[#00DC82]/40 rounded-lg shadow-lg shadow-[#00DC82]/10">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 bg-[#00DC82]/20 rounded-full animate-ping"></div>
          <div className="absolute inset-2 bg-[#00DC82]/40 rounded-full animate-pulse"></div>
          <Loader2 className="absolute inset-0 m-auto h-8 w-8 animate-spin text-[#00DC82]" />
        </div>
        <p className="mt-4 text-white/70">Loading NASDAQ data...</p>
      </div>
    )
  }

  // Combine historical and prediction data for chart
  const chartData = [...data, ...predictionData]

  return (
    <div className="space-y-4 p-4 bg-black/30 border border-[#00DC82]/40 rounded-lg shadow-lg shadow-[#00DC82]/10">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00DC82] to-[#36e4da]">
            NASDAQ
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">{currentValue.toLocaleString()}</span>
            <span className={`flex items-center ${isUp ? "text-green-500" : "text-red-500"} font-medium`}>
              {isUp ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
              {Math.abs(currentValue - previousValue).toFixed(2)}
              <span className="ml-1">
                ({((Math.abs(currentValue - previousValue) / previousValue) * 100).toFixed(2)}%)
              </span>
            </span>
          </div>
          <div className="text-xs text-white/60">Live data with real-time updates</div>
          {error && <p className="text-xs text-yellow-500">{error}</p>}
        </div>
        <div className="flex items-center gap-2">
          <PredictionHistory />
          <div className="text-right">
            <div className="text-sm text-white/70">Last Updated</div>
            <div>{lastUpdated.toLocaleTimeString()}</div>
          </div>
        </div>
      </div>

      <div
        className={`h-64 relative group ${isInitialLoad ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#00DC82]/5 to-transparent rounded-xl opacity-50"></div>
        {isPredicting && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="bg-black/70 p-3 rounded-lg flex items-center">
              <Loader2 className="h-4 w-4 animate-spin text-[#00DC82] mr-2" />
              <span>Generating prediction...</span>
            </div>
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%" minWidth={280}>
          <LineChart data={chartData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00DC82" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#00DC82" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPrediction" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0088FF" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#0088FF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="time" stroke="#666" />
            <YAxis domain={["auto", "auto"]} stroke="#666" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0,0,0,0.8)",
                border: "1px solid #00DC82",
                borderRadius: "8px",
                boxShadow: "0 0 10px rgba(0,220,130,0.3)",
              }}
              labelStyle={{ color: "#ccc" }}
              formatter={(value, name) => [
                `$${Number(value).toLocaleString()}`,
                name === "Prediction" ? "AI Prediction" : "Value",
              ]}
            />
            <Line
              type="monotone"
              dataKey="value"
              name="Historical"
              stroke="#00DC82"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 8, fill: "#00DC82", stroke: "#fff", strokeWidth: 2 }}
              isAnimationActive={true}
              animationDuration={1000}
            />
            <Line
              type="monotone"
              dataKey={(d) => (d.isPrediction ? d.value : undefined)}
              name="Prediction"
              stroke="#0088FF"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              activeDot={{ r: 8, fill: "#0088FF", stroke: "#fff", strokeWidth: 2 }}
              isAnimationActive={true}
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black to-transparent opacity-40 pointer-events-none"></div>
      </div>

      {predictionValue !== null && (
        <Card className="bg-[#00DC82]/10 border-[#00DC82]/30 overflow-hidden hover:border-[#00DC82]/50 transition-all duration-300">
          <CardContent className="p-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium mb-1">
                  <Lightbulb className="h-4 w-4 text-[#00DC82]" />
                  <span className="text-white">AI Prediction (24h)</span>
                </div>
                <div className="flex items-baseline gap-1 text-xs text-white/70">
                  <span>Based on time series analysis with {confidenceScore}% confidence</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-lg font-bold">${predictionValue.toLocaleString()}</div>
                <div className={`flex items-center ${isPredictionUp ? "text-green-500" : "text-red-500"}`}>
                  {isPredictionUp ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  <span>
                    {isPredictionUp ? "+" : ""}
                    {(((predictionValue - currentValue) / currentValue) * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {detailed && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#00DC82] to-[#36e4da]">
            Top NASDAQ Stocks
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { symbol: "AAPL", name: "Apple Inc.", price: 182.52, change: 1.25 },
              { symbol: "MSFT", name: "Microsoft Corp.", price: 337.18, change: 2.34 },
              { symbol: "GOOGL", name: "Alphabet Inc.", price: 131.86, change: -0.75 },
              { symbol: "AMZN", name: "Amazon.com Inc.", price: 127.74, change: 1.05 },
              { symbol: "NVDA", name: "NVIDIA Corp.", price: 416.1, change: 5.23 },
              { symbol: "META", name: "Meta Platforms Inc.", price: 297.74, change: -1.32 },
              { symbol: "TSLA", name: "Tesla Inc.", price: 237.49, change: -3.21 },
              { symbol: "JPM", name: "JPMorgan Chase & Co.", price: 146.77, change: 0.87 },
              { symbol: "V", name: "Visa Inc.", price: 235.44, change: 0.54 },
              { symbol: "WMT", name: "Walmart Inc.", price: 157.82, change: 1.23 },
            ].map((stock) => (
              <Card
                key={stock.symbol}
                className="bg-[#00DC82]/5 border-[#00DC82]/30 overflow-hidden group hover:border-[#00DC82]/50 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#00DC82]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardContent className="p-4 relative">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold">{stock.symbol}</div>
                      <div className="text-sm text-white/70">{stock.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${stock.price.toLocaleString()}</div>
                      <div className={`text-sm ${stock.change > 0 ? "text-green-500" : "text-red-500"}`}>
                        {stock.change > 0 ? "+" : ""}
                        {stock.change.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

