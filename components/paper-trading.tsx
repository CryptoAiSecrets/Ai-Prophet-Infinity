"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUp, ArrowDown, DollarSign, TrendingUp, TrendingDown, Search, Plus, RefreshCw } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

// Mock data for paper trading account
const initialBalance = 5000 // Changed to $5,000 starting balance
const initialPositions = [
  { symbol: "AAPL", name: "Apple Inc.", shares: 5, avgPrice: 182.52, currentPrice: 187.3, change: 2.62 },
  { symbol: "MSFT", name: "Microsoft Corp.", shares: 2, avgPrice: 337.18, currentPrice: 345.24, change: 2.39 },
  { symbol: "GOOGL", name: "Alphabet Inc.", shares: 3, avgPrice: 131.86, currentPrice: 129.82, change: -1.55 },
]

// Mock stock search results
const searchResults = [
  { symbol: "TSLA", name: "Tesla Inc.", price: 237.49, change: -1.21 },
  { symbol: "META", name: "Meta Platforms Inc.", price: 297.74, change: 1.32 },
  { symbol: "JPM", name: "JPMorgan Chase & Co.", price: 146.77, change: 0.87 },
  { symbol: "V", name: "Visa Inc.", price: 235.44, change: 0.54 },
  { symbol: "WMT", name: "Walmart Inc.", price: 157.82, change: 1.23 },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 127.74, change: 2.76 },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: 416.1, change: 5.15 },
  { symbol: "PYPL", name: "PayPal Holdings Inc.", price: 67.42, change: -0.89 },
  { symbol: "NFLX", name: "Netflix Inc.", price: 632.15, change: 1.54 },
  { symbol: "DIS", name: "Walt Disney Co.", price: 105.18, change: 0.32 },
]

