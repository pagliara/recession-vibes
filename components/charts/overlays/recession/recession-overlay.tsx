"use client"

import { historicalRecessionPeriods } from "@/components/charts/overlays/recession/recession-periods"
import React from "react" // React is needed for JSX
import { Label, ReferenceArea } from "recharts"

/**
 * Generates an array of ReferenceArea JSX elements for historical recession periods.
 * Uses default xAxisId and yAxisId="left" to match the chart configuration.
 */
export function renderRecessionReferenceAreas(): React.ReactNode[] {
  return historicalRecessionPeriods.map((period, index) => {
    const labelOffset = index % 2 === 0 ? 10 : 25; // Alternate offset
    return (
      <ReferenceArea
        key={`recession-${period.startDate}`}
        // Default xAxisId will be used automatically
        // Use the consistent left yAxisId across all charts
        yAxisId="left"
        x1={period.startDate}
        x2={period.endDate}
        fill="rgba(220, 53, 69, 0.15)" 
        fillOpacity={0.5}
        stroke="rgba(220, 53, 69, 0.5)"
        strokeOpacity={0.8}
        strokeWidth={1}
        isFront={false} // Render behind other elements
      >
        <Label
          value={period.name}
          position="insideTop"
          fill="#DC3545"
          fontSize={11}
          fontWeight="bold"
          offset={labelOffset}
        />
      </ReferenceArea>
    )
  })
}
