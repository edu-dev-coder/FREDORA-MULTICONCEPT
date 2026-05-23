import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import FrederaLogo from "@/components/FrederaLogo";

interface TestSession {
  id: string;
  testType: string;
  status: string;
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

const COMPATIBILITY_MATRIX: Record<string, Record<string, number>> = {
  Sanguine:    { Sanguine: 3, Choleric: 3, Melancholic: 2, Phlegmatic: 3 },
  Choleric:    { Sanguine: 3, Choleric: 2, Melancholic: 3, Phlegmatic: 2 },
  Melancholic: { Sanguine: 2, Choleric: 3, Melancholic: 2, Phlegmatic: 3 },
  Phlegmatic:  { Sanguine: 3, Choleric: 2, Melancholic: 3, Phlegmatic: 2 },
};

function getCompatibility(a: TestSession, b: TestSession) {
  const pA = a.primaryTemp ?? "Sanguine";
  const sA = a.secondaryTemp ?? "Phlegmatic";
  const pB = b.primaryTemp ?? "Sanguine";
  const sB = b.secondaryTemp ?? "Phlegmatic";

  const points = [
    COMPATIBILITY_MATRIX[pA]?.[pB] ?? 1,
    COMPATIBILITY_MATRIX[pA]?.[sB] ?? 1,
    COMPATIBILITY_MATRIX[sA]?.[pB] ?? 1,
    COMPATIBILITY_MATRIX[sA]?.[sB] ?? 1,
  ];
  const score = Math.round((points.reduce((a, b) => a + b, 0) / 12) * 100);

  if (score >= 80) return { score, level: "Highly Compatible", color: "text-green-600", bg: "bg-green-50", border: "border-green-200", advice: [
    "You balance each other beautifully — your strengths fill each other's gaps",
    "Communication will feel natural; invest in protecting this gift",
    "Use your differences as a team advantage, not a source of conflict",
    "Schedule regular quality time to maintain your strong connection",
  ]};
  if (score >= 65) return { score, level: "Very Compatible", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", advice: [
    "You share core values and have strong relational chemistry",
    "Be patient with areas where your styles differ",
    "Lean into your shared strengths as a foundation",
    "Discuss expectations openly to keep the connection strong",
  ]};
  if (score >= 50) return { score, level: "Compatible", color: "text-primary", bg: "bg-primary/5", border: "border-primary/20", advice: [
    "Your temperament differences can be complementary with understanding",
    "Invest in learning how the other person processes emotion and conflict",
    "Regular check-ins will help you stay aligned in your relationship",
    "Appreciate what the other brings that you naturally lack",
  ]};
  if (score >= 35) return { score, level: "Moderate", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", advice: [
    "Your personalities are quite different — intentional effort is key",
    "Learn to appreciate your partner's worldview as valid, not wrong",
    "Seek to understand before seeking to be understood",
    "Consider couples counselling or personality workshops for growth",
  ]};
  return { score, level: "Challenging", color: "text-red-600", bg: "bg-red-50", border: "border-red-200", advice: [
    "Significant personality differences exist and will require patience",
    "With commitment and professional support, growth is absolutely possible",
    "Focus on mutual respect as your foundation",
    "Individual growth in each temperament will strengthen the relationship",
  ]};
}

const BLEND_DYNAMICS: Record<string, string> = {
  "Sanguine-Choleric": "The Inspiring Dynamo — charismatic, energetic, and unstoppable together",
  "Sanguine-Melancholic": "The Heart & Mind Pair — emotional depth meets creative warmth",
  "Sanguine-Phlegmatic": "The Joyful Anchor — spontaneous energy balanced by calm steadiness",
  "Choleric-Sanguine": "The Bold Visionaries — driven and inspired, leading with passion",
  "Choleric-Melancholic": "The Perfectionists — high standards and deep analysis in tandem",
  "Choleric-Phlegmatic": "The Balanced Leaders — decisive energy grounded by quiet strength",
  "Melancholic-Sanguine": "The Deep Creatives — thoughtful depth with expressive warmth",
  "Melancholic-Choleric": "The Intense Achievers — analytical precision fueled by bold drive",
  "Melancholic-Phlegmatic": "The Quiet Strength Pair — loyal, deep-feeling, and deeply reliable",
  "Phlegmatic-Sanguine": "The Peaceful Companions — easy-going harmony with cheerful energy",
  "Phlegmatic-Choleric": "The Quiet Powerhouse — steady foundation with decisive momentum",
  "Phlegmatic-Melancholic": "The Faithful Souls — calm, consistent, loyal to the core",
};

export default function Compatibility() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [, setLocation] = useLocation();

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
          <Button onClick={() => setLocation(`/invite-partner/${sessionId}`)}>Back to Invite Page</Button>
        </div>
      </div>
    );
  }

  const compat = getCompatibility(mySession, partnerSession);
  const myColors = TEMP_COLORS[mySession.primaryTemp ?? "Sanguine"];
  const partnerColors = TEMP_COLORS[partnerSession.primaryTemp ?? "Sanguine"];
  const pairBlend = `${mySession.primaryTemp}-${partnerSession.primaryTemp}`;
  const pairDynamic = BLEND_DYNAMICS[pairBlend] || `${mySession.primaryTemp} and ${partnerSession.primaryTemp} — a unique combination`;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-white px-4 py-4 shadow">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button onClick={() => setLocation(`/results/${sessionId}`)} className="text-white/60 hover:text-white text-sm">
            ← My Results
          </button>
          <FrederaLogo size="sm" onDark />
          <div className="w-20" />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Compatibility score hero */}
        <Card className={`border-2 ${compat.border} ${compat.bg} overflow-hidden`}>
          <CardContent className="p-8 text-center">
            <div className="text-5xl mb-4">💑</div>
            <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-1">Compatibility Score</p>
            <div className={`text-6xl font-black mb-2 ${compat.color}`}>{compat.score}%</div>
            <Badge className={`text-base px-4 py-1 ${compat.bg} ${compat.color} ${compat.border} border mb-4`}>
              {compat.level}
            </Badge>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">{pairDynamic}</p>
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

        {/* Score bar */}
        <Card>
          <CardHeader><CardTitle className="text-primary text-base">Compatibility Breakdown</CardTitle></CardHeader>
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

        {/* Relationship advice */}
        <Card>
          <CardHeader><CardTitle className="text-primary text-base">Relationship Insights</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {compat.advice.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-accent font-bold mt-0.5">✦</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
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
