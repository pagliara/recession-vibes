import { NextResponse } from 'next/server';

// FRED API key from environment variables
const FRED_API_KEY = process.env.FRED_API_KEY;

// New Privately-Owned Housing Units Authorized in Permit-Issuing Places: Total Units Series ID
const PERMIT_SERIES_ID = 'PERMIT';

// Default start date (earliest available data)
const DEFAULT_START_DATE = '1960-01-01'; 

// Default housing permits data (fallback if API fails)
const DEFAULT_HOUSING_PERMITS_DATA = [
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
];

/**
 * Fetches all available Housing Building Permits data from FRED
 * 
 * Note: This endpoint always returns all available data to enable client-side filtering
 * and static generation. The startDate and endDate parameters in the request are ignored.
 * 
 * @returns Complete housing permits dataset
 */
// API route to fetch housing permit data from FRED
export async function GET(request: Request) {
  // Check if API key is provided
  if (!FRED_API_KEY) {
    console.error('FRED API key is not configured');
    // Return default data as fallback
    return NextResponse.json({
      success: true,
      data: DEFAULT_HOUSING_PERMITS_DATA,
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

    // Fetch the housing permits data
    const housingPermitsData = await fetchSeriesData(PERMIT_SERIES_ID, DEFAULT_START_DATE);
    
    // Sort data by date to ensure proper rendering
    housingPermitsData.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return NextResponse.json({
      success: true,
      data: housingPermitsData,
      meta: {
        endDate,
        fetchedFullDataset: true,
        series: {
          id: PERMIT_SERIES_ID,
          startDate: DEFAULT_START_DATE,
          description: 'New Privately-Owned Housing Units Authorized in Permit-Issuing Places: Total Units'
        },
        source: 'FRED'
      }
    });
  } catch (error: any) {
    console.error('Error fetching housing permits data:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
