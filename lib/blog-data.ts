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
Great, I’ll create an in-depth blog article explaining how the U.S. Treasury yield curve spread works as a predictor of economic recessions, focusing on the 10-year minus 2-year and 10-year minus 3-month differences. I’ll incorporate recent news from the past six months, charts, and historical data trends to make the topic accessible for a general audience.

I’ll let you know once everything is ready for your review.


# Unraveling the Yield Curve: Why the 10–2 and 10–3 Spreads Predict Recessions

**Introduction**
Among finance watchers, few indicators spark as much discussion as the **U.S. Treasury yield curve** and its unusual habit of **inverting** before recessions. In simple terms, the yield curve is a line plotting interest rates on government bonds from short maturities (like 3-month Treasury bills) to long maturities (like 10-year Treasury notes). Normally, this curve slopes upward – longer-term bonds pay higher yields than short-term ones. But occasionally the curve flips upside-down, with short-term yields rising above long-term yields. This rare phenomenon – an **inverted yield curve** – has gained fame as a **warning signal** for economic trouble ahead. In this article, we’ll demystify how the yield curve spread (especially the gap between 10-year and 2-year yields, and between 10-year and 3-month yields) works as a predictor of recessions. We’ll look at what an inversion means, why it matters, the historical pattern before past U.S. recessions, and what the current curve is suggesting about recession risks in 2025.

## What Is the Yield Curve and Its “Spread”?

The *yield curve* refers to the relationship between bond yields (interest rates) and their maturities. For U.S. Treasuries, it’s often visualized as a curve plotting yields for bonds of various terms – from very short (3-month, 1-year) to medium-term (2-year, 5-year) to long-term (10-year, 30-year). Under normal economic conditions, this curve slopes upward. Investors usually demand **higher yields for longer-term bonds** to compensate for the risks of time (like inflation or uncertainty), while short-term bonds have lower yields. In a **normal yield curve**, a 10-year bond’s interest rate will be higher than a 2-year bond’s rate, which in turn is higher than a 3-month bill’s rate. The difference in yield between any two maturities is called a **yield spread** or slope. Two closely watched spreads are: **10-year minus 2-year yield** (often abbreviated “10–2 spread”) and **10-year minus 3-month yield** (the spread used by many recession models). A positive spread means the longer-term rate is higher than the shorter-term rate (an upward slope), while a **negative spread** means the curve is inverted (short-term rate higher than long-term).

&#x20;*Illustration: Typical shapes of the yield curve.* An upward-sloping “normal” curve (top) has higher yields for longer terms; an “inverted” curve (bottom) slopes downward with short-term yields exceeding long-term yields, and a “flat” curve (middle) is nearly horizontal. In practice, the U.S. yield curve tends to be normal during economic expansions, flattens when growth prospects are uncertain, and inverts on the eve of slowdowns.

## Inverted Yield Curve: A Harbinger of Recession

When the yield curve **inverts**, it signals something very unusual: investors are accepting *lower* returns on long-term bonds than on short-term bonds. Why would they do that? The most common explanation is that **markets expect future interest rates to drop** – typically because of a weakening economy that will force the Federal Reserve to **cut short-term rates**. In other words, an inverted curve reflects a belief that today’s high short-term rates won’t last; growth and inflation will likely slow, so long-term yields fall in anticipation of easier monetary policy. An inversion is often interpreted as a vote of *no confidence* in the near-term economy.

Historically, an inverted yield curve has been an **uncannily accurate leading indicator** of U.S. recessions. As one analysis notes, a negative 10–2 year spread “has predicted every U.S. recession from 1955 to 2018, occurring 6–24 months before the recession”. Likewise, every U.S. recession in the past 60 years **was preceded by an inversion of the 10-year vs 3-month yield curve**. Investors have “almost always been correct in this prediction” – for the last half-century, *every* sustained yield curve inversion has been followed by an economic recession within roughly a year or two. Because of this track record, the yield curve’s slope is considered a valuable **leading economic indicator**. It is so reliable that the U.S. Federal Reserve Bank of New York even uses the 10-year minus 3-month spread in a model to estimate recession probabilities in the year ahead.

