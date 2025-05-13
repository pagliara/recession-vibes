"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Info, TrendingDown, TrendingUp } from "lucide-react"

// Mock weekly GDP growth nowcast data
const gdpData = [
  { week: "Jan 1", growth: 2.1 },
  { week: "Jan 8", growth: 2.0 },
  { week: "Jan 15", growth: 1.9 },
  { week: "Jan 22", growth: 1.8 },
  { week: "Jan 29", growth: 1.7 },
  { week: "Feb 5", growth: 1.6 },
  { week: "Feb 12", growth: 1.5 },
  { week: "Feb 19", growth: 1.4 },
  { week: "Feb 26", growth: 1.3 },
  { week: "Mar 5", growth: 1.2 },
  { week: "Mar 12", growth: 1.1 },
  { week: "Mar 19", growth: 1.0 },
  { week: "Mar 26", growth: 0.9 },
  { week: "Apr 2", growth: 0.8 },
  { week: "Apr 9", growth: 0.7 },
  { week: "Apr 16", growth: 0.6 },
  { week: "Apr 23", growth: 0.5 },
  { week: "Apr 30", growth: 0.4 },
  { week: "May 7", growth: 0.3 },
  { week: "May 14", growth: 0.2 },
]

export function GdpGrowthChart() {
  const currentGrowth = gdpData[gdpData.length - 1].growth
  const previousGrowth = gdpData[gdpData.length - 2].growth
  const isSlowing = currentGrowth < previousGrowth
  const riskLevel = currentGrowth < 0.5 ? "high" : currentGrowth < 1.0 ? "medium" : "low"

  return (
    <section className="pb-6 border-b">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <h2 className="text-xl font-semibold">GDP Growth Nowcast</h2>
          <div
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-white font-medium ${
              currentGrowth < 1.0 ? "bg-red-600" : "bg-green-600"
            }`}
          >
            <span className="text-lg">{currentGrowth.toFixed(1)}%</span>
            {isSlowing ? <TrendingDown className="h-4 w-4 ml-1" /> : <TrendingUp className="h-4 w-4 ml-1" />}
          </div>
        </div>
        <Badge variant={riskLevel === "high" ? "destructive" : riskLevel === "medium" ? "default" : "outline"}>
          {riskLevel === "high" ? "High Risk" : riskLevel === "medium" ? "Medium Risk" : "Low Risk"}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Weekly estimates of current quarter GDP growth (annualized %)
      </p>

      <div className="mb-4">
        <ChartContainer
          config={{
            growth: {
              label: "Growth (%)",
              color: currentGrowth < 1.0 ? "hsl(var(--chart-2))" : "hsl(var(--chart-1))",
            },
          }}
          className="h-[200px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={gdpData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="week" tickLine={false} axisLine={false} tickFormatter={(value) => value.split(" ")[1]} />
              <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="growth"
                fill={currentGrowth < 1.0 ? "hsl(var(--chart-2))" : "hsl(var(--chart-1))"}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <div className="mt-4">
        <div className="flex items-center gap-2 mb-2">
          <Info className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            GDP growth below 1% indicates economic weakness; negative growth defines a recession.
          </p>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {riskLevel === "high"
            ? "GDP growth estimates have fallen significantly and are approaching zero, suggesting high recession risk in the near term."
            : riskLevel === "medium"
              ? "Growth is slowing but remains positive. This suggests economic weakness but not yet recessionary conditions."
              : "Growth remains solid, indicating low recession risk in the immediate future."}
        </p>
      </div>
    </section>
  )
}
