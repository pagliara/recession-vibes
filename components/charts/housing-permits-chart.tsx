"use client"

import { useEffect, useState } from "react"
import { Line, CartesianGrid, ComposedChart, ResponsiveContainer, XAxis, YAxis, Label } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Info, Loader2 } from "lucide-react"
import { renderRecessionReferenceAreas } from "@/components/charts/overlays/recession/recession-overlay"
import { ChartHeader } from "@/components/ui/chart-header"

// Define the data structures for our chart data
type HousingPermitsDataPoint = {
  date: number // timestamp
  value: number // housing permits value
}

// Separate type for moving average data points
type MADataPoint = {
  date: number // timestamp
  maValue: number // moving average value
}

// Default housing permits data (fallback if API fails)
const defaultHousingPermitsData = [
  { date: "2023-01-01", value: 1339 },
  { date: "2023-02-01", value: 1371 },
  { date: "2023-03-01", value: 1413 },
  { date: "2023-04-01", value: 1425 },
  { date: "2023-05-01", value: 1447 },
  { date: "2023-06-01", value: 1466 },
  { date: "2023-07-01", value: 1443 },
  { date: "2023-08-01", value: 1541 },
  { date: "2023-09-01", value: 1471 },
  { date: "2023-10-01", value: 1495 },
  { date: "2023-11-01", value: 1460 },
  { date: "2023-12-01", value: 1493 },
  { date: "2024-01-01", value: 1410 },
  { date: "2024-02-01", value: 1425 },
  { date: "2024-03-01", value: 1437 },
  { date: "2024-04-01", value: 1453 },
]

interface HousingPermitsChartProps {
  startDate?: string
  endDate?: string
}

