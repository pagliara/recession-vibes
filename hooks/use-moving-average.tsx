import { useMemo } from 'react';

export type MADataPoint = {
  date: number;
  maValue: number;
};

type DataPoint = {
  date: number;
  [key: string]: any;
};

type MovingAverageOptions = {
  windowSize: number;
  valueKey?: string;
  useTimeBased?: boolean; 
};

/**
 * Hook to calculate moving averages for time series data
 * 
 * @param data Array of data points with date and value properties
 * @param options Configuration options
 * @returns Object with processed moving average data and stats
 */
export function useMovingAverage<T extends DataPoint>(
  data: T[], 
  options: MovingAverageOptions
) {
  const { 
    windowSize = 50, 
    valueKey = 'value',
    useTimeBased = false
  } = options;

  const result = useMemo(() => {
    if (!data || data.length === 0) {
      return { 
        maLine: [], 
        high: 0, 
        low: 0, 
        average: 0 
      };
    }

    // Sort by date (ascending) to ensure chronological order
    const sortedData = [...data].sort((a, b) => a.date - b.date);
    
    // Calculate MA for each point
    const maLine: MADataPoint[] = [];
    let sumAll = 0;
    let countAll = 0;
    let overallHigh = -Infinity;
    let overallLow = Infinity;
    
    if (useTimeBased) {
      // Time-based moving average (e.g., 50 days)
      const msPeriod = windowSize * 24 * 60 * 60 * 1000;
      
      sortedData.forEach((point) => {
        // Find all points within the window before this point
        const window = sortedData.filter(
          p => p.date <= point.date && p.date >= (point.date - msPeriod)
        );
        
        if (window.length > 0) {
          const values = window.map(p => p[valueKey]);
          const ma = values.reduce((sum, v) => sum + v, 0) / values.length;
          
          maLine.push({
            date: point.date,
            maValue: ma
          });
          
          overallHigh = Math.max(overallHigh, ma);
          overallLow = Math.min(overallLow, ma);
          sumAll += ma;
          countAll++;
        }
      });
    } else {
      // Count-based moving average (e.g., 50 points)
      for (let i = 0; i < sortedData.length; i++) {
        // Need at least windowSize points to calculate MA
        if (i >= windowSize - 1) {
          let sum = 0;
          let validPoints = 0;
          
          for (let j = 0; j < windowSize; j++) {
            const value = sortedData[i - j][valueKey];
            if (value !== undefined && value !== null && !isNaN(value)) {
              sum += value;
              validPoints++;
            }
          }
          
          if (validPoints > 0) {
            const ma = sum / validPoints;
            
            maLine.push({
              date: sortedData[i].date,
              maValue: ma
            });
            
            overallHigh = Math.max(overallHigh, ma);
            overallLow = Math.min(overallLow, ma);
            sumAll += ma;
            countAll++;
          }
        }
      }
    }
    
    // Calculate overall average of the MA line
    const average = countAll > 0 ? sumAll / countAll : 0;
    
    return { 
      maLine, 
      high: overallHigh, 
      low: overallLow, 
      average
    };
  }, [data, windowSize, valueKey, useTimeBased]);

  return result;
}
