function kpiTier(value, high, mid) {
  if (value >= high) return 1.0;
  if (value >= mid)  return 0.4;
  return 0.0;
}

export function computeES({ sessionMinutes, appOpens, productViews, wishlistConversionRate, advisorAcceptanceRate }) {
  const raw = kpiTier(sessionMinutes, 15, 5)               * 0.25
            + kpiTier(appOpens, 5, 2)                      * 0.20
            + kpiTier(productViews, 5, 1)                  * 0.20
            + kpiTier(wishlistConversionRate, 0.5, 0.15)   * 0.15
            + kpiTier(advisorAcceptanceRate, 0.4, 0.15)    * 0.20;
  return parseFloat((raw * 7).toFixed(2));
}

export function computeCVI(esScore, pfScore) {
  const cvi = Math.min(parseFloat((esScore + pfScore).toFixed(2)), 10);
  let segment = 'low_priority';
  if (cvi >= 8) segment = 'high_priority';
  else if (cvi >= 5) segment = 'follow_up';
  return { cviScore: cvi, cviSegment: segment };
}
