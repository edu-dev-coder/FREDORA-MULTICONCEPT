import { computeTemperament, type Question } from "./questions.ts";
import { pctFromMean, stenFromPct } from "./workplace-norms.ts";

export type WorkplaceScaleKey =
  | "Collaboration"
  | "Execution"
  | "DetailProcess"
  | "Composure"
  | "Adaptability"
  | "Directness";

export interface WorkplaceScale {
  key: WorkplaceScaleKey;
  label: string;
  items: number[];
  reverse: number[];
  description: string;
  strengths: string[];
  growth: string[];
  workWith: string;
}

export const WORKPLACE_SCALES: WorkplaceScale[] = [
  {
    key: "Collaboration",
    label: "Collaboration & Teamwork",
    items: [60, 69, 7, 15, 23, 36, 43],
    reverse: [],
    description: "How naturally you build relationships, listen, and reach fair compromises in a team.",
    strengths: [
      "Builds strong working relationships and lifts team morale",
      "A patient, trusted listener people come to with problems",
      "Naturally de-escalates conflict and finds fair compromises",
      "Generous and forgiving — keeps the team united",
    ],
    growth: [
      "May prioritise harmony over honest feedback when it is needed",
      "Can absorb others' workloads to avoid conflict",
      "May need to assert your own needs more directly",
    ],
    workWith: "Give them a say early and value their input; they hold teams together but need explicit invitation to speak.",
  },
  {
    key: "Execution",
    label: "Execution & Drive",
    items: [61, 1, 9, 13, 25, 33, 41, 49, 57],
    reverse: [],
    description: "How decisively you drive projects forward, compete, and push for results.",
    strengths: [
      "Moves projects forward decisively and holds people to deadlines",
      "Sets ambitious goals and pursues them relentlessly",
      "Confident and unshakable under pressure",
      "Fights through obstacles others give up on",
    ],
    growth: [
      "Can run over others' pace or ignore the cost of speed",
      "May cut corners on process in pursuit of results",
      "Impatience can read as pressure to teammates",
    ],
    workWith: "Give them a clear target and autonomy; check in on pace and let them own outcomes.",
  },
  {
    key: "DetailProcess",
    label: "Detail & Process",
    items: [62, 66, 68, 6, 10, 18, 38, 42],
    reverse: [],
    description: "How carefully you plan, organise, and maintain high quality standards.",
    strengths: [
      "Catches errors others miss before work ships",
      "Keeps work organised, structured, and on-schedule",
      "Follows defined processes and instructions accurately",
      "Sets and upholds high quality standards",
    ],
    growth: [
      "May slow work down in pursuit of perfect detail",
      "Can become rigid when processes change",
      "May over-prepare rather than ship and iterate",
    ],
    workWith: "Give them clear specs and time to verify; their standards protect the team's quality.",
  },
  {
    key: "Composure",
    label: "Composure & Resilience",
    items: [63, 3, 19, 31, 59],
    reverse: [14, 22, 50],
    description: "How calm and steady you remain under pressure, feedback, and setbacks.",
    strengths: [
      "Stays calm and stabilises the team during crises",
      "Slow to anger — a steadying presence in disagreements",
      "Bounces back quickly from setbacks and change",
      "Helps de-escalate tension without raising the stakes",
    ],
    growth: [
      "Can absorb criticism or mistakes more heavily than you show",
      "May internalise pressure instead of asking for support",
      "Others may not realise you are affected",
    ],
    workWith: "Deliver feedback privately and constructively; check in rather than assume they are fine.",
  },
  {
    key: "Adaptability",
    label: "Adaptability & Change",
    items: [64, 8, 32, 56],
    reverse: [35, 47],
    description: "How comfortable you are with fast pace, changing priorities, and new challenges.",
    strengths: [
      "Thrives when priorities shift and deadlines compress",
      "Energised by new challenges and unfamiliar problems",
      "Bored by repetition — brings fresh momentum to change",
      "Pivots quickly instead of clinging to old plans",
    ],
    growth: [
      "Can lose patience with routine or long-running detail work",
      "May underestimate the value of consistency",
      "Rests when the stimulation stops — needs variety to stay engaged",
    ],
    workWith: "Keep them on moving, varied work; pair them with steady executors for the grind parts.",
  },
  {
    key: "Directness",
    label: "Directness & Independence",
    items: [65, 67, 21, 29, 53],
    reverse: [37],
    description: "How directly you communicate and how much autonomy you want and grant others.",
    strengths: [
      "Communicates plainly — no ambiguity or sugar-coating",
      "Trusts their own judgment even under disagreement",
      "Delegates and lets others own their work",
      "Works best with clear authority and independence",
    ],
    growth: [
      "Blunt delivery can land as harsh to more sensitive teammates",
      "May push back on process or consensus unnecessarily",
      "Can mistake speed of reply for depth of consideration",
    ],
    workWith: "Be concise and direct back; give them ownership and the rationale, not just instructions.",
  },
];

