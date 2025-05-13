"use client"

import { Line, LineChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Info, TrendingDown, TrendingUp } from "lucide-react"

// Mock weekly leading economic indicators data
const leadingIndicatorsData = [
  { week: "Jan 1", index: 101.5 },
  { week: "Jan 8", index: 101.3 },
  { week: "Jan 15", index: 101.1 },
  { week: "Jan 22", index: 100.9 },
  { week: "Jan 29", index: 100.7 },
  { week: "Feb 5", index: 100.5 },
  { week: "Feb 12", index: 100.3 },
  { week: "Feb 19", index: 100.1 },
  { week: "Feb 26", index: 99.9 },
  { week: "Mar 5", index: 99.7 },
  { week: "Mar 12", index: 99.5 },
  { week: "Mar 19", index: 99.3 },
  { week: "Mar 26", index: 99.1 },
  { week: "Apr 2", index: 98.9 },
  { week: "Apr 9", index: 98.7 },
  { week: "Apr 16", index: 98.5 },
  { week: "Apr 23", index: 98.3 },
  { week: "Apr 30", index: 98.1 },
  { week: "May 7", index: 97.9 },
  { week: "May 14", index: 97.7 },
]

export function LeadingIndicatorsChart() {
  const currentIndex = leadingIndicatorsData[leadingIndicatorsData.length - 1].index
  const previousIndex = leadingIndicatorsData[leadingIndicatorsData.length - 2].index
  const isDecreasing = currentIndex < previousIndex
  const riskLevel = currentIndex < 98.5 ? "high" : currentIndex < 100 ? "medium" : "low"

  return (
    <section className="pb-6 border-b">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <h2 className="text-xl font-semibold">Leading Economic Indicators</h2>
          <div
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-white font-medium ${
              currentIndex < 100 ? "bg-red-600" : "bg-green-600"
            }`}
          >
            <span className="text-lg">{currentIndex.toFixed(1)}</span>
            {isDecreasing ? <TrendingDown className="h-4 w-4 ml-1" /> : <TrendingUp className="h-4 w-4 ml-1" />}
          </div>
        </div>
        <Badge variant={riskLevel === "high" ? "destructive" : riskLevel === "medium" ? "default" : "outline"}>
          {riskLevel === "high" ? "High Risk" : riskLevel === "medium" ? "Medium Risk" : "Low Risk"}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-4">Weekly composite index of leading economic indicators</p>

      <div className="mb-4">
        <ChartContainer
          config={{
            index: {
              label: "Index",
              color: currentIndex < 100 ? "hsl(var(--chart-2))" : "hsl(var(--chart-1))",
            },
          }}
          className="h-[200px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={leadingIndicatorsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="week" tickLine={false} axisLine={false} tickFormatter={(value) => value.split(" ")[1]} />
              <YAxis tickLine={false} axisLine={false} domain={[97, 102]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="index"
                stroke={currentIndex < 100 ? "hsl(var(--chart-2))" : "hsl(var(--chart-1))"}
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
            The index combines multiple leading indicators; values below 100 suggest contraction.
          </p>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {riskLevel === "high"
            ? "The leading indicators index has been declining for several months and is now well below 100, suggesting high recession probability in the next 6-9 months."
            : riskLevel === "medium"
              ? "The index has fallen below 100, indicating economic weakness. Continued declines would increase recession risk."
              : "The leading indicators index remains above 100, suggesting continued economic expansion in the near term."}
        </p>
      </div>
    </section>
  )
}
