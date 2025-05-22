import { NextResponse } from 'next/server';

// API Route to fetch NASDAQ Composite Index (NASDAQCOM) historical data
export async function GET() {
  try {
    // FRED API endpoint for NASDAQ Composite Index (NASDAQCOM)
    const url = `https://api.stlouisfed.org/fred/series/observations?series_id=NASDAQCOM&api_key=${process.env.FRED_API_KEY}&file_type=json`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`FRED API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Process the raw FRED data into our application format
    // Format: [{date: '2021-01-01', value: 12345.67}, ...]
    const processedData = data.observations
      .map((item: any) => ({
        date: item.date,
        value: parseFloat(item.value) || null
      }))
      // Filter out entries with null or missing values
      .filter((item: any) => item.value !== null);
    
    return NextResponse.json({
      success: true,
      data: processedData
    });
  } catch (error: any) {
    console.error('Error fetching NASDAQ data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch NASDAQ data' 
      },
      { status: 500 }
    );
  }
}
