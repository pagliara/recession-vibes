import RecessionDashboard from "@/components/recession-dashboard";
import { fetchYieldCurveData, fetchConsumerSentimentData, fetchHousingPermitsData, fetchUnemploymentData, fetchNasdaqData } from "@/lib/data-fetching"

// Page is a server component by default
export default async function DashboardPage() {
  // Fetch all chart data in parallel
  const [yieldCurveData, consumerSentimentData, housingPermitsData, unemploymentData, nasdaqData] = await Promise.all([
    fetchYieldCurveData(),
    fetchConsumerSentimentData(),
    fetchHousingPermitsData(),
    fetchUnemploymentData(),
    fetchNasdaqData()
  ]);
  
  // Pass all data to the client RecessionDashboard component
  return (
    <RecessionDashboard 
      yieldCurveData={yieldCurveData}
      consumerSentimentData={consumerSentimentData} 
      housingPermitsData={housingPermitsData}
      unemploymentData={unemploymentData}
      nasdaqData={nasdaqData}
    />
  )
}
