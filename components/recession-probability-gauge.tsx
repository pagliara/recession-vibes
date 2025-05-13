"use client"

import { useState, useEffect } from "react"
import { Info } from "lucide-react"

type GaugeProps = {
  probability: number // 0-100
}

export function RecessionProbabilityGauge({ probability }: GaugeProps) {
  const [mounted, setMounted] = useState(false)

  // Handle hydration mismatch by only rendering on client
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Determine risk level and color
  const getRiskLevel = (prob: number) => {
    if (prob < 20) return { level: "Very Low", color: "bg-green-600" }
    if (prob < 40) return { level: "Low", color: "bg-green-500" }
    if (prob < 60) return { level: "Moderate", color: "bg-yellow-500" }
    if (prob < 80) return { level: "High", color: "bg-red-500" }
    return { level: "Very High", color: "bg-red-600" }
  }

  const { level, color } = getRiskLevel(probability)

  // Calculate rotation for the gauge needle (0-180 degrees)
  const needleRotation = (probability / 100) * 180

  return (
    <div className="w-full bg-white p-6 rounded-lg mb-8">
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-2">Recession Probability</h2>
        <div className="flex items-center gap-2 mb-6">
          <span className={`text-3xl font-bold ${color.replace("bg-", "text-")}`}>{probability}%</span>
          <span className="text-lg font-medium text-muted-foreground">({level} Risk)</span>
        </div>

        {/* Gauge */}
        <div className="relative w-full max-w-md h-32 mb-4">
          {/* Gauge Background */}
          <div className="absolute w-full h-full flex justify-center">
            <div className="w-full h-32 overflow-hidden">
              <div
                className="w-full h-64 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-600"
                style={{
                  clipPath: "polygon(0% 50%, 100% 50%, 100% 100%, 0% 100%)",
                }}
              ></div>
            </div>
          </div>

          {/* Gauge Needle */}
          <div className="absolute w-full h-full flex justify-center">
            <div
              className="w-1 h-32 bg-gray-800 origin-bottom transform transition-transform duration-1000 ease-in-out"
              style={{
                transformOrigin: "bottom center",
                transform: `translateY(0%) rotate(${needleRotation - 90}deg)`,
              }}
            >
              <div className="w-3 h-3 rounded-full bg-gray-800 -ml-1"></div>
            </div>
          </div>

          {/* Gauge Markings */}
          <div className="absolute w-full h-full flex justify-between px-4 pt-24">
            <div className="text-xs font-medium">0%</div>
            <div className="text-xs font-medium">25%</div>
            <div className="text-xs font-medium">50%</div>
            <div className="text-xs font-medium">75%</div>
            <div className="text-xs font-medium">100%</div>
          </div>
        </div>

        <div className="flex items-start gap-2 text-sm text-muted-foreground mt-2 max-w-lg text-center">
          <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <p>
            This gauge represents the composite probability of recession based on the six economic indicators below.
            Each indicator is weighted according to its historical accuracy in predicting recessions.
          </p>
        </div>
      </div>
    </div>
  )
}
