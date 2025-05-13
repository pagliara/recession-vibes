"use client"

import { Line, CartesianGrid, ComposedChart, ReferenceArea, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Info, TrendingDown, TrendingUp } from "lucide-react"
import { RecessionOverlay } from "@/components/charts/overlays/recession/recession-overlay"

// Mock weekly leading economic indicators data with ISO date format
const leadingIndicatorsData = [
  { date: "2023-01-01", week: "Jan 1", index: 101.5 },
  { date: "2023-01-08", week: "Jan 8", index: 101.3 },
  { date: "2023-01-15", week: "Jan 15", index: 101.1 },
  { date: "2023-01-22", week: "Jan 22", index: 100.9 },
  { date: "2023-01-29", week: "Jan 29", index: 100.7 },
  { date: "2023-02-05", week: "Feb 5", index: 100.5 },
  { date: "2023-02-12", week: "Feb 12", index: 100.3 },
  { date: "2023-02-19", week: "Feb 19", index: 100.1 },
  { date: "2023-02-26", week: "Feb 26", index: 99.9 },
  { date: "2023-03-05", week: "Mar 5", index: 99.7 },
  { date: "2023-03-12", week: "Mar 12", index: 99.5 },
  { date: "2023-03-19", week: "Mar 19", index: 99.3 },
  { date: "2023-03-26", week: "Mar 26", index: 99.1 },
  { date: "2023-04-02", week: "Apr 2", index: 98.9 },
  { date: "2023-04-09", week: "Apr 9", index: 98.7 },
  { date: "2023-04-16", week: "Apr 16", index: 98.5 },
  { date: "2023-04-23", week: "Apr 23", index: 98.3 },
  { date: "2023-04-30", week: "Apr 30", index: 98.1 },
  { date: "2023-05-07", week: "May 7", index: 97.9 },
  { date: "2023-05-14", week: "May 14", index: 97.7 },
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
            <ComposedChart data={leadingIndicatorsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }} />
              <YAxis tickLine={false} axisLine={false} domain={[97, 102]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              {/* Recession periods */}
              <ReferenceArea x1={2} x2={7} fill="rgba(220, 53, 69, 0.2)" fillOpacity={0.8} strokeOpacity={0.8} stroke="#dc3545" label={{value: "Mock Recession 1", position: "insideTop", fill: "#dc3545"}} />
              <ReferenceArea x1={13} x2={16} fill="rgba(220, 53, 69, 0.2)" fillOpacity={0.8} strokeOpacity={0.8} stroke="#dc3545" label={{value: "Mock Recession 2", position: "insideTop", fill: "#dc3545"}} />
              <Line
                type="monotone"
                dataKey="index"
                stroke={currentIndex < 100 ? "hsl(var(--chart-2))" : "hsl(var(--chart-1))"}
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
