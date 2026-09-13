import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LOVE_STYLES, type CouplesPairing } from "@/lib/couples-data";

interface LoveLanguageCardProps {
  pairing: CouplesPairing;
  partner1Name: string;
  partner2Name: string;
}

function LanguageSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-bold uppercase tracking-wider text-primary">{title}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((lang) => (
          <Badge key={lang} variant="secondary" className="text-xs">{lang}</Badge>
        ))}
      </div>
    </div>
  );
}

function PartnerLoveCard({
  name,
  primaryTemp,
  gives,
  receives,
}: {
  name: string;
  primaryTemp: string;
  gives: string[];
  receives: string[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{name}</CardTitle>
        <p className="text-xs text-muted-foreground">{primaryTemp}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <LanguageSection title="Gives through" items={gives} />
        <LanguageSection title="Needs to receive" items={receives} />
      </CardContent>
    </Card>
  );
}

export function LoveLanguageCard({ pairing, partner1Name, partner2Name }: LoveLanguageCardProps) {
  const { loveLanguages } = pairing;

  const p1Style = LOVE_STYLES[partner1Name];
  const p2Style = LOVE_STYLES[partner2Name];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PartnerLoveCard
          name={partner1Name}
          primaryTemp={partner1Name}
          gives={loveLanguages.partnerA.gives}
          receives={loveLanguages.partnerA.receives}
        />
        <PartnerLoveCard
          name={partner2Name}
          primaryTemp={partner2Name}
          gives={loveLanguages.partnerB.gives}
          receives={loveLanguages.partnerB.receives}
        />
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-base text-primary">Match Insight</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground leading-relaxed">{loveLanguages.match}</p>
        </CardContent>
      </Card>

      {(p1Style || p2Style) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-red-600">Dealbreakers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {p1Style && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">{partner1Name}</p>
                <ul className="space-y-1.5">
                  {p1Style.dealbreakers.map((d, i) => (
                    <li key={i} className="flex gap-2 items-start text-sm">
                      <span className="text-red-500 font-bold mt-0.5">✗</span>
                      <span className="text-foreground">{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {p2Style && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">{partner2Name}</p>
                <ul className="space-y-1.5">
                  {p2Style.dealbreakers.map((d, i) => (
                    <li key={i} className="flex gap-2 items-start text-sm">
                      <span className="text-red-500 font-bold mt-0.5">✗</span>
                      <span className="text-foreground">{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
