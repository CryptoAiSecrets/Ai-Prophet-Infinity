"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import {
  Menu,
  Home,
  Briefcase,
  BarChart3,
  LineChart,
  HelpCircle,
  Settings,
  LogOut,
  Grid,
  PenToolIcon as Tool,
  Zap,
  Lightbulb,
} from "lucide-react"

interface MobileNavProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function MobileNav({ activeTab, setActiveTab }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const [toolsExpanded, setToolsExpanded] = useState(false)

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setOpen(false)
  }

  // Define a consistent structure for navigation
  const mainNavItems = [
    { id: "overview", icon: <Home className="h-4 w-4" />, label: "Overview" },
    { id: "portfolio", icon: <Briefcase className="h-4 w-4" />, label: "Portfolio" },
    { id: "trading", icon: <BarChart3 className="h-4 w-4" />, label: "Paper Trading" },
    { id: "market", icon: <LineChart className="h-4 w-4" />, label: "Market Data" },
    { id: "categories", icon: <Grid className="h-4 w-4" />, label: "Categories" },
  ]

  const toolItems = [
    { id: "analyze", icon: <BarChart3 className="h-3 w-3" />, label: "Analyze" },
    { id: "predict", icon: <LineChart className="h-3 w-3" />, label: "Predict" },
    { id: "variables", icon: <Zap className="h-3 w-3" />, label: "Variables" },
  ]

  const utilityItems = [
    { id: "assistant", icon: <HelpCircle className="h-4 w-4" />, label: "AI Assistant" },
    { id: "prediction-history", icon: <Lightbulb className="h-4 w-4" />, label: "ML Predictions" },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden h-9 w-9 flex items-center justify-center">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[250px] p-0 bg-black/90 border-r border-white/10">
        <div className="flex flex-col h-full">
          <div className="p-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-[#00DC82] flex items-center justify-center">
                <LineChart className="h-3 w-3 text-black" />
              </div>
              <h1 className="text-base font-bold">AI Prophet</h1>
            </div>
          </div>

          <nav className="flex-1 overflow-auto p-3 space-y-1">
            {/* Main navigation items */}
            {mainNavItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className={`w-full justify-start gap-2 text-sm h-10 ${
                  activeTab === item.id
                    ? "bg-gradient-to-r from-[#00DC82]/20 to-transparent border-l-2 border-[#00DC82] pl-3"
                    : ""
                }`}
                onClick={() => handleTabChange(item.id)}
              >
                <span className={activeTab === item.id ? "text-[#00DC82]" : ""}>{item.icon}</span>
                {item.label}
              </Button>
            ))}

            {/* Tools Section */}
            <div className="pt-1 pb-1">
              <Button
                variant="ghost"
                className={`w-full justify-between items-center text-sm h-10 ${
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
                  {toolItems.map((tool) => {
                    const getColor = (id) => {
                      switch (id) {
                        case "analyze":
                          return "blue-500"
                        case "predict":
                          return "amber-500"
                        case "variables":
                          return "red-500"
                        default:
                          return "[#00DC82]"
                      }
                    }

                    return (
                      <Button
                        key={tool.id}
                        variant="ghost"
                        size="sm"
                        className={`w-full justify-start gap-2 text-xs h-8 ${
                          activeTab === tool.id
                            ? `bg-gradient-to-r from-${getColor(tool.id)}/20 to-transparent border-l-2 border-${getColor(tool.id)} pl-3`
                            : ""
                        }`}
                        onClick={() => handleTabChange(tool.id)}
                      >
                        <span className={activeTab === tool.id ? `text-${getColor(tool.id)}` : ""}>{tool.icon}</span>
                        {tool.label}
                      </Button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Utility navigation items */}
            {utilityItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className={`w-full justify-start gap-2 text-sm h-10 ${
                  activeTab === item.id
                    ? "bg-gradient-to-r from-[#00DC82]/20 to-transparent border-l-2 border-[#00DC82] pl-3"
                    : ""
                }`}
                onClick={() => handleTabChange(item.id)}
              >
                <span className={activeTab === item.id ? "text-[#00DC82]" : ""}>{item.icon}</span>
                {item.label}
              </Button>
            ))}
          </nav>

          <div className="p-3 border-t border-white/10">
            <Button variant="ghost" className="w-full justify-start gap-2 text-sm h-10">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2 text-red-400 text-sm h-10">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

