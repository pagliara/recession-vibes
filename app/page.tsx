import RecessionDashboard from "@/components/recession-dashboard";
import { fetchYieldCurveData, fetchConsumerSentimentData, fetchHousingPermitsData, fetchUnemploymentData } from "@/lib/data-fetching"

// Page is a server component by default
export default async function DashboardPage() {
  // Fetch all chart data in parallel
  const [yieldCurveData, consumerSentimentData, housingPermitsData, unemploymentData] = await Promise.all([
    fetchYieldCurveData(),
    fetchConsumerSentimentData(),
    fetchHousingPermitsData(),
    fetchUnemploymentData()
  ]);
  
  // Pass all data to the client RecessionDashboard component
  return (
    <RecessionDashboard 
      yieldCurveData={yieldCurveData}
      consumerSentimentData={consumerSentimentData} 
      housingPermitsData={housingPermitsData}
      unemploymentData={unemploymentData}
    />
  )
}
