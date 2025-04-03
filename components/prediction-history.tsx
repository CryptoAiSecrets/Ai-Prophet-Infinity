"use client"

import { CardTitle } from "@/components/ui/card"
import { CardHeader } from "@/components/ui/card"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Clock, CheckCircle, XCircle, RefreshCw, History } from "lucide-react"

type PredictionType = "NASDAQ" | "Bitcoin" | "Portfolio"

interface Prediction {
  id: string
  type: PredictionType
  symbol?: string
  timestamp: string
  currentValue: number
  predictedValue: number
  confidenceScore: number
  timeframe: string
  actualValue?: number
  accuracy?: number
}

// Mock prediction data
const generateMockPredictions = (type: PredictionType, count: number): Prediction[] => {
  const predictions: Prediction[] = []
  const now = new Date("2025-03-27T21:11:23")

  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    let baseValue = 0
    switch (type) {
      case "NASDAQ":
        baseValue = 16000 + Math.random() * 1000
        break
      case "Bitcoin":
        baseValue = 60000 + Math.random() * 5000
        break
      case "Portfolio":
        baseValue = 10000 + Math.random() * 2000
        break
    }

    const predictedChange = Math.random() * 0.04 - 0.01 // Between -1% and 3%
    const predictedValue = baseValue * (1 + predictedChange)

    // For older predictions, add actual values
    let actualValue, accuracy
    if (i < count - 1) {
      const actualChange = Math.random() * 0.04 - 0.01
      actualValue = baseValue * (1 + actualChange)
      accuracy = 100 - Math.abs(((actualValue - predictedValue) / predictedValue) * 100)
    }

    predictions.push({
      id: `${type.toLowerCase()}-${date.getTime()}`,
      type,
      timestamp: date.toISOString(),
      currentValue: baseValue,
      predictedValue,
      confidenceScore: 65 + Math.random() * 30,
      timeframe: "24h",
      actualValue,
      accuracy,
    })
  }

  return predictions
}

