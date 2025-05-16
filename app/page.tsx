import RecessionDashboard from "@/components/recession-dashboard";
import { fetchYieldCurveData, fetchConsumerSentimentData, fetchHousingPermitsData } from "@/lib/data-fetching"

// Page is a server component by default
export default async function DashboardPage() {
  // Fetch all chart data in parallel
  const [yieldCurveData, consumerSentimentData, housingPermitsData] = await Promise.all([
    fetchYieldCurveData(),
    fetchConsumerSentimentData(),
    fetchHousingPermitsData()
  ]);
  
  // Pass all data to the client RecessionDashboard component
  return (
    <RecessionDashboard 
      yieldCurveData={yieldCurveData}
      consumerSentimentData={consumerSentimentData} 
      housingPermitsData={housingPermitsData}
    />
  )
}
