// Historical US recession periods (NBER official dates)
// Source: National Bureau of Economic Research (NBER)
// Format: [start date, end date]

export interface RecessionPeriod {
  startDate: number; // Changed from string to number (timestamp in ms)
  endDate: number;   // Changed from string to number (timestamp in ms)
  name?: string;     // Optional name/description of the recession
}

// List of historical US recessions 
export const historicalRecessionPeriods: RecessionPeriod[] = [
  {
    startDate: new Date("1980-01-01").getTime(),
    endDate: new Date("1980-07-31").getTime(),
    name: "1980 Recession"
  },
  {
    startDate: new Date("1981-07-01").getTime(),
    endDate: new Date("1982-11-30").getTime(),
    name: "Early 1980s Recession"
  },
  {
    startDate: new Date("1990-07-01").getTime(),
    endDate: new Date("1991-03-31").getTime(),
    name: "Early 1990s Recession"
  },
  {
    startDate: new Date("2001-03-01").getTime(),
    endDate: new Date("2001-11-30").getTime(),
    name: "Dot-com Recession"
  },
  {
    startDate: new Date("2007-12-01").getTime(),
    endDate: new Date("2009-06-30").getTime(),
    name: "Great Recession"
  },
  {
    startDate: new Date("2020-02-01").getTime(),
    endDate: new Date("2020-04-30").getTime(),
    name: "COVID-19 Recession"
  }
];
