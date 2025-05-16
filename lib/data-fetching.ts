// Data fetching utilities for server components

// Treasury yield curve data fetching
export async function fetchYieldCurveData() {
  try {
    // For server components, we need the absolute URL
    // We'll use the URL object to ensure we have an absolute URL
    const url = new URL('/api/treasury-curve', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000')
    const response = await fetch(url.toString(), {
      // Next.js caching options for server components
      next: { revalidate: 86400 } // Revalidate once per day (24 hours)
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch yield curve data');
    }
    
    return result.data;
  } catch (error: any) {
    console.error('Error fetching yield curve data:', error);
    // Return default data as fallback
    return {
      t10y2y: defaultYieldCurveDataRaw.map(item => ({
        date: item.date,
        spread: item.spread
      })),
      t10y3m: defaultYieldCurveT10Y3MDataRaw.map(item => ({
        date: item.date,
        spread: item.spread
      }))
    };
  }
}

// Consumer sentiment data fetching
export async function fetchConsumerSentimentData() {
  try {
    // For server components, we need the absolute URL
    const url = new URL('/api/consumer-sentiment', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000')
    const response = await fetch(url.toString(), {
      next: { revalidate: 86400 } // Revalidate once per day (24 hours)
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch consumer sentiment data');
    }
    
    return result.data;
  } catch (error: any) {
    console.error('Error fetching consumer sentiment data:', error);
    // Return default data as fallback
    return defaultConsumerSentimentData;
  }
}

// Housing permits data fetching
export async function fetchHousingPermitsData() {
  try {
    // For server components, we need the absolute URL
    const url = new URL('/api/housing-permits', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000')
    const response = await fetch(url.toString(), {
      next: { revalidate: 86400 } // Revalidate once per day (24 hours)
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch housing permits data');
    }
    
    return result.data;
  } catch (error: any) {
    console.error('Error fetching housing permits data:', error);
    // Return default data as fallback
    return defaultHousingPermitsData;
  }
}

// Default data for fallback scenarios
export const defaultYieldCurveDataRaw = [
  { date: "2023-01-01", spread: 0.21 },
  { date: "2023-01-08", spread: 0.18 },
  { date: "2023-01-15", spread: 0.15 },
  { date: "2023-01-22", spread: 0.12 },
  { date: "2023-01-29", spread: 0.08 },
  { date: "2023-02-05", spread: 0.05 },
  { date: "2023-02-12", spread: 0.02 },
  { date: "2023-02-19", spread: -0.01 },
  { date: "2023-02-26", spread: -0.05 },
  { date: "2023-03-05", spread: -0.08 },
  { date: "2023-03-12", spread: -0.12 },
  { date: "2023-03-19", spread: -0.15 },
  { date: "2023-03-26", spread: -0.18 },
  { date: "2023-04-02", spread: -0.21 },
  { date: "2023-04-09", spread: -0.23 },
  { date: "2023-04-16", spread: -0.25 },
  { date: "2023-04-23", spread: -0.27 },
  { date: "2023-04-30", spread: -0.28 },
  { date: "2023-05-07", spread: -0.26 },
  { date: "2023-05-14", spread: -0.24 },
];

export const defaultYieldCurveT10Y3MDataRaw = [
  { date: "2023-01-01", spread: 0.45 },
  { date: "2023-01-08", spread: 0.42 },
  { date: "2023-01-15", spread: 0.38 },
  { date: "2023-01-22", spread: 0.35 },
  { date: "2023-01-29", spread: 0.31 },
  { date: "2023-02-05", spread: 0.28 },
  { date: "2023-02-12", spread: 0.25 },
  { date: "2023-02-19", spread: 0.20 },
  { date: "2023-02-26", spread: 0.15 },
  { date: "2023-03-05", spread: 0.10 },
  { date: "2023-03-12", spread: 0.05 },
  { date: "2023-03-19", spread: 0.00 },
  { date: "2023-03-26", spread: -0.05 },
  { date: "2023-04-02", spread: -0.10 },
  { date: "2023-04-09", spread: -0.15 },
  { date: "2023-04-16", spread: -0.20 },
  { date: "2023-04-23", spread: -0.25 },
  { date: "2023-04-30", spread: -0.30 },
  { date: "2023-05-07", spread: -0.28 },
  { date: "2023-05-14", spread: -0.25 },
];

export const defaultConsumerSentimentData = [
  { date: "2023-01-01", value: 64.9 },
  { date: "2023-02-01", value: 67.0 },
  { date: "2023-03-01", value: 62.0 },
  { date: "2023-04-01", value: 63.5 },
  { date: "2023-05-01", value: 59.2 },
  { date: "2023-06-01", value: 64.4 },
  { date: "2023-07-01", value: 71.6 },
  { date: "2023-08-01", value: 69.5 },
  { date: "2023-09-01", value: 68.1 },
  { date: "2023-10-01", value: 63.8 },
  { date: "2023-11-01", value: 61.3 },
  { date: "2023-12-01", value: 69.7 },
  { date: "2024-01-01", value: 79.0 },
  { date: "2024-02-01", value: 76.9 },
  { date: "2024-03-01", value: 79.4 },
  { date: "2024-04-01", value: 77.2 },
];

export const defaultHousingPermitsData = [
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
