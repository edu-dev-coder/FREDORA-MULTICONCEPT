import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

const TEMP_COLORS: Record<string, string> = {
  Sanguine: "#f59e0b",
  Choleric: "#ef4444",
  Melancholic: "#3b82f6",
  Phlegmatic: "#22c55e",
};

interface TeamDNACardProps {
  composition: Record<string, number>;
  percentages: Record<string, number>;
  balanceScore: number;
  balanceGaps: string[];
  dominantStyle: string;
}

export function TeamDNACard({
  composition,
  percentages,
  balanceScore,
  balanceGaps,
  dominantStyle,
}: TeamDNACardProps) {
  const temps = ["Sanguine", "Choleric", "Melancholic", "Phlegmatic"];

  let cumulativePercent = 0;
  const gradientStops = temps
    .map((temp) => {
      const pct = percentages[temp] || 0;
      const start = cumulativePercent;
      cumulativePercent += pct;
      return `${TEMP_COLORS[temp]} ${start}% ${cumulativePercent}%`;
    })
    .join(", ");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team DNA</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-start gap-6">
          {/* Donut Chart */}
          <div className="flex-shrink-0">
            <div
              className="rounded-full mx-auto"
              style={{
                width: 160,
                height: 160,
                background: `conic-gradient(${gradientStops})`,
              }}
            >
              <div
                className="rounded-full bg-card flex items-center justify-center"
                style={{ width: 96, height: 96, margin: "32px auto" }}
              >
                <span className="text-lg font-bold">
                  {balanceScore}
                  <span className="text-xs text-muted-foreground">/100</span>
                </span>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-600">
                Dominant Style
              </p>
              <p className="text-lg font-semibold mt-1">{dominantStyle}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-600">
                Balance Score
              </p>
              <p className="text-3xl font-bold mt-1">{balanceScore}/100</p>
            </div>
            {balanceGaps.length > 0 && (
              <div className="space-y-2">
                {balanceGaps.map((gap) => (
                  <div
                    key={gap}
                    className="flex items-start gap-2 text-sm text-amber-700"
                  >
                    <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{gap}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {temps.map((temp) => (
            <div key={temp} className="flex items-center gap-2 text-sm">
              <span
                className="h-3 w-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: TEMP_COLORS[temp] }}
              />
              <span className="font-medium">{temp}</span>
              <span className="text-muted-foreground">
                {percentages[temp] || 0}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
