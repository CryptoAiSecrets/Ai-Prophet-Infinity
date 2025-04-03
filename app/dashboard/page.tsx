"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  LineChart,
  Settings,
  User,
  Bell,
  Search,
  Home,
  Briefcase,
  TrendingUp,
  LogOut,
  Grid,
  PenToolIcon as Tool,
  Zap,
  Lightbulb,
  RefreshCw,
  MessageSquare,
} from "lucide-react"
import { NasdaqFeed } from "@/components/nasdaq-feed"
import { BitcoinFeed } from "@/components/bitcoin-feed"
import { ChatInterface } from "@/components/chat-interface"
import { HexagonBackground } from "@/components/hexagon-background"
import { PortfolioPredictions } from "@/components/portfolio-predictions"
import { TopPredictions } from "@/components/top-predictions"
import { NewsFeed } from "@/components/news-feed"
import { PredictionHistory } from "@/components/prediction-history"
import MobileNav from "@/app/components/mobile-nav"
import { SplashScreen } from "@/components/splash-screen"
import { InstallPrompt } from "@/components/install-prompt"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showSplash, setShowSplash] = useState(true)
  const [toolsExpanded, setToolsExpanded] = useState(false)
  const [dataRefreshInterval, setDataRefreshInterval] = useState<NodeJS.Timeout | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const mainContentRef = useRef<HTMLDivElement>(null)

  // Refresh all live data
  const refreshAllData = () => {
    setIsRefreshing(true)
    // Force re-fetching in components that have useEffect dependencies
    setDataRefreshInterval(setInterval(() => {}, 100))

    // Show refresh for 1.5 seconds
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1500)
  }

  // For animation effects
  useEffect(() => {
    setMounted(true)

    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    // Hide splash screen after 2.5 seconds
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 2500)

    // Set up data refresh interval - refresh all live data every 60 seconds
    const refreshInterval = setInterval(() => {
      console.log("Refreshing live data...")
      refreshAllData()
    }, 60000)

    return () => {
      window.removeEventListener("resize", checkMobile)
      clearTimeout(timer)
      if (dataRefreshInterval) clearInterval(dataRefreshInterval)
      clearInterval(refreshInterval)
    }
  }, [])

  // Scroll to top on initial load to fix mobile navigation issue
  useEffect(() => {
    if (!showSplash && mainContentRef.current) {
      mainContentRef.current.scrollTop = 0
    }
  }, [showSplash])

  // Mock session data
  const session = { user: { name: "Demo User", email: "demo@example.com" } }

  // Handle tab change - ensure proper scrolling on mobile
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0
    }
  }

  return (
    <>
      {showSplash && <SplashScreen />}

      <div
        className={`flex h-[100dvh] bg-black text-white overflow-hidden ${
          mounted && !showSplash ? "opacity-100" : "opacity-0"
        } transition-opacity duration-500`}
      >
        {/* 3D Hexagon Background */}
        <div className="fixed inset-0 z-0">
          <HexagonBackground />
        </div>

        {/* Sidebar - hidden on mobile */}
        <div className="hidden md:flex w-64 border-r border-white/10 bg-black/80 backdrop-blur-sm flex-col h-full z-10 relative">
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#00DC82] to-[#36e4da] flex items-center justify-center shadow-lg shadow-[#00DC82]/20">
                <TrendingUp className="h-4 w-4 text-black" />
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                AI Prophet
              </h1>
            </div>
          </div>

          <nav className="flex-1 overflow-auto p-4 space-y-2">
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 transition-all duration-200 hover:bg-white/10 hover:translate-x-1 ${
                activeTab === "overview"
                  ? "bg-gradient-to-r from-[#00DC82]/20 to-transparent border-l-2 border-[#00DC82] pl-3"
                  : ""
              }`}
              onClick={() => handleTabChange("overview")}
            >
              <Home className={`h-4 w-4 ${activeTab === "overview" ? "text-[#00DC82]" : ""}`} />
              Overview
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 transition-all duration-200 hover:bg-white/10 hover:translate-x-1 ${
                activeTab === "portfolio"
                  ? "bg-gradient-to-r from-[#00DC82]/20 to-transparent border-l-2 border-[#00DC82] pl-3"
                  : ""
              }`}
              onClick={() => handleTabChange("portfolio")}
            >
              <Briefcase className={`h-4 w-4 ${activeTab === "portfolio" ? "text-[#00DC82]" : ""}`} />
              Portfolio
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 transition-all duration-200 hover:bg-white/10 hover:translate-x-1 ${
                activeTab === "trading"
                  ? "bg-gradient-to-r from-[#00DC82]/20 to-transparent border-l-2 border-[#00DC82] pl-3"
                  : ""
              }`}
              onClick={() => handleTabChange("trading")}
            >
              <BarChart3 className={`h-4 w-4 ${activeTab === "trading" ? "text-[#00DC82]" : ""}`} />
              Paper Trading
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 transition-all duration-200 hover:bg-white/10 hover:translate-x-1 ${
                activeTab === "market"
                  ? "bg-gradient-to-r from-[#00DC82]/20 to-transparent border-l-2 border-[#00DC82] pl-3"
                  : ""
              }`}
              onClick={() => handleTabChange("market")}
            >
              <LineChart className={`h-4 w-4 ${activeTab === "market" ? "text-[#00DC82]" : ""}`} />
              Market Data
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 transition-all duration-200 hover:bg-white/10 hover:translate-x-1 ${
                activeTab === "categories"
                  ? "bg-gradient-to-r from-[#00DC82]/20 to-transparent border-l-2 border-[#00DC82] pl-3"
                  : ""
              }`}
              onClick={() => handleTabChange("categories")}
            >
              <Grid className={`h-4 w-4 ${activeTab === "categories" ? "text-[#00DC82]" : ""}`} />
              Categories
            </Button>

            {/* Tools Section */}
            <div className="pt-2 pb-1">
              <Button
                variant="ghost"
                className={`w-full justify-between items-center transition-all duration-200 hover:bg-white/10 ${
                  toolsExpanded ? "bg-gradient-to-r from-[#00DC82]/10 to-transparent" : ""
                }`}
                onClick={() => setToolsExpanded(!toolsExpanded)}
              >
                <div className="flex items-center gap-2">
                  <Tool className="h-4 w-4" />
                  <span>Tools</span>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform duration-200 ${toolsExpanded ? "rotate-180" : ""}`}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </Button>

              {toolsExpanded && (
                <div className="pl-4 mt-1 space-y-1 border-l border-white/10 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start gap-2 transition-all duration-200 hover:bg-white/10 hover:translate-x-1 ${
                      activeTab === "analyze"
                        ? "bg-gradient-to-r from-blue-500/20 to-transparent border-l-2 border-blue-500 pl-3"
                        : ""
                    }`}
                    onClick={() => handleTabChange("analyze")}
                  >
                    <BarChart3 className={`h-4 w-4 ${activeTab === "analyze" ? "text-blue-500" : ""}`} />
                    Analyze
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start gap-2 transition-all duration-200 hover:bg-white/10 hover:translate-x-1 ${
                      activeTab === "predict"
                        ? "bg-gradient-to-r from-amber-500/20 to-transparent border-l-2 border-amber-500 pl-3"
                        : ""
                    }`}
                    onClick={() => handleTabChange("predict")}
                  >
                    <LineChart className={`h-4 w-4 ${activeTab === "predict" ? "text-amber-500" : ""}`} />
                    Predict
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start gap-2 transition-all duration-200 hover:bg-white/10 hover:translate-x-1 ${
                      activeTab === "variables"
                        ? "bg-gradient-to-r from-red-500/20 to-transparent border-l-2 border-red-500 pl-3"
                        : ""
                    }`}
                    onClick={() => handleTabChange("variables")}
                  >
                    <Zap className={`h-4 w-4 ${activeTab === "variables" ? "text-red-500" : ""}`} />
                    Variables
                  </Button>
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 transition-all duration-200 hover:bg-white/10 hover:translate-x-1 ${
                activeTab === "assistant"
                  ? "bg-gradient-to-r from-[#00DC82]/20 to-transparent border-l-2 border-[#00DC82] pl-3"
                  : ""
              }`}
              onClick={() => handleTabChange("assistant")}
            >
              <MessageSquare className={`h-4 w-4 ${activeTab === "assistant" ? "text-[#00DC82]" : ""}`} />
              AI Assistant
            </Button>

            <Button
              variant="ghost"
              className={`w-full justify-start gap-2 transition-all duration-200 hover:bg-white/10 hover:translate-x-1 ${
                activeTab === "prediction-history"
                  ? "bg-gradient-to-r from-[#00DC82]/20 to-transparent border-l-2 border-[#00DC82] pl-3"
                  : ""
              }`}
              onClick={() => handleTabChange("prediction-history")}
            >
              <Lightbulb className={`h-4 w-4 ${activeTab === "prediction-history" ? "text-[#00DC82]" : ""}`} />
              ML Predictions
            </Button>
          </nav>

          <div className="p-4 border-t border-white/10">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 transition-all duration-200 hover:bg-white/10 hover:translate-x-1"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-red-400 transition-all duration-200 hover:bg-red-500/10 hover:translate-x-1"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden z-10 relative w-full">
          {/* Header */}
          <header className="h-14 md:h-16 border-b border-white/10 bg-black/50 backdrop-blur-sm flex items-center justify-between px-2 md:px-6">
            <div className="flex items-center gap-2">
              {/* Mobile menu */}
              <MobileNav activeTab={activeTab} setActiveTab={handleTabChange} />

              {/* Logo for mobile */}
              <div className="md:hidden flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[#00DC82] to-[#36e4da] flex items-center justify-center shadow-lg shadow-[#00DC82]/20">
                  <TrendingUp className="h-3 w-3 text-black" />
                </div>
                <h1 className="text-base font-bold">AI Prophet</h1>
              </div>

              {/* Search - hidden on mobile */}
              <div className="relative hidden md:block">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-white/5 border border-white/10 rounded-md pl-8 pr-4 py-1 focus:outline-none focus:ring-1 focus:ring-[#00DC82] w-40 md:w-64 transition-all duration-300 focus:w-48 md:focus:w-80"
                />
              </div>
            </div>

            <div className="flex items-center gap-1 md:gap-4">
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2 border-white/10 hover:bg-white/10 hover:text-white flex items-center gap-1"
                onClick={refreshAllData}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">Live Feed</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2 border-white/10 hover:bg-white/10 hover:text-white flex items-center gap-1"
                onClick={() => handleTabChange("assistant")}
              >
                <MessageSquare className="h-3.5 w-3.5 text-[#00DC82]" />
                <span className="hidden sm:inline">Chat</span>
              </Button>

              <PredictionHistory />

              <Button variant="ghost" size="icon" className="rounded-full relative group h-8 w-8 md:h-10 md:w-10">
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#00DC82] rounded-full"></div>
                <Bell className="h-4 w-4 md:h-5 md:w-5 group-hover:text-[#00DC82] transition-colors duration-200" />
              </Button>
              <div className="flex items-center gap-1 md:gap-2 bg-white/5 px-2 py-1 rounded-full border border-white/10 hover:border-[#00DC82]/50 transition-colors duration-200">
                <div className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-gradient-to-br from-[#00DC82]/80 to-[#36e4da]/80 flex items-center justify-center shadow-md">
                  <User className="h-3 w-3 md:h-4 md:w-4 text-black" />
                </div>
                <span className="text-xs md:text-base hidden xs:block">
                  {session?.user?.name || session?.user?.email || "User"}
                </span>
              </div>
            </div>
          </header>

          {/* Main content area */}
          <main ref={mainContentRef} className="flex-1 overflow-auto p-2 md:p-6 backdrop-blur-sm">
            {isRefreshing && (
              <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 bg-black/80 border border-[#00DC82]/50 text-white px-4 py-2 rounded-full flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin text-[#00DC82]" />
                <span>Refreshing live data...</span>
              </div>
            )}

            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={handleTabChange} className="space-y-4">
              <TabsList className="bg-black/40 border border-white/10 p-1 rounded-lg backdrop-blur-sm w-full overflow-x-auto flex-nowrap whitespace-nowrap">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00DC82]/80 data-[state=active]:to-[#36e4da]/80 data-[state=active]:text-black rounded-md transition-all duration-200 data-[state=active]:shadow-lg data-[state=active]:shadow-[#00DC82]/20 text-xs md:text-sm"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="portfolio"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00DC82]/80 data-[state=active]:to-[#36e4da]/80 data-[state=active]:text-black rounded-md transition-all duration-200 data-[state=active]:shadow-lg data-[state=active]:shadow-[#00DC82]/20 text-xs md:text-sm"
                >
                  Portfolio
                </TabsTrigger>
                <TabsTrigger
                  value="trading"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00DC82]/80 data-[state=active]:to-[#36e4da]/80 data-[state=active]:text-black rounded-md transition-all duration-200 data-[state=active]:shadow-lg data-[state=active]:shadow-[#00DC82]/20 text-xs md:text-sm"
                >
                  Trading
                </TabsTrigger>
                <TabsTrigger
                  value="market"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00DC82]/80 data-[state=active]:to-[#36e4da]/80 data-[state=active]:text-black rounded-md transition-all duration-200 data-[state=active]:shadow-lg data-[state=active]:shadow-[#00DC82]/20 text-xs md:text-sm"
                >
                  Market
                </TabsTrigger>
                <TabsTrigger
                  value="categories"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00DC82]/80 data-[state=active]:to-[#36e4da]/80 data-[state=active]:text-black rounded-md transition-all duration-200 data-[state=active]:shadow-lg data-[state=active]:shadow-[#00DC82]/20 text-xs md:text-sm"
                >
                  Categories
                </TabsTrigger>
                <TabsTrigger
                  value="assistant"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#00DC82]/80 data-[state=active]:to-[#36e4da]/80 data-[state=active]:text-black rounded-md transition-all duration-200 data-[state=active]:shadow-lg data-[state=active]:shadow-[#00DC82]/20 text-xs md:text-sm"
                >
                  AI Assistant
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {/* Portfolio Predictions Chart */}
                  <div className="col-span-1">
                    <PortfolioPredictions />
                  </div>

                  {/* AI Assistant - moved up right after portfolio predictions */}
                  <div className="col-span-1">
                    <Card className="bg-black/70 border-[#00DC82]/30 overflow-hidden group hover:border-[#00DC82]/50 transition-all duration-300 h-full shadow-lg shadow-[#00DC82]/10">
                      <CardHeader className="relative p-3 md:p-4 flex items-center gap-2 border-b border-white/20 bg-gradient-to-r from-[#00DC82]/20 to-transparent">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#00DC82] to-[#36e4da] flex items-center justify-center shadow-lg shadow-[#00DC82]/20">
                          <MessageSquare className="h-4 w-4 text-black" />
                        </div>
                        <div>
                          <CardTitle className="text-white text-base md:text-lg">AI Assistant</CardTitle>
                          <p className="text-xs text-white/70">Ask me anything about markets or investments</p>
                        </div>
                      </CardHeader>
                      <CardContent className="relative p-0 h-[400px] sm:h-[450px]">
                        <ChatInterface compact={true} />
                      </CardContent>
                    </Card>
                  </div>

                  {/* Top Prediction Assets */}
                  <div className="col-span-1">
                    <TopPredictions setActiveTab={handleTabChange} />
                  </div>

                  {/* Market Data Predictions */}
                  <div className="col-span-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-black/60 border-white/10 overflow-hidden group hover:border-[#00DC82]/30 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#00DC82]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <CardHeader className="p-3">
                        <CardTitle className="text-base">NASDAQ Predictions</CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        <NasdaqFeed />
                      </CardContent>
                    </Card>

                    <Card className="bg-black/60 border-white/10 overflow-hidden group hover:border-[#F7931A]/30 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#F7931A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <CardHeader className="p-3">
                        <CardTitle className="text-base">Bitcoin Predictions</CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        <BitcoinFeed />
                      </CardContent>
                    </Card>
                  </div>

                  {/* News Feed */}
                  <div className="col-span-1">
                    <Card className="bg-black/60 border-white/10 overflow-hidden group hover:border-[#00DC82]/30 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#00DC82]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <CardContent className="p-3 md:p-4">
                        <NewsFeed />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* AI Assistant Tab */}
              <TabsContent value="assistant">
                <Card className="bg-black/60 border-white/10 overflow-hidden group hover:border-[#00DC82]/30 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00DC82]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <CardHeader className="relative p-3 md:p-4 flex items-center gap-2 border-b border-white/20 bg-gradient-to-r from-[#00DC82]/20 to-transparent">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#00DC82] to-[#36e4da] flex items-center justify-center shadow-lg shadow-[#00DC82]/20">
                      <MessageSquare className="h-4 w-4 text-black" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-base md:text-lg">AI Financial Assistant</CardTitle>
                      <p className="text-xs text-white/70">Ask me anything about markets or investments</p>
                    </div>
                  </CardHeader>
                  <CardContent className="relative p-0 h-[calc(100vh-180px)]">
                    <ChatInterface />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Other tabs content would continue here */}
            </Tabs>
          </main>
        </div>
      </div>

      <InstallPrompt />
    </>
  )
}

