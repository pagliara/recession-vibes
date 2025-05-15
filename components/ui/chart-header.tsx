"use client"

import { Badge } from "@/components/ui/badge"
import { ChartValueChip, RiskLevel } from "@/components/ui/chart-value-chip"
import { ReactNode } from "react"
import { CitationLink } from "@/components/layout/footer"

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
   * Array of citation IDs to display as links
   */
  citations?: number[]
  
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
  citations = [],
  children
}: ChartHeaderProps) {
  return (
    <>
      <div className="flex flex-row items-start justify-between gap-2 mb-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="flex items-center gap-1">
            <h2 className="text-xl font-semibold">{title}</h2>
            {citations.length > 0 && (
              <span className="inline-flex gap-1 items-center">
                {citations.map((id, index) => (
                  <span key={id} className="text-xs font-semibold align-super -mt-3">
                    <a href={`#citation-${id}`} className="text-muted-foreground hover:text-primary">
                    {id}{index < citations.length - 1 ? "," : ""}
                    </a>
                  </span>
                ))}
              </span>
            )}
          </div>
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
