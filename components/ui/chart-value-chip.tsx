"use client"

import { TrendingDown, TrendingUp, Loader2 } from "lucide-react"

/**
 * Risk levels that can be associated with a metric value
 */
export type RiskLevel = 'high' | 'medium' | 'low' | 'custom';

export interface ChartValueChipProps {
  /**
   * The current value of the metric to display
   */
  value: number;
  
  /**
   * The previous value of the metric, used to determine trend direction
   */
  previousValue?: number;
  
  /**
   * The risk level associated with the current value
   */
  riskLevel: RiskLevel;
  
  /**
   * Whether the component is in a loading state
   */
  loading?: boolean;
  
  /**
   * Number of decimal places to display (defaults to 1)
   */
  decimals?: number;
  
  /**
   * Optional custom color to use instead of the risk level colors
   * Only used when riskLevel is 'custom'
   */
  customColor?: string;
  
  /**
   * Optional prefix to add before the value (e.g., '$', '+')
   */
  prefix?: string;
  
  /**
   * Optional suffix to add after the value (e.g., '%', 'pts')
   */
  suffix?: string;
}

/**
 * A reusable component for displaying metric values with trend indicators in charts
 */
export function ChartValueChip({
  value,
  previousValue,
  riskLevel,
  loading = false,
  decimals = 1,
  customColor,
  prefix = '',
  suffix = ''
}: ChartValueChipProps) {
  // Determine trend direction if previous value is provided
  const hasPreviousValue = previousValue !== undefined;
  const isDecreasing = hasPreviousValue ? value < previousValue : false;
  
  // Determine background color based on risk level
  const getBgColor = () => {
    if (riskLevel === 'custom' && customColor) return customColor;
    return riskLevel === "high" ? "bg-red-600" 
         : riskLevel === "medium" ? "bg-yellow-600" 
         : "bg-green-600";
  };
  
  if (loading) {
    return <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />;
  }
  
  return (
    <div
      className={`flex items-center w-min gap-1 px-3 py-1.5 rounded-full text-white font-medium ${getBgColor()}`}
    >
      <span className="text-lg text-nowrap">
        {prefix}{value.toFixed(decimals)}{suffix}
      </span>
      {hasPreviousValue && (
        isDecreasing 
          ? <TrendingDown className="h-4 w-4 ml-1" /> 
          : <TrendingUp className="h-4 w-4 ml-1" />
      )}
    </div>
  );
}
