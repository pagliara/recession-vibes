"use client"

import { useState, useEffect } from "react"
import { Info } from "lucide-react"

type GaugeProps = {
  probability: number // 0-100
}

export function RecessionProbabilityGauge({ probability }: GaugeProps) {

  // Determine risk level and color
  const getRiskLevel = (prob: number) => {
    if (prob < 20) return { level: "Very Low", color: "text-green-600" }
    if (prob < 40) return { level: "Low", color: "text-green-500" }
    if (prob < 60) return { level: "Moderate", color: "text-yellow-500" }
    if (prob < 80) return { level: "High", color: "text-red-500" }
    return { level: "Very High", color: "text-red-600" }
  }

  const { level, color } = getRiskLevel(probability)

  return (
    <div className="w-full bg-white rounded-lg mb-8">
      <div className="flex flex-col items-start">
        <div className="flex items-center gap-2 mb-2">
        <h2 className="text-xl font-bold mb-2">Recession Probability</h2>
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-xl font-bold ${color}`}>{probability}%</span>
          <span className="text-lg font-medium text-muted-foreground">({level} Risk)</span>
        </div>
        </div>
        <div className="flex items-start gap-2 text-sm text-muted-foreground max-w-lg text-left">
          <p>
            This is a composite probability of recession based on the six economic indicators below.
            Each indicator is weighted according to its historical accuracy in predicting recessions.
          </p>
        </div>
      </div>
    </div>
  )
}
