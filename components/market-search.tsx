"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, RefreshCw, ArrowUp, ArrowDown } from "lucide-react"

// Mock API for market data search
const mockMarketSearch = async (query: string) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Generate mock results based on query
  const results = [
    {
      symbol: query.toUpperCase(),
      name: `${query.toUpperCase()} Corporation`,
      price: Math.round(Math.random() * 500 + 10),
      change: (Math.random() * 6 - 3).toFixed(2),
    },
    {
      symbol: `${query.substring(0, 1).toUpperCase()}LTX`,
      name: `${query.substring(0, 1).toUpperCase()}LTX Industries Ltd.`,
      price: Math.round(Math.random() * 200 + 20),
      change: (Math.random() * 6 - 3).toFixed(2),
    },
    {
      symbol: `${query.substring(0, 2).toUpperCase()}RK`,
      name: `${query.substring(0, 2).toUpperCase()}RK Group Inc.`,
      price: Math.round(Math.random() * 300 + 15),
      change: (Math.random() * 6 - 3).toFixed(2),
    },
  ]

  return results
}

export function MarketSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedStock, setSelectedStock] = useState(null)
  const [historicalData, setHistoricalData] = useState([])

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const results = await mockMarketSearch(searchQuery)
      setSearchResults(results)
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const loadStockData = async (stock) => {
    setSelectedStock(stock)

    // Generate mock historical data
    const days = 30
    const data = []
    let price = stock.price

    for (let i = days; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)

      // Create slightly random price fluctuations with a trend
      const change = (Math.random() * 2 - 1) * (stock.change > 0 ? 1.5 : 0.8)
      price = price + (price * change) / 100

      data.push({
        date: date.toLocaleDateString(),
        price: price.toFixed(2),
      })
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

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
          <Input
            type="text"
            placeholder="Search any market symbol..."
            className="pl-8 bg-white/5 border-white/10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <Button
          onClick={handleSearch}
          disabled={isSearching || !searchQuery.trim()}
          className="bg-gradient-to-r from-[#00DC82] to-[#36e4da] text-black hover:from-[#00b86b] hover:to-[#2bc0b8] shadow-md shadow-[#00DC82]/20"
        >
          {isSearching ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Search"}
        </Button>
      </div>

      {searchResults.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Search Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {searchResults.map((stock) => (
              <Button
                key={stock.symbol}
                variant="outline"
                className="bg-black/40 border-white/10 p-3 flex flex-col items-start h-auto"
                onClick={() => loadStockData(stock)}
              >
                <div className="flex justify-between items-start w-full">
                  <div>
                    <div className="font-bold">{stock.symbol}</div>
                    <div className="text-sm text-white/70">{stock.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{formatCurrency(stock.price)}</div>
                    <div className={`text-sm ${Number(stock.change) >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {Number(stock.change) >= 0 ? "+" : ""}
                      {stock.change}%
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}

      {selectedStock && (
        <Card className="bg-black/40 border-white/10 mt-6">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold">{selectedStock.symbol}</h2>
                <p className="text-white/70">{selectedStock.name}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{formatCurrency(selectedStock.price)}</div>
                <div
                  className={`flex items-center justify-end text-lg ${Number(selectedStock.change) >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {Number(selectedStock.change) >= 0 ? (
                    <ArrowUp className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDown className="h-4 w-4 mr-1" />
                  )}
                  {Number(selectedStock.change) >= 0 ? "+" : ""}
                  {selectedStock.change}%
                </div>
              </div>
            </div>

            <div className="h-64 bg-black/50 rounded-lg p-4 relative">
              {/* Simple chart visualization */}
              <div className="absolute inset-0 flex items-end">
                {historicalData.map((day, index) => {
                  const height = `${Math.min(80, (Number(day.price) / (selectedStock.price * 1.2)) * 100)}%`
                  const color = Number(selectedStock.change) >= 0 ? "bg-green-500/70" : "bg-red-500/70"
                  return (
                    <div key={index} className="flex-1" style={{ height: "100%" }}>
                      <div
                        className={`w-full ${color} rounded-t-sm mx-px transition-all duration-300`}
                        style={{ height }}
                      ></div>
                    </div>
                  )
                })}
              </div>

              <div className="absolute bottom-2 left-2 text-xs text-white/50">30 Day Historical Data (Simulated)</div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div>
                <div className="text-sm text-white/70">30d High</div>
                <div className="font-medium">{formatCurrency(selectedStock.price * 1.15)}</div>
              </div>
              <div>
                <div className="text-sm text-white/70">30d Low</div>
                <div className="font-medium">{formatCurrency(selectedStock.price * 0.85)}</div>
              </div>
              <div>
                <div className="text-sm text-white/70">Volume</div>
                <div className="font-medium">{(Math.random() * 10 + 1).toFixed(2)}M</div>
              </div>
              <div>
                <div className="text-sm text-white/70">Market Cap</div>
                <div className="font-medium">${(Math.random() * 100 + 10).toFixed(2)}B</div>
              </div>
            </div>

            <Button
              className="mt-4 w-full bg-gradient-to-r from-[#00DC82] to-[#36e4da] text-black hover:from-[#00b86b] hover:to-[#2bc0b8] shadow-md shadow-[#00DC82]/20"
              onClick={() => {
                setSelectedStock(null)
                setHistoricalData([])
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Search Another Stock
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

