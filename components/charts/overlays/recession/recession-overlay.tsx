"use client"

import { historicalRecessionPeriods } from "@/components/charts/overlays/recession/recession-periods"
import React from "react" // React is needed for JSX
import { Label, ReferenceArea } from "recharts"

/**
 * Generates an array of ReferenceArea JSX elements for historical recession periods.
 * Assumes default xAxisId="0" and yAxisId="0" if not specified otherwise in Recharts.
 */
export function renderRecessionReferenceAreas(): React.ReactNode[] {
  return historicalRecessionPeriods.map((period, index) => {
    const labelOffset = index % 2 === 0 ? 10 : 25; // Alternate offset
    return (
      <ReferenceArea
        key={period.name || period.startDate} // Use unique key
        xAxisId="0" // Ensure this matches your XAxis ID in the chart
        // yAxisId="0" // Add if you have a specific YAxis ID for ReferenceArea
        x1={period.startDate}
        x2={period.endDate}
        isFront={true}
        fill="rgba(220, 53, 69, 0.1)" 
        stroke="rgba(220, 53, 69, 0.3)"
        strokeOpacity={0.8}
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