Why does this inversion signal trouble so consistently? Partly it’s expectations – as mentioned, markets anticipate a downturn and Fed rate cuts. Another mechanism is through banks and credit: banks borrow short-term (e.g. taking deposits or short-term funding) and lend long-term (making longer-term loans). In a normal curve, this works profitably (borrow low, lend high). But if short rates rise above long rates (inversion), banks’ profit margins shrink and they may **cut back lending**, which can **tighten credit** to the economy and slow growth. Thus, an inverted curve doesn’t just predict downturns – it may *help cause* them by cooling credit flow. In sum, an inversion means **financial conditions are unusually tight**, future prospects are weak, or both. It’s a flashing indicator that “investors expect slower economic growth and future rate cuts,” and it often becomes a self-fulfilling prophecy as credit conditions tighten.

## 10-Year vs 2-Year and 10-Year vs 3-Month: What’s the Difference?

Not all yield curve spreads are created equal. The two most famous ones – the 10-year/2-year and the 10-year/3-month – are often both referenced, and they usually tell a similar story, though with some nuances. Both of these are **measures of the yield curve slope** (long-term minus short-term yield), but they can behave a bit differently at times:

* **10-Year vs 2-Year (10–2 Spread):** This compares a medium-term Treasury (2-year note) to a long-term Treasury (10-year note). The 2-year yield is heavily influenced by **market expectations of the Fed’s policy over the next couple of years**. It’s a forward-looking short-end rate. The 10-year yield reflects longer-term growth and inflation outlooks (and a term premium). The 10–2 spread is a favorite on trading desks and in media because the 2-year yield moves quickly with Fed signals. It sometimes inverts *earlier* than the 3-month spread because investors anticipating Fed rate hikes or cuts will trade the 2-year aggressively. For example, in 2022 the 10–2 spread inverted by summer, even while the 3-month rate (still near the Fed’s then-lower policy rate) had not risen enough to invert against the 10-year. Historically, the 10–2 spread has been a good recession predictor but not perfect. It has inverted a few times without an immediate recession (a notable case was 1998). It also tends to be a bit more volatile day-to-day than the 3-month spread.

* **10-Year vs 3-Month (10–3mo Spread):** This spread compares a true short-term rate (3-month T-bill, which closely tracks the Fed’s current policy rate) to the 10-year. Many economists (and the Fed itself) consider this spread to be **more theoretically grounded as a recession indicator**. It directly captures the difference between the current Fed-controlled short rate and the market’s longer-term rate. The New York Fed’s famous model uses the 3-month/10-year spread for this reason. The 10–3m spread tends to invert **slightly later** than 10–2 (because the Fed may still be hiking short rates even after 2-year has priced in those hikes), but when it does invert, it has given remarkably few false signals. As one research summary notes: “Every recession in the past 60 years has been preceded by an inversion of the 3-month and 10-year Treasury yields”. By contrast, the 2-year spread missed one instance (it did not invert before the 2020 COVID recession until perhaps very close, whereas 3m-10y did invert in 2019) and gave one premature signal (a brief 2y inversion in 1998 with no recession). In other words, the 10–3m is slightly more conservative but extremely reliable when it flips.

Importantly, most of the time these two spreads convey the **same general shape** of the curve. When one is deeply inverted, the other usually is as well (eventually). In fact, in the big picture, **both 10–2 and 10–3m spreads “move similarly” over time**, and both have been “excellent predictors of recessions” despite a couple of differences. The 10–2 spread might invert more frequently or sooner, while the 10–3m spread might be a cleaner recession signal if one had to choose. Because of these differences, analysts often monitor *both* to get a full picture.

## A Look Back: Yield Curve Inversions Before Past Recessions

One of the best ways to appreciate the yield curve’s predictive power is to see what it typically does *before* a recession hits. In U.S. data, yield curve inversions have consistently preceded recessions by a lead time of several months to over a year. The chart below shows the historical behavior of the 10-year minus 3-month and 10-year minus 2-year spreads alongside past recessions (gray bars):

&#x20;*Chart: U.S. Treasury yield curve spreads vs. recessions.* The blue line shows the 10-year minus 3-month yield spread and the red line shows the 10-year minus 2-year spread. When the lines dip below zero, the yield curve is inverted. Shaded gray areas indicate U.S. recessions. As shown, **each recession was preceded by an inversion of the yield curve** – the spreads turned negative before every downturn in recent decades. (Source: Federal Reserve Bank of St. Louis)

