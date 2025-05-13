"use client"

import { useEffect, useState } from "react"
import { Area, CartesianGrid, ComposedChart, ReferenceArea, ResponsiveContainer, XAxis, YAxis, Label } from "recharts"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Info, Loader2, TrendingDown, TrendingUp } from "lucide-react"
import { historicalRecessionPeriods } from "@/components/charts/overlays/recession/recession-periods"; 
import { renderRecessionReferenceAreas } from "@/components/charts/overlays/recession/recession-overlay"; 

// Define the data structure for the yield curve data
type YieldCurveDataPoint = {
  date: number
  spread: number
}

// Default yield curve data (fallback if API fails)
export const defaultYieldCurveDataRaw = [
  { date: "2023-01-01", spread: 0.21 },
  { date: "2023-01-08", spread: 0.18 },
  { date: "2023-01-15", spread: 0.15 },
  { date: "2023-01-22", spread: 0.12 },
  { date: "2023-01-29", spread: 0.08 },
  { date: "2023-02-05", spread: 0.05 },
  { date: "2023-02-12", spread: 0.02 },
  { date: "2023-02-19", spread: -0.01 },
  { date: "2023-02-26", spread: -0.05 },
  { date: "2023-03-05", spread: -0.08 },
  { date: "2023-03-12", spread: -0.12 },
  { date: "2023-03-19", spread: -0.15 },
  { date: "2023-03-26", spread: -0.18 },
  { date: "2023-04-02", spread: -0.21 },
  { date: "2023-04-09", spread: -0.23 },
  { date: "2023-04-16", spread: -0.25 },
  { date: "2023-04-23", spread: -0.27 },
  { date: "2023-04-30", spread: -0.28 },
  { date: "2023-05-07", spread: -0.26 },
  { date: "2023-05-14", spread: -0.24 },
]

interface YieldCurveChartProps {
  startDate?: string
  endDate?: string
}

export function YieldCurveChart({ startDate, endDate }: YieldCurveChartProps) {
  const [data, setData] = useState<YieldCurveDataPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Helper function to convert date strings to timestamps
  const parseData = (rawData: { date: string; spread: number }[]): YieldCurveDataPoint[] => {
    return rawData.map(item => ({
      ...item,
      date: new Date(item.date).getTime(),
    }));
  };

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const queryParams = new URLSearchParams()
        if (startDate) queryParams.append('startDate', startDate)
        if (endDate) queryParams.append('endDate', endDate)

        const response = await fetch(`/api/treasury-curve?${queryParams}`)

        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`)
        }

        const result = await response.json()

        if (result.success && result.data && result.data.length > 0) {
          setData(parseData(result.data))
        } else {
          // Fallback to default data if no results
          setData(parseData(defaultYieldCurveDataRaw))
          setError('Could not retrieve data from FRED API. Using default data.')
        }
      } catch (err: any) {
        console.error('Error fetching treasury yield data:', err)
        setData(parseData(defaultYieldCurveDataRaw))
        setError(err.message || 'Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [startDate, endDate])

  // Use the most recent data points or fallback to defaults
  const currentSpread = data.length > 0 ? data[data.length - 1].spread : 0
  const previousSpread = data.length > 1 ? data[data.length - 2].spread : 0
  const isInverted = currentSpread < 0
  const isWorsening = currentSpread < previousSpread

  // Convert string dates from props to numeric timestamps for the domain
  const numericStartDate = startDate ? new Date(startDate).getTime() : undefined;
  const numericEndDate = endDate ? new Date(endDate).getTime() : undefined;

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

      {loading ? (
        <div className="flex items-center justify-center h-[200px] bg-muted/20 rounded-md">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="mb-4">
          {error && (
            <div className="mb-2 text-sm text-amber-600 bg-amber-50 p-2 rounded-md">
              {error}
            </div>
          )}
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
              <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
              <XAxis
                id="0"
                dataKey="date"
                type="number"
                domain={numericStartDate && numericEndDate ? [numericStartDate, numericEndDate] : ['dataMin', 'dataMax']}
                tickLine={false}
                axisLine={false}
                allowDataOverflow={true} // Ensure reference areas slightly outside data points can be shown
                tickFormatter={(value) => {
                  // Format date for display (MM/DD)
                  const date = new Date(value)
                  return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`
                }}
              />
              <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${value.toFixed(2)}%`} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(timestamp) => {
                      if (typeof timestamp === 'number') {
                        const date = new Date(timestamp);
                        return date.toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        });
                      }
                      return String(timestamp); // Fallback for unexpected types
                    }}
                  />
                }
              />
              
              {renderRecessionReferenceAreas()} {/* Call the function to render areas */}
              <Area
                type="monotone"
                dataKey="spread"
                stroke={currentSpread < 0 ? "var(--color-spread)" : "var(--color-spread)"}
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorSpread)"
                connectNulls={true}
              />
            </ComposedChart>
        </ResponsiveContainer>
        </ChartContainer>
      </div>
      )}

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
