import { NextResponse } from 'next/server';

// FRED API key from environment variables
const FRED_API_KEY = process.env.FRED_API_KEY;

// Treasury Yield Curve Spread Series IDs
const T10Y2Y_SERIES_ID = 'T10Y2Y'; // 10Y-2Y
const T10Y3M_SERIES_ID = 'T10Y3M'; // 10Y-3M

// Default start dates (earliest available data)
const DEFAULT_START_DATE_T10Y2Y = '1976-06-01';
const DEFAULT_START_DATE_T10Y3M = '1982-01-04';

/**
 * Fetches all available Treasury Yield Curve Spread data (10Y-2Y and 10Y-3M) from FRED
 * 
 * Note: This endpoint always returns all available data to enable client-side filtering
 * and static generation. The startDate and endDate parameters in the request are ignored.
 * 
 * @returns Complete treasury yield curve spread datasets for both 10Y-2Y and 10Y-3M
 */
export async function GET(request: Request) {
  // Check if API key is provided
  if (!FRED_API_KEY) {
    return NextResponse.json(
      { success: false, error: 'FRED API key is not configured. Please set the FRED_API_KEY environment variable.' },
      { status: 500 }
    );
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
        spread: observation.value === '.' ? null : parseFloat(observation.value),
      }));
    };

    // Fetch both datasets in parallel
    const [t10y2yData, t10y3mData] = await Promise.all([
      fetchSeriesData(T10Y2Y_SERIES_ID, DEFAULT_START_DATE_T10Y2Y),
      fetchSeriesData(T10Y3M_SERIES_ID, DEFAULT_START_DATE_T10Y3M)
    ]);
    
    // Sort data by date to ensure proper rendering
    t10y2yData.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
    t10y3mData.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return NextResponse.json({
      success: true,
      data: {
        t10y2y: t10y2yData,
        t10y3m: t10y3mData
      },
      meta: {
        endDate,
        fetchedFullDataset: true,
        series: {
          t10y2y: {
            id: T10Y2Y_SERIES_ID,
            startDate: DEFAULT_START_DATE_T10Y2Y,
            description: '10-Year Treasury Constant Maturity Minus 2-Year Treasury Constant Maturity'
          },
          t10y3m: {
            id: T10Y3M_SERIES_ID,
            startDate: DEFAULT_START_DATE_T10Y3M,
            description: '10-Year Treasury Constant Maturity Minus 3-Month Treasury Constant Maturity'
          }
        },
        source: 'FRED'
      }
    });
  } catch (error: any) {
    console.error('Error fetching treasury yield curve data:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
