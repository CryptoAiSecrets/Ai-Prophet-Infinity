"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ArrowUp, ArrowDown, Lightbulb, TrendingUp, TrendingDown, RefreshCw } from "lucide-react"

// Generate mock portfolio data
const generatePortfolioData = () => {
  const data = []
  const now = new Date("2025-03-27T21:11:23")
  const startValue = 10000 + Math.random() * 2000
  let currentValue = startValue

  // Generate data for the past 30 days
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    // Create realistic price movements
    const dailyChange = (Math.random() * 2 - 0.5) / 100 // Between -0.5% and 1.5%
    currentValue = currentValue * (1 + dailyChange)

    data.push({
      date: date.toLocaleDateString(),
      value: Number(currentValue.toFixed(2)),
    })
  }

  return data
}

// Generate prediction data
const generatePredictionData = (historicalData: any[]) => {
  const lastDay = historicalData[historicalData.length - 1]
  const lastValue = lastDay.value
  const lastDate = new Date(lastDay.date)

  const predictions = []

  // Generate predictions for next 7 days
  for (let i = 1; i <= 7; i++) {
    const date = new Date(lastDate)
    date.setDate(date.getDate() + i)

    // Create prediction with slight upward bias
    const dailyChange = (Math.random() * 2 - 0.3) / 100 // Between -0.3% and 1.7%
    const predictedValue = lastValue * Math.pow(1 + dailyChange, i)

    predictions.push({
      date: date.toLocaleDateString(),
      prediction: Number(predictedValue.toFixed(2)),
    })
  }

  return predictions
}

