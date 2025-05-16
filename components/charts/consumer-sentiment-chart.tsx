"use client"

import { useEffect, useState } from "react"
import { Line, CartesianGrid, ComposedChart, ReferenceArea, ResponsiveContainer, XAxis, YAxis, Label } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Info, Loader2 } from "lucide-react"
import { historicalRecessionPeriods } from "@/components/charts/overlays/recession/recession-periods"
import { renderRecessionReferenceAreas } from "@/components/charts/overlays/recession/recession-overlay"
import { ChartHeader } from "@/components/ui/chart-header"
// Define the data structures for our chart data
type ConsumerSentimentDataPoint = {
  date: number // timestamp
  value: number // sentiment index value
}

// Separate type for moving average data points
type MADataPoint = {
  date: number // timestamp
  maValue: number // moving average value
}

// Default consumer sentiment data (fallback if API fails)
const defaultConsumerSentimentData = [
  { date: "2023-01-01", value: 64.9 },
  { date: "2023-02-01", value: 67.0 },
  { date: "2023-03-01", value: 62.0 },
  { date: "2023-04-01", value: 63.5 },
  { date: "2023-05-01", value: 59.2 },
  { date: "2023-06-01", value: 64.4 },
  { date: "2023-07-01", value: 71.6 },
  { date: "2023-08-01", value: 69.5 },
  { date: "2023-09-01", value: 68.1 },
  { date: "2023-10-01", value: 63.8 },
  { date: "2023-11-01", value: 61.3 },
  { date: "2023-12-01", value: 69.7 },
  { date: "2024-01-01", value: 79.0 },
  { date: "2024-02-01", value: 76.9 },
  { date: "2024-03-01", value: 79.4 },
  { date: "2024-04-01", value: 77.2 },
]

interface ConsumerSentimentChartProps {
  startDate?: string
  endDate?: string
  data: { date: string; value: number }[]
}

