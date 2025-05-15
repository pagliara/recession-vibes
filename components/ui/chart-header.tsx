"use client"

import { Badge } from "@/components/ui/badge"
import { ChartValueChip, RiskLevel } from "@/components/ui/chart-value-chip"
import { ReactNode } from "react"

export interface ChartHeaderProps {
  /**
   * The title of the chart
   */
  title: string
  
  /**
   * Description text to display below the title
   */
  description: string
  
  /**
   * Current value to display in the ChartValueChip
   */
  value: number
  
  /**
   * Previous value to determine trend direction
   */
  previousValue?: number
  
  /**
   * Risk level associated with the current value
   */
  riskLevel: RiskLevel
  
  /**
   * Loading state for the chart data
   */
  loading?: boolean
  
  /**
   * Optional error message to display
   */
  error?: string | null
  
  /**
   * Optional suffix to add after the value (e.g., '%', 'pts', 'days')
   */
  valueSuffix?: string
  
  /**
   * Number of decimal places to display in the value (defaults to 1)
   */
  valueDecimals?: number
  
  /**
   * Optional custom color for the chart value chip
   */
  customValueColor?: string
  
  /**
   * Optional additional content to display in the header
   */
  children?: ReactNode
}

/**
 * A reusable component for chart headers with consistent styling and functionality
 */
export function ChartHeader({
  title,
  description,
  value,
  previousValue,
  riskLevel,
  loading = false,
  error = null,
  valueSuffix = '',
  valueDecimals = 1,
  customValueColor,
  children
}: ChartHeaderProps) {
  return (
    <>
      <div className="flex flex-row items-start justify-between gap-2 mb-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <h2 className="text-xl font-semibold">{title}</h2>
          <ChartValueChip
            value={value}
            previousValue={previousValue}
            riskLevel={riskLevel}
            loading={loading}
            suffix={valueSuffix}
            decimals={valueDecimals}
            customColor={customValueColor}
          />
        </div>
        <Badge variant={riskLevel === "high" ? "destructive" : riskLevel === "medium" ? "default" : "outline"}>
          {riskLevel === "high" ? "High Risk" : riskLevel === "medium" ? "Medium Risk" : "Low Risk"}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        {description} {error && <span className="text-red-500">({error})</span>}
      </p>
      {children}
    </>
  )
}
