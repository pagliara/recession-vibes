import { NextResponse } from 'next/server';

// FRED API key from environment variables
const FRED_API_KEY = process.env.FRED_API_KEY;

// S&P 500 Series ID
const SP500_SERIES_ID = 'SP500'; // Standard & Poor's 500 Index

// Default start date (using a reasonable timeframe)
const DEFAULT_START_DATE = '1990-01-01';

// Default S&P 500 data (fallback if API fails)
const DEFAULT_SP500_DATA = [
  { date: "2023-01-01", value: 3824.14 },
  { date: "2023-02-01", value: 4119.58 },
  { date: "2023-03-01", value: 4109.31 },
  { date: "2023-04-01", value: 4169.48 },
  { date: "2023-05-01", value: 4179.83 },
  { date: "2023-06-01", value: 4450.38 },
  { date: "2023-07-01", value: 4588.96 },
  { date: "2023-08-01", value: 4328.41 },
  { date: "2023-09-01", value: 4288.05 },
  { date: "2023-10-01", value: 4193.80 },
  { date: "2023-11-01", value: 4567.80 },
  { date: "2023-12-01", value: 4769.83 },
  { date: "2024-01-01", value: 4845.65 },
  { date: "2024-02-01", value: 5069.76 },
  { date: "2024-03-01", value: 5254.35 },
  { date: "2024-04-01", value: 5127.79 },
];

/**
 * Fetches S&P 500 Index data from FRED
 * 
 * Note: This endpoint always returns all available data to enable client-side filtering
 * and static generation. The startDate and endDate parameters in the request are ignored.
 * 
 * @returns Complete S&P 500 Index dataset
 */
export async function GET(request: Request) {
  // Check if API key is provided
  if (!FRED_API_KEY) {
    console.error('FRED API key is not configured');
    // Return default data as fallback
    return NextResponse.json({
      success: true,
      data: DEFAULT_SP500_DATA,
      meta: {
        note: 'Using fallback data - FRED API key not configured',
        source: 'Default Data'
      }
    });
  }

  // Use today's date as end date
  const endDate = new Date().toISOString().split('T')[0];
  
  try {
    // Helper function to fetch and transform data from FRED API
    const fetchSeriesData = async (seriesId: string, startDate: string) => {
      const apiUrl = new URL('https://api.stlouisfed.org/fred/series/observations');
      apiUrl.searchParams.append('series_id', seriesId);
      apiUrl.searchParams.append('api_key', FRED_API_KEY);
      apiUrl.searchParams.append('file_type', 'json');
      apiUrl.searchParams.append('observation_start', startDate);
      apiUrl.searchParams.append('observation_end', endDate);
      apiUrl.searchParams.append('sort_order', 'asc');
      
      // Fetch data from FRED API
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`FRED API error for ${seriesId}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Transform the data for the chart and handle missing values
      return data.observations.map((observation: any) => ({
        date: observation.date,
        // Convert to numeric value and handle missing or invalid values
        value: observation.value === '.' ? null : parseFloat(observation.value),
      }));
    };

    // Fetch the S&P 500 data
    const sp500Data = await fetchSeriesData(SP500_SERIES_ID, DEFAULT_START_DATE);
    
    // Sort data by date to ensure proper rendering
    sp500Data.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return NextResponse.json({
      success: true,
      data: sp500Data,
      meta: {
        endDate,
        fetchedFullDataset: true,
        series: {
          id: SP500_SERIES_ID,
          startDate: DEFAULT_START_DATE,
          description: 'Standard & Poor\'s 500 Index'
        },
        source: 'FRED'
      }
    });
  } catch (error: any) {
    console.error('Error fetching S&P 500 data:', error);
    // If there's an error, return default data with success flag
    return NextResponse.json({
      success: true,
      data: DEFAULT_SP500_DATA,
      meta: {
        note: `Error fetching from FRED: ${error.message}`,
        source: 'Default Data'
      }
    });
  }
}
