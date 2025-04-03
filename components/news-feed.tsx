"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, TrendingUp, TrendingDown, RefreshCw, Newspaper, Globe, Lightbulb } from "lucide-react"

interface NewsItem {
  id: string
  title: string
  source: string
  url: string
  timestamp: string
  sentiment: "positive" | "negative" | "neutral"
  category: "market" | "stocks" | "crypto" | "economy"
  aiInsight?: string
}

export function NewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("all")
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const failedUpdatesRef = useRef(0)

  // Generate mock news data
  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true)

      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Base date for all news items
        const baseDate = new Date("2025-03-27T21:11:23")

        // Mock news data
        const mockNews: NewsItem[] = [
          {
            id: "1",
            title: "Federal Reserve signals potential rate cuts in coming months",
            source: "Financial Times",
            url: "#",
            timestamp: new Date(baseDate.getTime() - 2 * 60 * 60 * 1000).toISOString(),
            sentiment: "positive",
            category: "economy",
            aiInsight: "This could positively impact growth stocks and reduce borrowing costs for companies.",
          },
          {
            id: "2",
            title: "Tech stocks rally as AI investments continue to drive market gains",
            source: "Wall Street Journal",
            url: "#",
            timestamp: new Date(baseDate.getTime() - 5 * 60 * 60 * 1000).toISOString(),
            sentiment: "positive",
            category: "stocks",
            aiInsight: "AI-focused companies are showing strong momentum with potential for continued growth.",
          },
          {
            id: "3",
            title: "Bitcoin faces resistance at $65,000 as market sentiment shifts",
            source: "CoinDesk",
            url: "#",
            timestamp: new Date(baseDate.getTime() - 8 * 60 * 60 * 1000).toISOString(),
            sentiment: "negative",
            category: "crypto",
            aiInsight: "Technical indicators suggest a potential short-term correction before resuming uptrend.",
          },
          {
            id: "4",
            title: "Inflation data shows cooling consumer prices, boosting market outlook",
            source: "Bloomberg",
            url: "#",
            timestamp: new Date(baseDate.getTime() - 12 * 60 * 60 * 1000).toISOString(),
            sentiment: "positive",
            category: "economy",
            aiInsight: "Lower inflation could reduce pressure on the Fed to maintain high interest rates.",
          },
          {
            id: "5",
            title: "Oil prices drop amid concerns over global demand slowdown",
            source: "Reuters",
            url: "#",
            timestamp: new Date(baseDate.getTime() - 16 * 60 * 60 * 1000).toISOString(),
            sentiment: "negative",
            category: "market",
            aiInsight:
              "Energy sector may face headwinds, but could benefit transportation and consumer discretionary stocks.",
          },
          {
            id: "6",
            title: "Major retailer exceeds earnings expectations, shares surge 8%",
            source: "CNBC",
            url: "#",
            timestamp: new Date(baseDate.getTime() - 20 * 60 * 60 * 1000).toISOString(),
            sentiment: "positive",
            category: "stocks",
            aiInsight: "Consumer spending remains resilient despite economic concerns, positive for retail sector.",
          },
          {
            id: "7",
            title: "Ethereum upgrade scheduled for next quarter, promising improved scalability",
            source: "CryptoNews",
            url: "#",
            timestamp: new Date(baseDate.getTime() - 24 * 60 * 60 * 1000).toISOString(),
            sentiment: "positive",
            category: "crypto",
            aiInsight: "Technical improvements could drive increased adoption and transaction volume.",
          },
          {
            id: "8",
            title: "Housing market shows signs of cooling as mortgage rates remain elevated",
            source: "Housing Wire",
            url: "#",
            timestamp: new Date(baseDate.getTime() - 36 * 60 * 60 * 1000).toISOString(),
            sentiment: "negative",
            category: "economy",
            aiInsight: "Real estate sector may face challenges, but potential rate cuts could provide relief.",
          },
        ]

        setNews(mockNews)
        failedUpdatesRef.current = 0
        setIsInitialLoad(false)
      } catch (error) {
        console.error("Failed to fetch news:", error)
        failedUpdatesRef.current += 1

        // If we've failed multiple times, generate backup news
        if (failedUpdatesRef.current > 2) {
          generateBackupNews()
        }
      } finally {
        setIsLoading(false)
      }
    }

    const generateBackupNews = () => {
      console.log("Generating backup news")
      const baseDate = new Date("2025-03-27T21:11:23")

      // Create simple backup news
      const backupNews: NewsItem[] = [
        {
          id: "backup-1",
          title: "Markets continue to show volatility amid economic uncertainty",
          source: "Market Watch",
          url: "#",
          timestamp: new Date(baseDate.getTime() - 1 * 60 * 60 * 1000).toISOString(),
          sentiment: "neutral",
          category: "market",
        },
        {
          id: "backup-2",
          title: "Tech sector leads gains in today's trading session",
          source: "Financial News",
          url: "#",
          timestamp: new Date(baseDate.getTime() - 3 * 60 * 60 * 1000).toISOString(),
          sentiment: "positive",
          category: "stocks",
        },
        {
          id: "backup-3",
          title: "Cryptocurrency markets show signs of recovery",
          source: "Crypto Daily",
          url: "#",
          timestamp: new Date(baseDate.getTime() - 6 * 60 * 60 * 1000).toISOString(),
          sentiment: "positive",
          category: "crypto",
        },
      ]

      setNews(backupNews)
      setIsInitialLoad(false)
    }

    fetchNews()

    // Set up interval to refresh news every 15 minutes
    const intervalId = setInterval(fetchNews, 15 * 60 * 1000)

    return () => {
      clearInterval(intervalId)
      if (updateIntervalRef.current) clearInterval(updateIntervalRef.current)
    }
  }, [])

  // Periodically add new news items to simulate live updates
  useEffect(() => {
    if (news.length === 0) return

    // Clear any existing interval
    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current)
    }

    updateIntervalRef.current = setInterval(() => {
      // 20% chance to add a new news item
      if (Math.random() < 0.2) {
        const baseDate = new Date()
        const categories = ["market", "stocks", "crypto", "economy"] as const
        const sentiments = ["positive", "negative", "neutral"] as const
        const sources = ["Bloomberg", "CNBC", "Reuters", "Wall Street Journal", "Financial Times"]

        const randomCategory = categories[Math.floor(Math.random() * categories.length)]
        const randomSentiment = sentiments[Math.floor(Math.random() * sentiments.length)]
        const randomSource = sources[Math.floor(Math.random() * sources.length)]

        const headlines = {
          market: [
            "Markets react to latest economic indicators",
            "Global markets show mixed signals",
            "Trading volume increases amid market uncertainty",
            "Market volatility reaches new highs",
          ],
          stocks: [
            "Tech stocks continue upward trend",
            "Retail sector shows signs of recovery",
            "Energy stocks face pressure from policy changes",
            "Financial stocks rally on interest rate news",
          ],
          crypto: [
            "Bitcoin tests new resistance levels",
            "Ethereum upgrade sparks investor interest",
            "Cryptocurrency adoption increases among institutions",
            "Regulatory clarity boosts crypto market sentiment",
          ],
          economy: [
            "Inflation data surprises economists",
            "Job market shows resilience despite challenges",
            "Consumer spending trends indicate economic strength",
            "Supply chain improvements boost economic outlook",
          ],
        }

        const randomHeadline = headlines[randomCategory][Math.floor(Math.random() * headlines[randomCategory].length)]

        const newItem: NewsItem = {
          id: `dynamic-${Date.now()}`,
          title: randomHeadline,
          source: randomSource,
          url: "#",
          timestamp: new Date().toISOString(),
          sentiment: randomSentiment,
          category: randomCategory,
          aiInsight:
            Math.random() > 0.5
              ? "Our AI analysis suggests this could impact market sentiment in the short term."
              : undefined,
        }

        setNews((prev) => [newItem, ...prev.slice(0, 19)]) // Keep max 20 items
      }
    }, 60000) // Check every minute

    return () => {
      if (updateIntervalRef.current) clearInterval(updateIntervalRef.current)
    }
  }, [news])

  // Filter news by category
  const filteredNews = activeCategory === "all" ? news : news.filter((item) => item.category === activeCategory)

  // Format relative time
  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 60) {
      return `${diffMins}m ago`
    } else if (diffMins < 24 * 60) {
      return `${Math.floor(diffMins / 60)}h ago`
    } else {
      return `${Math.floor(diffMins / (60 * 24))}d ago`
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-base md:text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          Financial News & Insights
        </h3>

        <Button
          variant="outline"
          size="sm"
          className="h-8 border-white/10 hover:bg-white/10 hover:text-white"
          onClick={() => {
            setIsLoading(true)
            setTimeout(() => setIsLoading(false), 1000)
          }}
        >
          {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="bg-black/40 border border-white/10 p-1 h-auto flex-wrap">
          <TabsTrigger
            value="all"
            className="text-xs h-7 data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-sm"
          >
            All News
          </TabsTrigger>
          <TabsTrigger
            value="market"
            className="text-xs h-7 data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-sm"
          >
            Markets
          </TabsTrigger>
          <TabsTrigger
            value="stocks"
            className="text-xs h-7 data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-sm"
          >
            Stocks
          </TabsTrigger>
          <TabsTrigger
            value="crypto"
            className="text-xs h-7 data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-sm"
          >
            Crypto
          </TabsTrigger>
          <TabsTrigger
            value="economy"
            className="text-xs h-7 data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-sm"
          >
            Economy
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeCategory} className="mt-2">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <RefreshCw className="h-8 w-8 animate-spin text-white/50" />
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-white/50">
              <Newspaper className="h-12 w-12 mb-2 opacity-50" />
              <p>No news found for this category</p>
            </div>
          ) : (
            <div className={`space-y-3 ${isInitialLoad ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}>
              {filteredNews.map((item) => (
                <Card
                  key={item.id}
                  className={`bg-black/40 border-white/10 p-3 hover:bg-black/60 transition-colors duration-200 ${
                    item.sentiment === "positive"
                      ? "hover:border-green-500/30"
                      : item.sentiment === "negative"
                        ? "hover:border-red-500/30"
                        : "hover:border-white/30"
                  }`}
                >
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-1 text-xs text-white/60">
                        <Globe className="h-3 w-3" />
                        <span>{item.source}</span>
                        <span className="mx-1">•</span>
                        <Clock className="h-3 w-3" />
                        <span>{formatRelativeTime(item.timestamp)}</span>
                      </div>

                      {item.sentiment === "positive" ? (
                        <TrendingUp className="h-4 w-4 text-green-500 flex-shrink-0" />
                      ) : item.sentiment === "negative" ? (
                        <TrendingDown className="h-4 w-4 text-red-500 flex-shrink-0" />
                      ) : null}
                    </div>

                    <h4 className="font-medium">{item.title}</h4>

                    {item.aiInsight && (
                      <div className="bg-white/5 rounded-md p-2 mt-1 text-sm">
                        <div className="flex items-center gap-1 text-xs text-[#00DC82] mb-1">
                          <Lightbulb className="h-3 w-3" />
                          <span>AI Insight</span>
                        </div>
                        <p className="text-xs text-white/80">{item.aiInsight}</p>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

