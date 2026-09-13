import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Printer } from "lucide-react";

interface ExecutiveReport {
  memberCount: number;
  dominantStyle: string;
  balanceScore: number;
  balanceGaps: string[];
  recommendations: string[];
  executiveSummary: string;
}

interface ExecutiveSummaryProps {
  report: ExecutiveReport;
}

export function ExecutiveSummary({ report }: ExecutiveSummaryProps) {
  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .executive-summary-print, .executive-summary-print * { visibility: visible; }
          .executive-summary-print { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
        }
      `}</style>
      <Card className="executive-summary-print">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Executive Summary</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="no-print"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {report.executiveSummary}
          </p>

          {/* Balance Score */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-2">
              Balance Score
            </p>
            <div className="flex items-center gap-3">
              <Progress value={report.balanceScore} className="flex-1" />
              <span className="text-lg font-bold">{report.balanceScore}/100</span>
            </div>
          </div>

          {/* Balance Gaps */}
          {report.balanceGaps.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-2">
                Balance Gaps
              </p>
              <div className="space-y-2">
                {report.balanceGaps.map((gap) => (
                  <div
                    key={gap}
                    className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 rounded-lg p-3 border border-amber-200"
                  >
                    <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{gap}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-2">
              Recommendations
            </p>
            <ol className="space-y-2">
              {report.recommendations.map((rec, i) => (
                <li
                  key={i}
                  className="text-sm text-muted-foreground flex gap-2"
                >
                  <span className="font-medium text-foreground">{i + 1}.</span>
                  {rec}
                </li>
              ))}
            </ol>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
