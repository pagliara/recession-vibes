import { NextResponse } from 'next/server';

// FRED API key from environment variables
const FRED_API_KEY = process.env.FRED_API_KEY;

// University of Michigan Consumer Sentiment Series ID
const UMCSENT_SERIES_ID = 'UMCSENT';

// Default start date (earliest available data)
const DEFAULT_START_DATE = '1978-01-01'; // Data available from January 1978

/**
 * Fetches all available University of Michigan Consumer Sentiment data from FRED
 * 
 * Note: This endpoint always returns all available data to enable client-side filtering
 * and static generation. The startDate and endDate parameters in the request are ignored.
 * 
 * @returns Complete consumer sentiment dataset
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

    // Fetch the consumer sentiment data
    const consumerSentimentData = await fetchSeriesData(UMCSENT_SERIES_ID, DEFAULT_START_DATE);
    
    // Sort data by date to ensure proper rendering
    consumerSentimentData.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return NextResponse.json({
      success: true,
      data: consumerSentimentData,
      meta: {
        endDate,
        fetchedFullDataset: true,
        series: {
          id: UMCSENT_SERIES_ID,
          startDate: DEFAULT_START_DATE,
          description: 'University of Michigan: Consumer Sentiment'
        },
        source: 'FRED'
      }
    });
  } catch (error: any) {
    console.error('Error fetching consumer sentiment data:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
