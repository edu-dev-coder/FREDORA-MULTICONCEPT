import { getCouplesPairing, type CouplesPairing } from "./couples-data.ts";

export type DimensionKey =
  | "communication"
  | "emotional"
  | "lifestyle"
  | "financial"
  | "goals"
  | "conflict"
  | "friendship"
  | "intimacy"
  | "family"
  | "decision"
  | "trust";

export interface CompatibilityDimension {
  key: DimensionKey;
  label: string;
  score: number;
  level: string;
  meaning: string;
  tip: string;
}

export interface CouplesCompatibility {
  overall: number;
  level: string;
  framing: string;
  pairingLabel: string;
  pairSummary: string;
  dimensions: CompatibilityDimension[];
  majorRisks: string[];
  growthAreas: string[];
  relationshipAdvice: string[];
  bestStrength: string;
  biggestChallenge: string;
}

export interface CouplesSessionInput {
  primaryTemp?: string | null;
  secondaryTemp?: string | null;
  results?: Record<string, number> | null;
}

type TempKey = "Sanguine" | "Choleric" | "Melancholic" | "Phlegmatic";
type Weight = [number, number, number, number];

const TEMPS: TempKey[] = ["Sanguine", "Choleric", "Melancholic", "Phlegmatic"];

const PAIR_PCT: Record<number, number> = { 2: 55, 3: 72, 4: 85 };

const NEUTRAL_DIM = 65;

const FRAMING =
  "Temperament is your default pattern, not your destiny — compatibility is built through attention, communication, and mutual respect.";

const LEVELS: readonly [number, string][] = [
  [90, "Exceptional Compatibility"],
  [80, "Highly Compatible"],
  [70, "Good Compatibility"],
  [60, "Moderate Compatibility"],
  [50, "Challenging but Workable"],
  [0, "High-Care Relationship"],
];

interface AreaDef {
  key: DimensionKey;
  label: string;
  weight?: Weight;
  meaning: string;
}

const AREAS: AreaDef[] = [
  { key: "communication", label: "Communication Style", weight: [0.5, 0.5, 0, 0], meaning: "How aligned you are in expressiveness and directness — the language each of you naturally speaks when you talk, listen, and persuade." },
  { key: "emotional", label: "Emotional Compatibility", weight: [0, 0, 0.5, 0.5], meaning: "How similarly you process feelings, depth, and steadiness — how each of you experiences the emotional weather of the relationship." },
  { key: "lifestyle", label: "Lifestyle & Energy", weight: [0.35, 0.15, 0.15, 0.35], meaning: "How balanced your day-to-day rhythms are — pace of life, routines, and how much social stimulation you each need." },
  { key: "financial", label: "Financial Compatibility", weight: [0.1, 0.1, 0.4, 0.4], meaning: "How aligned your money instincts are — spending versus saving, planning versus impulse, risk versus safety." },
  { key: "goals", label: "Goals & Ambition", weight: [0.1, 0.5, 0.3, 0.1], meaning: "How similar your drive and long-term direction are — ambition, achievement, and how you plan your future." },
  { key: "conflict", label: "Conflict Style", meaning: "How your approaches to disagreement interact — whether you escalate, collide, or balance each other when tensions rise." },
  { key: "friendship", label: "Friendship & Fun", weight: [0.5, 0.1, 0.1, 0.3], meaning: "How easily you connect, play, and enjoy each other — the friendship that carries a relationship through the hard seasons." },
  { key: "intimacy", label: "Intimacy & Affection", weight: [0.4, 0.1, 0.3, 0.2], meaning: "How naturally you give and receive affection — warmth, closeness, and the ways you express love." },
  { key: "family", label: "Family & Parenting", weight: [0.1, 0.2, 0.3, 0.4], meaning: "How aligned you are on family responsibilities and parenting values — patience, structure, and care for the people you love." },
  { key: "decision", label: "Decision-Making", weight: [0.1, 0.4, 0.2, 0.3], meaning: "How well your decision styles work together — leadership, compromise, and who steers when it matters." },
  { key: "trust", label: "Trust & Security", weight: [0.1, 0.1, 0.4, 0.4], meaning: "How compatible your trust-building instincts are — loyalty, consistency, and the reassurance you each need to feel safe." },
];

