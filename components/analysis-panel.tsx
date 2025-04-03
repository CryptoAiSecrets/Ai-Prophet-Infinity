"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { Search, RefreshCw, TrendingUp, TrendingDown, BarChart2, PieChart, LineChartIcon } from "lucide-react"

export function AnalysisPanel() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [activeTab, setActiveTab] = useState("technical")
  const [selectedStock, setSelectedStock] = useState<any>(null)

  // Mock stock data
  const stockOptions = [
    { symbol: "AAPL", name: "Apple Inc.", price: 182.52, change: 1.25 },
    { symbol: "MSFT", name: "Microsoft Corp.", price: 337.18, change: 2.34 },
    { symbol: "GOOGL", name: "Alphabet Inc.", price: 131.86, change: -0.75 },
    { symbol: "AMZN", name: "Amazon.com Inc.", price: 127.74, change: 1.05 },
    { symbol: "NVDA", name: "NVIDIA Corp.", price: 416.1, change: 5.23 },
    { symbol: "META", name: "Meta Platforms Inc.", price: 297.74, change: -1.32 },
    { symbol: "TSLA", name: "Tesla Inc.", price: 237.49, change: -3.21 },
  ]

  // Filter stocks based on search query
  const filteredStocks = searchQuery
    ? stockOptions.filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          stock.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : stockOptions

  // Handle stock selection
  const handleSelectStock = (stock: any) => {
    setIsAnalyzing(true)
    setSelectedStock(stock)

    // Simulate analysis delay
    setTimeout(() => {
      setIsAnalyzing(false)
    }, 1500)
  }

  // Generate mock technical analysis data
  const generateTechnicalData = () => {
    const data = []
    const now = new Date()
    const baseValue = selectedStock?.price || 100

    for (let i = 30; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)

      // Create realistic price movements
      const volatility = 0.02 // 2% volatility
      const randomChange = (Math.random() * 2 - 1) * volatility
      const value = baseValue * (1 + (randomChange * i) / 10)

      // Add some technical indicators
      const sma20 = baseValue * (1 + (randomChange * i) / 15)
      const sma50 = baseValue * (1 + (randomChange * i) / 20)
      const volume = Math.round(1000000 + Math.random() * 5000000)

      data.push({
        date: date.toLocaleDateString(),
        price: Number(value.toFixed(2)),
        sma20: Number(sma20.toFixed(2)),
        sma50: Number(sma50.toFixed(2)),
        volume,
      })
    }

    return data
  }

  // Generate mock fundamental analysis data
  const generateFundamentalData = () => {
    return {
      pe: (15 + Math.random() * 25).toFixed(2),
      eps: (2 + Math.random() * 8).toFixed(2),
      marketCap: `$${(100 + Math.random() * 900).toFixed(2)}B`,
      dividend: (Math.random() * 3).toFixed(2) + "%",
      revenue: [
        { year: "2019", value: 50 + Math.random() * 20 },
        { year: "2020", value: 55 + Math.random() * 25 },
        { year: "2021", value: 65 + Math.random() * 30 },
        { year: "2022", value: 75 + Math.random() * 35 },
        { year: "2023", value: 85 + Math.random() * 40 },
      ],
      profitMargin: [
        { year: "2019", value: 10 + Math.random() * 10 },
        { year: "2020", value: 12 + Math.random() * 10 },
        { year: "2021", value: 15 + Math.random() * 10 },
        { year: "2022", value: 17 + Math.random() * 10 },
        { year: "2023", value: 20 + Math.random() * 10 },
      ],
    }
  }

  // Generate mock sentiment analysis data
  const generateSentimentData = () => {
    return {
      overall: (Math.random() * 100).toFixed(0),
      social: (Math.random() * 100).toFixed(0),
      news: (Math.random() * 100).toFixed(0),
      institutional: (Math.random() * 100).toFixed(0),
      sentiment: [
        { name: "Very Negative", value: Math.round(Math.random() * 10) },
        { name: "Negative", value: Math.round(Math.random() * 20) },
        { name: "Neutral", value: Math.round(Math.random() * 30) },
        { name: "Positive", value: Math.round(Math.random() * 25) },
        { name: "Very Positive", value: Math.round(Math.random() * 15) },
      ],
      timeline: Array.from({ length: 14 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (13 - i))
        return {
          date: date.toLocaleDateString(),
          sentiment: 30 + Math.random() * 40,
        }
      }),
    }
  }

  const technicalData = selectedStock ? generateTechnicalData() : []
  const fundamentalData = selectedStock ? generateFundamentalData() : null
  const sentimentData = selectedStock ? generateSentimentData() : null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-300">
          Market Analysis
        </h2>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className={`border-white/10 ${activeTab === "technical" ? "bg-blue-500/20 border-blue-500/50 text-blue-300" : ""}`}
            onClick={() => setActiveTab("technical")}
          >
            <LineChartIcon className="h-4 w-4 mr-1" />
            Technical
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`border-white/10 ${activeTab === "fundamental" ? "bg-blue-500/20 border-blue-500/50 text-blue-300" : ""}`}
            onClick={() => setActiveTab("fundamental")}
          >
            <BarChart2 className="h-4 w-4 mr-1" />
            Fundamental
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`border-white/10 ${activeTab === "sentiment" ? "bg-blue-500/20 border-blue-500/50 text-blue-300" : ""}`}
            onClick={() => setActiveTab("sentiment")}
          >
            <PieChart className="h-4 w-4 mr-1" />
            Sentiment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Stock Search Panel */}
        <div className="md:col-span-1">
          <Card className="bg-black/40 border-white/10">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                  <Input
                    type="text"
                    placeholder="Search stocks..."
                    className="pl-8 bg-white/5 border-white/10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                  {filteredStocks.map((stock) => (
                    <Button
                      key={stock.symbol}
                      variant="outline"
                      className={`w-full justify-between border-white/10 hover:bg-blue-500/10 hover:border-blue-500/30 ${
                        selectedStock?.symbol === stock.symbol ? "bg-blue-500/20 border-blue-500/50" : ""
                      }`}
                      onClick={() => handleSelectStock(stock)}
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-bold">{stock.symbol}</span>
                        <span className="text-xs text-white/70">{stock.name}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span>${stock.price}</span>
                        <span className={`text-xs ${stock.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                          {stock.change >= 0 ? "+" : ""}
                          {stock.change}%
                        </span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analysis Panel */}
        <div className="md:col-span-2">
          {!selectedStock ? (
            <Card className="bg-black/40 border-white/10 h-full">
              <CardContent className="p-4 flex flex-col items-center justify-center h-[400px] text-white/50">
                <BarChart2 className="h-16 w-16 mb-4 opacity-30" />
                <p className="text-lg mb-2">Select a stock to analyze</p>
                <p className="text-sm text-center max-w-md">
                  Choose a stock from the list to view detailed technical, fundamental, and sentiment analysis.
                </p>
              </CardContent>
            </Card>
          ) : isAnalyzing ? (
            <Card className="bg-black/40 border-white/10 h-full">
              <CardContent className="p-4 flex flex-col items-center justify-center h-[400px]">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
                  <div className="absolute inset-2 bg-blue-500/40 rounded-full animate-pulse"></div>
                  <RefreshCw className="relative h-12 w-12 animate-spin text-blue-500" />
                </div>
                <p className="mt-6 text-lg">Analyzing {selectedStock.symbol}</p>
                <p className="text-sm text-white/50 mt-2">Gathering market data and running AI analysis...</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-black/40 border-white/10">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-bold">{selectedStock.symbol}</h3>
                    <p className="text-sm text-white/70">{selectedStock.name}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">${selectedStock.price}</div>
                    <div
                      className={`flex items-center justify-end ${selectedStock.change >= 0 ? "text-green-500" : "text-red-500"}`}
                    >
                      {selectedStock.change >= 0 ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      <span>
                        {selectedStock.change >= 0 ? "+" : ""}
                        {selectedStock.change}%
                      </span>
                    </div>
                  </div>
                </div>

                <Tabs defaultValue="technical" value={activeTab} onValueChange={setActiveTab}>
                  <TabsContent value="technical" className="mt-0">
                    <div className="space-y-4">
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={technicalData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="date" stroke="#666" />
                            <YAxis stroke="#666" />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "rgba(0,0,0,0.8)",
                                border: "1px solid #3b82f6",
                                borderRadius: "8px",
                              }}
                            />
                            <Line
                              type="monotone"
                              dataKey="price"
                              stroke="#3b82f6"
                              strokeWidth={2}
                              dot={false}
                              activeDot={{ r: 8 }}
                            />
                            <Line
                              type="monotone"
                              dataKey="sma20"
                              stroke="#10b981"
                              strokeWidth={1.5}
                              strokeDasharray="5 5"
                              dot={false}
                            />
                            <Line
                              type="monotone"
                              dataKey="sma50"
                              stroke="#f59e0b"
                              strokeWidth={1.5}
                              strokeDasharray="3 3"
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {[
                          { label: "RSI (14)", value: (30 + Math.random() * 40).toFixed(2) },
                          { label: "MACD", value: (Math.random() * 2 - 1).toFixed(2) },
                          {
                            label: "Bollinger",
                            value: `${(selectedStock.price * 0.95).toFixed(2)} - ${(selectedStock.price * 1.05).toFixed(2)}`,
                          },
                          { label: "Volume", value: `${(1 + Math.random() * 10).toFixed(1)}M` },
                        ].map((indicator, index) => (
                          <div key={index} className="bg-black/40 rounded-lg p-2 border border-white/10">
                            <div className="text-xs text-white/70">{indicator.label}</div>
                            <div className="font-medium">{indicator.value}</div>
                          </div>
                        ))}
                      </div>

                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                        <h4 className="text-sm font-medium text-blue-300 mb-1">Technical Analysis</h4>
                        <p className="text-sm">
                          {selectedStock.symbol} is currently showing {Math.random() > 0.5 ? "bullish" : "bearish"}{" "}
                          momentum with key resistance at ${(selectedStock.price * 1.1).toFixed(2)} and support at $
                          {(selectedStock.price * 0.9).toFixed(2)}. The 20-day SMA is{" "}
                          {Math.random() > 0.5 ? "above" : "below"} the 50-day SMA, indicating a potential{" "}
                          {Math.random() > 0.5 ? "uptrend" : "downtrend"}.
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="fundamental" className="mt-0">
                    {fundamentalData && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {[
                            { label: "P/E Ratio", value: fundamentalData.pe },
                            { label: "EPS", value: `$${fundamentalData.eps}` },
                            { label: "Market Cap", value: fundamentalData.marketCap },
                            { label: "Dividend", value: fundamentalData.dividend },
                          ].map((metric, index) => (
                            <div key={index} className="bg-black/40 rounded-lg p-2 border border-white/10">
                              <div className="text-xs text-white/70">{metric.label}</div>
                              <div className="font-medium">{metric.value}</div>
                            </div>
                          ))}
                        </div>

                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={fundamentalData.revenue}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                              <XAxis dataKey="year" stroke="#666" />
                              <YAxis stroke="#666" />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "rgba(0,0,0,0.8)",
                                  border: "1px solid #3b82f6",
                                  borderRadius: "8px",
                                }}
                                formatter={(value) => [`$${value}B`, "Revenue"]}
                              />
                              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                          <h4 className="text-sm font-medium text-blue-300 mb-1">Fundamental Analysis</h4>
                          <p className="text-sm">
                            {selectedStock.symbol} shows {Math.random() > 0.5 ? "strong" : "moderate"} fundamentals with{" "}
                            {Math.random() > 0.5 ? "increasing" : "stable"} revenue growth. The P/E ratio of{" "}
                            {fundamentalData.pe} is {Number(fundamentalData.pe) > 20 ? "above" : "below"} industry
                            average, suggesting the stock is{" "}
                            {Number(fundamentalData.pe) > 20 ? "potentially overvalued" : "potentially undervalued"}{" "}
                            based on earnings.
                          </p>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="sentiment" className="mt-0">
                    {sentimentData && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {[
                            { label: "Overall Sentiment", value: `${sentimentData.overall}/100` },
                            { label: "Social Media", value: `${sentimentData.social}/100` },
                            { label: "News Sentiment", value: `${sentimentData.news}/100` },
                            { label: "Institutional", value: `${sentimentData.institutional}/100` },
                          ].map((metric, index) => (
                            <div key={index} className="bg-black/40 rounded-lg p-2 border border-white/10">
                              <div className="text-xs text-white/70">{metric.label}</div>
                              <div className="font-medium">{metric.value}</div>
                            </div>
                          ))}
                        </div>

                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={sentimentData.timeline}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                              <XAxis dataKey="date" stroke="#666" />
                              <YAxis domain={[0, 100]} stroke="#666" />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "rgba(0,0,0,0.8)",
                                  border: "1px solid #3b82f6",
                                  borderRadius: "8px",
                                }}
                                formatter={(value) => [`${value}/100`, "Sentiment"]}
                              />
                              <Line
                                type="monotone"
                                dataKey="sentiment"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 8 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                          <h4 className="text-sm font-medium text-blue-300 mb-1">Sentiment Analysis</h4>
                          <p className="text-sm">
                            {selectedStock.symbol} is currently experiencing{" "}
                            {Number(sentimentData.overall) > 50 ? "positive" : "mixed"} sentiment across social media
                            and news sources. Institutional investors are showing{" "}
                            {Number(sentimentData.institutional) > 60 ? "strong interest" : "cautious positioning"} in
                            the stock. Recent news coverage has been{" "}
                            {Number(sentimentData.news) > 50 ? "favorable" : "neutral to negative"}.
                          </p>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