export function PortfolioPredictions() {
  const [portfolioData, setPortfolioData] = useState<any[]>([])
  const [predictionData, setPredictionData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentValue, setCurrentValue] = useState(0)
  const [startValue, setStartValue] = useState(0)
  const [predictionValue, setPredictionValue] = useState(0)
  const [confidenceScore, setConfidenceScore] = useState(0)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const backupIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const failedUpdatesRef = useRef(0)

  // Load portfolio data
  useEffect(() => {
    const loadData = () => {
      setIsLoading(true)

      try {
        // Generate historical data
        const historical = generatePortfolioData()
        setPortfolioData(historical)

        // Set current and start values
        setCurrentValue(historical[historical.length - 1].value)
        setStartValue(historical[0].value)

        // Generate prediction data
        const predictions = generatePredictionData(historical)
        setPredictionData(predictions)

        // Set prediction value (7 days out)
        setPredictionValue(predictions[predictions.length - 1].prediction)

        // Set random confidence score between 75-95%
        setConfidenceScore(Math.round(75 + Math.random() * 20))

        setIsLoading(false)
        setIsInitialLoad(false)
        failedUpdatesRef.current = 0
      } catch (error) {
        console.error("Failed to load portfolio data:", error)
        failedUpdatesRef.current += 1

        // If we've failed multiple times, activate backup system
        if (failedUpdatesRef.current > 2) {
          activateBackupSystem()
        }
      }
    }

    const activateBackupSystem = () => {
      console.log("Activating portfolio backup system")

      // Generate simple backup data
      const backupHistorical = [
        { date: "2/26/2025", value: 9500 },
        { date: "3/5/2025", value: 9800 },
        { date: "3/12/2025", value: 10100 },
        { date: "3/19/2025", value: 10300 },
        { date: "3/27/2025", value: 10500 },
      ]

      const backupPredictions = [
        { date: "3/28/2025", prediction: 10550 },
        { date: "3/29/2025", prediction: 10600 },
        { date: "3/30/2025", prediction: 10650 },
        { date: "3/31/2025", prediction: 10700 },
        { date: "4/1/2025", prediction: 10750 },
        { date: "4/2/2025", prediction: 10800 },
        { date: "4/3/2025", prediction: 10850 },
      ]

      setPortfolioData(backupHistorical)
      setPredictionData(backupPredictions)
      setCurrentValue(backupHistorical[backupHistorical.length - 1].value)
      setStartValue(backupHistorical[0].value)
      setPredictionValue(backupPredictions[backupPredictions.length - 1].prediction)
      setConfidenceScore(85)
      setIsLoading(false)
      setIsInitialLoad(false)

      // Set up backup interval for continuous updates
      if (backupIntervalRef.current) {
        clearInterval(backupIntervalRef.current)
      }

      backupIntervalRef.current = setInterval(() => {
        // Small random changes to keep data "live"
        setCurrentValue((prev) => prev * (1 + (Math.random() * 0.004 - 0.002)))
        setPredictionValue((prev) => prev * (1 + (Math.random() * 0.004 - 0.002)))
      }, 5000)
    }

    loadData()

    // Refresh data every 5 minutes
    const intervalId = setInterval(loadData, 5 * 60 * 1000)
    return () => {
      clearInterval(intervalId)
      if (updateIntervalRef.current) clearInterval(updateIntervalRef.current)
      if (backupIntervalRef.current) clearInterval(backupIntervalRef.current)
    }
  }, [])

  // Add automatic live updates
  useEffect(() => {
    // Clear any existing interval
    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current)
    }

    updateIntervalRef.current = setInterval(() => {
      if (!isLoading) {
        // Update current value with small random change
        const change = currentValue * (Math.random() * 0.01 - 0.003) // -0.3% to +0.7%
        const newValue = currentValue + change
        setCurrentValue(newValue)

        // Update portfolio data with the new value
        const updatedPortfolioData = [...portfolioData]
        if (updatedPortfolioData.length > 0) {
          updatedPortfolioData[updatedPortfolioData.length - 1].value = newValue
          setPortfolioData(updatedPortfolioData)
        }

        // Update prediction with small change
        const predictionChange = predictionValue * (Math.random() * 0.008 - 0.003)
        const newPredictionValue = predictionValue + predictionChange
        setPredictionValue(newPredictionValue)

        // Update prediction data
        const updatedPredictionData = [...predictionData]
        if (updatedPredictionData.length > 0) {
          updatedPredictionData[updatedPredictionData.length - 1].prediction = newPredictionValue
          setPredictionData(updatedPredictionData)
        }

        // Slightly adjust confidence score - use integer values only
        setConfidenceScore(Math.min(95, Math.max(75, Math.round(confidenceScore + (Math.random() * 2 - 1)))))
      }
    }, 10000) // Update every 10 seconds

    return () => {
      if (updateIntervalRef.current) clearInterval(updateIntervalRef.current)
    }
  }, [currentValue, predictionValue, portfolioData, predictionData, confidenceScore, isLoading])

  // Calculate performance metrics
  const totalGain = currentValue - startValue
  const totalGainPercent = (totalGain / startValue) * 100

  const predictedGain = predictionValue - currentValue
  const predictedGainPercent = (predictedGain / currentValue) * 100

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  // Combine historical and prediction data for chart
  const combinedData = [
    ...portfolioData.map((item) => ({
      date: item.date,
      value: item.value,
      prediction: null,
    })),
    ...predictionData.map((item) => ({
      date: item.date,
      value: null,
      prediction: item.prediction,
    })),
  ]

  return (
    <Card className="bg-black/60 border-white/10 overflow-hidden group hover:border-[#00DC82]/30 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-[#00DC82]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <CardHeader className="relative p-3 md:p-4">
        <div className="flex items-center justify-between">
          <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 text-base md:text-lg">
            Portfolio Predictions
          </CardTitle>

          <Button
            variant="outline"
            size="sm"
            className="h-8 border-white/20 hover:bg-[#00DC82]/20 hover:border-[#00DC82]/40 hover:text-white flex items-center gap-1"
            onClick={() => {
              setIsLoading(true)
              setTimeout(() => {
                const historical = generatePortfolioData()
                setPortfolioData(historical)
                setCurrentValue(historical[historical.length - 1].value)
                setStartValue(historical[0].value)

                const predictions = generatePredictionData(historical)
                setPredictionData(predictions)
                setPredictionValue(predictions[predictions.length - 1].prediction)
                setConfidenceScore(75 + Math.random() * 20)

                setIsLoading(false)
              }, 1000)
            }}
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span className="hidden sm:inline">Updating...</span>
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline">Refresh Data</span>
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="relative p-3 md:p-4 pt-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
          <div>
            <div className="text-2xl font-bold">{formatCurrency(currentValue)}</div>
            <div className={`flex items-center ${totalGain >= 0 ? "text-green-500" : "text-red-500"}`}>
              {totalGain >= 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
              <span>
                {formatCurrency(Math.abs(totalGain))} ({Math.abs(totalGainPercent).toFixed(2)}%)
              </span>
            </div>
            <div className="text-xs text-white/60 mt-1">Live updates every 10 seconds</div>
          </div>

          <div className="flex items-center gap-2 bg-black/40 rounded-lg p-2 border border-white/10">
            <Lightbulb className={`h-5 w-5 ${predictedGain >= 0 ? "text-green-500" : "text-red-500"}`} />
            <div>
              <div className="text-sm">7-Day Prediction</div>
              <div className="flex items-center">
                <span className="font-bold">{formatCurrency(predictionValue)}</span>
                <span className={`ml-2 text-sm ${predictedGain >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {predictedGain >= 0 ? "+" : ""}
                  {predictedGainPercent.toFixed(2)}%
                </span>
              </div>
              <div className="text-xs text-white/50">{confidenceScore}% confidence</div>
            </div>
          </div>
        </div>

        <div className={`h-64 relative ${isInitialLoad ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <RefreshCw className="h-8 w-8 animate-spin text-[#00DC82]" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={combinedData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00DC82" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#00DC82" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPrediction" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0088FF" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0088FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis
                  dataKey="date"
                  stroke="#666"
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return `${date.getMonth() + 1}/${date.getDate()}`
                  }}
                />
                <YAxis domain={["auto", "auto"]} stroke="#666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    border: "1px solid #00DC82",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => [formatCurrency(Number(value)), ""]}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Portfolio"
                  stroke="#00DC82"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 8, fill: "#00DC82", stroke: "#fff", strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="prediction"
                  name="Prediction"
                  stroke="#0088FF"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  activeDot={{ r: 8, fill: "#0088FF", stroke: "#fff", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { label: "1D Change", value: 0.8, isPositive: true },
            { label: "1W Change", value: 2.3, isPositive: true },
            { label: "1M Change", value: -1.2, isPositive: false },
            { label: "YTD Change", value: 12.5, isPositive: true },
          ].map((stat, index) => (
            <div key={index} className="bg-black/40 rounded-lg p-2 border border-white/10">
              <div className="text-xs text-white/70">{stat.label}</div>
              <div className={`flex items-center ${stat.isPositive ? "text-green-500" : "text-red-500"}`}>
                {stat.isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                <span className="font-medium">
                  {stat.isPositive ? "+" : ""}
                  {stat.value}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

