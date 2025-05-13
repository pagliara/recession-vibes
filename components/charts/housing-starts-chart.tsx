"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Info, TrendingDown, TrendingUp } from "lucide-react"

// Mock weekly housing starts data
const housingStartsData = [
  { week: "Jan 1", starts: 1450 },
  { week: "Jan 8", starts: 1430 },
  { week: "Jan 15", starts: 1410 },
  { week: "Jan 22", starts: 1390 },
  { week: "Jan 29", starts: 1370 },
  { week: "Feb 5", starts: 1350 },
  { week: "Feb 12", starts: 1330 },
  { week: "Feb 19", starts: 1310 },
  { week: "Feb 26", starts: 1290 },
  { week: "Mar 5", starts: 1270 },
  { week: "Mar 12", starts: 1250 },
  { week: "Mar 19", starts: 1230 },
  { week: "Mar 26", starts: 1210 },
  { week: "Apr 2", starts: 1190 },
  { week: "Apr 9", starts: 1170 },
  { week: "Apr 16", starts: 1150 },
  { week: "Apr 23", starts: 1130 },
  { week: "Apr 30", starts: 1110 },
  { week: "May 7", starts: 1090 },
  { week: "May 14", starts: 1070 },
]

export function HousingStartsChart() {
  const currentStarts = housingStartsData[housingStartsData.length - 1].starts
  const previousStarts = housingStartsData[housingStartsData.length - 2].starts
  const isDecreasing = currentStarts < previousStarts
  const riskLevel = currentStarts < 1100 ? "high" : currentStarts < 1300 ? "medium" : "low"

  return (
    <section className="pb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <h2 className="text-xl font-semibold">Housing Starts</h2>
          <div
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-white font-medium ${
              currentStarts < 1300 ? "bg-red-600" : "bg-green-600"
            }`}
          >
            <span className="text-lg">{currentStarts}k</span>
            {isDecreasing ? <TrendingDown className="h-4 w-4 ml-1" /> : <TrendingUp className="h-4 w-4 ml-1" />}
          </div>
        </div>
        <Badge variant={riskLevel === "high" ? "destructive" : riskLevel === "medium" ? "default" : "outline"}>
          {riskLevel === "high" ? "High Risk" : riskLevel === "medium" ? "Medium Risk" : "Low Risk"}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-4">Weekly housing starts (thousands of units, annualized)</p>

      <div className="mb-4">
        <ChartContainer
          config={{
            starts: {
              label: "Starts (thousands)",
              color: currentStarts < 1300 ? "hsl(var(--chart-2))" : "hsl(var(--chart-1))",
            },
          }}
          className="h-[200px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={housingStartsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="week" tickLine={false} axisLine={false} tickFormatter={(value) => value.split(" ")[1]} />
              <YAxis tickLine={false} axisLine={false} domain={[1000, 1500]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="starts"
                fill={currentStarts < 1300 ? "hsl(var(--chart-2))" : "hsl(var(--chart-1))"}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <div className="mt-4">
        <div className="flex items-center gap-2 mb-2">
          <Info className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Housing starts typically decline sharply before recessions.</p>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {riskLevel === "high"
            ? "Housing starts have fallen significantly, indicating weakness in the housing sector. This decline often precedes broader economic contraction."
            : riskLevel === "medium"
              ? "Housing starts are moderating but remain at moderate levels. This suggests some economic slowing but not yet recessionary conditions."
              : "Housing starts remain robust, suggesting continued economic strength and low recession risk."}
        </p>
      </div>
    </section>
  )
}
