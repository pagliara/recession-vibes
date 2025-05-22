"use client"

import { useEffect, useState, useMemo } from "react"
import { Line, CartesianGrid, ComposedChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { createResponsiveXAxis, createResponsiveYAxis } from "@/components/charts/utils/axis-config"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Info, Loader2 } from "lucide-react"
import { renderRecessionReferenceAreas } from "@/components/charts/overlays/recession/recession-overlay"
import { NasdaqDataPoint, filterNasdaqData, renderNasdaqOverlay } from "@/components/charts/overlays/nasdaq/nasdaq-overlay"
import { ChartHeader } from "@/components/ui/chart-header"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label as UILabel } from "@/components/ui/label"
import { useMovingAverage, MADataPoint } from "@/hooks/use-moving-average"

// Define the data structures for our chart data
type UnemploymentDataPoint = {
  date: number // timestamp
  value: number // unemployment value
}

// Define the unemployment data type options
type UnemploymentDataType = 'unemploy' | 'u1rate' | 'emratio';

interface UnemploymentDataChartProps {
  startDate?: string
  endDate?: string
  data: {
    unemploy: { date: string; value: number }[]
    u1rate: { date: string; value: number }[]
    emratio: { date: string; value: number }[]
  }
  nasdaqData?: NasdaqDataPoint[]
  overlayOptions: {
    showRecessions: boolean
    showNasdaq: boolean
  }
}

