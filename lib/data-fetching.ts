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

// Unemployment data fetching
export async function fetchUnemploymentData() {
  try {
    // For server components, we need the absolute URL
    const url = new URL('/api/unemployment', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000')
    const response = await fetch(url.toString(), {
      next: { revalidate: 86400 } // Revalidate once per day (24 hours)
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch unemployment data');
    }
    
    return result.data;
  } catch (error: any) {
    console.error('Error fetching unemployment data:', error);
    // Return default data as fallback
    return {
      unemploy: defaultUnemployData,
      u1rate: defaultU1RateData,
      emratio: defaultEmRatioData
    };
  }
}

// S&P 500 index data fetching
export async function fetchSP500Data() {
  try {
    // For server components, we need the absolute URL
    const url = new URL('/api/sp500', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000')
    const response = await fetch(url.toString(), {
      next: { revalidate: 86400 } // Revalidate once per day (24 hours)
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();

    // Handle both response formats - with success flag or direct data
    if (result.success === false) {
      throw new Error(result.error || 'Failed to fetch S&P 500 data');
    }
    
    // Return data if it exists, otherwise assume result itself is the data
    return result.data || result;
  } catch (error: any) {
    console.error('Error fetching S&P 500 data:', error);
    // Return default data as fallback
    return defaultSP500Data;
  }
}

// NASDAQ Composite Index data fetching
export async function fetchNasdaqData() {
  try {
    // For server components, we need the absolute URL
    const url = new URL('/api/nasdaq', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000')
    const response = await fetch(url.toString(), {
      next: { revalidate: 86400 } // Revalidate once per day (24 hours)
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
    }
    
    const result = await response.json();

    // Handle both response formats - with success flag or direct data
    if (result.success === false) {
      throw new Error(result.error || 'Failed to fetch NASDAQ data');
    }
    
    // Return data if it exists, otherwise assume result itself is the data
    return result.data || result;
  } catch (error: any) {
    console.error('Error fetching NASDAQ data:', error);
    // Return default data as fallback
    return defaultNasdaqData;
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

// Default unemployment data for fallback scenarios
export const defaultUnemployData = [
  { date: "2023-01-01", value: 5892 },
  { date: "2023-02-01", value: 5799 },
  { date: "2023-03-01", value: 5848 },
  { date: "2023-04-01", value: 6107 },
  { date: "2023-05-01", value: 6091 },
  { date: "2023-06-01", value: 6050 },
  { date: "2023-07-01", value: 6281 },
  { date: "2023-08-01", value: 6358 },
  { date: "2023-09-01", value: 6077 },
  { date: "2023-10-01", value: 6335 },
  { date: "2023-11-01", value: 6284 },
  { date: "2023-12-01", value: 6164 },
  { date: "2024-01-01", value: 6119 },
  { date: "2024-02-01", value: 5896 },
  { date: "2024-03-01", value: 6041 },
  { date: "2024-04-01", value: 6178 },
];

export const defaultU1RateData = [
  { date: "2023-01-01", value: 1.2 },
  { date: "2023-02-01", value: 1.3 },
  { date: "2023-03-01", value: 1.3 },
  { date: "2023-04-01", value: 1.4 },
  { date: "2023-05-01", value: 1.4 },
  { date: "2023-06-01", value: 1.5 },
  { date: "2023-07-01", value: 1.5 },
  { date: "2023-08-01", value: 1.6 },
  { date: "2023-09-01", value: 1.5 },
  { date: "2023-10-01", value: 1.7 },
  { date: "2023-11-01", value: 1.7 },
  { date: "2023-12-01", value: 1.6 },
  { date: "2024-01-01", value: 1.6 },
  { date: "2024-02-01", value: 1.5 },
  { date: "2024-03-01", value: 1.5 },
  { date: "2024-04-01", value: 1.6 },
];

export const defaultEmRatioData = [
  { date: "2023-01-01", value: 60.2 },
  { date: "2023-02-01", value: 60.2 },
  { date: "2023-03-01", value: 60.3 },
  { date: "2023-04-01", value: 60.4 },
  { date: "2023-05-01", value: 60.3 },
  { date: "2023-06-01", value: 60.1 },
  { date: "2023-07-01", value: 60.0 },
  { date: "2023-08-01", value: 60.2 },
  { date: "2023-09-01", value: 60.4 },
  { date: "2023-10-01", value: 60.2 },
  { date: "2023-11-01", value: 60.0 },
  { date: "2023-12-01", value: 60.1 },
  { date: "2024-01-01", value: 60.2 },
  { date: "2024-02-01", value: 60.2 },
  { date: "2024-03-01", value: 60.3 },
  { date: "2024-04-01", value: 60.3 },
];

// Default S&P 500 data for fallback scenarios
export const defaultSP500Data = [
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

// Default NASDAQ Composite Index data for fallback scenarios
export const defaultNasdaqData = [
  { date: "1971-02-01", value: 100.00 },  // NASDAQ index started in 1971 with base value of 100
  { date: "1980-01-01", value: 159.14 },
  { date: "1990-01-01", value: 454.82 },
  { date: "2000-01-01", value: 4069.31 },
  { date: "2010-01-01", value: 2147.35 },
  { date: "2020-01-01", value: 9150.94 },
  { date: "2021-01-01", value: 13201.98 },
  { date: "2022-01-01", value: 14239.88 },
  { date: "2023-01-01", value: 10466.48 },
  { date: "2023-06-01", value: 13591.75 },
  { date: "2023-12-01", value: 14403.97 },
  { date: "2024-01-01", value: 14850.06 },
  { date: "2024-02-01", value: 15713.29 },
  { date: "2024-03-01", value: 16379.46 },
  { date: "2024-04-01", value: 15996.37 },
  { date: "2024-05-01", value: 16285.24 },
];
