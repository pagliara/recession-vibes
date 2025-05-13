import type { Metadata } from "next"
import { YieldCurveChart } from "@/components/charts/yield-curve-chart"
import { UnemploymentChart } from "@/components/charts/unemployment-chart"
import { GdpGrowthChart } from "@/components/charts/gdp-growth-chart"
import { ConsumerSentimentChart } from "@/components/charts/consumer-sentiment-chart"
import { LeadingIndicatorsChart } from "@/components/charts/leading-indicators-chart"
import { HousingStartsChart } from "@/components/charts/housing-starts-chart"
import { RecessionProbabilityGauge } from "@/components/recession-probability-gauge"
import { LatestBlogPost } from "@/components/latest-blog-post"
import { calculateRecessionProbability } from "@/lib/calculate-recession-probability"

export const metadata: Metadata = {
  title: "Recession Indicators Dashboard",
  description: "Weekly tracking of key economic indicators that signal recession risk",
}

export default function RecessionDashboard() {
  // Calculate the recession probability
  const recessionProbability = calculateRecessionProbability()

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Recession Indicators Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Weekly tracking of key economic indicators that signal recession risk
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <RecessionProbabilityGauge probability={recessionProbability} />
        </div>
        <div>
          <LatestBlogPost />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <YieldCurveChart />
        <UnemploymentChart />
        <GdpGrowthChart />
        <ConsumerSentimentChart />
        <LeadingIndicatorsChart />
        <HousingStartsChart />
      </div>
    </div>
  )
}
