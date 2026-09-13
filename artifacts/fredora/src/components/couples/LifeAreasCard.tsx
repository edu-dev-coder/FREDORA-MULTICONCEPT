import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CouplesPairing } from "@/lib/couples-data";

interface LifeAreasCardProps {
  pairing: CouplesPairing;
}

const AREA_META: Record<string, { emoji: string; label: string }> = {
  intimacy: { emoji: "❤️", label: "Intimacy" },
  finances: { emoji: "💰", label: "Finances" },
  parenting: { emoji: "👨‍👩‍👧", label: "Parenting" },
  household: { emoji: "🏠", label: "Household" },
  decisions: { emoji: "🧭", label: "Decisions" },
  social: { emoji: "👥", label: "Social" },
};

const AREA_KEYS = ["intimacy", "finances", "parenting", "household", "decisions", "social"] as const;

function getRiskLevel(risk: string): { color: string; bg: string; label: string } {
  if (risk.length > 200) return { color: "text-red-600", bg: "bg-red-50", label: "High Risk" };
  if (risk.length > 120) return { color: "text-amber-600", bg: "bg-amber-50", label: "Moderate Risk" };
  return { color: "text-green-600", bg: "bg-green-50", label: "Low Risk" };
}

export function LifeAreasCard({ pairing }: LifeAreasCardProps) {
  const areas = pairing.lifeAreas;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {AREA_KEYS.map((key) => {
        const meta = AREA_META[key];
        const area = areas[key];
        const risk = getRiskLevel(area.risk);

        return (
          <Card key={key}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <span>{meta.emoji}</span>
                  {meta.label}
                </CardTitle>
                <span className={`text-xs font-bold uppercase tracking-wider ${risk.color}`}>
                  {risk.label}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="space-y-2">
                {area.tips.map((tip, i) => (
                  <li key={i} className="flex gap-2 items-start text-sm">
                    <span className="text-accent font-bold mt-0.5 shrink-0">→</span>
                    <span className="text-foreground leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
              <div className={`${risk.bg} rounded-lg px-3 py-2.5 mt-2`}>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Risk</p>
                <p className="text-sm leading-relaxed text-foreground">{area.risk}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
