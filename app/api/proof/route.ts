import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    // Fetch predictions from the database
    const { data: predictions, error } = await supabase
      .from("predictions")
      .select(`
        id,
        asset_id,
        assets(name, symbol),
        prediction_type,
        prediction_value,
        confidence,
        timestamp,
        outcome,
        actual_value,
        verified_at
      `)
      .order("timestamp", { ascending: false })
      .limit(100)

    if (error) {
      throw error
    }

    // Format the predictions to match the expected structure
    const formattedPredictions = predictions.map((prediction) => ({
      id: prediction.id,
      asset_id: prediction.asset_id,
      asset_name: prediction.assets?.name || "Unknown",
      asset_symbol: prediction.assets?.symbol || "UNKNOWN",
      prediction_type: prediction.prediction_type,
      prediction_value: prediction.prediction_value,
      confidence: prediction.confidence,
      timestamp: prediction.timestamp,
      outcome: prediction.outcome,
      actual_value: prediction.actual_value,
      verified_at: prediction.verified_at,
    }))

    return NextResponse.json({
      predictions: formattedPredictions,
      success: true,
    })
  } catch (error) {
    console.error("Error fetching predictions:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch predictions",
        predictions: [],
      },
      { status: 500 },
    )
  }
}

