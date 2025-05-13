"use client"

import { Bar, CartesianGrid, ComposedChart, ReferenceArea, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Info, TrendingDown, TrendingUp } from "lucide-react"
import { RecessionOverlay } from "@/components/charts/overlays/recession/recession-overlay"

// Mock weekly GDP growth nowcast data with ISO date format
const gdpData = [
  { date: "2023-01-01", week: "Jan 1", growth: 2.1 },
  { date: "2023-01-08", week: "Jan 8", growth: 2.0 },
  { date: "2023-01-15", week: "Jan 15", growth: 1.9 },
  { date: "2023-01-22", week: "Jan 22", growth: 1.8 },
  { date: "2023-01-29", week: "Jan 29", growth: 1.7 },
  { date: "2023-02-05", week: "Feb 5", growth: 1.6 },
  { date: "2023-02-12", week: "Feb 12", growth: 1.5 },
  { date: "2023-02-19", week: "Feb 19", growth: 1.4 },
  { date: "2023-02-26", week: "Feb 26", growth: 1.3 },
  { date: "2023-03-05", week: "Mar 5", growth: 1.2 },
  { date: "2023-03-12", week: "Mar 12", growth: 1.1 },
  { date: "2023-03-19", week: "Mar 19", growth: 1.0 },
  { date: "2023-03-26", week: "Mar 26", growth: 0.9 },
  { date: "2023-04-02", week: "Apr 2", growth: 0.8 },
  { date: "2023-04-09", week: "Apr 9", growth: 0.7 },
  { date: "2023-04-16", week: "Apr 16", growth: 0.6 },
  { date: "2023-04-23", week: "Apr 23", growth: 0.5 },
  { date: "2023-04-30", week: "Apr 30", growth: 0.4 },
  { date: "2023-05-07", week: "May 7", growth: 0.3 },
  { date: "2023-05-14", week: "May 14", growth: 0.2 },
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
            <ComposedChart data={gdpData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }} />
              <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              {/* Recession periods */}
              <ReferenceArea x1={2} x2={7} fill="rgba(220, 53, 69, 0.2)" fillOpacity={0.8} strokeOpacity={0.8} stroke="#dc3545" label={{value: "Mock Recession 1", position: "insideTop", fill: "#dc3545"}} />
              <ReferenceArea x1={13} x2={16} fill="rgba(220, 53, 69, 0.2)" fillOpacity={0.8} strokeOpacity={0.8} stroke="#dc3545" label={{value: "Mock Recession 2", position: "insideTop", fill: "#dc3545"}} />
              <Bar
                dataKey="growth"
                fill={currentGrowth < 1.0 ? "hsl(var(--chart-2))" : "hsl(var(--chart-1))"}
                radius={[4, 4, 0, 0]}
              />
            </ComposedChart>
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