export function ConsumerSentimentChart({ startDate, endDate, data: chartData }: ConsumerSentimentChartProps) {
  // State for filtered data (what's displayed in the chart)
  const [data, setData] = useState<ConsumerSentimentDataPoint[]>([])
  // State for the complete dataset
  const [fullDataset, setFullDataset] = useState<ConsumerSentimentDataPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Helper function to convert date strings to timestamps
  const parseData = (rawData: { date: string; value: number }[]) => {
    return rawData.map(item => ({
      date: new Date(item.date).getTime(),
      value: item.value
    }));
  };

  // No longer needed as data is passed via props

  // Process data when component mounts or data changes
  useEffect(() => {
    setLoading(true);
    try {
      // Parse the data to convert string dates to timestamps
      const parsedData = parseData(chartData);
      
      // Store the full dataset
      setFullDataset(parsedData);
      setError(null);
    } catch (err: any) {
      console.error('Error processing consumer sentiment data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [chartData]);

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
      setError('No data available for the selected date range. Showing full dataset.');
    } else {
      // Clear any previous errors if we have data
      if (error === 'No data available for the selected date range. Showing full dataset.') {
        setError(null);
      }
    }
    
    setData(filteredData);
  }, [fullDataset, startDate, endDate, loading, error]);

  // Calculate 200-day moving average for each data point and overall stats
  const calculate200DayMA = () => {
    if (fullDataset.length === 0) {
      return { average: 0, high: 0, low: 0, maLine: [] };
    }

    // Sort by date (ascending) to ensure chronological order
    const sortedData = [...fullDataset].sort((a, b) => a.date - b.date);
    
    // Period for moving average (200 days in ms)
    const maPeriod = 200 * 24 * 60 * 60 * 1000;
    
    // Calculate MA for each point by looking back 200 days
    const maLine: MADataPoint[] = [];
    let overallHigh = -Infinity;
    let overallLow = Infinity;
    let sumValues = 0;
    let countValues = 0;
    
    // For each data point, calculate its 200-day MA
    sortedData.forEach((point, index) => {
      // Find all points within 200 days before this point
      const window = sortedData.filter(
        p => p.date <= point.date && p.date >= (point.date - maPeriod)
      );
      
      if (window.length > 0) {
        const values = window.map(p => p.value);
        const ma = values.reduce((sum, v) => sum + v, 0) / values.length;
        
        // Add to MA line with a dedicated type for MA points
        maLine.push({
          date: point.date,
          maValue: ma
        });
        
        // Update overall stats
        overallHigh = Math.max(overallHigh, ma);
        overallLow = Math.min(overallLow, ma);
        sumValues += ma;
        countValues++;
      }
    });
    
    // Calculate overall average of the MA line
    const average = countValues > 0 ? sumValues / countValues : 0;
    
    return { 
      average, 
      high: overallHigh, 
      low: overallLow, 
      maLine 
    };
  };

  // Get the 200-day moving average stats and line data
  const { average: ma200, high: ma200High, low: ma200Low, maLine } = calculate200DayMA();
  
  // Filter maLine to match the date range displayed on the chart
  const filteredMALine = maLine.filter(point => {
    if (!data.length) return true;
    const minDate = Math.min(...data.map(d => d.date));
    const maxDate = Math.max(...data.map(d => d.date));
    return point.date >= minDate && point.date <= maxDate;
  }) as MADataPoint[];
  
  // Calculate the range of the 200-day MA
  const ma200Range = ma200High - ma200Low;
  
  // Use the most recent data points or fallback to defaults
  const currentSentiment = data.length > 0 ? data[data.length - 1].value : 65;
  const previousSentiment = data.length > 1 ? data[data.length - 2].value : currentSentiment;
  
  // Determine if trend is up or down based on most recent points
  const isTrendUp = currentSentiment > previousSentiment;
  
  // Calculate current position within the 200-day range (as a percentage)
  let rangePosition = 0;
  if (ma200Range > 0) {
    // Normalize current position within range (0 = at low, 1 = at high)
    rangePosition = (currentSentiment - ma200Low) / ma200Range;
  }
  
  // Determine risk level based on position within range and trend
  let riskLevel: "high" | "medium" | "low";
  
  if (rangePosition < 0.3) {
    // Near or below the low of the 200-day range - higher risk
    riskLevel = "high";
  } else if (rangePosition < 0.5) {
    // In bottom half of the range
    riskLevel = isTrendUp ? "medium" : "high";
  } else if (rangePosition < 0.7) {
    // In top half of the range
    riskLevel = isTrendUp ? "low" : "medium";
  } else {
    // Near or above the high of the 200-day range
    riskLevel = "low";
  }
  
  // Fallback if we don't have sufficient data
  if (fullDataset.length < 3) {
    const lowThreshold = 60; // Default fallback
    const mediumThreshold = 75;
    riskLevel = currentSentiment < lowThreshold ? "high" : currentSentiment < mediumThreshold ? "medium" : "low";
  }

  return (
    <section className="pb-6 border-b">
      <ChartHeader 
        title="Consumer Sentiment Index" 
        description="University of Michigan Consumer Sentiment Index" 
        value={currentSentiment} 
        previousValue={previousSentiment}
        riskLevel={riskLevel} 
        loading={loading} 
        error={error} 
        valueDecimals={1}
        citations={[3, 5]}
      />

      {loading ? (
        <div className="flex items-center justify-center h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="mb-4 h-[350px]">
          <ChartContainer
            config={{
              value: {
                label: "Consumer Sentiment",
                color: riskLevel === "high" ? "hsl(var(--chart-2))" : "hsl(var(--chart-1))",
              },
            }}
            className="h-full"
          >
              <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  type="number"
                  domain={['dataMin', 'dataMax']} 
                  tickLine={false} 
                  axisLine={false}
                  allowDataOverflow={true}
                  padding={{ left: 10, right: 10 }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getFullYear().toString().substr(2, 2)}`;
                  }}
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false} 
                  domain={['auto', 'auto']} 
                  padding={{ top: 10, bottom: 10 }}
                />
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
                        return String(timestamp);
                      }}
                    />
                  }
                />
                
                {/* Add the 200-day moving average dotted line */}
                <Line
                  data={filteredMALine}
                  type="monotone"
                  dataKey="maValue" // Using a different dataKey to avoid conflicts
                  name="200-day MA"
                  stroke="hsl(var(--foreground))"
                  strokeWidth={1.5}
                  strokeDasharray="5 5"
                  dot={false}
                  activeDot={false}
                  connectNulls={true}
                  isAnimationActive={false}
                />
                
                {/* Main sentiment line with dots */}
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Consumer Sentiment"
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
                {renderRecessionReferenceAreas()} {/* Use the same recession overlay as yield curve */}
              </ComposedChart>  
          </ChartContainer>
        </div>
      )}

      <div className="mt-4">
        <div className="flex items-start gap-2 mb-2">
          <Info className="h-5 w-5 mt-0.5 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">
              The Consumer Sentiment Index tracks how consumers feel about their personal finances,
              business conditions, and buying conditions.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {riskLevel === "high"
                ? "Consumer sentiment has fallen to levels typically seen during economic downturns. This suggests consumers are pessimistic about future economic conditions."
                : riskLevel === "medium"
                  ? "Sentiment is moderating but remains above levels typically associated with recessions. The trend bears watching."
                  : "Consumer sentiment remains relatively strong, suggesting continued consumer spending and economic growth."}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