Historically, the pattern is striking. For example, the yield curve inverted in **late 2006** – the 10–3 month spread turned negative about a year before the Great Recession of 2007–2009. It inverted in **2000** before the 2001 recession. It inverted in **1989**, roughly a year before the 1990–91 recession. Going further back, an inversion occurred in 1980 ahead of the 1981–82 double-dip recession, and in the late 1970s before the 1980 downturn. In each case, short-term interest rates (often driven up by Fed tightening to combat inflation) rose above long-term rates, signaling that monetary policy had become tight and the economy was likely to slow. Typically the **lead time** from inversion to recession has been anywhere from about 6 months to 18+ months. One study of past instances found an average lead of around 12 months or so, though it varies (for example, the yield curve inverted in mid-2006 and the recession started about 18 months later, in Dec 2007; in other cases the lag was shorter).

It’s also worth noting that **false alarms are rare** – sustained yield curve inversions have almost always been followed by recessions. A possible exception was a brief 2-year/10-year inversion in 1998: the 2-year spread went slightly negative amid the LTCM crisis and Fed rate cuts, but the 3-month/10-year did *not* invert at that time and the economy avoided recession in 1998–99. That minor episode underscores why many analysts place more weight on the 3-month spread. Other than that, the yield curve’s recession-forecasting record since the 1960s has been remarkably clean. As economists often quip, “the yield curve has predicted *10 of the last 7 recessions*” – a tongue-in-cheek way to note that while it’s not perfect, it has a far better hit rate than most indicators (its *misses* are few, and it sometimes gives early warnings that take a while to play out).

## Why Is the Yield Curve a Leading Indicator?

The yield curve’s predictive prowess comes from its role as a barometer of **investor expectations and financial conditions**. When the curve inverts, it indicates a consensus that **monetary policy is (or will be) tight and the economy will weaken**. Typically, the Federal Reserve raises short-term interest rates to cool an overheating economy or fight inflation. If it raises them high enough, short-term yields (like the 3-month or 2-year) can exceed longer yields. At that point, bond investors are effectively saying: *“We think these high rates won’t last; the Fed will likely have to cut rates in the near future because the economy will falter.”* Long-term yields stop rising (or even fall) because investors flock to longer bonds as a safe haven, locking in yields before they drop further. This dynamic is why an inversion often **“leads” the recession** – it’s reflecting expectations of future rate cuts and economic decline. As the Reserve Bank of Australia explains, an inverted curve in the U.S. has been associated with upcoming contractions because investors correctly anticipate that the central bank will later **reduce rates in response to a downturn**.

Another reason it’s a leading indicator is that an inversion affects **bank lending behavior**, as mentioned earlier. When short rates jump above long rates, banks face a profit squeeze on new loans, which can prompt them to tighten lending standards. Less credit flowing into businesses and households can **slow spending and investment**, hastening an economic cooldown. In essence, the inversion is both a *symptom* of expected Fed over-tightening and a *cause* of a credit squeeze – a one-two punch that tends to precede recessions.

Of course, the yield curve is not a timer that tells exactly *when* a recession will hit or how severe it will be. There can be a considerable lag. But its consistent track record has made it a staple in forecasting. Even the Federal Reserve’s own research acknowledges the term spread’s value: the Cleveland Fed notes a common “rule of thumb” that an inverted curve “indicates a recession in about a year”. The New York Fed’s model (as of spring 2025) pegs the probability of a U.S. recession by early 2026 at roughly 30% based purely on the current yield spread. Many private forecasters also incorporate the curve; for instance, earlier this year J.P. Morgan economists said including the yield curve pushes their recession odds for 2025 up to around 30%, versus only \~12% if one excludes it. In summary, the slope of the yield curve encapsulates a lot of forward-looking information about monetary policy and economic sentiment, which is why its inversion is heeded as an omen of rough times ahead.

## Recent Developments: An Unprecedented Inversion and “Steepening” in 2022–2025

The past few years have given a textbook example of the yield curve’s signaling power – albeit with some unique twists. In **2022**, as inflation spiked to multi-decade highs, the Federal Reserve embarked on an aggressive campaign of interest rate hikes. Short-term yields rocketed upward in response. By mid-2022, the 2-year Treasury yield had risen sharply, and by July 2022 the 10-year minus 2-year spread turned negative (signaling the start of an inversion). The 10-year minus 3-month spread followed a few months later – by late 2022, that key spread also inverted as the Fed’s rate hikes drove the 3-month T-bill yield above the 10-year yield. This kicked off what would become an **extended, deep yield curve inversion**. Throughout 2023, short-term rates remained higher than long-term rates. At its deepest point, the inversion was the most extreme in over 40 years – at one point the 2-year yield exceeded the 10-year yield by **more than a full percentage point**, and the 3-month/10-year gap was similarly large. (For context, the 10–2 spread hit a low around –1.07% in July 2022, and the 10–3m spread reached roughly –1.5% by spring 2023, the biggest inversion since the early 1980s.) This prolonged inversion lasted into 2024. In fact, the yield curve (10–3m) stayed inverted for an extraordinary **783 consecutive days**, the longest stretch on record. By mid-2023, commentators were loudly debating if a recession was inevitable given the curve’s historic warning.

