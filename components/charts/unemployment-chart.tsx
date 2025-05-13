"use client"

import { Line, LineChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Info, TrendingDown, TrendingUp } from "lucide-react"

// Mock weekly data for unemployment claims
const unemploymentData = [
  { week: "Jan 1", claims: 215, trend: 220 },
  { week: "Jan 8", claims: 220, trend: 221 },
  { week: "Jan 15", claims: 225, trend: 222 },
  { week: "Jan 22", claims: 218, trend: 223 },
  { week: "Jan 29", claims: 223, trend: 224 },
  { week: "Feb 5", claims: 230, trend: 226 },
  { week: "Feb 12", claims: 235, trend: 228 },
  { week: "Feb 19", claims: 240, trend: 230 },
  { week: "Feb 26", claims: 245, trend: 233 },
  { week: "Mar 5", claims: 250, trend: 236 },
  { week: "Mar 12", claims: 255, trend: 240 },
  { week: "Mar 19", claims: 260, trend: 244 },
  { week: "Mar 26", claims: 265, trend: 248 },
  { week: "Apr 2", claims: 270, trend: 252 },
  { week: "Apr 9", claims: 275, trend: 256 },
  { week: "Apr 16", claims: 280, trend: 260 },
  { week: "Apr 23", claims: 285, trend: 264 },
  { week: "Apr 30", claims: 290, trend: 268 },
  { week: "May 7", claims: 295, trend: 272 },
  { week: "May 14", claims: 300, trend: 276 },
]

export function UnemploymentChart() {
  const currentClaims = unemploymentData[unemploymentData.length - 1].claims
  const previousClaims = unemploymentData[unemploymentData.length - 2].claims
  const isRising = currentClaims > previousClaims
  const riskLevel = currentClaims > 250 ? "high" : currentClaims > 230 ? "medium" : "low"

  return (
    <section className="pb-6 border-b">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <h2 className="text-xl font-semibold">Initial Unemployment Claims</h2>
          <div
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-white font-medium ${
              isRising ? "bg-red-600" : "bg-green-600"
            }`}
          >
            <span className="text-lg">{currentClaims}k</span>
            {isRising ? <TrendingUp className="h-4 w-4 ml-1" /> : <TrendingDown className="h-4 w-4 ml-1" />}
          </div>
        </div>
        <Badge variant={riskLevel === "high" ? "destructive" : riskLevel === "medium" ? "default" : "outline"}>
          {riskLevel === "high" ? "High Risk" : riskLevel === "medium" ? "Medium Risk" : "Low Risk"}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-4">Weekly initial jobless claims (in thousands)</p>

      <div className="mb-4">
        <ChartContainer
          config={{
            claims: {
              label: "Claims (thousands)",
              color: "hsl(var(--chart-2))",
            },
            trend: {
              label: "4-Week Average",
              color: "hsl(var(--chart-4))",
            },
          }}
          className="h-[200px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={unemploymentData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="week" tickLine={false} axisLine={false} tickFormatter={(value) => value.split(" ")[1]} />
              <YAxis tickLine={false} axisLine={false} domain={["dataMin - 20", "dataMax + 20"]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="claims" stroke="hsl(var(--chart-2))" strokeWidth={3} dot={true} />
              <Line
                type="monotone"
                dataKey="trend"
                stroke="hsl(var(--chart-4))"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      <div className="mt-4">
        <div className="flex items-center gap-2 mb-2">
          <Info className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Rising unemployment claims often precede economic downturns.</p>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {riskLevel === "high"
            ? "Initial claims have been consistently rising for several weeks, suggesting deteriorating labor market conditions. This trend often precedes recessions."
            : riskLevel === "medium"
              ? "Claims are elevated but not yet at levels typically associated with imminent recession. The trend bears watching."
              : "Claims remain at historically low levels, suggesting a healthy labor market with low recession risk."}
        </p>
      </div>
    </section>
  )
}
