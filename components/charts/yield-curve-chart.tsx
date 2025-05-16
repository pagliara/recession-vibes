"use client"

import { useEffect, useState } from "react"
import { Area, CartesianGrid, ComposedChart, ReferenceArea, ResponsiveContainer, ReferenceDot, XAxis, YAxis, Label } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Info, Loader2 } from "lucide-react"
import { historicalRecessionPeriods } from "@/components/charts/overlays/recession/recession-periods"; 
import { renderRecessionReferenceAreas } from "@/components/charts/overlays/recession/recession-overlay"; 
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label as UILabel } from "@/components/ui/label"
import { ChartHeader } from "@/components/ui/chart-header"

// Define the data structure for the yield curve data
type YieldCurveDataPoint = {
  date: number
  spread: number
}

// Define the spread type options
type SpreadType = 'T10Y2Y' | 'T10Y3M';

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
  data: {
    t10y2y: { date: string; spread: number }[]
    t10y3m: { date: string; spread: number }[]
  }
}

export function YieldCurveChart({ startDate, endDate, data: chartData }: YieldCurveChartProps) {
  // State for filtered data (what's displayed in the chart)
  const [filteredData, setFilteredData] = useState<YieldCurveDataPoint[]>([])
  // State for the complete dataset (used for historical analysis)
  const [fullDataset, setFullDataset] = useState<{
    t10y2y: YieldCurveDataPoint[],
    t10y3m: YieldCurveDataPoint[]
  }>({
    t10y2y: [],
    t10y3m: []
  })
  const [spreadType, setSpreadType] = useState<SpreadType>('T10Y2Y')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Enhanced transition points with recession association
  type EnhancedTransitionPoint = {
    index: number;        // Index in the filtered data array
    date: number;         // Timestamp of the transition
    daysToRecession?: number; // Days until next recession (optional)
    recessionName?: string;  // Name of the next recession (optional)
  };
  
  const [transitionPoints, setTransitionPoints] = useState<EnhancedTransitionPoint[]>([])
  const [averageDaysToRecession, setAverageDaysToRecession] = useState<number | null>(null)
  const [daysSinceLastTransition, setDaysSinceLastTransition] = useState<number | null>(null)
  const [recessionRiskPercent, setRecessionRiskPercent] = useState<number | null>(null)

  // Helper function to convert date strings to timestamps
  const parseData = (rawData: { date: string; spread: number }[]): YieldCurveDataPoint[] => {
    return rawData.map(item => ({
      ...item,
      date: new Date(item.date).getTime(),
    }));
  };
  
  // Helper function to get the current active dataset based on selected spread type
  const getCurrentDataset = () => {
    return spreadType === 'T10Y2Y' ? fullDataset.t10y2y : fullDataset.t10y3m;
  };

  // Process the provided data on component mount and when it changes
  useEffect(() => {
    setLoading(true)
    try {
      // Parse the data provided via props
      const parsedT10Y2YData = parseData(chartData.t10y2y)
      const parsedT10Y3MData = parseData(chartData.t10y3m)
      
      setFullDataset({
        t10y2y: parsedT10Y2YData,
        t10y3m: parsedT10Y3MData
      })
      setError(null)
    } catch (err: any) {
      console.error('Error processing treasury yield data:', err)
      setError(`Error processing data: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }, [chartData]) // Re-process when chartData changes

  // Filter data by date range and handle transition points calculation
  useEffect(() => {
    // Skip if no data or still loading
    if (loading || Object.keys(fullDataset).length === 0) return;
    
    const currentDataset = getCurrentDataset();
    
    let newFilteredData = [...currentDataset];
    
    // Filter by start date if provided
    if (startDate) {
      const startTimestamp = new Date(startDate).getTime();
      newFilteredData = newFilteredData.filter(item => item.date >= startTimestamp);
    }
    
    // Filter by end date if provided
    if (endDate) {
      const endTimestamp = new Date(endDate).getTime();
      newFilteredData = newFilteredData.filter(item => item.date <= endTimestamp);
    }
    
    // If no data after filtering, use full dataset (this is unlikely unless date range is invalid)
    if (newFilteredData.length === 0 && currentDataset.length > 0) {
      console.warn('No data points in selected date range, using full dataset');
      newFilteredData = [...currentDataset];
      
      // If showing the full dataset, set default dates to match
      if (newFilteredData.length > 0) {
        const firstDate = new Date(newFilteredData[0].date).toISOString().split('T')[0];
        const lastDate = new Date(newFilteredData[newFilteredData.length - 1].date).toISOString().split('T')[0];
        // This would ideally update the parent's state, but would need to be handled via prop callbacks
        // Instead, we just log a warning
        console.info(`Available data range: ${firstDate} to ${lastDate}`);
      }
    }
    
    setFilteredData(newFilteredData)
  }, [fullDataset, startDate, endDate, loading, spreadType]) // Re-filter when date range or full dataset changes

  // Use the most recent data points or fallback to defaults
  const currentSpread = filteredData.length > 0 ? filteredData[filteredData.length - 1].spread : 0
  const previousSpread = filteredData.length > 1 ? filteredData[filteredData.length - 2].spread : currentSpread
  const isInverted = currentSpread < 0
  const isWorsening = currentSpread < previousSpread

  // Calculate avg days to recession and days since last transition using full dataset
  useEffect(() => {
    // Get the appropriate dataset based on selected spread type
    const currentDataset = spreadType === 'T10Y2Y' ? fullDataset.t10y2y : fullDataset.t10y3m;
    
    // Don't calculate if dataset is too small
    if (currentDataset.length < 2) return;

    // Find all transition points in the full dataset (negative to positive only)
    const fullDatasetTransitions: {date: number}[] = [];
    
    for (let i = 1; i < currentDataset.length; i++) {
      // Only include points where previous was negative and current is positive
      if (currentDataset[i-1].spread < 0 && currentDataset[i].spread >= 0) {
        fullDatasetTransitions.push({
          date: currentDataset[i].date
        });
      }
    }
    
    // For each recession, find the closest preceding transition point
    const transitionToRecessionDays: number[] = [];
    
    for (const recession of historicalRecessionPeriods) {
      let closestPoint = null;
      let smallestTimeDiff = Infinity;
      
      // Find the transition point closest to but before this recession start
      for (const point of fullDatasetTransitions) {
        const timeDiff = recession.startDate - point.date;
        if (timeDiff > 0 && timeDiff < smallestTimeDiff) {
          smallestTimeDiff = timeDiff;
          closestPoint = point;
        }
      }
      
      if (closestPoint) {
        // Calculate days to recession
        const daysToRecession = Math.floor((recession.startDate - closestPoint.date) / (1000 * 60 * 60 * 24));
        transitionToRecessionDays.push(daysToRecession);
      }
    }
    
    // Calculate average days to recession using full historical data
    if (transitionToRecessionDays.length > 0) {
      const totalDays = transitionToRecessionDays.reduce((sum, days) => sum + days, 0);
      setAverageDaysToRecession(Math.round(totalDays / transitionToRecessionDays.length));
    } else {
      setAverageDaysToRecession(null);
    }
    
    // Calculate days since most recent transition using full dataset
    if (fullDatasetTransitions.length > 0) {
      // Sort by date in descending order to find the most recent transition
      const sortedByDate = [...fullDatasetTransitions].sort((a, b) => b.date - a.date);
      const mostRecentTransition = sortedByDate[0];
      
      // Calculate days since most recent transition
      const today = new Date().getTime();
      const daysSince = Math.round((today - mostRecentTransition.date) / (1000 * 60 * 60 * 24));
      setDaysSinceLastTransition(daysSince);
      
      // Calculate recession risk percentage based on how close we are to average days
      if (averageDaysToRecession) {
        // As we approach the average days to recession, risk increases
        // Risk is 100% when we reach or exceed the average days
        const riskPercent = Math.min(100, Math.round((daysSince / averageDaysToRecession) * 100));
        setRecessionRiskPercent(riskPercent);
      }
    } else {
      setDaysSinceLastTransition(null);
      setRecessionRiskPercent(null);
    }
  }, [fullDataset, spreadType, averageDaysToRecession]); // Recalculate when the full dataset or spread type changes
  
  // Calculate transition points for display in the current view
  useEffect(() => {
    if (filteredData.length < 2) return

    // First find all transition points (negative to positive) in the current view
    const allTransitionPoints: {index: number, date: number}[] = [];
    
    // Loop through data to find transitions
    for (let i = 1; i < filteredData.length; i++) {
      // Only include points where previous was negative and current is positive
      if (filteredData[i-1].spread < 0 && filteredData[i].spread >= 0) {
        allTransitionPoints.push({
          index: i,
          date: filteredData[i].date
        });
      }
    }
    
    // Array to hold transition points with recession information for display
    const enhancedTransitions: EnhancedTransitionPoint[] = [];
    
    // For each recession, find the closest preceding transition point
    for (const recession of historicalRecessionPeriods) {
      let closestPoint = null;
      let smallestTimeDiff = Infinity;
      
      // Find the transition point closest to but before this recession start
      for (const point of allTransitionPoints) {
        const timeDiff = recession.startDate - point.date;
        if (timeDiff > 0 && timeDiff < smallestTimeDiff) {
          smallestTimeDiff = timeDiff;
          closestPoint = point;
        }
      }
      
      if (closestPoint) {
        // Calculate days to recession
        const daysToRecession = Math.floor((recession.startDate - closestPoint.date) / (1000 * 60 * 60 * 24));
        
        // Add to our enhanced transition points with recession info
        enhancedTransitions.push({
          ...closestPoint,
          daysToRecession,
          recessionName: recession.name
        });
      }
    }
    
    // Only add the most recent transition point if we're not currently in a recession
    if (allTransitionPoints.length > 0) {
      const now = new Date().getTime();
      
      // Check if we're in a recession now
      const inRecession = historicalRecessionPeriods.some(recession => 
        now >= recession.startDate && now <= recession.endDate
      );
      
      if (!inRecession) {
        // For the most recent point we don't have recession info yet
        const lastPoint = allTransitionPoints[allTransitionPoints.length - 1];
        enhancedTransitions.push({
          ...lastPoint
        });
      }
    }
    
    // Remove any duplicates by index
    const uniqueTransitions = enhancedTransitions.filter(
      (point, index, self) => index === self.findIndex((p) => p.index === point.index)
    );
    
    // Use the already-calculated average days to recession from the full dataset
    // We don't recalculate it here, as we want to use the complete history
    
    setTransitionPoints(uniqueTransitions);
  }, [filteredData])

  // Convert string dates from props to numeric timestamps for the domain
  const numericStartDate = startDate ? new Date(startDate).getTime() : undefined;
  const numericEndDate = endDate ? new Date(endDate).getTime() : undefined;

  return (
    <section className="pb-6 border-b">
      <ChartHeader
        title="Treasury Yield Curve Spread"
        description={spreadType === 'T10Y2Y' 
          ? "The difference between 10-year and 2-year Treasury yields" 
          : "The difference between 10-year and 3-month Treasury yields"}
        value={daysSinceLastTransition ?? 0}
        riskLevel={daysSinceLastTransition !== null && daysSinceLastTransition > 0 ? 'high' : 'low'}
        loading={loading}
        error={error}
        valueSuffix=" days"
        valueDecimals={0}
        citations={[1, 2, 5]}
      >
        <div className="mt-2">
          <RadioGroup
            value={spreadType}
            onValueChange={(value) => setSpreadType(value as SpreadType)}
            className="flex space-x-4"
            defaultValue="T10Y2Y"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="T10Y2Y" id="t10y2y" />
              <UILabel htmlFor="t10y2y">10Y-2Y</UILabel>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="T10Y3M" id="t10y3m" />
              <UILabel htmlFor="t10y3m">10Y-3M</UILabel>
            </div>
          </RadioGroup>
        </div>
      </ChartHeader>

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
          <div className="h-[350px]">
            <ChartContainer
              config={{
                spread: {
                  label: "Spread (%)",
                  color: currentSpread < 0 ? "hsl(var(--chart-2))" : "hsl(var(--chart-1))",
                },
              }}
              className="h-full w-full"
            >
              <ComposedChart data={filteredData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                domain={['dataMin', 'dataMax']} // Always use the min/max of filtered data
                tickLine={false}
                axisLine={false}
                allowDataOverflow={true} // Ensure reference areas slightly outside data points can be shown
                tickFormatter={(value) => {
                  // Format date for display (MM/DD)
                  const date = new Date(value)
                  return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`
                }}
              />
              <YAxis id="0" tickLine={false} axisLine={false} tickFormatter={(value) => `${value.toFixed(2)}%`} />
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
              
              {/* Add circular markers at transition points with tooltips */}
              {transitionPoints
                .filter(point => 
                  // Safety check: only include points with valid indices in the current dataset
                  point.index >= 0 && 
                  point.index < filteredData.length && 
                  filteredData[point.index] !== undefined
                )
                .map((point, idx) => (
                  <ReferenceDot
                    key={`transition-${idx}`}
                    x={filteredData[point.index].date}
                    y={filteredData[point.index].spread}
                    r={6}
                    fill="hsl(var(--primary))"
                    stroke="white"
                    strokeWidth={2}
                    ifOverflow="extendDomain"
                  />
                ))}
             
            </ComposedChart>
        </ChartContainer>
        </div>
      </div>
      )}

      <div className="mt-4">
        {averageDaysToRecession && (
          <div className="flex align-start gap-2 mb-2">
            <Info className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Historically, when the {spreadType === 'T10Y2Y' ? '10Y-2Y' : '10Y-3M'} yield curve transitions from negative to positive, 
            a recession has followed in an average of {averageDaysToRecession} days (approximately {Math.round(averageDaysToRecession/30)} months).
            The circular markers on the chart indicate these transition points.
          </p>
          </div>
        )}
      </div>
    </section>
  )
}