export function PredictionHistory() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [predictionType, setPredictionType] = useState<PredictionType>("NASDAQ")
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const loadPredictions = async (type: PredictionType) => {
    setIsLoading(true)
    try {
      // In a real app, this would fetch from an API
      const data = generateMockPredictions(type, 30)
      setPredictions(data)
    } catch (error) {
      console.error("Failed to load predictions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTypeChange = (type: PredictionType) => {
    setPredictionType(type)
    loadPredictions(type)
  }

  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen)
    if (isOpen && predictions.length === 0) {
      loadPredictions(predictionType)
    }
  }

  // Format currency
  const formatCurrency = (value: number, type: PredictionType) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: type === "Bitcoin" ? 0 : 2,
      maximumFractionDigits: type === "Bitcoin" ? 0 : 2,
    }).format(value)
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Calculate accuracy metrics
  const calculateAccuracy = () => {
    if (predictions.length === 0) return { avg: 0, positive: 0, negative: 0, total: 0 }

    const withAccuracy = predictions.filter((p) => p.accuracy !== undefined)
    if (withAccuracy.length === 0) return { avg: 0, positive: 0, negative: 0, total: 0 }

    const avgAccuracy = withAccuracy.reduce((sum, p) => sum + (p.accuracy || 0), 0) / withAccuracy.length
    const positiveCount = withAccuracy.filter((p) => (p.actualValue || 0) >= p.currentValue).length
    const negativeCount = withAccuracy.filter((p) => (p.actualValue || 0) < p.currentValue).length

    return {
      avg: avgAccuracy,
      positive: positiveCount,
      negative: negativeCount,
      total: withAccuracy.length,
    }
  }

  const accuracy = calculateAccuracy()

  // Prepare data for the accuracy chart
  const chartData = predictions
    .filter((p) => p.accuracy !== undefined)
    .map((p) => ({
      date: new Date(p.timestamp).toLocaleDateString(),
      actual: p.actualValue,
      predicted: p.predictedValue,
      accuracy: p.accuracy,
    }))
    .reverse()

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-2 border-[#00DC82]/40 bg-[#00DC82]/10 hover:bg-[#00DC82]/20 hover:text-white flex items-center gap-1 shadow-sm shadow-[#00DC82]/20"
        >
          <History className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Prediction History</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black/95 border border-[#00DC82]/30 text-white max-w-4xl w-[90vw] max-h-[90vh] overflow-y-auto shadow-xl shadow-[#00DC82]/10">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00DC82] to-[#36e4da]">
            ML Prediction History
          </DialogTitle>
        </DialogHeader>

        <Tabs
          defaultValue="NASDAQ"
          className="mt-4"
          onValueChange={(value) => handleTypeChange(value as PredictionType)}
        >
          <TabsList className="bg-black/60 border border-[#00DC82]/20">
            <TabsTrigger value="NASDAQ" className="data-[state=active]:bg-[#00DC82] data-[state=active]:text-black">
              NASDAQ
            </TabsTrigger>
            <TabsTrigger value="Bitcoin" className="data-[state=active]:bg-[#F7931A] data-[state=active]:text-black">
              Bitcoin
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <Card className="bg-black/60 border-[#00DC82]/30">
              <CardHeader className="p-3">
                <CardTitle className="text-sm">Average Accuracy</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="text-2xl font-bold text-center">{accuracy.avg.toFixed(2)}%</div>
                <div className="text-xs text-center text-white/60">Based on {accuracy.total} verified predictions</div>
              </CardContent>
            </Card>

            <Card className="bg-black/60 border-[#00DC82]/30">
              <CardHeader className="p-3">
                <CardTitle className="text-sm">Direction Accuracy</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <div className="flex justify-between items-center">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-500">{accuracy.positive}</div>
                    <div className="text-xs text-white/60">Correct Up</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-500">{accuracy.negative}</div>
                    <div className="text-xs text-white/60">Correct Down</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">
                      {accuracy.total > 0
                        ? (((accuracy.positive + accuracy.negative) / accuracy.total) * 100).toFixed(0)
                        : 0}
                      %
                    </div>
                    <div className="text-xs text-white/60">Direction Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/60 border-[#00DC82]/30">
              <CardHeader className="p-3">
                <CardTitle className="text-sm">Recent Prediction</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                {predictions.length > 0 ? (
                  <div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-white/60" />
                      <span className="text-xs text-white/60">{formatDate(predictions[0].timestamp)}</span>
                    </div>
                    <div className="mt-1 flex justify-between items-baseline">
                      <div>Current:</div>
                      <div className="font-bold">{formatCurrency(predictions[0].currentValue, predictionType)}</div>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <div>Predicted:</div>
                      <div
                        className={`font-bold ${predictions[0].predictedValue > predictions[0].currentValue ? "text-green-500" : "text-red-500"}`}
                      >
                        {formatCurrency(predictions[0].predictedValue, predictionType)}
                      </div>
                    </div>
                    <div className="text-xs text-white/60 text-right mt-1">
                      Confidence: {predictions[0].confidenceScore.toFixed(1)}%
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-white/60">No predictions yet</div>
                )}
              </CardContent>
            </Card>
          </div>

          <TabsContent value="NASDAQ" className="mt-4">
            <Card className="bg-black/60 border-[#00DC82]/30">
              <CardHeader className="p-3">
                <CardTitle className="text-sm">Prediction Accuracy Over Time</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0 h-64">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="date" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(0,0,0,0.8)",
                          border: "1px solid #00DC82",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="predicted"
                        name="Predicted"
                        stroke="#00DC82"
                        activeDot={{ r: 8 }}
                      />
                      <Line type="monotone" dataKey="actual" name="Actual" stroke="#0088FF" activeDot={{ r: 8 }} />
                      <Line
                        type="monotone"
                        dataKey="accuracy"
                        name="Accuracy %"
                        stroke="#FFC107"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-white/60">
                    No historical data available yet
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Prediction Log</h3>
              <div className="bg-black/60 border border-[#00DC82]/30 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#00DC82]/10">
                        <th className="px-3 py-2 text-left">Date</th>
                        <th className="px-3 py-2 text-right">Current</th>
                        <th className="px-3 py-2 text-right">Predicted</th>
                        <th className="px-3 py-2 text-right">Actual</th>
                        <th className="px-3 py-2 text-center">Direction</th>
                        <th className="px-3 py-2 text-right">Accuracy</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <tr>
                          <td colSpan={6} className="px-3 py-6 text-center">
                            <RefreshCw className="h-5 w-5 animate-spin mx-auto text-white/60" />
                          </td>
                        </tr>
                      ) : predictions.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-3 py-6 text-center text-white/60">
                            No predictions found
                          </td>
                        </tr>
                      ) : (
                        predictions.slice(0, 10).map((prediction) => {
                          const isPredictionUp = prediction.predictedValue > prediction.currentValue
                          const isActualUp =
                            prediction.actualValue !== undefined && prediction.actualValue > prediction.currentValue
                          const isDirectionCorrect =
                            prediction.actualValue !== undefined &&
                            ((isPredictionUp && isActualUp) || (!isPredictionUp && !isActualUp))

                          return (
                            <tr key={prediction.id} className="border-t border-[#00DC82]/10 hover:bg-[#00DC82]/5">
                              <td className="px-3 py-2 text-left">{formatDate(prediction.timestamp)}</td>
                              <td className="px-3 py-2 text-right">
                                {formatCurrency(prediction.currentValue, predictionType)}
                              </td>
                              <td
                                className={`px-3 py-2 text-right ${isPredictionUp ? "text-green-500" : "text-red-500"}`}
                              >
                                {formatCurrency(prediction.predictedValue, predictionType)}
                              </td>
                              <td className="px-3 py-2 text-right">
                                {prediction.actualValue !== undefined ? (
                                  formatCurrency(prediction.actualValue, predictionType)
                                ) : (
                                  <span className="text-white/40">Pending</span>
                                )}
                              </td>
                              <td className="px-3 py-2 text-center">
                                {prediction.actualValue !== undefined ? (
                                  isDirectionCorrect ? (
                                    <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                                  ) : (
                                    <XCircle className="h-4 w-4 text-red-500 mx-auto" />
                                  )
                                ) : (
                                  <span className="text-white/40">-</span>
                                )}
                              </td>
                              <td className="px-3 py-2 text-right">
                                {prediction.accuracy !== undefined ? (
                                  `${prediction.accuracy.toFixed(2)}%`
                                ) : (
                                  <span className="text-white/40">-</span>
                                )}
                              </td>
                            </tr>
                          )
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="Bitcoin" className="mt-4">
            <Card className="bg-black/60 border-[#00DC82]/30">
              <CardHeader className="p-3">
                <CardTitle className="text-sm">Prediction Accuracy Over Time</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0 h-64">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="date" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(0,0,0,0.8)",
                          border: "1px solid #F7931A",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="predicted"
                        name="Predicted"
                        stroke="#F7931A"
                        activeDot={{ r: 8 }}
                      />
                      <Line type="monotone" dataKey="actual" name="Actual" stroke="#0088FF" activeDot={{ r: 8 }} />
                      <Line
                        type="monotone"
                        dataKey="accuracy"
                        name="Accuracy %"
                        stroke="#FFC107"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-white/60">
                    No historical data available yet
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Prediction Log</h3>
              <div className="bg-black/60 border border-[#00DC82]/30 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#00DC82]/10">
                        <th className="px-3 py-2 text-left">Date</th>
                        <th className="px-3 py-2 text-right">Current</th>
                        <th className="px-3 py-2 text-right">Predicted</th>
                        <th className="px-3 py-2 text-right">Actual</th>
                        <th className="px-3 py-2 text-center">Direction</th>
                        <th className="px-3 py-2 text-right">Accuracy</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        <tr>
                          <td colSpan={6} className="px-3 py-6 text-center">
                            <RefreshCw className="h-5 w-5 animate-spin mx-auto text-white/60" />
                          </td>
                        </tr>
                      ) : predictions.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-3 py-6 text-center text-white/60">
                            No predictions found
                          </td>
                        </tr>
                      ) : (
                        predictions.slice(0, 10).map((prediction) => {
                          const isPredictionUp = prediction.predictedValue > prediction.currentValue
                          const isActualUp =
                            prediction.actualValue !== undefined && prediction.actualValue > prediction.currentValue
                          const isDirectionCorrect =
                            prediction.actualValue !== undefined &&
                            ((isPredictionUp && isActualUp) || (!isPredictionUp && !isActualUp))

                          return (
                            <tr key={prediction.id} className="border-t border-[#00DC82]/10 hover:bg-[#00DC82]/5">
                              <td className="px-3 py-2 text-left">{formatDate(prediction.timestamp)}</td>
                              <td className="px-3 py-2 text-right">
                                {formatCurrency(prediction.currentValue, predictionType)}
                              </td>
                              <td
                                className={`px-3 py-2 text-right ${isPredictionUp ? "text-green-500" : "text-red-500"}`}
                              >
                                {formatCurrency(prediction.predictedValue, predictionType)}
                              </td>
                              <td className="px-3 py-2 text-right">
                                {prediction.actualValue !== undefined ? (
                                  formatCurrency(prediction.actualValue, predictionType)
                                ) : (
                                  <span className="text-white/40">Pending</span>
                                )}
                              </td>
                              <td className="px-3 py-2 text-center">
                                {prediction.actualValue !== undefined ? (
                                  isDirectionCorrect ? (
                                    <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                                  ) : (
                                    <XCircle className="h-4 w-4 text-red-500 mx-auto" />
                                  )
                                ) : (
                                  <span className="text-white/40">-</span>
                                )}
                              </td>
                              <td className="px-3 py-2 text-right">
                                {prediction.accuracy !== undefined ? (
                                  `${prediction.accuracy.toFixed(2)}%`
                                ) : (
                                  <span className="text-white/40">-</span>
                                )}
                              </td>
                            </tr>
                          )
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

