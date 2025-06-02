"use client"

import React from "react"

// Define citations data structure
interface Citation {
  id: number
  source: string
  url: string
  description: string
}

// List of citations for all charts
const citations: Citation[] = [
  {
    id: 1,
    source: "Federal Reserve Economic Data (FRED)",
    url: "https://fred.stlouisfed.org/series/T10Y2Y",
    description: "10-Year Treasury Constant Maturity Minus 2-Year Treasury Constant Maturity"
  },
  {
    id: 2,
    source: "Federal Reserve Economic Data (FRED)",
    url: "https://fred.stlouisfed.org/series/T10Y3M",
    description: "10-Year Treasury Constant Maturity Minus 3-Month Treasury Constant Maturity"
  },
  {
    id: 3,
    source: "University of Michigan",
    url: "https://data.sca.isr.umich.edu/",
    description: "Surveys of Consumers - Index of Consumer Sentiment"
  },
  {
    id: 4,
    source: "U.S. Census Bureau",
    url: "https://www.census.gov/construction/nrc/index.html",
    description: "New Residential Construction - Housing Units Authorized by Building Permits"
  },
  {
    id: 5,
    source: "National Bureau of Economic Research (NBER)",
    url: "https://www.nber.org/research/business-cycle-dating",
    description: "Business Cycle Dating Committee Announcements"
  },
  {
    id: 6,
    source: "Federal Reserve Economic Data (FRED)",
    url: "https://fred.stlouisfed.org/series/UNEMPLOY",
    description: "Unemployment Level"
  },
  {
    id: 7,
    source: "Federal Reserve Economic Data (FRED)",
    url: "https://fred.stlouisfed.org/series/U1RATE",
    description: "Percentage of Labor Force Unemployed 15 Weeks or Longer"
  },
  {
    id: 8,
    source: "Federal Reserve Economic Data (FRED)",
    url: "https://fred.stlouisfed.org/series/EMRATIO",
    description: "Employment-Population Ratio"
  }
]

export function Footer() {
  return (
    <footer className="container mx-auto px-4 sm:px-8 py-8 border-t mt-12">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Data Sources</h2>
        <p className="text-sm text-muted-foreground mb-4">
          The data presented in these charts comes from the following sources:
        </p>
        <ul className="space-y-2">
          {citations.map((citation) => (
            <li key={citation.id} id={`citation-${citation.id}`} className="text-sm">
              <span className="font-medium">[{citation.id}]</span>{" "}
              <a 
                href={citation.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {citation.source}
              </a>
              {citation.description && (
                <span className="text-muted-foreground"> - {citation.description}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Open Source</h2>
        <p className="text-sm text-muted-foreground">
          This project is open source and available on{" "}
          <a 
            href="https://github.com/pagliara/recession-vibes" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            GitHub
          </a>.
          Contributions, suggestions, and feedback are welcome!
        </p>
      </div>
      <div className="text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Recession Vibes. Updated {new Date().toLocaleDateString()}</p>
        <p>This dashboard is for informational purposes only and should not be considered as financial advice.</p>
      </div>
    </footer>
  )
}

// Export specific citation links for use in chart components
export function CitationLink({ id }: { id: number }) {
  return (
    <a 
      href={`#citation-${id}`} 
      className="text-xs align-super ml-1 text-muted-foreground hover:text-primary"
    >
      [{id}]
    </a>
  )
}
