"use client"

import React from 'react'
import { Line, YAxis } from 'recharts'

export interface NasdaqDataPoint {
  date: string | number // Can be ISO string or timestamp
  value: number
}

/**
 * Renders the NASDAQ overlay components directly.
 * Returns an array of React components (YAxis and Line) to be included in a ComposedChart.
 */
export function renderNasdaqOverlay(
  data: NasdaqDataPoint[] = [], 
  isVisible: boolean = false,
  isMobile: boolean = false,
  color: string = "rgba(0, 128, 255, 0.8)"
): React.ReactNode[] {
  // If overlay isn't visible or has no data, return empty array
  if (!isVisible || !data || data.length === 0) {
    return []
  }
  
  const components: React.ReactNode[] = []
  
  // NASDAQ Y-Axis 
    components.push(
      <YAxis
        key="nasdaq-axis"
        yAxisId="right"
        orientation="right"
        domain={['dataMin', 'dataMax']}
        tickLine={true}
        axisLine={true}
        tickFormatter={(value) => value.toLocaleString()}
        hide={isMobile}
        label={{
          value: "NASDAQ Index",
          angle: 90,
          position: "right",
          offset: 4,
          fill: color,
          fontSize: 12,
        }}
        style={{
          fill: color,
          fontSize: '10px',
        }}
      />
    )
  
  // NASDAQ Line Chart
  components.push(
    <Line
      key="nasdaq-line"
      type="monotone"
      data={data}
      dataKey="value"
      name="NASDAQ Index"
      yAxisId="right"
      stroke={color}
      dot={false}
      strokeWidth={2}
      connectNulls={true}
      activeDot={{ r: 6, strokeWidth: 1, stroke: '#fff' }}
    />
  )
  
  return components
}

// Helper function to normalize date format for consistent comparison
export function normalizeDate(date: string | number): number {
  if (typeof date === 'number') {
    return date
  }
  return new Date(date).getTime()
}

// Helper function to filter NASDAQ data based on the chart's date range
export function filterNasdaqData(
  data: NasdaqDataPoint[] | undefined,
  startDate?: string | number,
  endDate?: string | number
): NasdaqDataPoint[] {
  if (!data || data.length === 0) {
    return []
  }

  // If no dates provided, return all data
  if (!startDate && !endDate) {
    return data
  }

  const startTimestamp = startDate ? normalizeDate(startDate) : 0
  const endTimestamp = endDate ? normalizeDate(endDate) : Date.now()

  return data.filter(item => {
    const itemTimestamp = normalizeDate(item.date)
    return itemTimestamp >= startTimestamp && itemTimestamp <= endTimestamp
  }).map(item => ({
    ...item,
    // Ensure date is in timestamp format for consistency
    date: typeof item.date === 'string' ? new Date(item.date).getTime() : item.date
  }))
}
