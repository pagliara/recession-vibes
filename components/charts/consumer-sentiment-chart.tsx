"use client"

import { Line, LineChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Info, TrendingDown, TrendingUp } from "lucide-react"

// Mock weekly consumer sentiment data
const sentimentData = [
  { week: "Jan 1", sentiment: 75 },
  { week: "Jan 8", sentiment: 74 },
  { week: "Jan 15", sentiment: 73 },
  { week: "Jan 22", sentiment: 72 },
  { week: "Jan 29", sentiment: 71 },
  { week: "Feb 5", sentiment: 70 },
  { week: "Feb 12", sentiment: 69 },
  { week: "Feb 19", sentiment: 68 },
  { week: "Feb 26", sentiment: 67 },
  { week: "Mar 5", sentiment: 66 },
  { week: "Mar 12", sentiment: 65 },
  { week: "Mar 19", sentiment: 64 },
  { week: "Mar 26", sentiment: 63 },
  { week: "Apr 2", sentiment: 62 },
  { week: "Apr 9", sentiment: 61 },
  { week: "Apr 16", sentiment: 60 },
  { week: "Apr 23", sentiment: 59 },
  { week: "Apr 30", sentiment: 58 },
  { week: "May 7", sentiment: 57 },
  { week: "May 14", sentiment: 56 },
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
            <LineChart data={sentimentData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="week" tickLine={false} axisLine={false} tickFormatter={(value) => value.split(" ")[1]} />
              <YAxis tickLine={false} axisLine={false} domain={[50, 80]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="sentiment"
                stroke={currentSentiment < 65 ? "hsl(var(--chart-2))" : "hsl(var(--chart-1))"}
                strokeWidth={3}
                dot={true}
              />
            </LineChart>
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