export function UnemploymentDataChart({ 
  startDate, 
  endDate, 
  data: chartData,
  nasdaqData = [],
  overlayOptions
}: UnemploymentDataChartProps) {
  // State for which data series to display
  const [dataType, setDataType] = useState<UnemploymentDataType>('unemploy')
  const [isMobile, setIsMobile] = useState(false)
  
  // State for filtered data (what's displayed in the chart)
  const [data, setData] = useState<UnemploymentDataPoint[]>([])
  // State for the complete dataset
  const [fullDataset, setFullDataset] = useState<UnemploymentDataPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // State for moving average data
  const [movingAverageData, setMovingAverageData] = useState<MADataPoint[]>([])
  // State for filtered moving average line
  const [filteredMALine, setFilteredMALine] = useState<MADataPoint[]>([])
  // State for risk assessment
  const [riskLevel, setRiskLevel] = useState<"low" | "medium" | "high">("medium")
  
  // Process NASDAQ data with useMemo
  const processedNasdaqData = useMemo(() => {
    // Ensure we have valid NASDAQ data
    if (!nasdaqData || nasdaqData.length === 0) return [];
    
    return filterNasdaqData(nasdaqData, startDate, endDate);
  }, [nasdaqData, startDate, endDate]);
  
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

  // Process data when component mounts, chart data changes, or dataType changes
  useEffect(() => {
    setLoading(true);
    try {
      // Make sure chartData has the expected structure
      if (!chartData || typeof chartData !== 'object') {
        throw new Error(`Invalid chart data: data is ${typeof chartData}`);
      }
      
      const currentData = chartData[dataType] || [];
      
      // Validate data before processing
      if (!Array.isArray(currentData)) {
        console.error(`Data for ${dataType} is not an array:`, currentData);
        throw new Error(`Invalid data format for ${dataType}`);
      }
      
      // Parse the data to convert string dates to timestamps
      const parsedData = parseData(currentData);
      
      // Store the full dataset
      setFullDataset(parsedData);
      setError(null);
    } catch (err: any) {
      console.error(`Error processing ${dataType} data:`, err);
      setError(err.message || 'Error processing unemployment data');
    } finally {
      setLoading(false);
    }
  }, [chartData, dataType]);

  // Calculate moving averages with our custom hook
  const { maLine } = useMovingAverage(fullDataset, {
    // Use a consistent 50-day moving average across all economic indicators
    windowSize: 200,
    valueKey: 'value',
    useTimeBased: true, // Use count-based window rather than time-based
    dataFrequency: 'monthly' // Specify that this is monthly data
  });
  
  // Update state when moving average data changes
  useEffect(() => {
    if (loading || fullDataset.length === 0) return;
    setMovingAverageData(maLine);
  }, [maLine, loading, fullDataset]);  
  
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

  // Filter data based on date range
  useEffect(() => {
    if (loading || fullDataset.length === 0) return;
    
    // Then filter both the data and the MA for display
    let filteredData = [...fullDataset];
    let filteredMA = [...movingAverageData];
    
    // Filter by start date if provided
    if (startDate) {
      const startTimestamp = new Date(startDate).getTime();
      filteredData = filteredData.filter(item => item.date >= startTimestamp);
      filteredMA = filteredMA.filter(item => item.date >= startTimestamp);
    }
    
    // Filter by end date if provided
    if (endDate) {
      const endTimestamp = new Date(endDate).getTime();
      filteredData = filteredData.filter(item => item.date <= endTimestamp);
      filteredMA = filteredMA.filter(item => item.date <= endTimestamp);
    }
    
    // Ensure no null or undefined values that could break the chart
    filteredData = filteredData.filter(item => 
      item.value !== null && item.value !== undefined && !isNaN(item.value)
    );
    
    // Also ensure MA data has no null/undefined/NaN values
    filteredMA = filteredMA.filter(item => 
      item.maValue !== null && item.maValue !== undefined && !isNaN(item.maValue)
    );
    
    // If no data after filtering (or empty array), use full dataset but show warning
    if (filteredData.length === 0) {
      filteredData = [...fullDataset];
      filteredMA = [...movingAverageData];
      setError('No data available for the selected date range. Showing full dataset.');
    } else {
      // Clear any previous errors if we have data
      if (error === 'No data available for the selected date range. Showing full dataset.') {
        setError(null);
      }
    }
    
    setData(filteredData);
    setFilteredMALine(filteredMA);

    // Calculate risk levels based on the filtered data and MA
    if (dataType === 'unemploy') {
      calculateRiskLevels(filteredData, filteredMA);
    } else if (dataType === 'u1rate') {
      calculateRiskLevelsForU1Rate(filteredData, filteredMA);
    } else {
      calculateRiskLevelsForEmRatio(filteredData, filteredMA);
    }
    
  }, [fullDataset, movingAverageData, startDate, endDate, loading, error, dataType]);

  // Calculate risk levels based on current data vs MA for Unemployment Level
  const calculateRiskLevels = (dataPoints: UnemploymentDataPoint[], maData: MADataPoint[]) => {
    if (!dataPoints || dataPoints.length === 0 || !maData || maData.length === 0) {
      setRiskLevel("medium");
      setCurrentVsMA({
        current: null,
        previous: null,
        average: null,
        percentDifference: null,
      });
      return;
    }
    
    // Get most recent data points
    const latestDataPoint = dataPoints[dataPoints.length - 1];
    const previousDataPoint = dataPoints.length > 1 ? dataPoints[dataPoints.length - 2] : null;
    
    // Find matching MA value for the latest data point
    let latestMAPoint = maData.find(ma => ma.date === latestDataPoint.date);
    
    // If exact match not found, find the closest date
    if (!latestMAPoint && maData.length > 0) {
      // Sort by absolute difference to find closest date
      const sortedByDateDiff = [...maData].sort((a, b) => 
        Math.abs(a.date - latestDataPoint.date) - Math.abs(b.date - latestDataPoint.date)
      );
      latestMAPoint = sortedByDateDiff[0];
    }
    
    if (!latestMAPoint || isNaN(latestMAPoint.maValue)) {
      setRiskLevel("medium");
      return;
    }
    
    // Calculate percentage difference
    const percentDiff = ((latestDataPoint.value - latestMAPoint.maValue) / latestMAPoint.maValue) * 100;
    
    // Set risk level based on percentage above/below MA
    // For unemployment level, higher values are worse for the economy
    if (percentDiff > 5) {
      setRiskLevel("high");
    } else if (percentDiff < -5) {
      setRiskLevel("low");
    } else {
      setRiskLevel("medium");
    }
    
    // Update state with current metrics
    setCurrentVsMA({
      current: latestDataPoint.value,
      previous: previousDataPoint?.value || null,
      average: latestMAPoint.maValue,
      percentDifference: percentDiff,
    });
  };
  
  // Calculate risk levels for U1 Rate
  const calculateRiskLevelsForU1Rate = (dataPoints: UnemploymentDataPoint[], maData: MADataPoint[]) => {
    if (!dataPoints || dataPoints.length === 0 || !maData || maData.length === 0) {
      setRiskLevel("medium");
      setCurrentVsMA({
        current: null,
        previous: null,
        average: null,
        percentDifference: null,
      });
      return;
    }
    
    // Get most recent data points
    const latestDataPoint = dataPoints[dataPoints.length - 1];
    const previousDataPoint = dataPoints.length > 1 ? dataPoints[dataPoints.length - 2] : null;
    
    // Find matching MA value for the latest data point
    let latestMAPoint = maData.find(ma => ma.date === latestDataPoint.date);
    
    // If exact match not found, find the closest date
    if (!latestMAPoint && maData.length > 0) {
      // Sort by absolute difference to find closest date
      const sortedByDateDiff = [...maData].sort((a, b) => 
        Math.abs(a.date - latestDataPoint.date) - Math.abs(b.date - latestDataPoint.date)
      );
      latestMAPoint = sortedByDateDiff[0];
    }
    
    if (!latestMAPoint || isNaN(latestMAPoint.maValue)) {
      setRiskLevel("medium");
      return;
    }
    
    // Calculate percentage difference
    const percentDiff = ((latestDataPoint.value - latestMAPoint.maValue) / latestMAPoint.maValue) * 100;
    
    // Set risk level based on absolute value - for U1RATE, higher values are worse
    if (percentDiff > 8) {
      setRiskLevel("high");
    } else if (percentDiff < -5) {
      setRiskLevel("low");
    } else {
      setRiskLevel("medium");
    }
    
    // Update state with current metrics
    setCurrentVsMA({
      current: latestDataPoint.value,
      previous: previousDataPoint?.value || null,
      average: latestMAPoint.maValue,
      percentDifference: percentDiff,
    });
  };
  
  // Calculate risk levels for Employment-Population Ratio
  const calculateRiskLevelsForEmRatio = (dataPoints: UnemploymentDataPoint[], maData: MADataPoint[]) => {
    if (!dataPoints || dataPoints.length === 0 || !maData || maData.length === 0) {
      setRiskLevel("medium");
      setCurrentVsMA({
        current: null,
        previous: null,
        average: null,
        percentDifference: null,
      });
      return;
    }
    
    // Get most recent data points
    const latestDataPoint = dataPoints[dataPoints.length - 1];
    const previousDataPoint = dataPoints.length > 1 ? dataPoints[dataPoints.length - 2] : null;
    
    // Find matching MA value for the latest data point
    let latestMAPoint = maData.find(ma => ma.date === latestDataPoint.date);
    
    // If exact match not found, find the closest date
    if (!latestMAPoint && maData.length > 0) {
      // Sort by absolute difference to find closest date
      const sortedByDateDiff = [...maData].sort((a, b) => 
        Math.abs(a.date - latestDataPoint.date) - Math.abs(b.date - latestDataPoint.date)
      );
      latestMAPoint = sortedByDateDiff[0];
    }
    
    if (!latestMAPoint || isNaN(latestMAPoint.maValue)) {
      setRiskLevel("medium");
      return;
    }
    
    // Calculate percentage difference
    const percentDiff = ((latestDataPoint.value - latestMAPoint.maValue) / latestMAPoint.maValue) * 100;
    
    // Set risk level based on absolute value - for EMRATIO, lower values are worse
    if (percentDiff < -3) {
      setRiskLevel("high");
    } else if (percentDiff > 3) {
      setRiskLevel("low");
    } else {
      setRiskLevel("medium");
    }
    
    // Update state with current metrics
    setCurrentVsMA({
      current: latestDataPoint.value,
      previous: previousDataPoint?.value || null,
      average: latestMAPoint.maValue,
      percentDifference: percentDiff,
    });
  };

  // Get the appropriate chart title and description based on dataType
  const getChartTitle = () => {
    switch(dataType) {
      case 'unemploy':
        return 'Unemployment Level';
      case 'u1rate':
        return 'Unemployment Rate (U-1)';
      case 'emratio':
        return 'Employment-Population Ratio';
      default:
        return 'Unemployment Data';
    }
  };
  
  // Get the citation IDs based on the selected data type
  const getCitationIds = () => {
    switch(dataType) {
      case 'unemploy':
        return [6, 5]; // Unemployment Level and NBER recession data
      case 'u1rate':
        return [7, 5]; // U1 Rate and NBER recession data
      case 'emratio':
        return [8, 5]; // Employment-Population Ratio and NBER recession data
      default:
        return [6, 7, 8, 5];
    }
  };
  
  const getChartDescription = () => {
    switch(dataType) {
      case 'unemploy':
        return 'Total unemployed, in thousands of persons';
      case 'u1rate':
        return 'Percent of civilian labor force unemployed 15 weeks or longer';
      case 'emratio':
        return 'Ratio of employed people to the total working-age population';
      default:
        return '';
    }
  };
  
  const getChartValueLabel = () => {
    switch(dataType) {
      case 'unemploy':
        return 'Thousands of persons';
      case 'u1rate':
        return 'Percent';
      case 'emratio':
        return 'Percent';
      default:
        return '';
    }
  };
  
  // Helper function to get the appropriate value suffix based on data type
  const getValueSuffix = () => {
    switch (dataType) {
      case 'unemploy':
        return " thousand";
      case 'u1rate':
      case 'emratio':
        return "%";
      default:
        return "";
    }
  };
  
  // Helper function to get Y-axis domain based on data type
  const getYAxisDomain = () => {
    if (data.length === 0) return ['auto', 'auto'];
    
    // Make sure we have valid values before calculating min/max
    const validValues = data.map(d => d.value).filter(v => v !== null && v !== undefined && !isNaN(v));
    
    if (validValues.length === 0) return ['auto', 'auto'];
    
    switch(dataType) {
      case 'unemploy':
        // Get min and max from data with a small buffer
        const minUnemploy = Math.min(...validValues) * 0.9;
        const maxUnemploy = Math.max(...validValues) * 1.1;
        return [minUnemploy, maxUnemploy];
      case 'u1rate':
        // For U-1 rate, set a reasonable range that starts from 0
        // since these are percentage values
        const maxU1 = Math.max(...validValues);
        // Make sure we have a reasonable upper bound - between 1.5x max and 5%
        return [0, Math.max(maxU1 * 1.5, 5)];
      case 'emratio':
        // For employment-population ratio, we want to emphasize changes
        // But also maintain a reasonable context (e.g., show from 50% not from 0)
        const minEm = Math.min(...validValues);
        const maxEm = Math.max(...validValues);
        // Use a narrower range to emphasize changes
        // For employment ratio, a 5 percentage point change is significant
        return [Math.max(minEm - 5, 50), Math.min(maxEm + 5, 70)];
      default:
        return ['auto', 'auto'];
    }
  };
  
  // Helper function to format Y-axis ticks based on data type
  const getYAxisTickFormatter = (value: number) => {
    if (value === null || value === undefined || isNaN(value)) {
      return ''; // Return empty string for invalid values
    }
    
    switch(dataType) {
      case 'unemploy':
        // Format in thousands (K) or millions (M) depending on scale
        return value >= 1000 ? `${(value/1000).toFixed(1)}M` : value.toFixed(0);
      case 'u1rate':
        // Format with 1 decimal for small percentages
        return `${value.toFixed(1)}%`;
      case 'emratio':
        // Format with 1 decimal for percentages
        return `${value.toFixed(1)}%`;
      default:
        return value.toString();
    }
  };
  
  const getChartExplanation = () => {
    switch(dataType) {
      case 'unemploy':
        return riskLevel === "high"
          ? "Unemployment levels have risen significantly above the moving average, suggesting potential economic contraction."
          : riskLevel === "medium"
            ? "Unemployment levels are near historical norms, showing neither strong growth nor contraction."
            : "Unemployment levels remain low relative to the moving average, suggesting a strong labor market.";
      case 'u1rate':
        return riskLevel === "high"
          ? "Long-term unemployment (15+ weeks) has risen significantly, a concerning signal for economic health."
          : riskLevel === "medium"
            ? "Long-term unemployment is moderate, showing neither strength nor significant weakness."
            : "Long-term unemployment remains low, indicating a healthy labor market with good job prospects.";
      case 'emratio':
        return riskLevel === "high"
          ? "The employment-population ratio has fallen below trend, suggesting fewer working-age adults are employed."
          : riskLevel === "medium"
            ? "The employment-population ratio is close to its recent average, indicating stable labor market participation."
            : "The employment-population ratio is strong, with a higher percentage of the working-age population employed.";
      default:
        return '';
    }
  };

  return (
    <section className="pb-6 border-b">
      <ChartHeader 
        title={getChartTitle()}
        description={getChartDescription()}
        value={currentVsMA.current || 0}
        previousValue={currentVsMA.previous || undefined}
        riskLevel={riskLevel}
        valueSuffix={getValueSuffix()}
        valueDecimals={dataType === 'unemploy' ? 0 : 1}
        citations={getCitationIds()}
      />
      
      {/* Series Selection Controls */}
      <div className="mt-2">
        <RadioGroup
          value={dataType}
          onValueChange={(value) => setDataType(value as UnemploymentDataType)}
          className="flex space-x-4"
          defaultValue="unemploy"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="unemploy" id="unemploy" />
            <UILabel htmlFor="unemploy">Unemployment Level</UILabel>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="u1rate" id="u1rate" />
            <UILabel htmlFor="u1rate">U-1 Rate</UILabel>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="emratio" id="emratio" />
            <UILabel htmlFor="emratio">Employment-Population Ratio</UILabel>
          </div>
        </RadioGroup>
      </div>

      {loading ? (
        <div className="h-[300px] w-full flex items-center justify-center bg-muted/20 rounded-md">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading data...</span>
        </div>
      ) : error ? (
        <div className="h-[300px] w-full flex items-center justify-center bg-muted/20 rounded-md">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <ChartContainer
              config={{
                value: {
                  label: getChartValueLabel(),
                  color: "hsl(var(--chart-2))",
                },
                maValue: {
                  label: `${dataType === 'unemploy' ? '24' : '12'}-month MA`,
                  color: "hsl(var(--foreground))",
                },
              }}
              className="h-[300px]"
            >
                <ComposedChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    {...createResponsiveXAxis({
                      isMobile,
                      dataKey: "date",
                      type: "number",
                      domain: ['dataMin', 'dataMax'], 
                      tickFormatter: (timestamp) => {
                        // Format date for display (MM/DD)
                        const date = new Date(timestamp);
                        return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`; // Format as MM/DD
                      },
                      padding: { left: 10, right: 10 },
                      scale: "time",
                      tickCount: isMobile ? 4 : 7
                    })}
                  />
                  <YAxis 
                    yAxisId="left"
                    {...createResponsiveYAxis({
                      isMobile: isMobile,
                      axisLabel: getChartValueLabel(),
                      domain: getYAxisDomain(),
                      tickFormatter: getYAxisTickFormatter
                    })}
                  />
                  
                  {/* Right YAxis for NASDAQ data */}
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={['dataMin', 'dataMax']}
                    hide={!overlayOptions.showNasdaq}
                    tickLine={overlayOptions.showNasdaq}
                    axisLine={overlayOptions.showNasdaq}
                    tickFormatter={(value) => value.toLocaleString()}
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
                    yAxisId="left"
                    stroke="hsl(var(--foreground))"
                    strokeWidth={1.5}
                    strokeDasharray="5 5"
                    dot={false}
                    activeDot={false}
                    connectNulls={true}
                    isAnimationActive={false}
                  />
                  
                  {/* Main value line with dots */}
                  <Line
                    type="monotone"
                    dataKey="value"
                    name={getChartTitle()}
                    yAxisId="left"
                    stroke={riskLevel === "high" ? "rgb(220, 38, 38)" : riskLevel === "medium" ? "rgb(202, 138, 4)" : "rgb(22, 163, 74)"}
                    strokeWidth={2}
                    // Use the dot property to control density
                    dot={(props) => {
                      // Only render dots at specific intervals (adjust pointDensity to control density)
                      const pointDensity = 5;
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
                  
                  {/* NASDAQ Overlay */}
                  {renderNasdaqOverlay(processedNasdaqData, overlayOptions.showNasdaq, isMobile)}
                  
                  {overlayOptions.showRecessions && renderRecessionReferenceAreas()} {/* Use recession overlay */}
                </ComposedChart>
            </ChartContainer>
          </div>

          <div className="mt-4">
            <div className="flex items-start gap-2 mb-2">
              <Info className="h-5 w-5 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">
                  {dataType === 'unemploy' 
                    ? "The Unemployment Level tracks the total number of unemployed persons in the U.S." 
                    : dataType === 'u1rate' 
                      ? "The U-1 Rate measures the percentage of civilians unemployed for 15 weeks or longer."
                      : "The Employment-Population Ratio represents the proportion of the country's working-age population that is employed."}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {getChartExplanation()}
                </p>
                {currentVsMA.percentDifference !== null && (
                  <p className="text-sm font-medium mt-1">
                    Current value is {Math.abs(currentVsMA.percentDifference).toFixed(1)}% 
                    {currentVsMA.percentDifference >= 0 ? " above " : " below "} 
                    the 200-day moving average.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
