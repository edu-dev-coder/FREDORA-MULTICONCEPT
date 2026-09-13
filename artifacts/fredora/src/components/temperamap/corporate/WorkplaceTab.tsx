import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WORKPLACE_SCALES } from "@/lib/workplace";
import type {
  WorkplaceAggregation,
  ScaleRanks,
  ResponseQualitySummary,
} from "@/lib/corporate-workplace";

const DIST_SEGMENTS = [
  { key: "high" as const, className: "bg-green-500" },
  { key: "mid" as const, className: "bg-amber-400" },
  { key: "low" as const, className: "bg-red-400" },
];

interface WorkplaceTabProps {
  agg: WorkplaceAggregation;
  ranks: ScaleRanks;
  rqSummary: ResponseQualitySummary;
}

export function WorkplaceTab({ agg, ranks, rqSummary }: WorkplaceTabProps) {
  return (
    <div className="space-y-6">
      {rqSummary.hasIssues && (
        <Card className="border-amber-300 bg-amber-50">
          <CardContent className="py-4 text-sm text-amber-800">
            {rqSummary.caution} member{rqSummary.caution === 1 ? "" : "s"} flagged for caution and{" "}
            {rqSummary.flagged} flagged for response quality — workplace results should be read with
            caution.
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base text-primary">Team Workplace Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {WORKPLACE_SCALES.map((scale) => {
            const s = agg.scales[scale.key];
            if (!s || s.n === 0) return null;
            return (
              <div key={scale.key}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold">{scale.label}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">P{s.pct}</Badge>
                    <span className="text-xs font-medium w-10 text-right">{s.mean.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${(s.mean / 4) * 100}%` }} />
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex h-2 flex-1 overflow-hidden rounded-full bg-muted">
                    {DIST_SEGMENTS.map((seg) => (
                      <div
                        key={seg.key}
                        className={seg.className}
                        style={{ width: `${(s[seg.key] / s.n) * 100}%` }}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    H {s.high} · M {s.mid} · L {s.low}
                  </span>
                </div>
              </div>
            );
          })}
          <p className="text-xs text-muted-foreground">
            Team means and percentiles use a provisional working-adult norm model, not a real sample.
          </p>
        </CardContent>
      </Card>

      {agg.topScales.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-primary">Top Team Strengths</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {agg.topScales.map((t) => {
              const scale = WORKPLACE_SCALES.find((sc) => sc.key === t.key);
              if (!scale) return null;
              return (
                <div key={t.key}>
                  <p className="text-sm font-semibold">{scale.label}</p>
                  <p className="text-sm text-foreground leading-relaxed">{t.strengths[0]}</p>
                  <p className="text-xs text-muted-foreground">Work with: {t.workWith}</p>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base text-primary">Leaders &amp; Laggards</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {WORKPLACE_SCALES.map((scale) => {
            const r = ranks[scale.key];
            if (!r) return null;
            return (
              <div key={scale.key}>
                <p className="text-sm font-semibold mb-1">{scale.label}</p>
                <div className="grid gap-1 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground flex-shrink-0">Highest</span>
                    <span className="font-medium text-right">
                      {r.highest.memberName} — {r.highest.mean.toFixed(2)} (P{r.highest.pct})
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-muted-foreground flex-shrink-0">Lowest</span>
                    <span className="font-medium text-right">
                      {r.lowest.memberName} — {r.lowest.mean.toFixed(2)} (P{r.lowest.pct})
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