Fast forward to late **2024** and early **2025**, and the story took a turn. The U.S. economy proved resilient through 2023 – growth moderated but did not collapse, even as the curve remained inverted. Inflation started cooling and by 2024 the Federal Reserve paused its rate hikes. In the latter half of 2024, the yield curve began to **“un-invert” and steepen**. There were two forces at play: First, **short-term yields started to come down** slightly as markets anticipated future Fed rate cuts (and indeed the Fed quietly began trimming rates – by early 2025 the 3-month T-bill yield had fallen from over 5% a year earlier to about 4.3%). Second, **long-term yields actually rose in late 2024**, due to factors like heavy Treasury debt issuance and a modest uptick in term premia. This combination caused the 10-year yield to climb above the 2-year yield again. By **September 2024**, for the first time in over two years, the 10–2 spread flipped back to positive. A research note at the time gleefully proclaimed “the end of the yield curve inversion that just wouldn’t quit” – after a record duration, the curve had finally righted itself. This phase is called a **steepening** of the curve (the curve’s slope is increasing again). Notably, this steepening happened *before* any clear recession hit – raising the question, what now?

As of mid-**2025**, the U.S. Treasury yield curve is no longer inverted. Short-term rates remain relatively high, but long-term rates have moved higher as well, and short rates are off their peak. The **10-year minus 2-year spread** is about **+0.5 percentage points** (10-year yield \~4.3%, 2-year \~3.8% in May 2025). One year ago it was –0.37%, so that’s a significant swing back upward. The **10-year minus 3-month spread** has also climbed out of inversion; it’s only slightly positive (\~0.08% as of May 13, 2025) but that’s up from deeply negative territory a year prior. In yield-curve parlance, the curve has gone from **inverted** in 2022–2023 to **flattening out** in 2024 and now **steepening** in 2025. However, it’s not a steep upward slope – it’s more or less flat-to-gently-upward at the moment, reflecting an uncertain equilibrium.

This recent “disinversion” has prompted much discussion in financial media. Some analysts interpret the steepening as a late-cycle signal that a recession is still coming – often, the curve *un-inverts* because the Fed starts cutting rates as the economy softens (which historically happens right before a recession hits). In fact, one model argues that the **risk of recession is highest in the months immediately after the curve un-inverts**. According to an analysis by Current Market Valuation, the probability of recession remains “Very High” in the 0–6 month window after the yield curve turns positive again, given historical patterns. Their logic: when the spread starts widening from negative to positive, it usually means monetary easing has begun due to economic stress, and the long-anticipated downturn may be near. Indeed, an observer on one forum quipped, “The entire yield curve has now uninverted… So we can start the countdown to recession – 12–18 months?”. This view aligns with the idea that the **damage may already be done** by the long inversion; the steepening is just the prelude to the actual downturn.

On the other hand, **not everyone agrees** that a recession is inevitable. Some economists argue “this time might be different” due to unique post-pandemic factors. When the curve steepened in late 2024, *growing recession concerns* accompanied it, but a few analysts doubted a recession would materialize. For example, Capital Economics noted in September 2024 that while the curve’s inversion was ending amid worries of a downturn, they did **“doubt one will materialise this time.”** They expected the curve to keep steepening (with 10-year yields rising and 2-year yields falling) without a recession in the near term. Their argument hinged on the idea of a **“soft landing”** – inflation coming down without a major economic contraction – which would allow long-term rates to rise for benign reasons (better growth prospects) even as the Fed eases gently. Likewise, some market strategists have pointed out that **un-inversion can occur in two ways**: one bearish (short-term yields collapse as the Fed cuts into a recession) and one bullish (long-term yields climb, reflecting optimism or higher neutral rates). The latter seems to have contributed in late 2024, when a surge in long-term yields steepened the curve even as the economy stayed out of recession. This has created a bit of a **mystery over the U.S. economy**, as one Financial Times piece put it – the yield curve had been screaming “recession ahead,” yet as of 2025 the economy is still growing modestly. Investors are left guessing whether the curve was early, or just wrong this time.

