import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import FrederaLogo from "@/components/FrederaLogo";
import {
  getQuestionsForTestType,
  computeTemperament,
  OPTIONS,
  type Question,
} from "@/lib/questions";

interface TestSession {
  id: string;
  testType: string;
  status: string;
  paid: boolean;
  answers?: Record<string, number> | null;
}

const QUESTIONS_PER_PAGE = 6;

export default function TakeTest() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [page, setPage] = useState(0);

  const { data: session, isFetched } = useQuery<TestSession>({
    queryKey: ["test", sessionId],
    queryFn: async () => {
      const r = await fetch(`/api/tests/${sessionId}`);
      if (!r.ok) throw new Error("Not found");
      return r.json();
    },
    enabled: !!sessionId,
    staleTime: 0,
  });

  useEffect(() => {
    if (!isFetched) return;
    if (session?.answers) setAnswers(session.answers as Record<string, number>);
    if (session?.status === "completed") setLocation(`/results/${sessionId}`);
  }, [session, isFetched]);

  const questions: Question[] = getQuestionsForTestType(session?.testType ?? "single_test");
  const coreQuestions = questions.filter(q => q.temperament !== "bonus");
  const bonusQuestions = questions.filter(q => q.temperament === "bonus");
  const hasBonusSection = bonusQuestions.length > 0;
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / totalQuestions) * 100;

  const totalPages = Math.ceil(coreQuestions.length / QUESTIONS_PER_PAGE) + (hasBonusSection ? 1 : 0);
  const isBonusPage = hasBonusSection && page === totalPages - 1;

  const currentQuestions: Question[] = isBonusPage
    ? bonusQuestions
    : coreQuestions.slice(page * QUESTIONS_PER_PAGE, (page + 1) * QUESTIONS_PER_PAGE);

  const pageAnswered = currentQuestions.every(q => answers[q.id.toString()] !== undefined);
  const allAnswered = answeredCount === totalQuestions;

  const submitTest = useMutation({
    mutationFn: async () => {
      const { primaryTemp, secondaryTemp, blend, results } = computeTemperament(answers);
      const bonusAnswers = bonusQuestions.length > 0
        ? Object.fromEntries(bonusQuestions.map(q => [q.id, answers[q.id.toString()] ?? 0]))
        : undefined;
      const r = await fetch(`/api/tests/${sessionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "completed",
          answers,
          results,
          primaryTemp,
          secondaryTemp,
          blend,
          completedAt: new Date().toISOString(),
        }),
      });
      if (!r.ok) throw new Error("Submit failed");
      return r.json();
    },
    onSuccess: () => {
      toast({ title: "Assessment complete!", description: "View your results below." });
      if (session?.testType === "couples_test") {
        setLocation(`/invite-partner/${sessionId}`);
      } else {
        setLocation(`/results/${sessionId}`);
      }
    },
    onError: () => {
      toast({ title: "Error", description: "Could not submit. Please try again.", variant: "destructive" });
    },
  });

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId.toString()]: value }));
  };

  const startIdx = isBonusPage ? coreQuestions.length : page * QUESTIONS_PER_PAGE;
  const endIdx = isBonusPage ? totalQuestions : Math.min(startIdx + QUESTIONS_PER_PAGE, coreQuestions.length);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-white px-4 py-4 sticky top-0 z-10 shadow">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => {
                if (answeredCount > 0 && !window.confirm("Your progress will be saved. Leave the test?")) return;
                setLocation("/dashboard");
              }}
              className="text-white/60 hover:text-white text-sm transition-colors"
            >
              ← Exit
            </button>
            <FrederaLogo size="sm" onDark />
            <span className="text-blue-200 text-sm">{answeredCount}/{totalQuestions}</span>
          </div>
          <Progress value={progress} className="h-2 bg-white/20 [&>div]:bg-accent" />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            Questions {startIdx + 1}–{endIdx} of {totalQuestions}
          </p>
          <div className="flex items-center gap-2">
            {isBonusPage && (
              <Badge className="bg-accent/10 text-accent border-accent/30 text-xs">
                {session?.testType === "couples_test" ? "Relationship Insights" : session?.testType === "corporate_team" ? "Workplace Profile" : "Learning Style"}
              </Badge>
            )}
            <p className="text-sm text-muted-foreground">
              Section {page + 1} of {totalPages}
            </p>
          </div>
        </div>

        {isBonusPage && (
          <Card className="mb-6 bg-accent/5 border-accent/20">
            <CardContent className="p-4">
              <p className="text-sm text-accent font-semibold mb-1">
                {session?.testType === "couples_test"
                  ? "💑 Relationship Insights Section"
                  : session?.testType === "corporate_team"
                  ? "🏢 Workplace Profile Section"
                  : "📚 Learning Style Section"}
              </p>
              <p className="text-xs text-muted-foreground">
                {session?.testType === "couples_test"
                  ? "These 10 questions help us generate your couples compatibility analysis."
                  : session?.testType === "corporate_team"
                  ? "These 10 questions generate your workplace temperament and leadership profile."
                  : "These 10 questions help us generate your personalized learning style profile."}
              </p>
            </CardContent>
          </Card>
        )}

        <div className="space-y-5">
          {currentQuestions.map((question) => {
            const selected = answers[question.id.toString()];
            return (
              <Card
                key={question.id}
                className={`transition-all ${selected !== undefined ? "border-primary/40 bg-primary/5" : ""}`}
              >
                <CardContent className="p-5">
                  <p className="font-medium text-primary mb-4">
                    <span className="text-accent font-bold mr-2">{question.id + 1}.</span>
                    {question.text}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => handleAnswer(question.id, opt.value)}
                        className={`flex-1 min-w-[110px] py-2 px-3 rounded-lg text-xs font-medium border-2 transition-all ${
                          selected === opt.value
                            ? "bg-primary border-primary text-white"
                            : "border-border hover:border-primary/50 hover:bg-primary/5 text-muted-foreground"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex justify-between mt-8 gap-4">
          <Button
            variant="outline"
            onClick={() => { setPage(p => Math.max(0, p - 1)); window.scrollTo(0, 0); }}
            disabled={page === 0}
            className="flex-1"
          >
            ← Previous
          </Button>
          {page < totalPages - 1 ? (
            <Button
              onClick={() => { setPage(p => p + 1); window.scrollTo(0, 0); }}
              disabled={!pageAnswered}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              Next Section →
            </Button>
          ) : (
            <Button
              onClick={() => submitTest.mutate()}
              disabled={!allAnswered || submitTest.isPending}
              className="flex-1 bg-accent hover:bg-amber-600 text-white font-bold"
            >
              {submitTest.isPending ? "Submitting..." : "Submit Test ✓"}
            </Button>
          )}
        </div>

        {page === totalPages - 1 && !allAnswered && (
          <p className="text-center text-sm text-amber-600 mt-3">
            Please answer all {totalQuestions - answeredCount} remaining question{totalQuestions - answeredCount !== 1 ? "s" : ""} to submit.
          </p>
        )}
      </div>
    </div>
  );
}
