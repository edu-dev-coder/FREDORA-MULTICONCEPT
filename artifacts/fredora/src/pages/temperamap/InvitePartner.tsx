import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import FrederaLogo from "@/components/FrederaLogo";

interface TestSession {
  id: string;
  testType: string;
  status: string;
  paid: boolean;
  primaryTemp?: string | null;
  secondaryTemp?: string | null;
  blend?: string | null;
  partnerSessionId?: string | null;
}

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function InvitePartner() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: session, isLoading } = useQuery<TestSession>({
    queryKey: ["test", sessionId],
    queryFn: async () => {
      const r = await fetch(`/api/tests/${sessionId}`);
      if (!r.ok) throw new Error("Not found");
      return r.json();
    },
    enabled: !!sessionId,
  });

  const { data: partnerSession, isLoading: loadingPartner } = useQuery<TestSession>({
    queryKey: ["test", session?.partnerSessionId],
    queryFn: async () => {
      const r = await fetch(`/api/tests/${session!.partnerSessionId}`);
      if (!r.ok) throw new Error("Not found");
      return r.json();
    },
    enabled: !!session?.partnerSessionId,
  });

  const partnerLink = `${window.location.origin}/temperamap/join-partner/${sessionId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(partnerLink);
    toast({ title: "Link copied!", description: "Share this link with your partner." });
  };

  const handleSkip = () => {
    setLocation(`/temperamap/results/${sessionId}`);
  };

  if (isLoading || loadingPartner) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const hasPartner = !!session?.partnerSessionId;
  const partnerCompleted = !!partnerSession?.primaryTemp;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-white px-4 py-4 shadow-sm">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <button onClick={() => setLocation(`/temperamap/results/${sessionId}`)} className="text-white/60 hover:text-white text-sm">
            ← Results
          </button>
          <div className="cursor-pointer" onClick={() => setLocation("/temperamap")}>
            <FrederaLogo size="sm" onDark />
          </div>
          <div className="w-20" />
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">💑</div>
          <h1 className="text-2xl font-bold text-primary mb-2">
            {hasPartner ? "Partner Has Joined!" : "Invite Your Partner"}
          </h1>
          <p className="text-muted-foreground">
            {hasPartner
              ? partnerCompleted
                ? "Both of you have completed the assessment. View your compatibility results now."
                : "Your partner has joined and is completing their assessment. This page updates automatically when they finish."
              : "Share this link with your partner so they can take their own assessment. Both results will be compared for your compatibility report."}
          </p>
        </div>

        {hasPartner ? (
          partnerCompleted ? (
            <div className="space-y-4">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">✅</div>
                  <p className="font-semibold text-green-800">Both assessments are complete</p>
                  <p className="text-sm text-green-700 mt-1">Your compatibility analysis is ready</p>
                </CardContent>
              </Card>
              <Button
                className="w-full bg-accent hover:bg-amber-600 text-white font-bold text-lg py-6 rounded-full shadow"
                onClick={() => setLocation(`/temperamap/compatibility/${sessionId}`)}
              >
                View Compatibility Results →
              </Button>
              <Button variant="outline" className="w-full rounded-full" onClick={() => setLocation(`/temperamap/results/${sessionId}`)}>
                View My Individual Results
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Card className="bg-amber-50 border-amber-200">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">⏳</div>
                  <p className="font-semibold text-amber-800">Waiting for your partner to finish</p>
                  <p className="text-sm text-amber-700 mt-1">
                    They've joined the assessment but haven't completed it yet. This page will update automatically once they're done.
                  </p>
                </CardContent>
              </Card>
              <Button variant="outline" className="w-full rounded-full" onClick={() => setLocation(`/temperamap/results/${sessionId}`)}>
                View My Individual Results
              </Button>
            </div>
          )
        ) : (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-5">
                <p className="text-sm font-semibold text-primary mb-2">Partner's Invitation Link</p>
                <div className="flex gap-2">
                  <div className="flex-1 bg-muted rounded-lg px-3 py-2 text-xs text-muted-foreground break-all font-mono">
                    {partnerLink}
                  </div>
                  <Button onClick={handleCopy} className="shrink-0 bg-primary hover:bg-primary/90">
                    Copy
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Your partner will need to sign in or create a free account to take the assessment. Your Couples Test passcode covers both partners.
                </p>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5">
                <span className="text-primary font-bold text-lg">1</span>
                <div>
                  <p className="font-medium text-sm">Share the link above with your partner</p>
                  <p className="text-xs text-muted-foreground">Via WhatsApp, email, or any messaging app</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5">
                <span className="text-primary font-bold text-lg">2</span>
                <div>
                  <p className="font-medium text-sm">Your partner takes the 70-question assessment</p>
                  <p className="text-xs text-muted-foreground">No passcode required — covered by your Couples Test</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5">
                <span className="text-primary font-bold text-lg">3</span>
                <div>
                  <p className="font-medium text-sm">Return here to view your compatibility report</p>
                  <p className="text-xs text-muted-foreground">This page will update automatically when they finish</p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <Button variant="ghost" className="w-full text-muted-foreground" onClick={handleSkip}>
                View my individual results first
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
