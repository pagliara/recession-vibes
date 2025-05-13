"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Info, TrendingDown, TrendingUp } from "lucide-react"

// Export the data so it can be used by the recession probability calculator
export const yieldCurveData = [
  { week: "Jan 1", spread: 0.21 },
  { week: "Jan 8", spread: 0.18 },
  { week: "Jan 15", spread: 0.15 },
  { week: "Jan 22", spread: 0.12 },
  { week: "Jan 29", spread: 0.08 },
  { week: "Feb 5", spread: 0.05 },
  { week: "Feb 12", spread: 0.02 },
  { week: "Feb 19", spread: -0.01 },
  { week: "Feb 26", spread: -0.05 },
  { week: "Mar 5", spread: -0.08 },
  { week: "Mar 12", spread: -0.12 },
  { week: "Mar 19", spread: -0.15 },
  { week: "Mar 26", spread: -0.18 },
  { week: "Apr 2", spread: -0.21 },
  { week: "Apr 9", spread: -0.23 },
  { week: "Apr 16", spread: -0.25 },
  { week: "Apr 23", spread: -0.27 },
  { week: "Apr 30", spread: -0.28 },
  { week: "May 7", spread: -0.26 },
  { week: "May 14", spread: -0.24 },
]

export function YieldCurveChart() {
  const currentSpread = yieldCurveData[yieldCurveData.length - 1].spread
  const previousSpread = yieldCurveData[yieldCurveData.length - 2].spread
  const isInverted = currentSpread < 0
  const isWorsening = currentSpread < previousSpread

  return (
    <section className="pb-6 border-b">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <h2 className="text-xl font-semibold">Treasury Yield Curve Spread</h2>
          <div
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-white font-medium ${
              currentSpread < 0 ? "bg-red-600" : "bg-green-600"
            }`}
          >
            <span className="text-lg">{currentSpread.toFixed(2)}%</span>
            {isWorsening ? <TrendingDown className="h-4 w-4 ml-1" /> : <TrendingUp className="h-4 w-4 ml-1" />}
          </div>
        </div>
        <Badge variant={isInverted ? "destructive" : "outline"}>{isInverted ? "Inverted" : "Normal"}</Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-4">The difference between 10-year and 2-year Treasury yields</p>

      <div className="mb-4">
        <ChartContainer
          config={{
            spread: {
              label: "Spread (%)",
              color: currentSpread < 0 ? "hsl(var(--chart-2))" : "hsl(var(--chart-1))",
            },
          }}
          className="h-[200px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={yieldCurveData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSpread" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={currentSpread < 0 ? "hsl(var(--chart-2))" : "hsl(var(--chart-1))"}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={currentSpread < 0 ? "hsl(var(--chart-2))" : "hsl(var(--chart-1))"}
                    stopOpacity={0.2}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="week" tickLine={false} axisLine={false} tickFormatter={(value) => value.split(" ")[1]} />
              <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${value.toFixed(2)}%`} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="spread"
                stroke={currentSpread < 0 ? "var(--color-spread)" : "var(--color-spread)"}
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorSpread)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <div className="mt-4">
        <div className="flex items-center gap-2 mb-2">
          <Info className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            An inverted yield curve (negative spread) has historically preceded recessions.
          </p>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {isInverted
            ? "The yield curve is currently inverted, which has been a reliable recession indicator historically. The inversion has been in place for several weeks, suggesting increased recession risk."
            : "The yield curve remains positive, suggesting lower recession risk in the near term."}
        </p>
      </div>
    </section>
  )
}
