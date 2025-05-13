// A simplified approach that doesn't rely on importing data from chart components

export function calculateRecessionProbability(): number {
  // Hardcoded latest values for each indicator
  // In a real application, these would come from an API or database
  const latestYieldCurve = -0.24 // Latest value from yieldCurveData
  const latestUnemployment = 300 // Latest value from unemploymentData
  const latestGdp = 0.2 // Latest value from gdpData
  const latestSentiment = 56 // Latest value from sentimentData
  const latestLeadingIndicators = 97.7 // Latest value from leadingIndicatorsData
  const latestHousingStarts = 1070 // Latest value from housingStartsData

  // Calculate individual probabilities (simplified)
  // Each returns a value between 0-100
  const yieldCurveProb = latestYieldCurve < 0 ? 80 : latestYieldCurve < 0.5 ? 40 : 10
  const unemploymentProb = latestUnemployment > 275 ? 70 : latestUnemployment > 250 ? 50 : 20
  const gdpProb = latestGdp < 0.5 ? 80 : latestGdp < 1.0 ? 60 : 20
  const sentimentProb = latestSentiment < 60 ? 75 : latestSentiment < 70 ? 40 : 15
  const leadingIndicatorsProb = latestLeadingIndicators < 98.5 ? 85 : latestLeadingIndicators < 100 ? 50 : 15
  const housingStartsProb = latestHousingStarts < 1100 ? 70 : latestHousingStarts < 1300 ? 40 : 10

  // Apply weights based on historical predictive power
  // These weights should sum to 1
  const weights = {
    yieldCurve: 0.25, // Yield curve inversion is historically a strong predictor
    unemployment: 0.15,
    gdp: 0.2,
    sentiment: 0.1,
    leadingIndicators: 0.2,
    housingStarts: 0.1,
  }

  // Calculate weighted average
  const weightedProb =
    yieldCurveProb * weights.yieldCurve +
    unemploymentProb * weights.unemployment +
    gdpProb * weights.gdp +
    sentimentProb * weights.sentiment +
    leadingIndicatorsProb * weights.leadingIndicators +
    housingStartsProb * weights.housingStarts

  // Round to nearest integer
  return Math.round(weightedProb)
}
