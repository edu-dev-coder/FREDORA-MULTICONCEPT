import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, ShieldCheck, Shield } from "lucide-react";
import type { ConflictPair } from "@/lib/corporate-data";

interface ConflictRiskListProps {
  risks: ConflictPair[];
}

const RISK_CONFIG = {
  high: {
    icon: ShieldAlert,
    badgeClass: "bg-red-100 text-red-800 border-red-200",
    cardClass: "border-red-200",
    label: "High Risk",
  },
  medium: {
    icon: Shield,
    badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
    cardClass: "border-amber-200",
    label: "Medium Risk",
  },
  low: {
    icon: ShieldCheck,
    badgeClass: "bg-green-100 text-green-800 border-green-200",
    cardClass: "border-green-200",
    label: "Low Risk",
  },
};

export function ConflictRiskList({ risks }: ConflictRiskListProps) {
  if (risks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Conflict Risk Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 py-8 justify-center text-muted-foreground">
            <ShieldCheck className="h-5 w-5 text-green-500" />
            <span className="text-sm">No high-risk pairs detected</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const sorted = [...risks].sort((a, b) => {
    const priority: Record<string, number> = { high: 3, medium: 2, low: 1 };
    return (priority[b.risk] || 0) - (priority[a.risk] || 0);
  });

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-amber-600">
        Conflict Risk Assessment
      </h3>
      {sorted.map((risk) => {
        const config =
          RISK_CONFIG[risk.risk as keyof typeof RISK_CONFIG] ||
          RISK_CONFIG.medium;
        const Icon = config.icon;

        return (
          <Card key={risk.pair.join("-")} className={config.cardClass}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <CardTitle className="text-base">
                    {risk.pair[0]} & {risk.pair[1]}
                  </CardTitle>
                </div>
                <Badge className={`text-xs ${config.badgeClass}`}>
                  {config.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{risk.description}</p>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-2">
                  Mitigation Strategies
                </p>
                <ol className="space-y-1">
                  {risk.mitigation.map((item, i) => (
                    <li
                      key={i}
                      className="text-sm text-muted-foreground flex gap-2"
                    >
                      <span className="font-medium text-foreground">
                        {i + 1}.
                      </span>
                      {item}
                    </li>
                  ))}
                </ol>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
