import { computeES, computeCVI } from '../liraScoring';

// ── computeES ─────────────────────────────────────────────────────────────────

describe('computeES', () => {
  const maxEngagement = {
    sessionMinutes: 20,
    appOpens: 6,
    productViews: 8,
    wishlistConversionRate: 0.6,
    advisorAcceptanceRate: 0.5,
  };

  const zeroEngagement = {
    sessionMinutes: 0,
    appOpens: 0,
    productViews: 0,
    wishlistConversionRate: 0,
    advisorAcceptanceRate: 0,
  };

  test('fully active user scores 7.0', () => {
    expect(computeES(maxEngagement)).toBe(7.0);
  });

  test('completely inactive user scores 0.0', () => {
    expect(computeES(zeroEngagement)).toBe(0.0);
  });

  test('mid-tier engagement scores between 0 and 7', () => {
    const score = computeES({
      sessionMinutes: 7,
      appOpens: 3,
      productViews: 2,
      wishlistConversionRate: 0.2,
      advisorAcceptanceRate: 0.2,
    });
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThan(7);
  });

  test('score is always capped at 7.0', () => {
    const score = computeES(maxEngagement);
    expect(score).toBeLessThanOrEqual(7.0);
  });

  test('score is always at least 0.0', () => {
    const score = computeES(zeroEngagement);
    expect(score).toBeGreaterThanOrEqual(0.0);
  });

  test('only session minutes above threshold contributes correctly', () => {
    const score = computeES({
      sessionMinutes: 20,
      appOpens: 0,
      productViews: 0,
      wishlistConversionRate: 0,
      advisorAcceptanceRate: 0,
    });
    // session weight 0.25 × tier 1.0 × scale 7 = 1.75
    expect(score).toBe(1.75);
  });
});

// ── computeCVI ────────────────────────────────────────────────────────────────

describe('computeCVI', () => {
  test('ES 7 + PF 3 = CVI 10, high_priority', () => {
    const result = computeCVI(7.0, 3);
    expect(result.cviScore).toBe(10);
    expect(result.cviSegment).toBe('high_priority');
  });

  test('CVI is capped at 10 even if inputs exceed it', () => {
    const result = computeCVI(7.0, 5);
    expect(result.cviScore).toBe(10);
  });

  test('CVI >= 8 is high_priority', () => {
    expect(computeCVI(6.0, 2).cviSegment).toBe('high_priority');
  });

  test('CVI >= 5 and < 8 is follow_up', () => {
    expect(computeCVI(3.0, 2).cviSegment).toBe('follow_up');
    expect(computeCVI(5.0, 0).cviSegment).toBe('follow_up');
  });

  test('CVI < 5 is low_priority', () => {
    expect(computeCVI(1.0, 0).cviSegment).toBe('low_priority');
    expect(computeCVI(0.0, 0).cviSegment).toBe('low_priority');
  });

  test('ES 0 + PF 0 = CVI 0, low_priority', () => {
    const result = computeCVI(0, 0);
    expect(result.cviScore).toBe(0);
    expect(result.cviSegment).toBe('low_priority');
  });
});
