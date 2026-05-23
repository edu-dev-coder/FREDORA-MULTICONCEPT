import { useEffect, useState } from "react";
import { useUser } from "@clerk/react";
import { useLocation, useParams, useSearch } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import FrederaLogo from "@/components/FrederaLogo";

interface TestSession {
  id: string;
  testType: string;
  status: string;
  paid: boolean;
  paymentRef?: string | null;
}

const PRODUCT_LABELS: Record<string, { label: string; price: string; priceKobo: number; emoji: string }> = {
  child_3_5:      { label: "Ages 3–5",         price: "₦5,000",   priceKobo: 500000,   emoji: "👶" },
  child_6_9:      { label: "Ages 6–9",         price: "₦5,000",   priceKobo: 500000,   emoji: "📖" },
  preteen_10_12:  { label: "Ages 10–12",       price: "₦5,000",   priceKobo: 500000,   emoji: "🌟" },
  teen_13_17:     { label: "Ages 13–17",       price: "₦5,000",   priceKobo: 500000,   emoji: "☀️" },
  single_test:    { label: "Adult Test",       price: "₦5,000",   priceKobo: 500000,   emoji: "🧠" },
  couples_test:   { label: "Couples Test",     price: "₦10,000",  priceKobo: 1000000,  emoji: "👫" },
  corporate_team: { label: "Corporate Team",   price: "₦150,000", priceKobo: 15000000, emoji: "🏢" },
};

function formatKobo(kobo: number) {
  return `₦${(kobo / 100).toLocaleString("en-NG")}`;
}

