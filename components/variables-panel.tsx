"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import {
  Cloud,
  Sun,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  Building,
  Briefcase,
  Globe,
  Activity,
  RefreshCw,
  Info,
  AlertCircle,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Define the variable types
interface FinancialVariable {
  id: string
  name: string
  category: string
  description: string
  icon: React.ReactNode
  enabled: boolean
  impact: number // -10 to 10, negative means negative impact
  weight: number // 0 to 100, how much this variable affects predictions
  currentValue?: number
  unit?: string
}

export function VariablesPanel() {
  const [variables, setVariables] = useState<FinancialVariable[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [changesMade, setChangesMade] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // In a real app, this would fetch from an API
    const initialVariables: FinancialVariable[] = [
      {
        id: "interest_rate",
        name: "Interest Rate",
        category: "economic",
        description: "Federal Reserve interest rate affects borrowing costs and investment returns",
        icon: <Percent className="h-4 w-4" />,
        enabled: true,
        impact: -7,
        weight: 85,
        currentValue: 5.25,
        unit: "%",
      },
      {
        id: "inflation",
        name: "Inflation",
        category: "economic",
        description: "Rate at which prices increase over time, eroding purchasing power",
        icon: <DollarSign className="h-4 w-4" />,
        enabled: true,
        impact: -8,
        weight: 80,
        currentValue: 3.7,
        unit: "%",
      },
      {
        id: "gdp_growth",
        name: "GDP Growth",
        category: "economic",
        description: "Measure of economic output and overall economic health",
        icon: <TrendingUp className="h-4 w-4" />,
        enabled: true,
        impact: 6,
        weight: 75,
        currentValue: 2.1,
        unit: "%",
      },
      {
        id: "unemployment",
        name: "Unemployment",
        category: "economic",
        description: "Percentage of workforce without jobs, indicator of economic health",
        icon: <Briefcase className="h-4 w-4" />,
        enabled: true,
        impact: -5,
        weight: 70,
        currentValue: 3.8,
        unit: "%",
      },
      {
        id: "consumer_sentiment",
        name: "Consumer Sentiment",
        category: "sentiment",
        description: "Measure of consumer confidence in the economy",
        icon: <Activity className="h-4 w-4" />,
        enabled: true,
        impact: 7,
        weight: 65,
        currentValue: 68.2,
        unit: "index",
      },
      {
        id: "market_volatility",
        name: "Market Volatility",
        category: "market",
        description: "Measure of market fluctuations and uncertainty",
        icon: <Activity className="h-4 w-4" />,
        enabled: true,
        impact: -6,
        weight: 75,
        currentValue: 14.8,
        unit: "VIX",
      },
      {
        id: "oil_price",
        name: "Oil Price",
        category: "commodity",
        description: "Price of crude oil, affects energy costs and transportation",
        icon: <DollarSign className="h-4 w-4" />,
        enabled: false,
        impact: -4,
        weight: 60,
        currentValue: 78.5,
        unit: "USD",
      },
      {
        id: "housing_market",
        name: "Housing Market",
        category: "sector",
        description: "Health of the housing market, affects construction and mortgage industries",
        icon: <Building className="h-4 w-4" />,
        enabled: false,
        impact: 3,
        weight: 55,
        currentValue: 1.2,
        unit: "% growth",
      },
      {
        id: "global_trade",
        name: "Global Trade",
        category: "global",
        description: "Volume of international trade, indicator of global economic activity",
        icon: <Globe className="h-4 w-4" />,
        enabled: false,
        impact: 5,
        weight: 65,
        currentValue: 3.2,
        unit: "% growth",
      },
      {
        id: "weather",
        name: "Weather Patterns",
        category: "environmental",
        description: "Unusual weather patterns affecting agriculture, energy, and retail",
        icon: <Cloud className="h-4 w-4" />,
        enabled: false,
        impact: -2,
        weight: 30,
        currentValue: 0.8,
        unit: "severity",
      },
      {
        id: "seasonal",
        name: "Seasonal Factors",
        category: "temporal",
        description: "Seasonal trends affecting consumer behavior and spending",
        icon: <Sun className="h-4 w-4" />,
        enabled: true,
        impact: 4,
        weight: 40,
        currentValue: 0.6,
        unit: "index",
      },
      {
        id: "political",
        name: "Political Stability",
        category: "geopolitical",
        description: "Political climate affecting market confidence and investment",
        icon: <Building className="h-4 w-4" />,
        enabled: false,
        impact: -3,
        weight: 50,
        currentValue: 65,
        unit: "index",
      },
    ]

    setVariables(initialVariables)
    setIsLoading(false)
  }, [])

  // Toggle variable
  const toggleVariable = (id: string) => {
    setVariables(variables.map((v) => (v.id === id ? { ...v, enabled: !v.enabled } : v)))
    setChangesMade(true)
  }

  // Update variable weight
  const updateVariableWeight = (id: string, weight: number) => {
    setVariables(variables.map((v) => (v.id === id ? { ...v, weight } : v)))
    setChangesMade(true)
  }

  // Filter variables
  const getFilteredVariables = () => {
    if (filter === "all") return variables
    return variables.filter((v) => v.category === filter)
  }

  // Calculate net impact
  const getNetImpact = () => {
    const enabledVariables = variables.filter((v) => v.enabled)
    if (enabledVariables.length === 0) return 0

    const totalImpact = enabledVariables.reduce((sum, v) => {
      return sum + v.impact * (v.weight / 100)
    }, 0)

    return totalImpact / enabledVariables.length
  }

  // Save changes
  const saveChanges = () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      setChangesMade(false)

      // Show success notification - in a real app you'd use a toast
      alert("Variables saved successfully")
    }, 1500)
  }

  const netImpact = getNetImpact()
  const filteredVariables = getFilteredVariables()

  // Get unique categories for filter
  const categories = Array.from(new Set(variables.map((v) => v.category)))

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div>
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-300">
            Prediction Variables
          </h2>
          <p className="text-sm text-white/70">Toggle variables to see how they affect predictions</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className={filter === "all" ? "bg-red-500 text-white" : ""}
          >
            All
          </Button>

          {categories.map((category) => (
            <Button
              key={category}
              variant={filter === category ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(category)}
              className={filter === category ? "bg-red-500 text-white" : ""}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => {
              setVariables(variables.map((v) => ({ ...v, enabled: false })))
              setChangesMade(true)
            }}
          >
            Reset All
          </Button>
        </div>
      </div>

      {/* Net impact card */}
      <Card className="bg-black/40 border-white/10">
        <CardHeader className="p-3">
          <CardTitle className="text-sm">Net Variable Impact</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {netImpact > 0 ? (
                <div className="flex items-center text-green-500">
                  <TrendingUp className="h-5 w-5 mr-1" />
                  <span className="text-2xl font-bold">+{netImpact.toFixed(1)}</span>
                </div>
              ) : (
                <div className="flex items-center text-red-500">
                  <TrendingDown className="h-5 w-5 mr-1" />
                  <span className="text-2xl font-bold">{netImpact.toFixed(1)}</span>
                </div>
              )}
              <span className="text-sm text-white/70">on prediction model</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-white/70">
                {variables.filter((v) => v.enabled).length} of {variables.length} variables enabled
              </span>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => {
                  setVariables(variables.map((v) => ({ ...v, enabled: true })))
                  setChangesMade(true)
                }}
              >
                <RefreshCw className="h-3 w-3" />
                Enable All
              </Button>
            </div>
          </div>

          {/* Impact visualization */}
          <div className="mt-4 relative h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`absolute top-0 bottom-0 left-1/2 ${netImpact > 0 ? "bg-green-500" : "bg-red-500"}`}
              style={{
                width: `${Math.abs(netImpact) * 5}%`,
                transform: netImpact > 0 ? "translateX(0)" : "translateX(-100%)",
              }}
            ></div>
            <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-white/50"></div>
          </div>

          {changesMade && (
            <div className="mt-4 flex items-center justify-center">
              <Button
                size="sm"
                className="bg-gradient-to-r from-red-500 to-red-400 text-white shadow-md shadow-red-500/20"
                onClick={saveChanges}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="h-3 w-3 mr-1 animate-spin" /> Saving Changes...
                  </>
                ) : (
                  <>Apply Changes to Model</>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Variables grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVariables.map((variable) => (
          <Card
            key={variable.id}
            className={`bg-black/40 ${variable.enabled ? "border-red-500/30" : "border-white/10"} transition-colors duration-300`}
          >
            <CardContent className="p-3">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-md ${variable.enabled ? "bg-red-500/20" : "bg-white/10"}`}>
                    {variable.icon}
                  </div>
                  <div>
                    <div className="font-medium flex items-center gap-1">
                      {variable.name}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3 w-3 text-white/50" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">{variable.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="text-xs text-white/60">
                      {variable.category.charAt(0).toUpperCase() + variable.category.slice(1)}
                    </div>
                  </div>
                </div>

                <Switch
                  checked={variable.enabled}
                  onCheckedChange={() => toggleVariable(variable.id)}
                  className={variable.enabled ? "data-[state=checked]:bg-red-500" : ""}
                />
              </div>

              <div className="flex justify-between items-center mb-1">
                <div className="text-xs text-white/60">Current Value:</div>
                <div className="text-sm font-medium">
                  {variable.currentValue} {variable.unit}
                </div>
              </div>

              <div className="flex justify-between items-center mb-1">
                <div className="text-xs text-white/60">Impact:</div>
                <div
                  className={`text-sm font-medium flex items-center ${variable.impact > 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {variable.impact > 0 ? (
                    <>
                      <TrendingUp className="h-3 w-3 mr-1" />+{variable.impact}
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-3 w-3 mr-1" />
                      {variable.impact}
                    </>
                  )}
                </div>
              </div>

              <div className="mt-3">
                <div className="flex justify-between items-center mb-1">
                  <div className="text-xs text-white/60">Weight:</div>
                  <div className="text-sm font-medium">{variable.weight}%</div>
                </div>
                <Slider
                  disabled={!variable.enabled}
                  value={[variable.weight]}
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={(value) => updateVariableWeight(variable.id, value[0])}
                  className={variable.enabled ? "" : "opacity-50"}
                />
              </div>

              {variable.enabled && (
                <div className="mt-2 text-xs text-center">
                  <span className="bg-black/30 text-white/70 px-2 py-0.5 rounded-full">
                    Net contribution:{" "}
                    <span className={variable.impact * (variable.weight / 100) > 0 ? "text-green-400" : "text-red-400"}>
                      {variable.impact * (variable.weight / 100) > 0 ? "+" : ""}
                      {(variable.impact * (variable.weight / 100)).toFixed(2)}
                    </span>
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {variables.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 text-white/60">
          <AlertCircle className="h-10 w-10 mb-2 opacity-50" />
          <p>No variables found. Try adjusting your filters.</p>
        </div>
      )}

      {changesMade && (
        <div className="sticky bottom-4 left-0 right-0 bg-red-500/90 text-white p-3 rounded-lg border border-red-400 shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span>You have unsaved changes to your prediction model</span>
          </div>
          <Button size="sm" variant="secondary" onClick={saveChanges} disabled={isSaving}>
            {isSaving ? <RefreshCw className="h-3 w-3 animate-spin mr-1" /> : <RefreshCw className="h-3 w-3 mr-1" />}
            {isSaving ? "Saving..." : "Apply Changes"}
          </Button>
        </div>
      )}
    </div>
  )
}