export function HousingPermitsChart({ startDate, endDate }: HousingPermitsChartProps) {
  // State for filtered data (what's displayed in the chart)
  const [data, setData] = useState<HousingPermitsDataPoint[]>([])
  // State for the complete dataset
  const [fullDataset, setFullDataset] = useState<HousingPermitsDataPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // State for moving average data
  const [movingAverageData, setMovingAverageData] = useState<MADataPoint[]>([])
  // State for filtered moving average line
  const [filteredMALine, setFilteredMALine] = useState<MADataPoint[]>([])
  // State for risk assessment
  const [riskLevel, setRiskLevel] = useState<"low" | "medium" | "high">("medium")
  // State for current vs. average comparison
  const [currentVsMA, setCurrentVsMA] = useState<{
    current: number | null;
    previous: number | null;
    average: number | null;
    percentDifference: number | null;
  }>({
    current: null,
    previous: null,
    average: null,
    percentDifference: null,
  });

  // Helper function to convert date strings to timestamps
  const parseData = (rawData: { date: string; value: number }[]) => {
    return rawData.map(item => ({
      date: new Date(item.date).getTime(),
      value: item.value
    }));
  };

  // Fetch housing permits data from the API
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/housing-permits');
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Housing Permits API response:', result);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch housing permits data');
      }
      
      // Parse the data to convert string dates to timestamps
      const parsedData = parseData(result.data);
      
      // Store the full dataset
      setFullDataset(parsedData);
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching housing permits data:', err);
      setError(`${err.message}. Using fallback data.`);
      
      // Load default data as fallback
      console.log('Loading default housing permits data as fallback');
      setFullDataset(parseData(defaultHousingPermitsData));
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Filter data based on date range
  useEffect(() => {
    if (loading || fullDataset.length === 0) return;
    
    let filteredData = [...fullDataset];
    
    // Filter by start date if provided
    if (startDate) {
      const startTimestamp = new Date(startDate).getTime();
      filteredData = filteredData.filter(item => item.date >= startTimestamp);
    }
    
    // Filter by end date if provided
    if (endDate) {
      const endTimestamp = new Date(endDate).getTime();
      filteredData = filteredData.filter(item => item.date <= endTimestamp);
    }
    
    // If no data after filtering (or empty array), use full dataset but show warning
    if (filteredData.length === 0) {
      filteredData = [...fullDataset];
      console.warn('No data available in specified date range. Showing full dataset instead.');
    }
    
    setData(filteredData);
    
    // Calculate 50-day moving average on the full dataset first
    const maData = calculate50DayMA(fullDataset);
    
    // Then filter the MA data to match our current data range
    const filteredMA = maData.filter(maPoint => {
      return filteredData.some(dataPoint => dataPoint.date === maPoint.date);
    });
    
    setFilteredMALine(filteredMA);
    
    // Calculate risk levels based on the filtered data
    calculateRiskLevels(filteredData, filteredMA);
    
  }, [fullDataset, startDate, endDate, loading]);

  // Calculate 50-day moving average for each data point - returns MA data points
  const calculate50DayMA = (dataPoints: HousingPermitsDataPoint[]): MADataPoint[] => {
    if (!dataPoints || dataPoints.length === 0) return [];
    
    const windowSize = 50; // 50-day moving average
    const maData: MADataPoint[] = [];
    
    // Calculate MA for each point
    for (let i = 0; i < dataPoints.length; i++) {
      // Need at least windowSize points to calculate MA
      if (i >= windowSize - 1) {
        // Sum up the last windowSize values
        let sum = 0;
        let validPoints = 0;
        
        for (let j = 0; j < windowSize; j++) {
          const value = dataPoints[i - j].value;
          if (value !== null && !isNaN(value)) {
            sum += value;
            validPoints++;
          }
        }
        
        // Calculate the average if there are valid points
        const average = validPoints > 0 ? sum / validPoints : null;
        
        if (average !== null) {
          maData.push({
            date: dataPoints[i].date,
            maValue: average
          });
        }
      }
    }
    
    setMovingAverageData(maData);
    return maData;
  };
  
  // Calculate risk levels based on current data vs MA
  const calculateRiskLevels = (dataPoints: HousingPermitsDataPoint[], maData: MADataPoint[]) => {
    // Calculate current vs MA comparison if we have data
    if (dataPoints.length > 0 && maData.length > 0) {
      const mostRecentPoint = dataPoints[dataPoints.length - 1];
      // Get previous month's value if available
      const previousPoint = dataPoints.length > 1 ? dataPoints[dataPoints.length - 2] : null;
      const mostRecentMA = maData[maData.length - 1];
      
      const current = mostRecentPoint.value;
      const previous = previousPoint ? previousPoint.value : null;
      const average = mostRecentMA.maValue;
      
      // Calculate percent difference
      const percentDiff = ((current - average) / average) * 100;
      
      setCurrentVsMA({
        current,
        previous,
        average,
        percentDifference: percentDiff
      });
      
      // Determine risk level based on percent difference
      if (percentDiff < -15) {
        setRiskLevel("high");
      } else if (percentDiff < -5) {
        setRiskLevel("medium");
      } else {
        setRiskLevel("low");
      }
    }
  };

  return (
    <section className="space-y-4">
      <ChartHeader 
        title="Housing Building Permits" 
        description="New Privately-Owned Housing Units Authorized in Permit-Issuing Places" 
        value={currentVsMA.current || 0}
        previousValue={currentVsMA.previous || 0}
        riskLevel={riskLevel}
        citations={[4, 5]}
      />
      
      {loading ? (
        <div className="flex justify-center items-center h-[400px] bg-background/50 rounded-md border">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading housing permits data...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-[400px] bg-destructive/10 rounded-md border border-destructive">
          <div className="flex flex-col items-center gap-2 p-4 text-center">
            <p className="font-medium text-destructive">Error loading housing permits data</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      ) : (
        <div className="rounded-md border p-2">
          <div className="h-[350px]">
            <ChartContainer 
              className="h-full"
              config={{
                value: {
                  label: "Housing Permits",
                  color: riskLevel === "high" ? "rgb(220, 38, 38)" : riskLevel === "medium" ? "rgb(202, 138, 4)" : "rgb(22, 163, 74)"
                },
                maValue: {
                  label: "50-day MA",
                  color: "hsl(var(--foreground))"
                }
              }}
            >
                <ComposedChart data={data} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
                  <defs>
                    <linearGradient id="colorHousingPermits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="date"
                    type="number"
                    domain={['dataMin', 'dataMax']}
                    tickLine={false}
                    axisLine={false}
                    scale="time"
                    padding={{ left: 10, right: 10 }}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(timestamp) => {
                      // Format date for display (MM/YYYY)
                      const date = new Date(timestamp);
                      return `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear().toString().substr(2, 2)}`;
                    }}
                    allowDataOverflow
                  />
                  <YAxis 
                    tickLine={false} 
                    axisLine={false} 
                    width={50}
                    domain={[0, 'dataMax + 200']}
                    padding={{ top: 40, bottom: 20 }}
                    allowDecimals={false}
                    allowDataOverflow
                    tickFormatter={(value) => (value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value)}
                  >
                    <Label
                      value="Units (thousands)"
                      position="insideLeft"
                      angle={-90}
                      style={{ textAnchor: 'middle', fill: 'var(--muted-foreground)' }}
                      className="text-xs fill-muted-foreground"
                      offset={-25}
                    />
                  </YAxis>
                  
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        labelFormatter={(timestamp) => {
                          if (typeof timestamp === 'number') {
                            const date = new Date(timestamp);
                            return date.toLocaleDateString(undefined, {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            });
                          }
                          return String(timestamp);
                        }}
                      />
                    }
                  />
                  
                  {/* Add the 50-day moving average dotted line */}
                  <Line
                    type="monotone"
                    data={filteredMALine}
                    dataKey="maValue" // Using a different dataKey to avoid conflicts
                    name="50-day MA"
                    stroke="hsl(var(--foreground))"
                    strokeWidth={1.5}
                    strokeDasharray="5 5"
                    dot={false}
                    activeDot={false}
                    connectNulls={true}
                    isAnimationActive={true}
                  />
                  
                  {/* Main permits line with dots */}
                  <Line
                    type="monotone"
                    dataKey="value"
                    name="Housing Permits"
                    stroke={riskLevel === "high" ? "rgb(220, 38, 38)" : riskLevel === "medium" ? "rgb(202, 138, 4)" : "rgb(22, 163, 74)"}
                    strokeWidth={2}
                    // Use the dot property to control density
                    dot={(props) => {
                      // Only render dots at specific intervals (adjust pointDensity to control density)
                      const pointDensity = 3;
                      const { cx, cy, index, payload } = props;
                      // Always show first and last points, plus every Nth point
                      if (index % pointDensity === 0 || index === 0 || index === (data.length - 1)) {
                        return (
                          <circle 
                            key={`dot-${index}`}
                            cx={cx} 
                            cy={cy} 
                            r={3} 
                            fill={riskLevel === "high" ? "rgb(220, 38, 38)" : riskLevel === "medium" ? "rgb(202, 138, 4)" : "rgb(22, 163, 74)"} 
                            className="recharts-dot"
                          />
                        );
                      }
                      // For points we don't want to show, render an invisible dot
                      return <circle key={`dot-${index}`} cx={cx} cy={cy} r={0} fill="transparent" />;
                    }}
                    activeDot={{ r: 5, strokeWidth: 1 }}
                    connectNulls={true}
                  />
                  {renderRecessionReferenceAreas()} {/* Use the recession overlay */}
                </ComposedChart>
            </ChartContainer>
          </div>
        </div>
      )}

      <div className="mt-4">
        <div className="flex items-start gap-2 mb-2">
          <Info className="h-5 w-5 mt-0.5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">
              Housing Building Permits track the number of new privately-owned housing units 
              authorized in permit-issuing places, a key leading indicator of future construction activity.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {riskLevel === "high"
                ? "Housing permits have fallen significantly below the 50-day moving average, suggesting a substantial slowdown in future housing construction and possible economic contraction."
                : riskLevel === "medium"
                  ? "Housing permits are moderately below the 50-day moving average, indicating some weakness in the housing sector."
                  : "Housing permits remain robust relative to the 50-day moving average, suggesting continued strength in housing construction."}
            </p>
            {currentVsMA.percentDifference !== null && (
              <p className="text-sm font-medium mt-1">
                Current value is {Math.abs(currentVsMA.percentDifference).toFixed(1)}% 
                {currentVsMA.percentDifference >= 0 ? " above " : " below "} 
                the 50-day moving average.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
