import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CouplesPairing } from "@/lib/couples-data";

interface CommunicationGuideProps {
  pairing: CouplesPairing;
}

export function CommunicationGuide({ pairing }: CommunicationGuideProps) {
  const { communication } = pairing;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base text-green-600">Communication Do&apos;s</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2.5">
            {communication.dos.map((item, i) => (
              <li key={i} className="flex gap-2.5 items-start text-sm">
                <span className="text-green-500 font-bold mt-0.5 shrink-0">✓</span>
                <span className="text-foreground leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base text-red-600">Communication Don&apos;ts</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2.5">
            {communication.donts.map((item, i) => (
              <li key={i} className="flex gap-2.5 items-start text-sm">
                <span className="text-red-500 font-bold mt-0.5 shrink-0">✗</span>
                <span className="text-foreground leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {communication.scripts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-primary">Real Conversation Scripts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {communication.scripts.map((script, i) => (
              <div key={i} className="border border-border rounded-xl p-4 space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{script.situation}</p>
                <div className="space-y-2">
                  <div className="bg-blue-50 rounded-lg px-4 py-3">
                    <p className="text-xs font-semibold text-blue-600 mb-1">Partner A</p>
                    <p className="text-sm text-blue-900 leading-relaxed italic">"{script.partnerA}"</p>
                  </div>
                  <div className="bg-amber-50 rounded-lg px-4 py-3">
                    <p className="text-xs font-semibold text-amber-600 mb-1">Partner B</p>
                    <p className="text-sm text-amber-900 leading-relaxed italic">"{script.partnerB}"</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
