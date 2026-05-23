import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import FrederaLogo from "@/components/FrederaLogo";

interface TestSession {
  id: string;
  testType: string;
  status: string;
  paid: boolean;
  primaryTemp?: string | null;
  secondaryTemp?: string | null;
  blend?: string | null;
  createdAt: string;
  completedAt?: string | null;
}

const TEST_LABELS: Record<string, string> = {
  single_test:    "Adult Test",
  couples_test:   "Couples Compatibility",
  school_license: "School License",
  individual_student: "Individual Student",
  corporate_team: "Corporate Team",
  child_3_5:      "Ages 3–5",
  child_6_9:      "Ages 6–9",
  preteen_10_12:  "Ages 10–12",
  teen_13_17:     "Ages 13–17",
};

const STATUS_COLOR: Record<string, string> = {
  pending:     "bg-yellow-100 text-yellow-700 border-yellow-200",
  paid:        "bg-blue-100 text-blue-700 border-blue-200",
  in_progress: "bg-purple-100 text-purple-700 border-purple-200",
  completed:   "bg-green-100 text-green-700 border-green-200",
};

const TEMP_COLOR: Record<string, string> = {
  Sanguine:   "text-amber-600",
  Choleric:   "text-red-600",
  Melancholic:"text-blue-600",
  Phlegmatic: "text-green-600",
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  const { data: tests = [], isLoading } = useQuery<TestSession[]>({
    queryKey: ["tests", user?.id],
    queryFn: async () => {
      const r = await fetch(`/api/tests?userId=${user?.id}`);
      if (!r.ok) return [];
      return r.json();
    },
    enabled: !!user?.id,
  });

  const completedTests = tests.filter(t => t.status === "completed");
  const hasTests = tests.length > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-white px-4 py-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <FrederaLogo size="sm" onDark />
          <div className="flex items-center gap-3">
            <span className="text-blue-200 text-sm hidden sm:block">
              {user?.firstName || user?.email}
            </span>
            {user?.role === "admin" && (
              <a
                href="/admin/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold bg-accent text-white px-3 py-1 rounded-full hover:bg-amber-600 transition-colors"
              >
                Admin ↗
              </a>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { logout(); setLocation("/"); }}
              className="text-white hover:bg-white/10"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary mb-1">
            Welcome{user?.firstName ? `, ${user.firstName}` : " back"}! 👋
          </h1>
          <p className="text-muted-foreground">
            {completedTests.length > 0
              ? `You've completed ${completedTests.length} assessment${completedTests.length > 1 ? "s" : ""}.`
              : hasTests
              ? "You have an assessment in progress."
              : "Ready to discover your temperament?"}
          </p>
        </div>

        {/* Empty state — first time user */}
        {!isLoading && !hasTests && (
          <div className="mb-8">
            <Card className="border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-primary/5">
              <CardContent className="py-14 px-8 text-center">
                <div className="flex justify-center gap-3 mb-6 text-4xl">
                  <span>🌟</span><span>🔥</span><span>🌊</span><span>🌿</span>
                </div>
                <h2 className="text-2xl font-bold text-primary mb-3">Discover Your Temperament Blend</h2>
                <p className="text-muted-foreground max-w-md mx-auto mb-2 leading-relaxed">
                  You're just 60 questions away from understanding your personality, relationships, and purpose at a deeper level than you ever have before.
                </p>
                <p className="text-muted-foreground text-sm mb-8">Takes 12–20 minutes · Results are instant · PDF report included</p>
                <Button
                  size="lg"
                  onClick={() => setLocation("/select-test")}
                  className="bg-accent hover:bg-amber-600 text-white font-bold px-10 py-6 text-base shadow-lg"
                >
                  Take Your First Assessment →
                </Button>
                <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
                  <span>📄 Full PDF report</span>
                  <span>⚡ Instant results</span>
                  <span>🔐 Private & secure</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* CTA for returning users */}
        {hasTests && (
          <Card className="mb-8 bg-gradient-to-r from-primary to-[#1e4580] text-white border-0">
            <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold mb-1">Take a New Assessment</h2>
                <p className="text-blue-200 text-sm">Choose from Individual, Couples, School, or Corporate packages</p>
              </div>
              <Button
                onClick={() => setLocation("/select-test")}
                className="bg-accent hover:bg-amber-600 text-white font-bold shrink-0"
              >
                Start Assessment →
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Completed summary cards */}
        {completedTests.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-1 pt-4 px-4">
                <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider">Tests Completed</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <p className="text-3xl font-black text-primary">{completedTests.length}</p>
              </CardContent>
            </Card>
            {completedTests[0]?.primaryTemp && (
              <Card className="bg-accent/5 border-accent/20">
                <CardHeader className="pb-1 pt-4 px-4">
                  <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider">Primary Type</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <p className={`text-2xl font-black ${TEMP_COLOR[completedTests[0].primaryTemp] ?? "text-primary"}`}>
                    {completedTests[0].primaryTemp}
                  </p>
                </CardContent>
              </Card>
            )}
            {completedTests[0]?.secondaryTemp && (
              <Card className="bg-green-50 border-green-200">
                <CardHeader className="pb-1 pt-4 px-4">
                  <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider">Secondary Type</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <p className={`text-2xl font-black ${TEMP_COLOR[completedTests[0].secondaryTemp] ?? "text-primary"}`}>
                    {completedTests[0].secondaryTemp}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Test history */}
        <div>
          <h2 className="text-lg font-bold text-primary mb-4">Your Assessments</h2>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map(i => (
                <div key={i} className="h-20 bg-muted animate-pulse rounded-xl" />
              ))}
            </div>
          ) : tests.length === 0 ? null : (
            <div className="space-y-3">
              {tests.map(test => (
                <Card
                  key={test.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    if (test.status === "completed") {
                      setLocation(`/results/${test.id}?type=${test.testType}`);
                    } else {
                      setLocation(`/test/${test.id}`);
                    }
                  }}
                >
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-xl">
                        {test.status === "completed" ? "✅" : "📝"}
                      </div>
                      <div>
                        <p className="font-semibold text-primary">{TEST_LABELS[test.testType] || test.testType}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(test.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                        {test.primaryTemp && (
                          <p className={`text-xs font-medium mt-0.5 ${TEMP_COLOR[test.primaryTemp] ?? "text-accent"}`}>
                            {test.primaryTemp}{test.secondaryTemp ? ` / ${test.secondaryTemp}` : ""} blend
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs border ${STATUS_COLOR[test.status] || "bg-gray-100 text-gray-600"}`}>
                        {test.status.replace("_", " ")}
                      </Badge>
                      {test.status === "completed" && (
                        <span className="text-muted-foreground text-sm">→</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 py-8 px-4 text-center border-t border-border">
        <p className="text-xs text-muted-foreground mb-3">© {new Date().getFullYear()} Fredora TemperaMap</p>
        <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground/60">
          <a href={`${import.meta.env.BASE_URL}terms`} className="hover:text-accent transition-colors">Terms of Service</a>
          <span>·</span>
          <a href={`${import.meta.env.BASE_URL}privacy`} className="hover:text-accent transition-colors">Privacy Policy</a>
          <span>·</span>
          <a href="mailto:support@fredora.com" className="hover:text-accent transition-colors">Support</a>
        </div>
      </footer>
    </div>
  );
}
