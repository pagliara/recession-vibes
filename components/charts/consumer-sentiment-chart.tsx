"use client"

import { Line, CartesianGrid, ComposedChart, ReferenceArea, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Info, TrendingDown, TrendingUp } from "lucide-react"
import { RecessionOverlay } from "@/components/charts/overlays/recession/recession-overlay"

// Mock weekly consumer sentiment data with ISO date format
const sentimentData = [
  { date: "2023-01-01", week: "Jan 1", sentiment: 75 },
  { date: "2023-01-08", week: "Jan 8", sentiment: 74 },
  { date: "2023-01-15", week: "Jan 15", sentiment: 73 },
  { date: "2023-01-22", week: "Jan 22", sentiment: 72 },
  { date: "2023-01-29", week: "Jan 29", sentiment: 71 },
  { date: "2023-02-05", week: "Feb 5", sentiment: 70 },
  { date: "2023-02-12", week: "Feb 12", sentiment: 69 },
  { date: "2023-02-19", week: "Feb 19", sentiment: 68 },
  { date: "2023-02-26", week: "Feb 26", sentiment: 67 },
  { date: "2023-03-05", week: "Mar 5", sentiment: 66 },
  { date: "2023-03-12", week: "Mar 12", sentiment: 65 },
  { date: "2023-03-19", week: "Mar 19", sentiment: 64 },
  { date: "2023-03-26", week: "Mar 26", sentiment: 63 },
  { date: "2023-04-02", week: "Apr 2", sentiment: 62 },
  { date: "2023-04-09", week: "Apr 9", sentiment: 61 },
  { date: "2023-04-16", week: "Apr 16", sentiment: 60 },
  { date: "2023-04-23", week: "Apr 23", sentiment: 59 },
  { date: "2023-04-30", week: "Apr 30", sentiment: 58 },
  { date: "2023-05-07", week: "May 7", sentiment: 57 },
  { date: "2023-05-14", week: "May 14", sentiment: 56 },
]

export function ConsumerSentimentChart() {
  const currentSentiment = sentimentData[sentimentData.length - 1].sentiment
  const previousSentiment = sentimentData[sentimentData.length - 2].sentiment
  const isDecreasing = currentSentiment < previousSentiment
  const riskLevel = currentSentiment < 60 ? "high" : currentSentiment < 70 ? "medium" : "low"

  return (
    <section className="pb-6 border-b">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <h2 className="text-xl font-semibold">Consumer Sentiment Index</h2>
          <div
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-white font-medium ${
              currentSentiment < 65 ? "bg-red-600" : "bg-green-600"
            }`}
          >
            <span className="text-lg">{currentSentiment}</span>
            {isDecreasing ? <TrendingDown className="h-4 w-4 ml-1" /> : <TrendingUp className="h-4 w-4 ml-1" />}
          </div>
        </div>
        <Badge variant={riskLevel === "high" ? "destructive" : riskLevel === "medium" ? "default" : "outline"}>
          {riskLevel === "high" ? "High Risk" : riskLevel === "medium" ? "Medium Risk" : "Low Risk"}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-4">Weekly consumer sentiment readings (index value)</p>

      <div className="mb-4">
        <ChartContainer
          config={{
            sentiment: {
              label: "Sentiment",
              color: currentSentiment < 65 ? "hsl(var(--chart-2))" : "hsl(var(--chart-1))",
            },
          }}
          className="h-[200px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={sentimentData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }} />
              <YAxis tickLine={false} axisLine={false} domain={[50, 80]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              {/* Recession periods */}
              <ReferenceArea x1={2} x2={7} fill="rgba(220, 53, 69, 0.2)" fillOpacity={0.8} strokeOpacity={0.8} stroke="#dc3545" label={{value: "Mock Recession 1", position: "insideTop", fill: "#dc3545"}} />
              <ReferenceArea x1={13} x2={16} fill="rgba(220, 53, 69, 0.2)" fillOpacity={0.8} strokeOpacity={0.8} stroke="#dc3545" label={{value: "Mock Recession 2", position: "insideTop", fill: "#dc3545"}} />
              <Line
                type="monotone"
                dataKey="sentiment"
                stroke={currentSentiment < 65 ? "hsl(var(--chart-2))" : "hsl(var(--chart-1))"}
                strokeWidth={3}
                dot={true}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <div className="mt-4">
        <div className="flex items-center gap-2 mb-2">
          <Info className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Consumer sentiment often falls sharply before and during recessions.
          </p>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {riskLevel === "high"
            ? "Consumer sentiment has fallen to levels typically seen during economic downturns. This suggests consumers are pessimistic about future economic conditions."
            : riskLevel === "medium"
              ? "Sentiment is weakening but remains above levels typically associated with recessions. The trend bears watching."
              : "Consumer sentiment remains relatively strong, suggesting continued consumer spending and economic growth."}
        </p>
      </div>
    </section>
  )
}