export default function Payment() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { user } = useUser();
  const [, setLocation] = useLocation();
  const search = useSearch();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isVerifying, setIsVerifying] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    couponId: string; discountPercent: number; code: string;
  } | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // Detect mobile source — skip redirect to test after payment
  const isMobileSource = new URLSearchParams(search).get("source") === "mobile";

  const { data: session, isLoading } = useQuery<TestSession>({
    queryKey: ["test", sessionId],
    queryFn: async () => {
      const r = await fetch(`/api/tests/${sessionId}`);
      if (!r.ok) throw new Error("Session not found");
      return r.json();
    },
    enabled: !!sessionId,
  });

  // If already paid and NOT mobile source, redirect to test
  useEffect(() => {
    if (session?.paid && !isMobileSource) {
      setLocation(`/test/${sessionId}`);
    }
  }, [session?.paid, sessionId, setLocation, isMobileSource]);

  // Handle Paystack callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reference = params.get("reference") || params.get("trxref");
    if (reference && !isVerifying) {
      setIsVerifying(true);
      fetch(`/api/payments/verify/${reference}`)
        .then(r => r.json())
        .then((data: { success: boolean; sessionId?: string }) => {
          if (data.success) {
            if (isMobileSource) {
              // Show return-to-app screen — don't navigate
              setIsVerifying(false);
              toast({ title: "Payment confirmed!", description: "Return to the Fredora app to start your test." });
              queryClient.invalidateQueries({ queryKey: ["test", sessionId] });
            } else {
              toast({ title: "Payment successful!", description: "Your test is now unlocked." });
              setLocation(`/test/${data.sessionId || sessionId}`);
            }
          } else {
            toast({ title: "Payment not confirmed", description: "Please try again or contact support.", variant: "destructive" });
            setIsVerifying(false);
          }
        })
        .catch(() => {
          toast({ title: "Verification failed", description: "Please try again.", variant: "destructive" });
          setIsVerifying(false);
        });
    }
  }, []);

  const productInfo = PRODUCT_LABELS[session?.testType ?? ""] ?? { label: session?.testType ?? "—", price: "—", priceKobo: 0, emoji: "🧪" };

  const discountedKobo = appliedCoupon
    ? Math.floor(productInfo.priceKobo * (1 - appliedCoupon.discountPercent / 100))
    : productInfo.priceKobo;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setValidatingCoupon(true);
    try {
      const r = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim() }),
      });
      const data = await r.json() as { valid: boolean; message?: string; discountPercent?: number; couponId?: string; code?: string };
      if (data.valid && data.discountPercent !== undefined && data.couponId) {
        setAppliedCoupon({ couponId: data.couponId, discountPercent: data.discountPercent, code: data.code ?? couponCode });
        toast({ title: `Coupon applied! ${data.discountPercent}% off`, description: `Code: ${data.code}` });
      } else {
        toast({ title: "Invalid coupon", description: data.message ?? "Coupon not found", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Could not validate coupon", variant: "destructive" });
    } finally {
      setValidatingCoupon(false);
    }
  };

  const initPayment = useMutation({
    mutationFn: async () => {
      const email = user?.emailAddresses[0]?.emailAddress;
      if (!email) throw new Error("No email");
      const r = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          product: session?.testType,
          sessionId,
          userId: user?.id,
          ...(appliedCoupon ? { couponCode: appliedCoupon.code } : {}),
        }),
      });
      if (!r.ok) throw new Error("Payment initialization failed");
      return r.json() as Promise<{ authorizationUrl: string; reference: string; isDemoMode?: boolean }>;
    },
    onSuccess: (data) => {
      if (data.isDemoMode) {
        toast({ title: "Demo Mode", description: "No payment key configured. Unlocking directly..." });
        fetch(`/api/payments/demo-unlock/${sessionId}`, { method: "POST" })
          .then(() => {
            if (isMobileSource) {
              queryClient.invalidateQueries({ queryKey: ["test", sessionId] });
              toast({ title: "Unlocked!", description: "Return to the Fredora app to start your test." });
            } else {
              setLocation(`/test/${sessionId}`);
            }
          })
          .catch(() => toast({ title: "Error", description: "Could not unlock demo", variant: "destructive" }));
      } else {
        window.location.href = data.authorizationUrl;
      }
    },
    onError: (err) => {
      toast({ title: "Payment Error", description: String(err), variant: "destructive" });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center text-muted-foreground">Loading session...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-lg font-medium text-primary mb-4">Session not found</p>
          <Button onClick={() => setLocation("/select-test")}>Select a Test</Button>
        </div>
      </div>
    );
  }

  // Mobile source: show return-to-app screen after successful payment
  if (isMobileSource && session.paid) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <div className="max-w-sm w-full text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">✅</span>
          </div>
          <h1 className="text-2xl font-bold text-primary mb-3">Payment Confirmed!</h1>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Your <strong>{productInfo.label}</strong> is now unlocked. Return to the Fredora app on your phone to start your assessment.
          </p>
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-left text-sm text-muted-foreground">
            <p className="font-semibold text-primary mb-2">What to do next:</p>
            <ol className="space-y-1 list-decimal list-inside">
              <li>Switch back to the Fredora app on your phone</li>
              <li>The app will detect your payment automatically</li>
              <li>Your 60-question assessment will begin</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-primary text-white px-4 py-4">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          {!isMobileSource ? (
            <button onClick={() => setLocation("/dashboard")} className="text-white/60 hover:text-white text-sm transition-colors">
              ← Dashboard
            </button>
          ) : (
            <div className="w-20" />
          )}
          <FrederaLogo size="sm" onDark />
          <div className="w-20" />
        </div>
      </header>

      {/* Mobile banner */}
      {isMobileSource && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
          <div className="max-w-xl mx-auto flex items-center gap-2 text-blue-700 text-sm">
            <span>📱</span>
            <span>You're paying for your mobile app session. After payment, return to the Fredora app.</span>
          </div>
        </div>
      )}

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-6xl mb-3">{productInfo.emoji}</div>
            <h1 className="text-2xl font-bold text-primary mb-1">{productInfo.label}</h1>
            <div className="flex items-center justify-center gap-3 mb-3">
              {appliedCoupon ? (
                <>
                  <span className="text-2xl font-black text-muted-foreground line-through">{productInfo.price}</span>
                  <span className="text-4xl font-black text-accent">{formatKobo(discountedKobo)}</span>
                </>
              ) : (
                <span className="text-4xl font-black text-accent">{productInfo.price}</span>
              )}
            </div>
            {appliedCoupon && (
              <span className="inline-block bg-green-100 text-green-700 border border-green-200 text-xs font-bold px-3 py-1 rounded-full mb-2">
                {appliedCoupon.discountPercent}% discount applied ✓
              </span>
            )}
            <p className="text-muted-foreground text-sm">One-time payment · Instant access · Lifetime results</p>
          </div>

          <Card className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-primary">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Assessment</span>
                <span className="font-medium">{productInfo.label}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account</span>
                <span className="font-medium truncate ml-4">{user?.emailAddresses[0]?.emailAddress}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-green-700">
                  <span>Discount ({appliedCoupon.discountPercent}%)</span>
                  <span className="font-medium">−{formatKobo(productInfo.priceKobo - discountedKobo)}</span>
                </div>
              )}
              <div className="border-t pt-3 flex justify-between font-bold text-primary text-base">
                <span>Total</span>
                <span className="text-accent">{formatKobo(discountedKobo)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Coupon code */}
          {!appliedCoupon ? (
            <div className="flex gap-2 mb-6">
              <Input
                placeholder="Promo / coupon code"
                value={couponCode}
                onChange={e => setCouponCode(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleApplyCoupon()}
                className="uppercase placeholder:normal-case"
              />
              <Button
                variant="outline"
                onClick={handleApplyCoupon}
                disabled={validatingCoupon || !couponCode.trim()}
                className="shrink-0"
              >
                {validatingCoupon ? "..." : "Apply"}
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between mb-6 p-3 rounded-lg bg-green-50 border border-green-200">
              <span className="text-green-700 text-sm font-medium">Code: {appliedCoupon.code}</span>
              <button
                onClick={() => { setAppliedCoupon(null); setCouponCode(""); }}
                className="text-green-600 text-xs hover:text-green-800"
              >
                Remove
              </button>
            </div>
          )}

          {isVerifying ? (
            <div className="text-center py-6">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-muted-foreground">Verifying your payment...</p>
            </div>
          ) : (
            <Button
              className="w-full bg-accent hover:bg-amber-600 text-white font-bold text-lg py-6"
              onClick={() => initPayment.mutate()}
              disabled={initPayment.isPending}
            >
              {initPayment.isPending ? "Redirecting to Paystack..." : `Pay ${formatKobo(discountedKobo)} via Paystack`}
            </Button>
          )}

          <p className="text-center text-xs text-muted-foreground mt-4">
            🔒 Secured by Paystack · SSL encrypted · Instant confirmation
          </p>
          <p className="text-center text-xs text-muted-foreground mt-2">
            By paying you agree to our{" "}
            <a href="/web/terms" className="text-accent hover:underline">Terms of Service</a>
            {" "}and{" "}
            <a href="/web/privacy" className="text-accent hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
