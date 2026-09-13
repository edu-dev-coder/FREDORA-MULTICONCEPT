import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { CouplesPairing } from "@/lib/couples-data";

const TEMPERAMENT_EMOJI: Record<string, string> = {
  Sanguine: "🌟",
  Choleric: "🔥",
  Melancholic: "🌊",
  Phlegmatic: "🌿",
};

const TEMPERAMENT_HEADLINE: Record<string, string> = {
  Sanguine: "The Enthusiastic Optimist",
  Choleric: "The Bold Leader",
  Melancholic: "The Deep Thinker",
  Phlegmatic: "The Steady Peacemaker",
};

interface PartnerInfo {
  primary: string;
  secondary?: string;
  firstName?: string;
}

interface PartnerComparisonProps {
  partner1: PartnerInfo;
  partner2: PartnerInfo;
  pairing: CouplesPairing;
}

function PartnerCard({ partner, align }: { partner: PartnerInfo; align: "left" | "right" }) {
  const emoji = TEMPERAMENT_EMOJI[partner.primary] ?? "🧠";
  const headline = TEMPERAMENT_HEADLINE[partner.primary] ?? "";
  const name = partner.firstName || partner.primary;

  return (
    <Card>
      <CardHeader className={align === "right" ? "text-right" : ""}>
        <div className={`flex flex-col ${align === "right" ? "items-end" : "items-start"} gap-2`}>
          <span className="text-4xl">{emoji}</span>
          <CardTitle className="text-lg">{name}</CardTitle>
          <div className="flex flex-wrap gap-1.5">
            <Badge className="bg-primary/10 text-primary border-primary/20">{partner.primary}</Badge>
            {partner.secondary && (
              <Badge variant="secondary">{partner.secondary}</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className={align === "right" ? "text-right" : ""}>
        <p className="text-sm text-muted-foreground">{headline}</p>
      </CardContent>
    </Card>
  );
}

export function PartnerComparison({ partner1, partner2, pairing }: PartnerComparisonProps) {
  const scoreColor =
    pairing.score >= 4 ? "text-green-600" :
    pairing.score >= 3 ? "text-amber-600" :
    "text-red-600";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
      <PartnerCard partner={partner1} align="left" />

      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Compatibility
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-5xl font-black tabular-nums">
            <span className={scoreColor}>{pairing.score}</span>
            <span className="text-lg text-muted-foreground font-normal">/5</span>
          </div>
          <p className="text-sm font-semibold text-foreground">{pairing.label}</p>
          <Progress
            value={(pairing.score / 5) * 100}
            className="h-2.5"
          />
        </CardContent>
      </Card>

      <PartnerCard partner={partner2} align="right" />
    </div>
  );
}