export function couplesLevel(overall: number): string {
  for (const [threshold, label] of LEVELS) {
    if (overall >= threshold) return label;
  }
  return "High-Care Relationship";
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function mix(results: Record<string, number>, weight: Weight): number {
  return (
    weight[0] * (results.Sanguine ?? 0) +
    weight[1] * (results.Choleric ?? 0) +
    weight[2] * (results.Melancholic ?? 0) +
    weight[3] * (results.Phlegmatic ?? 0)
  );
}

function weightedScore(
  resA: Record<string, number>,
  resB: Record<string, number>,
  weight: Weight
): number {
  const mixA = mix(resA, weight);
  const mixB = mix(resB, weight);
  const gap = clamp(100 - (Math.abs(mixA - mixB) / 45) * 100, 0, 100);
  const level = (Math.min(mixA, mixB) / 60) * 100;
  return Math.round(0.7 * gap + 0.3 * level);
}

function conflictScore(resA: Record<string, number>, resB: Record<string, number>): number {
  const assertA = ((resA.Sanguine ?? 0) + (resA.Choleric ?? 0)) / 120;
  const assertB = ((resB.Sanguine ?? 0) + (resB.Choleric ?? 0)) / 120;
  const collision = Math.min(assertA, assertB);
  const gap = Math.abs(assertA - assertB);
  return Math.round(100 * (1 - (0.6 * collision + 0.4 * gap)));
}

function tipFor(pairing: CouplesPairing, key: DimensionKey): string {
  switch (key) {
    case "communication":
      return pairing.communication.dos[0];
    case "emotional":
      return pairing.conflictPlaybook.deescalation[0];
    case "lifestyle":
      return pairing.lifeAreas.social.tips[0];
    case "financial":
      return pairing.lifeAreas.finances.tips[0];
    case "goals":
      return pairing.conflictPlaybook.repair[0];
    case "conflict":
      return pairing.conflictPlaybook.deescalation[1] ?? pairing.conflictPlaybook.deescalation[0];
    case "friendship":
      return pairing.lifeAreas.social.tips[1] ?? pairing.lifeAreas.social.tips[0];
    case "intimacy":
      return pairing.lifeAreas.intimacy.tips[0];
    case "family":
      return pairing.lifeAreas.parenting.tips[0];
    case "decision":
      return pairing.lifeAreas.decisions.tips[0];
    case "trust":
      return pairing.communication.dos[1] ?? pairing.communication.dos[0];
  }
}

export function computeCouplesCompatibility(
  sessionA: CouplesSessionInput,
  sessionB: CouplesSessionInput
): CouplesCompatibility {
  const pairing = getCouplesPairing(
    sessionA.primaryTemp ?? "Sanguine",
    sessionB.primaryTemp ?? "Sanguine"
  );
  const resA = sessionA.results ?? {};
  const resB = sessionB.results ?? {};
  const hasData = TEMPS.some((t) => resA[t] !== undefined) && TEMPS.some((t) => resB[t] !== undefined);

  const dimensions: CompatibilityDimension[] = AREAS.map((area) => {
    const score = !hasData
      ? NEUTRAL_DIM
      : area.weight
        ? weightedScore(resA, resB, area.weight)
        : conflictScore(resA, resB);
    return {
      key: area.key,
      label: area.label,
      score,
      level: couplesLevel(score),
      meaning: area.meaning,
      tip: tipFor(pairing, area.key),
    };
  });

  const areaMean = dimensions.reduce((acc, d) => acc + d.score, 0) / dimensions.length;
  const pairPct = PAIR_PCT[pairing.score] ?? 72;
  const overall = Math.round(0.8 * areaMean + 0.2 * pairPct);

  return {
    overall,
    level: couplesLevel(overall),
    framing: FRAMING,
    pairingLabel: pairing.label,
    pairSummary: pairing.summary,
    dimensions,
    majorRisks: pairing.challenges,
    growthAreas: pairing.communication.dos.slice(0, 3),
    relationshipAdvice: pairing.conflictPlaybook.repair,
    bestStrength: pairing.strengths[0],
    biggestChallenge: pairing.challenges[0],
  };
}
