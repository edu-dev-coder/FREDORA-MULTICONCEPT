import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import FrederaLogo from "@/components/FrederaLogo";

export default function Payment() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-primary text-white px-4 py-4">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <button onClick={() => setLocation("/temperamap/dashboard")} className="text-white/60 hover:text-white text-sm transition-colors">
            ← Dashboard
          </button>
          <FrederaLogo size="sm" onDark />
          <div className="w-20" />
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-5xl mb-4">📞</div>
              <h1 className="text-2xl font-bold text-primary mb-3">Contact Us to Get Started</h1>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                To purchase access to your selected assessment, please contact us through any of the channels below.
                Once we confirm your payment, we will send you a one-time passcode to unlock your test.
              </p>

              <div className="text-left space-y-4 bg-muted/30 rounded-xl p-5 mb-6">
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Call / WhatsApp</p>
                  <a href="https://wa.me/2348066705224" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">
                    +234 806 670 5224
                  </a>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Email Us</p>
                  <p className="text-primary font-semibold">contact@fredora.com.ng</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Bank Transfer</p>
                  <p className="text-primary font-semibold">Access Bank — 1487059923</p>
                  <p className="text-primary font-semibold">Fredora Multiconcept</p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mb-6">
                After payment, we will generate and send your unique passcode within 24 hours.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90 text-white"
                  onClick={() => setLocation("/temperamap/select-test")}
                >
                  ← Back to Tests
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setLocation("/temperamap/dashboard")}
                >
                  Go to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
