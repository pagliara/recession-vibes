"use client"

import { useEffect, useState } from "react"
import { Area, CartesianGrid, ComposedChart, ReferenceArea, ResponsiveContainer, XAxis, YAxis, Label } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Info, Loader2 } from "lucide-react"
import { historicalRecessionPeriods } from "@/components/charts/overlays/recession/recession-periods"
import { renderRecessionReferenceAreas } from "@/components/charts/overlays/recession/recession-overlay"
import { ChartHeader } from "@/components/ui/chart-header"
// Define the data structure for the consumer sentiment data
type ConsumerSentimentDataPoint = {
  date: number // timestamp
  value: number // sentiment index value
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
}

export function ConsumerSentimentChart({ startDate, endDate }: ConsumerSentimentChartProps) {
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

  // Fetch consumer sentiment data from the API
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/consumer-sentiment');
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch consumer sentiment data');
      }
      
      // Parse the data to convert string dates to timestamps
      const parsedData = parseData(result.data);
      
      // Store the full dataset
      setFullDataset(parsedData);
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching consumer sentiment data:', err);
      setError(err.message);
      
      // Load default data as fallback
      setFullDataset(parseData(defaultConsumerSentimentData));
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
      setError('No data available for the selected date range. Showing full dataset.');
    } else {
      // Clear any previous errors if we have data
      if (error === 'No data available for the selected date range. Showing full dataset.') {
        setError(null);
      }
    }
    
    setData(filteredData);
  }, [fullDataset, startDate, endDate, loading, error]);

  // Calculate risk levels based on historical data
  const getHistoricalLow = () => {
    if (fullDataset.length === 0) return 60; // Default low threshold
    return Math.min(...fullDataset.map(d => d.value)) + 5; // 5 points above absolute low
  };

  const getHistoricalMedium = () => {
    if (fullDataset.length === 0) return 75; // Default medium threshold
    const values = fullDataset.map(d => d.value);
    return values.reduce((a, b) => a + b, 0) / values.length; // Average
  };

  // Use the most recent data point or fallback to default
  const currentSentiment = data.length > 0 ? data[data.length - 1].value : 65;
  const previousSentiment = data.length > 1 ? data[data.length - 2].value : currentSentiment;
  const isDecreasing = currentSentiment < previousSentiment;
  
  // Dynamic risk levels based on historical data
  const lowThreshold = getHistoricalLow();
  const mediumThreshold = getHistoricalMedium();
  const riskLevel = currentSentiment < lowThreshold ? "high" : currentSentiment < mediumThreshold ? "medium" : "low";

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
      />

      {loading ? (
        <div className="flex items-center justify-center h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="mb-4">
          <ChartContainer
            config={{
              value: {
                label: "Consumer Sentiment",
                color: riskLevel === "high" ? "hsl(var(--chart-2))" : "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 10, right: 10, left: 5, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSentiment" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={riskLevel === "high" ? "hsl(var(--chart-2))" : "hsl(var(--chart-1))"}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={riskLevel === "high" ? "hsl(var(--chart-2))" : "hsl(var(--chart-1))"}
                      stopOpacity={0.2}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  type="number"
                  domain={['dataMin', 'dataMax']} 
                  tickLine={false} 
                  axisLine={false}
                  allowDataOverflow={true}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getFullYear().toString().substr(2, 2)}`;
                  }}
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false} 
                  domain={['dataMin - 5', 'dataMax + 5']} 
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
                
                {renderRecessionReferenceAreas()} {/* Use the same recession overlay as yield curve */}
                
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={riskLevel === "high" ? "var(--color-spread)" : "var(--color-spread)"}
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorSentiment)"
                  connectNulls={true}
                />
              </ComposedChart>
            </ResponsiveContainer>
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
