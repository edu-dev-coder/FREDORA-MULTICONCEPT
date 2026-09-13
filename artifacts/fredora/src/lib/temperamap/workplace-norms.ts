const ITEM_SD = 0.95;
const INTER_ITEM_RHO = 0.25;
const SQRT_2_PI = Math.sqrt(2 * Math.PI);

export function stdNormalCdf(x: number): number {
  if (x === 0) return 0.5;
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const t = 1 / (1 + 0.2316419 * ax);
  const pdf = Math.exp((-ax * ax) / 2) / SQRT_2_PI;
  const poly =
    t *
    (0.31938153 +
      t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  const cdf = 1 - pdf * poly;
  return sign < 0 ? 1 - cdf : cdf;
}

export function itemMeanSd(itemCount: number): number {
  return ITEM_SD * Math.sqrt((1 + (itemCount - 1) * INTER_ITEM_RHO) / itemCount);
}

// Default 2.0 preserves generic semantics; the workplace profile passes 3.0 as its provisional population-mean assumption.
export function pctFromMean(mean: number, itemCount: number, normMean = 2.0): number {
  const z = (mean - normMean) / itemMeanSd(itemCount);
  return Math.min(100, Math.max(0, Math.round(stdNormalCdf(z) * 100)));
}

export function stenFromPct(pct: number): number {
  return Math.min(10, Math.max(1, Math.round(1 + (pct / 100) * 9)));
}
