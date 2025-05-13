import { NextResponse } from 'next/server';

// FRED API key from environment variables
const FRED_API_KEY = process.env.FRED_API_KEY;

// Treasury Yield Curve Spread (10Y-2Y) Series ID
const T10Y2Y_SERIES_ID = 'T10Y2Y';

/**
 * Fetches the Treasury Yield Curve Spread (10Y-2Y) data from FRED
 * 
 * @param startDate - Start date in YYYY-MM-DD format
 * @param endDate - End date in YYYY-MM-DD format
 * @returns Treasury yield curve spread data
 */
export async function GET(request: Request) {
  // Check if API key is provided
  if (!FRED_API_KEY) {
    return NextResponse.json(
      { success: false, error: 'FRED API key is not configured. Please set the FRED_API_KEY environment variable.' },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  
  // Get date parameters, default to last 6 months if not provided
  const endDate = searchParams.get('endDate') || new Date().toISOString().split('T')[0];
  
  // Calculate default start date (6 months ago)
  const defaultStartDate = new Date();
  defaultStartDate.setMonth(defaultStartDate.getMonth() - 6);
  const startDate = searchParams.get('startDate') || defaultStartDate.toISOString().split('T')[0];
  
  try {
    // Construct the FRED API URL
    const apiUrl = new URL('https://api.stlouisfed.org/fred/series/observations');
    apiUrl.searchParams.append('series_id', T10Y2Y_SERIES_ID);
    apiUrl.searchParams.append('api_key', FRED_API_KEY);
    apiUrl.searchParams.append('file_type', 'json');
    apiUrl.searchParams.append('observation_start', startDate);
    apiUrl.searchParams.append('observation_end', endDate);
    apiUrl.searchParams.append('sort_order', 'asc');
    
    // Fetch data from FRED API
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`FRED API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Transform the data for the chart and handle missing values
    const transformedData = data.observations.map((observation: any) => ({
      date: observation.date,
      // Convert to numeric value and handle missing or invalid values
      spread: observation.value === '.' ? null : parseFloat(observation.value),
    }));
    
    // Sort data by date to ensure proper rendering
    transformedData.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return NextResponse.json({
      success: true,
      data: transformedData,
      meta: {
        startDate,
        endDate,
        series: T10Y2Y_SERIES_ID,
        source: 'FRED',
        description: 'Treasury Yield Curve Spread (10-Year Treasury Constant Maturity Minus 2-Year Treasury Constant Maturity)'
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