export function PaperTrading() {
  const [positions, setPositions] = useState(initialPositions)
  const [balance, setBalance] = useState(initialBalance)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStock, setSelectedStock] = useState(null)
  const [tradeAmount, setTradeAmount] = useState("")
  const [tradeShares, setTradeShares] = useState("")
  const [tradeType, setTradeType] = useState("buy")

  // Calculate total portfolio value
  const calculatePortfolioValue = () => {
    const positionsValue = positions.reduce((total, position) => {
      return total + position.shares * position.currentPrice
    }, 0)
    return positionsValue + balance
  }

  const portfolioValue = calculatePortfolioValue()

  // Calculate total P/L
  const calculateTotalPL = () => {
    return positions.reduce((total, position) => {
      const positionValue = position.shares * position.currentPrice
      const costBasis = position.shares * position.avgPrice
      return total + (positionValue - costBasis)
    }, 0)
  }

  const totalPL = calculateTotalPL()
  const totalPLPercent = (totalPL / (portfolioValue - totalPL - balance)) * 100

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  // Handle trade execution
  const executeTrade = () => {
    if (!selectedStock) return

    const shares = Number(tradeShares)
    if (isNaN(shares) || shares <= 0) return

    if (tradeType === "buy") {
      const cost = shares * selectedStock.price
      if (cost > balance) return // Insufficient funds

      // Check if we already own this stock
      const existingPosition = positions.find((p) => p.symbol === selectedStock.symbol)

      if (existingPosition) {
        // Update existing position
        const newPositions = positions.map((p) => {
          if (p.symbol === selectedStock.symbol) {
            const totalShares = p.shares + shares
            const totalCost = p.shares * p.avgPrice + shares * selectedStock.price
            const newAvgPrice = totalCost / totalShares

            return {
              ...p,
              shares: totalShares,
              avgPrice: newAvgPrice,
            }
          }
          return p
        })

        setPositions(newPositions)
      } else {
        // Add new position
        setPositions([
          ...positions,
          {
            symbol: selectedStock.symbol,
            name: selectedStock.name,
            shares: shares,
            avgPrice: selectedStock.price,
            currentPrice: selectedStock.price,
            change: selectedStock.change,
          },
        ])
      }

      // Deduct from balance
      setBalance(balance - cost)
    } else {
      // Sell
      const existingPosition = positions.find((p) => p.symbol === selectedStock.symbol)
      if (!existingPosition || existingPosition.shares < shares) return // Can't sell what you don't have

      const proceeds = shares * selectedStock.price

      if (existingPosition.shares === shares) {
        // Sell entire position
        setPositions(positions.filter((p) => p.symbol !== selectedStock.symbol))
      } else {
        // Sell partial position
        setPositions(
          positions.map((p) => {
            if (p.symbol === selectedStock.symbol) {
              return {
                ...p,
                shares: p.shares - shares,
              }
            }
            return p
          }),
        )
      }

      // Add to balance
      setBalance(balance + proceeds)
    }

    // Reset form
    setSelectedStock(null)
    setTradeShares("")
  }

  // Filter search results
  const filteredResults = searchQuery
    ? searchResults.filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          stock.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : searchResults

  return (
    <Card className="bg-black/60 border-white/10 overflow-hidden group hover:border-[#00DC82]/30 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-[#00DC82]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <CardHeader className="relative flex flex-row items-center justify-between">
        <div>
          <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-[#00DC82]" />
            Paper Trading Account
          </CardTitle>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold">{formatCurrency(portfolioValue)}</span>
            <span className={`flex items-center text-sm ${totalPL >= 0 ? "text-green-500" : "text-red-500"}`}>
              {totalPL >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
              {formatCurrency(Math.abs(totalPL))} ({Math.abs(totalPLPercent).toFixed(2)}%)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                className="bg-gradient-to-r from-[#00DC82] to-[#36e4da] text-black hover:from-[#00b86b] hover:to-[#2bc0b8] shadow-md shadow-[#00DC82]/20"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Trade
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black/90 border-white/20 text-white">
              <DialogHeader>
                <DialogTitle>Paper Trade</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                  <input
                    type="text"
                    placeholder="Search for a stock..."
                    className="w-full bg-white/5 border border-white/10 rounded-md pl-8 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#00DC82]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="max-h-60 overflow-y-auto space-y-2">
                  {filteredResults.map((stock) => (
                    <div
                      key={stock.symbol}
                      className={`p-2 rounded-md cursor-pointer flex justify-between items-center ${
                        selectedStock?.symbol === stock.symbol
                          ? "bg-[#00DC82]/20 border border-[#00DC82]/50"
                          : "hover:bg-white/5"
                      }`}
                      onClick={() => setSelectedStock(stock)}
                    >
                      <div>
                        <div className="font-bold">{stock.symbol}</div>
                        <div className="text-sm text-white/70">{stock.name}</div>
                      </div>
                      <div className="text-right">
                        <div>{formatCurrency(stock.price)}</div>
                        <div className={`text-sm ${stock.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                          {stock.change >= 0 ? "+" : ""}
                          {stock.change}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedStock && (
                  <div className="space-y-4 border-t border-white/10 pt-4">
                    <div className="flex justify-between">
                      <div className="font-bold">{selectedStock.symbol}</div>
                      <div>{formatCurrency(selectedStock.price)}</div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className={`flex-1 ${tradeType === "buy" ? "bg-green-500/20 border-green-500/50 text-green-500" : ""}`}
                        onClick={() => setTradeType("buy")}
                      >
                        Buy
                      </Button>
                      <Button
                        variant="outline"
                        className={`flex-1 ${tradeType === "sell" ? "bg-red-500/20 border-red-500/50 text-red-500" : ""}`}
                        onClick={() => setTradeType("sell")}
                      >
                        Sell
                      </Button>
                    </div>

                    <div>
                      <label className="text-sm text-white/70 block mb-1">Shares</label>
                      <input
                        type="number"
                        className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#00DC82]"
                        value={tradeShares}
                        onChange={(e) => setTradeShares(e.target.value)}
                        min="1"
                        step="1"
                      />
                    </div>

                    {tradeShares && !isNaN(Number(tradeShares)) && (
                      <div className="flex justify-between text-sm">
                        <span>Estimated {tradeType === "buy" ? "Cost" : "Proceeds"}</span>
                        <span>{formatCurrency(Number(tradeShares) * selectedStock.price)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm">
                      <span>Available Cash</span>
                      <span>{formatCurrency(balance)}</span>
                    </div>

                    <Button
                      className="w-full bg-gradient-to-r from-[#00DC82] to-[#36e4da] text-black hover:from-[#00b86b] hover:to-[#2bc0b8] shadow-md shadow-[#00DC82]/20"
                      onClick={executeTrade}
                      disabled={
                        !selectedStock || !tradeShares || isNaN(Number(tradeShares)) || Number(tradeShares) <= 0
                      }
                    >
                      {tradeType === "buy" ? "Buy" : "Sell"} {tradeShares} {selectedStock.symbol}
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/10 hover:text-white">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="relative">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-white/70 border-b border-white/10 pb-2">
            <span>Cash Balance</span>
            <span>{formatCurrency(balance)}</span>
          </div>

          <div className="space-y-4">
            <div className="text-sm font-medium">Your Positions</div>

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
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

