export type BlogPost = {
  id: string
  title: string
  excerpt: string
  date: string
  author: string
  content: string
  slug: string
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Yield Curve Inversion: What It Means for the Economy",
    excerpt:
      "The yield curve has been inverted for several months. Here's what history tells us about what might happen next.",
    date: "May 10, 2025",
    author: "Jane Economist",
    slug: "yield-curve-inversion-economy",
    content: `
# Yield Curve Inversion: What It Means for the Economy

The yield curve has been inverted for several months. Here's what history tells us about what might happen next.

## What is the Yield Curve?

The yield curve is a graph that plots the yields (interest rates) of bonds with equal credit quality but different maturity dates. The most commonly referenced yield curve compares the three-month, two-year, five-year, 10-year, and 30-year U.S. Treasury debt. Under normal circumstances, the curve slopes upward, as debt with longer maturities typically carries higher interest rates than shorter-term debt.

## Why Does an Inversion Matter?

An inverted yield curve occurs when short-term debt instruments have higher yields than long-term instruments of the same credit quality. This unusual situation reflects investors' expectations for a weakening economy. Historically, yield curve inversions have been reliable predictors of economic recessions.

## Historical Precedent

Looking back at the past 50 years, we can observe that a yield curve inversion has preceded every recession, with only one false positive. The time lag between inversion and the onset of recession has varied from 6 to 24 months.

## Current Situation

The current inversion between the 10-year and 2-year Treasury yields has persisted for several months, reaching levels not seen since 2000. This persistent inversion, combined with other weakening economic indicators, suggests an increased probability of recession within the next 12 months.

## What Should Investors Do?

While yield curve inversions have historically been reliable recession predictors, they don't provide precise timing for market downturns. Investors should consider:

1. Reviewing asset allocations
2. Ensuring adequate emergency funds
3. Potentially increasing exposure to defensive sectors
4. Not making drastic portfolio changes based on a single indicator

## Conclusion

The yield curve inversion is a significant warning sign but should be considered alongside other economic indicators. Our recession probability model currently indicates a 68% chance of recession within the next 12 months, suggesting caution is warranted.
    `,
  },
  {
    id: "2",
    title: "Consumer Sentiment Decline: Leading or Lagging Indicator?",
    excerpt:
      "Consumer sentiment has fallen sharply in recent months. We analyze whether this is predicting or reflecting economic weakness.",
    date: "May 5, 2025",
    author: "Michael Analyst",
    slug: "consumer-sentiment-decline",
    content: `
# Consumer Sentiment Decline: Leading or Lagging Indicator?

Consumer sentiment has fallen sharply in recent months. We analyze whether this is predicting or reflecting economic weakness.

## Recent Trends in Consumer Sentiment

The Consumer Sentiment Index has declined for six consecutive months, falling to levels typically seen during economic downturns. This persistent decline has raised concerns about the health of consumer spending, which accounts for approximately 70% of U.S. GDP.

## Historical Relationship with Recessions

Historically, consumer sentiment has shown both leading and lagging properties with respect to recessions. While sharp declines often precede economic contractions, sentiment can also deteriorate as a result of already weakening economic conditions.

## Current Analysis

Our analysis suggests that the current decline in consumer sentiment is primarily functioning as a leading indicator. The deterioration began before significant changes in unemployment or GDP growth, suggesting that consumers are anticipating economic weakness rather than responding to it.

## Implications for the Economy

The forward-looking nature of the current sentiment decline is concerning, as it suggests consumers may reduce spending in anticipation of harder times ahead. This behavioral change could itself contribute to economic contraction through a self-fulfilling prophecy mechanism.

## What to Watch For

Key metrics to monitor alongside consumer sentiment include:

1. Retail sales data
2. Personal consumption expenditures
3. Credit card spending
4. Savings rates

Divergence between sentiment and actual spending patterns would provide important information about the predictive value of the current sentiment decline.

## Conclusion

The sharp drop in consumer sentiment appears to be signaling future economic weakness rather than reflecting current conditions. This increases the recession probability in our models and suggests that consumer-focused sectors may face headwinds in coming quarters.
    `,
  },
  {
    id: "3",
    title: "Housing Market Slowdown: Recession Harbinger or Healthy Correction?",
    excerpt:
      "Housing starts and home sales are declining. We examine whether this signals broader economic trouble ahead.",
    date: "April 28, 2025",
    author: "Sarah Builder",
    slug: "housing-market-slowdown",
    content: `
# Housing Market Slowdown: Recession Harbinger or Healthy Correction?

Housing starts and home sales are declining. We examine whether this signals broader economic trouble ahead.

## The Current Housing Market

Housing starts have declined for eight consecutive months, falling to levels last seen in early 2020. Home sales have similarly decreased, with existing home sales down 15% year-over-year. These trends have emerged despite continued low unemployment and moderate GDP growth.

## Historical Context

The housing market has often led the broader economy into recession. The 2008 financial crisis is the most dramatic example, but housing weakness also preceded the 2001 and 1990-91 recessions. However, not all housing market corrections lead to broader economic contractions.

## Causes of the Current Slowdown

Several factors are contributing to the current housing market weakness:

1. Rising mortgage rates
2. Elevated home prices affecting affordability
3. Reduced household formation
4. Tightening lending standards

## Potential Economic Impacts

The housing sector impacts the economy through multiple channels:

- Direct construction employment
- Demand for materials and furnishings
- Wealth effects on consumer spending
- Financial system exposure to mortgage debt

## Is This Time Different?

Unlike 2008, today's housing market features stronger fundamentals:

- Lower leverage among homeowners
- Stricter lending standards
- Less speculative building
- Stronger household balance sheets

## Conclusion

While the housing market slowdown is concerning and contributes to our elevated recession probability estimate, it appears more like a correction than a collapse. Nevertheless, continued deterioration in housing metrics would significantly increase recession risk, particularly if combined with weakness in other sectors.
    `,
  },
]

export function getLatestBlogPost(): BlogPost {
  return blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug)
}
