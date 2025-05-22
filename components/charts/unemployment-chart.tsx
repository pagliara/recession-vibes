"use client"

import { useEffect, useMemo, useState } from "react"
import { Line, CartesianGrid, ComposedChart, ReferenceArea, ResponsiveContainer, XAxis, YAxis, Label } from "recharts"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Info, TrendingDown, TrendingUp } from "lucide-react"
import { renderRecessionReferenceAreas } from "@/components/charts/overlays/recession/recession-overlay";
import { NasdaqDataPoint, filterNasdaqData, renderNasdaqOverlay } from "@/components/charts/overlays/nasdaq/nasdaq-overlay";

// Mock weekly data for unemployment claims with proper date format
const rawUnemploymentData = [
  { date: "2023-01-01", week: "Jan 1", claims: 215, trend: 220 },
  { date: "2023-01-08", week: "Jan 8", claims: 220, trend: 221 },
  { date: "2023-01-15", week: "Jan 15", claims: 225, trend: 222 },
  { date: "2023-01-22", week: "Jan 22", claims: 218, trend: 223 },
  { date: "2023-01-29", week: "Jan 29", claims: 223, trend: 224 },
  { date: "2023-02-05", week: "Feb 5", claims: 230, trend: 226 },
  { date: "2023-02-12", week: "Feb 12", claims: 235, trend: 228 },
  { date: "2023-02-19", week: "Feb 19", claims: 240, trend: 230 },
  { date: "2023-02-26", week: "Feb 26", claims: 245, trend: 233 },
  { date: "2023-03-05", week: "Mar 5", claims: 250, trend: 236 },
  { date: "2023-03-12", week: "Mar 12", claims: 255, trend: 240 },
  { date: "2023-03-19", week: "Mar 19", claims: 260, trend: 244 },
  { date: "2023-03-26", week: "Mar 26", claims: 265, trend: 248 },
  { date: "2023-04-02", week: "Apr 2", claims: 270, trend: 252 },
  { date: "2023-04-09", week: "Apr 9", claims: 275, trend: 256 },
  { date: "2023-04-16", week: "Apr 16", claims: 280, trend: 260 },
  { date: "2023-04-23", week: "Apr 23", claims: 285, trend: 264 },
  { date: "2023-04-30", week: "Apr 30", claims: 290, trend: 268 },
  { date: "2023-05-07", week: "May 7", claims: 295, trend: 272 },
  { date: "2023-05-14", week: "May 14", claims: 300, trend: 276 },
];

interface UnemploymentDataPoint {
  date: number; // Timestamp
  week: string;
  claims: number;
  trend: number;
}

interface UnemploymentChartProps {
  startDate?: string;
  endDate?: string;
  data: { date: string; claims: number, trend: number }[];
  nasdaqData?: { date: string; value: number }[];
  overlayOptions?: {
    showRecessions: boolean;
    showNasdaq: boolean;
  }
}

export function UnemploymentChart({ 
  startDate, 
  endDate, 
  data, 
  nasdaqData,
  overlayOptions = { showRecessions: true, showNasdaq: false } 
}: UnemploymentChartProps) {
  const [processedData, setProcessedData] = useState<UnemploymentDataPoint[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  
  // Process NASDAQ data with useMemo
  const processedNasdaqData = useMemo(() => {
    // Ensure we have valid NASDAQ data
    if (!nasdaqData || nasdaqData.length === 0) return [];
    
    return filterNasdaqData(nasdaqData, startDate, endDate);
  }, [nasdaqData, startDate, endDate]);
  
  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // 640px is Tailwind's sm breakpoint
    };
    
    // Check initially
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const startTimestamp = startDate ? new Date(startDate).getTime() : -Infinity;
    const endTimestamp = endDate ? new Date(endDate).getTime() : Infinity;

    const filteredAndProcessed = rawUnemploymentData
      .map(item => ({
        ...item,
        date: new Date(item.date).getTime(), // Convert to timestamp
      }))
      .filter(item => item.date >= startTimestamp && item.date <= endTimestamp);
    
    setProcessedData(filteredAndProcessed);
  }, [startDate, endDate]);

  const currentClaims = processedData.length > 0 ? processedData[processedData.length - 1].claims : 0;
  const previousClaims = processedData.length > 1 ? processedData[processedData.length - 2].claims : 0;
  const isRising = currentClaims > previousClaims;
  const riskLevel = currentClaims > 250 ? "high" : currentClaims > 230 ? "medium" : "low";

  const numericStartDate = startDate ? new Date(startDate).getTime() : undefined;
  const numericEndDate = endDate ? new Date(endDate).getTime() : undefined;

  if (processedData.length === 0) {
    return (
      <section className="pb-6 border-b">
        <div className="flex items-center justify-center h-[200px] bg-muted/20 rounded-md">
          <p className="text-muted-foreground">No data available for the selected period.</p>
        </div>
      </section>
    );
  }

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
            <ComposedChart data={processedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="date" 
                type="number" 
                domain={numericStartDate && numericEndDate ? [numericStartDate, numericEndDate] : ['dataMin', 'dataMax']}
                allowDataOverflow={true}
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`; // Format as MM/DD
              }} />
              <YAxis
                yAxisId="left"
                tickLine={false} 
                axisLine={false} 
                domain={["dataMin - 20", "dataMax + 20"]} 
                orientation={isMobile ? "right" : "left"}
                tick={{
                  fontSize: 10, // Keep tick labels but slightly smaller
                }}
                width={isMobile ? 30 : 60} // More space for larger screens with label
              >
                {!isMobile && (
                  <Label 
                    value="Claims (thousands)" 
                    angle={-90} 
                    position="insideLeft"
                    style={{ textAnchor: 'middle', fill: 'var(--muted-foreground)' }}
                    className="text-xs fill-muted-foreground"
                    offset={-20}
                  />
                )}
              </YAxis>
              
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
              {/* NASDAQ Overlay */}
              {renderNasdaqOverlay(processedNasdaqData, overlayOptions.showNasdaq, isMobile)}
              
              {/* Recession overlay */}
              {overlayOptions.showRecessions && renderRecessionReferenceAreas()}
              <Line type="monotone" dataKey="claims" yAxisId="left" stroke="hsl(var(--chart-2))" strokeWidth={3} dot={true} />
              <Line
                type="monotone"
                dataKey="trend"
                yAxisId="left"
                stroke="hsl(var(--chart-4))"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </ComposedChart>
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