## Recession Risk in 2025: Reading the Tea Leaves

So, what do the current yield curve spreads suggest about recession risk in 2025? On balance, the message is **cautionary, but with some ambiguity**. The yield curve **did** issue a loud warning in 2022–2023 by inverting deeply – and historically such a warning often precedes a recession within about two years. We are now within that window. The curve has only recently un-inverted, which, as noted, is often the final phase before a downturn (when the Fed pivots to rate cuts, the economy sometimes enters recession shortly thereafter). The **New York Fed’s model**, using the 10y–3m spread and data through April 2025, assigns roughly a **30% probability** of a U.S. recession by April 2026. (That probability had been higher when the curve was more inverted; it has come down as the curve flattened out.) Other forecasters have varied in their outlooks: for instance, some Wall Street economists peg the odds of a 2025 recession at around 40–60%, while others are more optimistic. The **Wall Street Journal’s latest economist survey** (April 2025) on average put recession odds at \~22% for 2025 – notably lower than the yield curve model alone, reflecting that many see a chance of dodging a downturn.

It’s important to weigh the curve’s signal against current conditions. **Supporters of the soft-landing view** argue that unlike prior inversion episodes, this one occurred while the job market remained robust and excess savings from the pandemic helped sustain spending. They also note that inflation, while high in 2022, has been coming down, potentially allowing the Fed to ease without a recession. **Skeptics**, however, point out that key sectors (like manufacturing) have weakened and that lagged effects of the Fed’s very rapid rate hikes may simply not have fully hit yet. They warn that the **curve’s track record shouldn’t be ignored** – the long inversion could have been the prelude, and the real impact (credit tightening, reduced investment) will show up in late 2025. Historical studies have found that even if stocks or the economy perform decently for a while after inversion, a recession often follows with a lag. For example, after the 2006 inversion, equity markets kept rising for over a year, only to decline when the recession finally arrived.

At the moment, the yield curve is **neither steeply upward nor inverted – it’s relatively flat**. A flat curve itself can indicate a transition or uncertainty. If the curve *steepens further* because short-term yields drop (say, the Fed cuts rates significantly), that could be happening in response to economic weakness – essentially confirming recession. If instead the curve steepens because long-term yields rise (without a big Fed cut), that might suggest the economy is muddling through with slightly higher long-run rates (a scenario of continued expansion or only mild slowdown). As of May 2025, we’ve seen a bit of both: some decline in short rates and some rise in long rates.

**Bottom line:** The yield curve spread – especially the gap between the 10-year and 3-month yields – gave a clear recession warning in the past two years by inverting. Now that warning signal is *less glaring* (spreads have moved back above zero), but it hasn’t completely gone away. The curve’s earlier message of caution still looms in the background. Every inversion doesn’t guarantee a recession, but given the flawless U.S. record since the 1970s, it tilts the odds in favor of one. Many analysts are therefore on alert for a possible economic downturn in **late 2025 or early 2026**, roughly 1–2 years after the initial inversion – consistent with the historical lag. However, if a recession does occur, it may also be **milder** if the advance warning allows policymakers and businesses to prepare (for instance, the Fed could continue easing to cushion the blow).

In conclusion, the U.S. yield curve’s 10–2 and 10–3 spreads remain crucial gauges to watch. They encapsulate the collective wisdom (or worries) of bond investors about the future. As of now, the curve is signaling that we are **not out of the woods yet**. It has transitioned from an inverted shape (clear warning) to a flat/upward shape (uncertain outlook). History suggests vigilance: a flat or steepening curve following an inversion often precedes the actual downturn. Whether 2025 will indeed bring a recession is still a matter of debate, but thanks to the yield curve, we at least know what many consider the *single best predictor* has to say. And what it said – loudly, in 2022–23 – was “buckle up.” Time will tell if that warning translates into an actual recession or if extraordinary factors allow the economy to defy the yield curve’s ominous signal. For now, economists and investors will be **scanning that curve** every day for further clues – an upward steepening or renewed flattening – as they try to discern which way the economic winds will blow.

**Sources:** U.S. Federal Reserve data; Financial Times; Capital Economics; U.S. Funds; YCharts market data; Federal Reserve Bank of Cleveland; New York Fed; RBA Explainer; CurrentMarketValuation; UW-Stevens Point analysis; and other financial news and research as cited above.

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
