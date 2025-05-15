"use client"

import { useState } from "react"
import { YieldCurveChart } from "@/components/charts/yield-curve-chart"
import { UnemploymentChart } from "@/components/charts/unemployment-chart"
import { GdpGrowthChart } from "@/components/charts/gdp-growth-chart"
import { ConsumerSentimentChart } from "@/components/charts/consumer-sentiment-chart"
import { LeadingIndicatorsChart } from "@/components/charts/leading-indicators-chart"
import { HousingStartsChart } from "@/components/charts/housing-starts-chart"
import { RecessionProbabilityGauge } from "@/components/recession-probability-gauge"
import { LatestBlogPost } from "@/components/latest-blog-post"
import { DateRangeSelector } from "@/components/date-range-selector"
import { calculateRecessionProbability } from "@/lib/calculate-recession-probability"

export default function RecessionDashboard() {
  // State for date range
  const [dateRange, setDateRange] = useState({
    startDate: (() => {
      const date = new Date();
      date.setFullYear(date.getFullYear() - 5); // Set to 5 years ago
      return date.toISOString().split('T')[0];
    })(),
    endDate: new Date().toISOString().split('T')[0],
  })

  // Handle date range changes
  const handleDateRangeChange = (range: { startDate: string; endDate: string }) => {
    setDateRange(range)
  }
  
  // Calculate the recession probability
  const recessionProbability = calculateRecessionProbability()

  return (
    <div className="container mx-auto px-4 sm:px-8 py-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-2">
        <div>
          <RecessionProbabilityGauge probability={recessionProbability} />
        </div>
        <div>
          <LatestBlogPost />
        </div>
      </div>

      {/* Sticky date range selector */}
      <div className="sticky top-0 py-2 z-50">
        <DateRangeSelector 
          onDateRangeChange={handleDateRangeChange}
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
        />
      </div>

      <div className="grid grid-cols-1 gap-8">
        <YieldCurveChart startDate={dateRange.startDate} endDate={dateRange.endDate} />
        <UnemploymentChart />
        <GdpGrowthChart />
        <ConsumerSentimentChart startDate={dateRange.startDate} endDate={dateRange.endDate} />
        <LeadingIndicatorsChart />
        <HousingStartsChart />
      </div>
    </div>
  )
}
