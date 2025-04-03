"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { ArrowUp, ArrowDown, TrendingUp, TrendingDown, RefreshCw, DollarSign, Briefcase, BarChart2 } from "lucide-react"
import { PortfolioPredictions } from "@/components/portfolio-predictions"
import { TopPredictions } from "@/components/top-predictions"

// Import paper trading data (mock for now)
const initialBalance = 5000
const initialPositions = [
  { symbol: "AAPL", name: "Apple Inc.", shares: 5, avgPrice: 182.52, currentPrice: 187.3, change: 2.62 },
  { symbol: "MSFT", name: "Microsoft Corp.", shares: 2, avgPrice: 337.18, currentPrice: 345.24, change: 2.39 },
  { symbol: "GOOGL", name: "Alphabet Inc.", shares: 3, avgPrice: 131.86, currentPrice: 129.82, change: -1.55 },
]

export default function PortfolioPage() {
  const [positions, setPositions] = useState(initialPositions)
  const [balance, setBalance] = useState(initialBalance)
  const [portfolioValue, setPortfolioValue] = useState(0)
  const [totalPL, setTotalPL] = useState(0)
  const [totalPLPercent, setTotalPLPercent] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [historicalData, setHistoricalData] = useState([])
  const [allocationData, setAllocationData] = useState([])

  // Calculate portfolio metrics
  useEffect(() => {
    // Calculate portfolio value
    const positionsValue = positions.reduce((total, position) => {
      return total + position.shares * position.currentPrice
    }, 0)
    const totalValue = positionsValue + balance
    setPortfolioValue(totalValue)

    // Calculate total P/L
    const totalProfit = positions.reduce((total, position) => {
      const positionValue = position.shares * position.currentPrice
      const costBasis = position.shares * position.avgPrice
      return total + (positionValue - costBasis)
    }, 0)
    setTotalPL(totalProfit)

    // Calculate P/L percent
    const costBasis = positions.reduce((total, position) => {
      return total + position.shares * position.avgPrice
    }, 0)
    setTotalPLPercent(costBasis > 0 ? (totalProfit / costBasis) * 100 : 0)

    // Generate historical data
    generateHistoricalData()

    // Generate allocation data
    const allocations = positions.map((position) => ({
      name: position.symbol,
      value: position.shares * position.currentPrice,
    }))
    allocations.push({ name: "Cash", value: balance })
    setAllocationData(allocations)

    setIsLoading(false)
  }, [positions, balance])

  // Generate historical portfolio data
  const generateHistoricalData = () => {
    const data = []
    const now = new Date("2025-03-27T21:11:23")
    const startValue = portfolioValue * 0.9 // Start at 90% of current value
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

    // Make sure the last value matches the current portfolio value
    if (data.length > 0) {
      data[data.length - 1].value = portfolioValue
    }

    setHistoricalData(data)
  }

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  // Live updates for positions
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLoading) {
        const updatedPositions = positions.map((position) => {
          const priceChange = position.currentPrice * (Math.random() * 0.01 - 0.005) // -0.5% to +0.5%
          const newPrice = position.currentPrice + priceChange
          const newChange = position.change + (Math.random() * 0.2 - 0.1) // Small adjustment to change percentage

          return {
            ...position,
            currentPrice: newPrice,
            change: Number(newChange.toFixed(2)),
          }
        })

        setPositions(updatedPositions)
      }
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [positions, isLoading])

  // Colors for pie chart
  const COLORS = ["#00DC82", "#0088FE", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-black/60 border-white/10 overflow-hidden group hover:border-[#00DC82]/30 transition-all duration-300 md:col-span-2">
          <CardHeader className="p-4">
            <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-[#00DC82]" />
              Portfolio Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
              <div>
                <div className="text-2xl font-bold">{formatCurrency(portfolioValue)}</div>
                <div className={`flex items-center ${totalPL >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {totalPL >= 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                  <span>
                    {formatCurrency(Math.abs(totalPL))} ({Math.abs(totalPLPercent).toFixed(2)}%)
                  </span>
                </div>
                <div className="text-xs text-white/60 mt-1">Live updates every 5 seconds</div>
              </div>

              <div className="flex items-center gap-2 bg-black/40 rounded-lg p-2 border border-white/10">
                <DollarSign className="h-5 w-5 text-[#00DC82]" />
                <div>
                  <div className="text-sm">Cash Balance</div>
                  <div className="font-bold">{formatCurrency(balance)}</div>
                </div>
              </div>
            </div>

            <div className="h-64 relative">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <RefreshCw className="h-8 w-8 animate-spin text-[#00DC82]" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={historicalData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00DC82" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#00DC82" stopOpacity={0} />
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
                    {stat.isPositive ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
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

        <Card className="bg-black/60 border-white/10 overflow-hidden group hover:border-[#00DC82]/30 transition-all duration-300">
          <CardHeader className="p-4">
            <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-[#00DC82]" />
              Asset Allocation
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {isLoading ? (
              <div className="h-64 flex items-center justify-center">
                <RefreshCw className="h-8 w-8 animate-spin text-[#00DC82]" />
              </div>
            ) : (
              <>
                <div className="h-64 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={allocationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {allocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [formatCurrency(value), "Value"]}
                        contentStyle={{
                          backgroundColor: "rgba(0,0,0,0.8)",
                          border: "1px solid #00DC82",
                          borderRadius: "8px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2">
                  <div className="text-sm font-medium mb-2">Holdings</div>
                  <div className="space-y-1">
                    {allocationData.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-1">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          ></div>
                          <span>{item.name}</span>
                        </div>
                        <span>{formatCurrency(item.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-black/60 border-white/10 overflow-hidden group hover:border-[#00DC82]/30 transition-all duration-300">
        <CardHeader className="p-4">
          <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Your Positions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {positions.length === 0 ? (
            <div className="text-center py-8 text-white/50">
              <div className="mb-2">No positions yet</div>
              <div className="text-sm">Start trading to build your portfolio</div>
            </div>
          ) : (
            <div className="space-y-3">
              {positions.map((position) => {
                const marketValue = position.shares * position.currentPrice
                const costBasis = position.shares * position.avgPrice
                const pl = marketValue - costBasis
                const plPercent = (pl / costBasis) * 100

                return (
                  <div
                    key={position.symbol}
                    className="bg-black/40 border border-white/10 rounded-lg p-3 hover:border-[#00DC82]/30 transition-all duration-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold flex items-center gap-1">
                          {position.symbol}
                          {position.change >= 0 ? (
                            <TrendingUp className="h-3 w-3 text-green-500" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-500" />
                          )}
                        </div>
                        <div className="text-sm text-white/70">{position.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{formatCurrency(marketValue)}</div>
                        <div className={`text-sm ${pl >= 0 ? "text-green-500" : "text-red-500"}`}>
                          {pl >= 0 ? "+" : ""}
                          {formatCurrency(pl)} ({Math.abs(plPercent).toFixed(2)}%)
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-2 text-xs text-white/70">
                      <div>
                        <div>Shares</div>
                        <div className="font-medium text-white">{position.shares}</div>
                      </div>
                      <div>
                        <div>Avg Price</div>
                        <div className="font-medium text-white">{formatCurrency(position.avgPrice)}</div>
                      </div>
                      <div>
                        <div>Current Price</div>
                        <div className="font-medium text-white">{formatCurrency(position.currentPrice)}</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <PortfolioPredictions />

      <TopPredictions />
    </div>
  )
}

