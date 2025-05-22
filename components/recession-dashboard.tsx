"use client"

import { useState } from "react"
import { YieldCurveChart } from "@/components/charts/yield-curve-chart"
import { ConsumerSentimentChart } from "@/components/charts/consumer-sentiment-chart"
import { HousingPermitsChart } from "@/components/charts/housing-permits-chart"
import { UnemploymentDataChart } from "@/components/charts/unemployment-data/unemployment-data-chart"
import { RecessionProbabilityGauge } from "@/components/recession-probability-gauge"
import { LatestBlogPost } from "@/components/latest-blog-post"
import { DateRangeSelector } from "@/components/date-range-selector"
import { OverlaySelector, OverlayOptions } from "@/components/overlay-selector"
import { calculateRecessionProbability } from "@/lib/calculate-recession-probability"
import { Footer } from "@/components/layout/footer"

interface RecessionDashboardProps {
  yieldCurveData: {
    t10y2y: { date: string; spread: number }[]
    t10y3m: { date: string; spread: number }[]
  }
  consumerSentimentData: { date: string; value: number }[]
  housingPermitsData: { date: string; value: number }[]
  unemploymentData: {
    unemploy: { date: string; value: number }[]
    u1rate: { date: string; value: number }[]
    emratio: { date: string; value: number }[]
  }
  nasdaqData: { date: string; value: number }[]
}

export default function RecessionDashboard({ 
  yieldCurveData, 
  consumerSentimentData, 
  housingPermitsData,
  unemploymentData,
  nasdaqData 
}: RecessionDashboardProps) {
  // State for date range
  const [dateRange, setDateRange] = useState({
    startDate: (() => {
      const date = new Date();
      date.setFullYear(date.getFullYear() - 5); // Set to 5 years ago
      return date.toISOString().split('T')[0];
    })(),
    endDate: new Date().toISOString().split('T')[0],
  })
  
  // State for chart overlay options
  const [overlayOptions, setOverlayOptions] = useState<OverlayOptions>({
    showRecessions: true,
    showNasdaq: false
  })

  // Handle date range changes
  const handleDateRangeChange = (range: { startDate: string; endDate: string }) => {
    setDateRange(range)
  }
  
  // Handle overlay changes
  const handleOverlayChange = (options: OverlayOptions) => {
    setOverlayOptions(options)
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

      {/* Sticky controls bar with date range and overlay selectors */}
      <div className="sticky top-0 py-2 z-50 bg-background/80 backdrop-blur-sm">
        <div className="flex justify-end gap-2 items-center mb-4">
          <OverlaySelector 
            defaultOptions={overlayOptions}
            onOverlayChange={handleOverlayChange}
          />
          <DateRangeSelector 
            onDateRangeChange={handleDateRangeChange}
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <YieldCurveChart 
          startDate={dateRange.startDate} 
          endDate={dateRange.endDate}
          data={yieldCurveData}
          nasdaqData={nasdaqData}
          overlayOptions={overlayOptions}
        />
        <ConsumerSentimentChart 
          startDate={dateRange.startDate} 
          endDate={dateRange.endDate}
          data={consumerSentimentData}
          nasdaqData={nasdaqData}
          overlayOptions={overlayOptions}
        />
        <HousingPermitsChart 
          startDate={dateRange.startDate} 
          endDate={dateRange.endDate}
          data={housingPermitsData}
          nasdaqData={nasdaqData}
          overlayOptions={overlayOptions}
        />
        <UnemploymentDataChart 
          startDate={dateRange.startDate} 
          endDate={dateRange.endDate}
          data={unemploymentData}
          nasdaqData={nasdaqData}
          overlayOptions={overlayOptions}
        />
      </div>

      <Footer />
    </div>
  )
}