export const LIE_QUESTION_IDS = [70, 71, 72];
export const ATTENTION_QUESTION_ID = 73;

export interface ResponseQuality {
  lieScore: number;
  attentionPassed: boolean;
  durationSec: number | null;
  extremeRate: number;
  flag: "ok" | "caution" | "flagged";
}

export interface WorkplaceProfile {
  scales: Record<string, { mean: number; raw: number; pct: number; sten: number }>;
  topScales: string[];
  strength: { label: "Clear" | "Blended"; coPrimary: boolean; gap: number };
  normVersion: "provisional";
  responseQuality: ResponseQuality;
}

export function computeResponseQuality(
  answers: Record<string, number>,
  meta: { startedAt?: string | null; completedAt?: string | null } = {}
): ResponseQuality {
  const lieScore = LIE_QUESTION_IDS.filter((id) => (answers[id.toString()] ?? 0) >= 3).length;
  const attentionPassed = (answers[ATTENTION_QUESTION_ID.toString()] ?? 0) === 4;

  let durationSec: number | null = null;
  if (meta.startedAt && meta.completedAt) {
    const ms = new Date(meta.completedAt).getTime() - new Date(meta.startedAt).getTime();
    if (!Number.isNaN(ms) && ms >= 0) durationSec = Math.round(ms / 1000);
  }

  const coreValues = Object.entries(answers)
    .map(([id, v]) => ({ id: Number(id), v }))
    .filter(({ id, v }) => id >= 0 && id <= 59 && typeof v === "number");
  // Informational-only: not fed into `flag`. Persisted for future real-norm validation,
  // where a defensible threshold can be set once empirical distributions exist.
  const extremeRate =
    coreValues.length > 0
      ? coreValues.filter(({ v }) => v === 0 || v === 4).length / coreValues.length
      : 0;

  const flag: ResponseQuality["flag"] =
    lieScore >= 2 || !attentionPassed ? "flagged" : lieScore === 1 ? "caution" : "ok";

  return { lieScore, attentionPassed, durationSec, extremeRate, flag };
}

export function computeWorkplaceProfile(
  answers: Record<string, number>,
  questions: Question[],
  meta: { startedAt?: string | null; completedAt?: string | null } = {}
): WorkplaceProfile {
  const answered = (id: number) => answers[id.toString()];

  const scales: WorkplaceProfile["scales"] = {};
  for (const scale of WORKPLACE_SCALES) {
    const values: number[] = [];
    for (const id of scale.items) {
      const v = answered(id);
      if (v !== undefined) values.push(v);
    }
    for (const id of scale.reverse) {
      const v = answered(id);
      if (v !== undefined) values.push(4 - v);
    }
    if (values.length === 0) continue;
    const k = scale.items.length + scale.reverse.length;
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    // Provisional: working-population mean per item assumed 3.0.
    const pct = pctFromMean(mean, k, 3.0);
    scales[scale.key] = {
      mean: Math.round(mean * 100) / 100,
      raw: values.reduce((a, b) => a + b, 0),
      pct,
      sten: stenFromPct(pct),
    };
  }

  const topScales = Object.entries(scales)
    .sort((a, b) => b[1].mean - a[1].mean)
    .map(([key]) => key);

  const temp = computeTemperament(answers);
  const tempSorted = Object.entries(temp.results).sort((a, b) => b[1] - a[1]);
  const gap = tempSorted[0][1] - tempSorted[1][1];
  const label: "Clear" | "Blended" = gap <= 6 ? "Blended" : "Clear";

  return {
    scales,
    topScales,
    strength: { label, coPrimary: gap <= 2, gap },
    normVersion: "provisional",
    responseQuality: computeResponseQuality(answers, meta),
  };
}
