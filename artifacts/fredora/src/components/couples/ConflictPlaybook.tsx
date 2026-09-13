import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CouplesPairing } from "@/lib/couples-data";

interface ConflictPlaybookProps {
  pairing: CouplesPairing;
}

export function ConflictPlaybook({ pairing }: ConflictPlaybookProps) {
  const { conflictPlaybook: cp } = pairing;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-amber-200 bg-amber-50/50">
          <CardHeader>
            <CardTitle className="text-base text-amber-700">Partner A Triggers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-amber-900 leading-relaxed">{cp.triggerA}</p>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50/50">
          <CardHeader>
            <CardTitle className="text-base text-amber-700">Partner B Triggers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-amber-900 leading-relaxed">{cp.triggerB}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-red-200 bg-red-50/50">
        <CardHeader>
          <CardTitle className="text-base text-red-700">How Conflict Escalates</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-900 leading-relaxed">{cp.escalation}</p>
        </CardContent>
      </Card>

      <Card className="border-green-200 bg-green-50/50">
        <CardHeader>
          <CardTitle className="text-base text-green-700">De-escalation Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            {cp.deescalation.map((step, i) => (
              <li key={i} className="flex gap-3 items-start text-sm">
                <span className="bg-green-100 text-green-700 font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0 text-xs">
                  {i + 1}
                </span>
                <span className="text-green-900 leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base text-primary">After the Fight: Repair</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2.5">
            {cp.repair.map((item, i) => (
              <li key={i} className="flex gap-2.5 items-start text-sm">
                <span className="text-accent font-bold mt-0.5 shrink-0">→</span>
                <span className="text-foreground leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
