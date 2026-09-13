import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import FrederaLogo from "@/components/FrederaLogo";
import { generateCompatibilityPdf } from "@/lib/compatibility-pdf";
import { computeCouplesCompatibility } from "@/lib/couples-compatibility";
import { getCouplesPairing } from "@/lib/couples-data";
import { CommunicationGuide } from "@/components/couples/CommunicationGuide";
import { LoveLanguageCard } from "@/components/couples/LoveLanguageCard";
import { ConflictPlaybook } from "@/components/couples/ConflictPlaybook";
import { LifeAreasCard } from "@/components/couples/LifeAreasCard";

interface TestSession {
  id: string;
  testType: string;
  status: string;
  userName?: string | null;
  primaryTemp?: string | null;
  secondaryTemp?: string | null;
  blend?: string | null;
  results?: Record<string, number> | null;
  partnerSessionId?: string | null;
}

const TEMP_COLORS: Record<string, { text: string; bg: string; border: string; emoji: string }> = {
  Sanguine:    { text: "text-red-600",    bg: "bg-red-50",    border: "border-red-200",    emoji: "🌟" },
  Choleric:    { text: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200", emoji: "🔥" },
  Melancholic: { text: "text-blue-600",   bg: "bg-blue-50",   border: "border-blue-200",   emoji: "🌊" },
  Phlegmatic:  { text: "text-green-600",  bg: "bg-green-50",  border: "border-green-200",  emoji: "🌿" },
};

const LEVEL_COLORS: Record<string, string> = {
  "Exceptional Compatibility": "text-green-700 bg-green-100 border-green-300",
  "Highly Compatible": "text-green-600 bg-green-50 border-green-200",
  "Good Compatibility": "text-blue-600 bg-blue-50 border-blue-200",
  "Moderate Compatibility": "text-amber-600 bg-amber-50 border-amber-200",
  "Challenging but Workable": "text-orange-600 bg-orange-50 border-orange-200",
  "High-Care Relationship": "text-primary bg-primary/5 border-primary/20",
};

export default function Compatibility() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [, setLocation] = useLocation();

  const { toast } = useToast();
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const { data: mySession, isLoading: loadingMine } = useQuery<TestSession>({
    queryKey: ["test", sessionId],
    queryFn: async () => {
      const r = await fetch(`/api/tests/${sessionId}`);
      if (!r.ok) throw new Error("Not found");
      return r.json();
    },
    enabled: !!sessionId,
  });

  const { data: partnerSession, isLoading: loadingPartner } = useQuery<TestSession>({
    queryKey: ["test", mySession?.partnerSessionId],
    queryFn: async () => {
      const r = await fetch(`/api/tests/${mySession!.partnerSessionId}`);
      if (!r.ok) throw new Error("Not found");
      return r.json();
    },
    enabled: !!mySession?.partnerSessionId,
  });

  if (loadingMine || loadingPartner) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!mySession?.partnerSessionId || !partnerSession?.primaryTemp) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">⏳</div>
          <h1 className="text-xl font-bold text-primary mb-2">Waiting for your partner</h1>
          <p className="text-muted-foreground text-sm mb-6">
            Your partner hasn't completed their assessment yet. Share the invite link with them and come back here when they're done.
          </p>
          <Button onClick={() => setLocation(`/temperamap/invite-partner/${sessionId}`)}>Back to Invite Page</Button>
        </div>
      </div>
    );
  }

  const compat = computeCouplesCompatibility(mySession, partnerSession);
  const pairing = getCouplesPairing(mySession.primaryTemp ?? "Sanguine", partnerSession.primaryTemp ?? "Sanguine");
  const myColors = TEMP_COLORS[mySession.primaryTemp ?? "Sanguine"];
  const partnerColors = TEMP_COLORS[partnerSession.primaryTemp ?? "Sanguine"];

  const handleDownloadPdf = async () => {
    if (!mySession || !partnerSession) return;
    setGeneratingPdf(true);
    try {
      await generateCompatibilityPdf({ compat, mySession, partnerSession });
      toast({ title: "Download started", description: "Your compatibility report is being saved." });
    } catch {
      toast({ title: "Error", description: "Could not generate PDF. Please try again.", variant: "destructive" });
    } finally {
      setGeneratingPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-white px-4 py-4 shadow">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button onClick={() => setLocation(`/temperamap/results/${sessionId}`)} className="text-white/60 hover:text-white text-sm">
            ← My Results
          </button>
          <div className="cursor-pointer" onClick={() => setLocation("/temperamap")}>
            <FrederaLogo size="sm" onDark />
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleDownloadPdf}
            disabled={generatingPdf}
            className="text-primary"
          >
            {generatingPdf ? "Generating..." : "⬇ Download PDF"}
          </Button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Score hero */}
        <Card className="overflow-hidden">
          <CardContent className="p-8 text-center">
            <div className="text-5xl mb-4">💑</div>
            <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-1">Overall Compatibility</p>
            <div className="text-6xl font-black mb-2 text-primary">{compat.overall}%</div>
            <Badge className={`text-base px-4 py-1 border mb-4 ${LEVEL_COLORS[compat.level] ?? "text-primary bg-primary/5 border-primary/20"}`}>
              {compat.level}
            </Badge>
            <p className="font-semibold text-foreground">{compat.pairingLabel}</p>
            <p className="text-muted-foreground text-sm max-w-md mx-auto mt-2 italic">{compat.framing}</p>
          </CardContent>
        </Card>

        {/* Dimension sub-scores */}
        <Card>
          <CardHeader><CardTitle className="text-primary text-base">Your Compatibility by Area</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            {compat.dimensions.map((d) => (
              <div key={d.key}>
                <div className="flex justify-between mb-1.5">
                  <span className="font-semibold text-sm">{d.label}</span>
                  <span className="font-bold text-sm">{d.score}%</span>
                </div>
                <Progress value={d.score} className="h-2.5" />
                <p className="text-xs text-muted-foreground mt-1.5">{d.meaning}</p>
                <p className="text-xs text-primary mt-1">
                  <span className="font-semibold">Tip:</span> {d.tip}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Side by side temperaments */}
        <div className="grid grid-cols-2 gap-4">
          <Card className={`border-2 ${myColors.border} ${myColors.bg}`}>
            <CardContent className="p-5 text-center">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-2">You</p>
              <div className="text-4xl mb-2">{myColors.emoji}</div>
              <p className={`text-xl font-bold ${myColors.text}`}>{mySession.primaryTemp}</p>
              {mySession.secondaryTemp && (
                <p className="text-xs text-muted-foreground mt-1">+ {mySession.secondaryTemp}</p>
              )}
            </CardContent>
          </Card>
          <Card className={`border-2 ${partnerColors.border} ${partnerColors.bg}`}>
            <CardContent className="p-5 text-center">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-2">Partner</p>
              <div className="text-4xl mb-2">{partnerColors.emoji}</div>
              <p className={`text-xl font-bold ${partnerColors.text}`}>{partnerSession.primaryTemp}</p>
              {partnerSession.secondaryTemp && (
                <p className="text-xs text-muted-foreground mt-1">+ {partnerSession.secondaryTemp}</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Score breakdown */}
        <Card>
          <CardHeader><CardTitle className="text-primary text-base">Temperament Score Breakdown</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {(["Sanguine", "Choleric", "Melancholic", "Phlegmatic"] as const).map(t => {
              const myVal = mySession.results?.[t] ?? 0;
              const partnerVal = partnerSession.results?.[t] ?? 0;
              const myMax = Math.max(...Object.values(mySession.results ?? {}));
              const partnerMax = Math.max(...Object.values(partnerSession.results ?? {}));
              const colors = TEMP_COLORS[t];
              return (
                <div key={t}>
                  <div className="flex justify-between mb-1 text-sm">
                    <span className="font-medium flex items-center gap-1">{colors.emoji} {t}</span>
                    <span className="text-muted-foreground">{myVal} vs {partnerVal}</span>
                  </div>
                  <div className="flex gap-1 h-2">
                    <div className="flex-1 bg-muted rounded-l overflow-hidden flex justify-end">
                      <div className="bg-primary h-full rounded-l" style={{ width: `${(myVal / (myMax || 1)) * 100}%` }} />
                    </div>
                    <div className="flex-1 bg-muted rounded-r overflow-hidden">
                      <div className="bg-accent h-full rounded-r" style={{ width: `${(partnerVal / (partnerMax || 1)) * 100}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="flex gap-4 text-xs text-muted-foreground mt-2">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-primary inline-block" /> You</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-accent inline-block" /> Partner</span>
            </div>
          </CardContent>
        </Card>

        {/* Pairing summary */}
        <Card>
          <CardHeader><CardTitle className="text-primary text-base">Your Pairing — {compat.pairingLabel}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm">{compat.pairSummary}</p>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-green-600 mb-1">Best Strength</p>
              <p className="flex gap-2 items-start text-sm"><span className="text-green-500 font-bold mt-0.5">✓</span><span>{compat.bestStrength}</span></p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">Biggest Challenge</p>
              <p className="flex gap-2 items-start text-sm"><span className="text-amber-500 font-bold mt-0.5">!</span><span>{compat.biggestChallenge}</span></p>
            </div>
          </CardContent>
        </Card>

        {/* Major Risk Areas */}
        <Card>
          <CardHeader><CardTitle className="text-primary text-base">Major Risk Areas</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {compat.majorRisks.map((risk, i) => (
                <li key={i} className="flex gap-2 items-start text-sm">
                  <span className="text-red-500 font-bold mt-0.5">⚠</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Growth Areas */}
        <Card>
          <CardHeader><CardTitle className="text-primary text-base">Growth Areas</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {compat.growthAreas.map((area, i) => (
                <li key={i} className="flex gap-2 items-start text-sm">
                  <span className="text-green-500 font-bold mt-0.5">✓</span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Relationship Advice */}
        <Card>
          <CardHeader><CardTitle className="text-primary text-base">Relationship Advice</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {compat.relationshipAdvice.map((advice, i) => (
                <li key={i} className="flex gap-2 items-start text-sm">
                  <span className="text-primary font-bold mt-0.5">•</span>
                  <span>{advice}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Couples guides */}
        <CommunicationGuide pairing={pairing} />
        <LoveLanguageCard pairing={pairing} partner1Name={mySession.userName || "Partner 1"} partner2Name={partnerSession.userName || "Partner 2"} />
        <ConflictPlaybook pairing={pairing} />
        <LifeAreasCard pairing={pairing} />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            className="flex-1 bg-primary hover:bg-primary/90 text-white"
            onClick={handleDownloadPdf}
            disabled={generatingPdf}
          >
            {generatingPdf ? "Generating..." : "⬇ Download PDF Report"}
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-primary text-primary"
            onClick={() => setLocation(`/results/${sessionId}`)}
          >
            My Individual Results
          </Button>
          <Button
            className="flex-1 bg-primary hover:bg-primary/90 text-white"
            onClick={() => setLocation("/dashboard")}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
