import {
  WORKPLACE_SCALES,
  type WorkplaceProfile,
  type WorkplaceScaleKey,
} from "./workplace.ts";
import { pctFromMean } from "./workplace-norms.ts";

export interface WorkplaceScaleAgg {
  mean: number;
  pct: number;
  high: number;
  mid: number;
  low: number;
  n: number;
}

export interface WorkplaceTopScale {
  key: WorkplaceScaleKey;
  mean: number;
  strengths: string[];
  workWith: string;
}

export interface WorkplaceAggregation {
  scales: Record<WorkplaceScaleKey, WorkplaceScaleAgg>;
  topScales: WorkplaceTopScale[];
  memberCount: number;
}

export function aggregateWorkplace(
  profiles: (WorkplaceProfile | null | undefined)[]
): WorkplaceAggregation {
  const present = profiles.filter((p): p is WorkplaceProfile => Boolean(p));
  const memberCount = present.length;

  const scales = {} as Record<WorkplaceScaleKey, WorkplaceScaleAgg>;

  for (const scale of WORKPLACE_SCALES) {
    const means: number[] = [];
    const pcts: number[] = [];
    for (const p of present) {
      const entry = p.scales[scale.key];
      if (!entry) continue;
      means.push(entry.mean);
      pcts.push(entry.pct);
    }
    const n = means.length;
    const mean = n === 0 ? 0 : Math.round((means.reduce((a, b) => a + b, 0) / n) * 100) / 100;
    const itemCount = scale.items.length + scale.reverse.length;
    const pct = n === 0 ? 0 : pctFromMean(mean, itemCount, 3.0);
    const high = pcts.filter((p) => p >= 75).length;
    const mid = pcts.filter((p) => p >= 26 && p <= 74).length;
    const low = pcts.filter((p) => p <= 25).length;
    scales[scale.key] = { mean, pct, high, mid, low, n };
  }

  const topScales = WORKPLACE_SCALES
    .filter((s) => scales[s.key].n > 0)
    .sort((a, b) => scales[b.key].mean - scales[a.key].mean)
    .slice(0, 3)
    .map((s) => ({
      key: s.key,
      mean: scales[s.key].mean,
      strengths: s.strengths,
      workWith: s.workWith,
    }));

  return { scales, topScales, memberCount };
}

export interface WorkplaceMember {
  memberId: string;
  memberName: string;
  workplace: WorkplaceProfile;
}

export interface MemberScaleRank {
  memberId: string;
  memberName: string;
  mean: number;
  pct: number;
}

export type ScaleRanks = Partial<
  Record<WorkplaceScaleKey, { highest: MemberScaleRank; lowest: MemberScaleRank }>
>;

export function rankMembersByScale(
  members: (WorkplaceMember | null | undefined)[]
): ScaleRanks {
  const present = members.filter((m): m is WorkplaceMember => Boolean(m?.workplace));
  const ranks = {} as ScaleRanks;

  for (const scale of WORKPLACE_SCALES) {
    const contributors: { member: WorkplaceMember; mean: number; pct: number }[] = [];
    for (const m of present) {
      const entry = m.workplace.scales[scale.key];
      if (!entry) continue;
      contributors.push({ member: m, mean: entry.mean, pct: entry.pct });
    }
    if (contributors.length === 0) continue;
    const sorted = [...contributors].sort((a, b) => b.mean - a.mean);
    const toRank = (r: { member: WorkplaceMember; mean: number; pct: number }): MemberScaleRank => ({
      memberId: r.member.memberId,
      memberName: r.member.memberName,
      mean: r.mean,
      pct: r.pct,
    });
    ranks[scale.key] = {
      highest: toRank(sorted[0]),
      lowest: toRank(sorted[sorted.length - 1]),
    };
  }
  return ranks;
}

export interface ResponseQualitySummary {
  ok: number;
  caution: number;
  flagged: number;
  total: number;
  hasIssues: boolean;
}

export function summarizeResponseQuality(
  profiles: (WorkplaceProfile | null | undefined)[]
): ResponseQualitySummary {
  let ok = 0;
  let caution = 0;
  let flagged = 0;
  for (const p of profiles) {
    if (!p) continue;
    if (p.responseQuality.flag === "flagged") flagged++;
    else if (p.responseQuality.flag === "caution") caution++;
    else ok++;
  }
  const total = ok + caution + flagged;
  return { ok, caution, flagged, total, hasIssues: caution + flagged > 0 };
}
