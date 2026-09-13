import { useLocation, useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

interface TestSession {
  id: string;
  testType: string;
  status: string;
  paid: boolean;
  userId?: string | null;
  primaryTemp?: string | null;
  partnerSessionId?: string | null;
}

export default function JoinPartner() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { data: originalSession, isLoading } = useQuery<TestSession>({
    queryKey: ["test", sessionId],
    queryFn: async () => {
      const r = await fetch(`/api/tests/${sessionId}`);
      if (!r.ok) throw new Error("Session not found");
      return r.json();
    },
    enabled: !!sessionId,
  });

  const createPartnerSession = useMutation({
    mutationFn: async () => {
      const r = await fetch("/api/tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          testType: "couples_test",
        }),
      });
      if (!r.ok) throw new Error("Could not create partner session");
      return r.json() as Promise<{ id: string }>;
    },
    onSuccess: async (partnerSession) => {
      await fetch(`/api/tests/${partnerSession.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partnerSessionId: sessionId, paid: true, status: "paid" }),
      });
      await fetch(`/api/tests/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partnerSessionId: partnerSession.id }),
      });
      toast({ title: "You've joined the couples assessment!", description: "Now take your individual test." });
      setLocation(`/temperamap/test/${partnerSession.id}`);
    },
    onError: () => {
      toast({ title: "Error", description: "Could not join this assessment. Please try again.", variant: "destructive" });
    },
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">💑</div>
          <h1 className="text-xl font-bold text-primary mb-2">Sign in to join the couples assessment</h1>
          <p className="text-muted-foreground text-sm mb-6">
            Your partner has invited you to take the TemperaMap Couples Assessment. Please sign in to continue.
          </p>
          <Button onClick={() => setLocation(`/temperamap/sign-in?redirect=/temperamap/join-partner/${sessionId}`)} className="bg-primary rounded-full px-6">
            Sign In to Continue
          </Button>
          <p className="text-xs text-muted-foreground mt-3">
            Don't have an account? <button onClick={() => setLocation(`/temperamap/sign-up?redirect=/temperamap/join-partner/${sessionId}`)} className="text-accent font-semibold">Sign Up Free</button>
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!originalSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-primary mb-4">Invitation not found</p>
          <Button onClick={() => setLocation("/temperamap/dashboard")} className="rounded-full">Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  if (originalSession.userId === user.id) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">🤔</div>
          <h1 className="text-xl font-bold text-primary mb-2">This is your own invitation link</h1>
          <p className="text-muted-foreground text-sm mb-6">
            Please share this link with your partner, not open it yourself.
          </p>
          <Button onClick={() => setLocation(`/temperamap/invite-partner/${sessionId}`)} className="rounded-full">Back to Invite Page</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">💑</div>
          <h1 className="text-2xl font-bold text-primary mb-2">You've been invited!</h1>
          <p className="text-muted-foreground">
            Your partner has completed their TemperaMap assessment and is waiting for you to take yours. Both of your results will be used to generate a couples compatibility report.
          </p>
        </div>

        <Card className="mb-6">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📝</span>
              <div>
                <p className="font-semibold text-sm">70 questions</p>
                <p className="text-xs text-muted-foreground">60 temperament + 10 relationship insight questions</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">💳</span>
              <div>
                <p className="font-semibold text-sm">No passcode needed</p>
                <p className="text-xs text-muted-foreground">Your partner's Couples Test passcode covers you</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">📊</span>
              <div>
                <p className="font-semibold text-sm">Compatibility report</p>
                <p className="text-xs text-muted-foreground">See how your temperaments interact and complement each other</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          className="w-full bg-accent hover:bg-amber-600 text-white font-bold text-lg py-6"
          onClick={() => createPartnerSession.mutate()}
          disabled={createPartnerSession.isPending}
        >
          {createPartnerSession.isPending ? "Setting up your test..." : "Start My Assessment →"}
        </Button>
      </div>
    </div>
  );
}
