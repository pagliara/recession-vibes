import { NextResponse } from 'next/server';

// FRED API key from environment variables
const FRED_API_KEY = process.env.FRED_API_KEY;

// Unemployment Series IDs
const UNEMPLOY_SERIES_ID = 'UNEMPLOY'; // Unemployment Level
const U1RATE_SERIES_ID = 'U1RATE'; // Percent of Civilian Labor Force Unemployed 15 Weeks and over
const EMRATIO_SERIES_ID = 'EMRATIO'; // Employment-Population Ratio

// Default start dates (using reasonable start dates for historical context)
const DEFAULT_START_DATE_UNEMPLOY = '1990-01-01';
const DEFAULT_START_DATE_U1RATE = '1990-01-01';
const DEFAULT_START_DATE_EMRATIO = '1990-01-01';

/**
 * Fetches all available Unemployment data (UNEMPLOY, U1RATE, and EMRATIO) from FRED
 * 
 * Note: This endpoint always returns all available data to enable client-side filtering
 * and static generation.
 * 
 * @returns Complete unemployment datasets for UNEMPLOY, U1RATE, and EMRATIO
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
        value: observation.value === '.' ? null : parseFloat(observation.value),
      }));
    };

    // Fetch all datasets in parallel
    const [unemployData, u1rateData, emratioData] = await Promise.all([
      fetchSeriesData(UNEMPLOY_SERIES_ID, DEFAULT_START_DATE_UNEMPLOY),
      fetchSeriesData(U1RATE_SERIES_ID, DEFAULT_START_DATE_U1RATE),
      fetchSeriesData(EMRATIO_SERIES_ID, DEFAULT_START_DATE_EMRATIO)
    ]);
    
    // Sort data by date to ensure proper rendering
    unemployData.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
    u1rateData.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
    emratioData.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return NextResponse.json({
      success: true,
      data: {
        unemploy: unemployData,
        u1rate: u1rateData,
        emratio: emratioData
      },
      meta: {
        endDate,
        fetchedFullDataset: true,
        series: {
          unemploy: {
            id: UNEMPLOY_SERIES_ID,
            startDate: DEFAULT_START_DATE_UNEMPLOY,
            description: 'Unemployment Level'
          },
          u1rate: {
            id: U1RATE_SERIES_ID,
            startDate: DEFAULT_START_DATE_U1RATE,
            description: 'Percent of Civilian Labor Force Unemployed 15 Weeks and over (U-1)'
          },
          emratio: {
            id: EMRATIO_SERIES_ID,
            startDate: DEFAULT_START_DATE_EMRATIO,
            description: 'Employment-Population Ratio'
          }
        },
        source: 'FRED'
      }
    });
  } catch (error: any) {
    console.error('Error fetching unemployment data:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
