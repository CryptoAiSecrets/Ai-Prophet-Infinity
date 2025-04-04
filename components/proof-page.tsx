"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownRight, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Prediction {
  id: string
  asset_id: string
  asset_name: string
  asset_symbol: string
  prediction_type: string
  prediction_value: string
  confidence: number
  timestamp: string
  outcome: "pending" | "correct" | "incorrect" | null
  actual_value?: string
  verified_at?: string
}

// Sample fallback data in case the API fails
const fallbackPredictions: Prediction[] = [
  {
    id: "1",
    asset_id: "1",
    asset_name: "Bitcoin",
    asset_symbol: "BTC",
    prediction_type: "price_up",
    prediction_value: "$68,500",
    confidence: 85,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    outcome: "correct",
    actual_value: "$68,750",
    verified_at: new Date().toISOString(),
  },
  {
    id: "2",
    asset_id: "2",
    asset_name: "Ethereum",
    asset_symbol: "ETH",
    prediction_type: "price_down",
    prediction_value: "$3,200",
    confidence: 72,
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    outcome: "pending",
  },
  {
    id: "3",
    asset_id: "3",
    asset_name: "Apple Inc.",
    asset_symbol: "AAPL",
    prediction_type: "price_up",
    prediction_value: "$182.50",
    confidence: 68,
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    outcome: "incorrect",
    actual_value: "$180.25",
    verified_at: new Date().toISOString(),
  },
]

export default function ProofPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [metrics, setMetrics] = useState({
    total: 0,
    correct: 0,
    accuracy: 0,
    pending: 0,
  })

  useEffect(() => {
    async function fetchPredictions() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch("/api/proof")

        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`)
        }

        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("API did not return JSON")
        }

        const data = await response.json()

        if (!data.success) {
          throw new Error(data.error || "Unknown API error")
        }

        setPredictions(data.predictions || [])

        // Calculate metrics
        const total = data.predictions.length
        const correct = data.predictions.filter((p: Prediction) => p.outcome === "correct").length
        const pending = data.predictions.filter((p: Prediction) => p.outcome === "pending").length

        setMetrics({
          total,
          correct,
          accuracy: total > 0 ? Math.round((correct / (total - pending)) * 100) : 0,
          pending,
        })
      } catch (error) {
        console.error("Error fetching predictions:", error)
        setError("Failed to load predictions. Using sample data instead.")

        // Use fallback data
        setPredictions(fallbackPredictions)

        // Calculate metrics from fallback data
        const total = fallbackPredictions.length
        const correct = fallbackPredictions.filter((p) => p.outcome === "correct").length
        const pending = fallbackPredictions.filter((p) => p.outcome === "pending").length

        setMetrics({
          total,
          correct,
          accuracy: total > 0 ? Math.round((correct / (total - pending)) * 100) : 0,
          pending,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPredictions()
    // Refresh data every 5 minutes
    const interval = setInterval(fetchPredictions, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const filteredPredictions = predictions.filter((prediction) => {
    if (activeTab === "all") return true
    if (activeTab === "pending") return prediction.outcome === "pending"
    if (activeTab === "verified") return prediction.outcome !== "pending"
    if (activeTab === "correct") return prediction.outcome === "correct"
    if (activeTab === "incorrect") return prediction.outcome === "incorrect"
    return true
  })

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Prediction Proof System</CardTitle>
          <CardDescription>Transparent verification of all predictions made by the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{metrics.total}</div>
                <p className="text-xs text-muted-foreground">Total Predictions</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{metrics.correct}</div>
                <p className="text-xs text-muted-foreground">Correct Predictions</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{metrics.accuracy}%</div>
                <p className="text-xs text-muted-foreground">Accuracy Rate</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{metrics.pending}</div>
                <p className="text-xs text-muted-foreground">Pending Verification</p>
              </CardContent>
            </Card>
          </div>

          {error && (
            <div className="mb-4 p-4 border rounded-md bg-yellow-50 text-yellow-800 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          )}

          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="verified">Verified</TabsTrigger>
              <TabsTrigger value="correct">Correct</TabsTrigger>
              <TabsTrigger value="incorrect">Incorrect</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {loading ? (
                <div className="flex justify-center py-8">
                  <p>Loading predictions...</p>
                </div>
              ) : filteredPredictions.length === 0 ? (
                <div className="flex justify-center py-8">
                  <p>No predictions found</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Asset</TableHead>
                        <TableHead>Prediction</TableHead>
                        <TableHead>Confidence</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Outcome</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPredictions.map((prediction) => (
                        <TableRow key={prediction.id}>
                          <TableCell>
                            <div className="font-medium">{prediction.asset_symbol}</div>
                            <div className="text-xs text-muted-foreground">{prediction.asset_name}</div>
                          </TableCell>
                          <TableCell>
                            {prediction.prediction_type === "price_up" ? (
                              <div className="flex items-center text-green-500">
                                <ArrowUpRight className="mr-1 h-4 w-4" />
                                <span>Up to {prediction.prediction_value}</span>
                              </div>
                            ) : (
                              <div className="flex items-center text-red-500">
                                <ArrowDownRight className="mr-1 h-4 w-4" />
                                <span>Down to {prediction.prediction_value}</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={prediction.confidence > 75 ? "default" : "outline"}>
                              {prediction.confidence}%
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                              <span title={new Date(prediction.timestamp).toLocaleString()}>
                                {formatDistanceToNow(new Date(prediction.timestamp), { addSuffix: true })}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {prediction.outcome === "pending" ? (
                              <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                                Pending
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                                Verified
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {prediction.outcome === "pending" ? (
                              <div className="flex items-center text-muted-foreground">
                                <Clock className="mr-1 h-4 w-4" />
                                <span>Pending</span>
                              </div>
                            ) : prediction.outcome === "correct" ? (
                              <div className="flex items-center text-green-500">
                                <CheckCircle className="mr-1 h-4 w-4" />
                                <span>Correct</span>
                              </div>
                            ) : (
                              <div className="flex items-center text-red-500">
                                <XCircle className="mr-1 h-4 w-4" />
                                <span>Incorrect</span>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

