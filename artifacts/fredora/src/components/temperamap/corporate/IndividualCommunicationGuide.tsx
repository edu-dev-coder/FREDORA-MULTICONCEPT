import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { commPairsForRow } from "@/lib/corporate-data";

const TEMP_COLORS: Record<string, string> = {
  Sanguine: "#f59e0b",
  Choleric: "#ef4444",
  Melancholic: "#3b82f6",
  Phlegmatic: "#22c55e",
};

interface IndividualCommunicationGuideProps {
  row: string;
}

export function IndividualCommunicationGuide({ row }: IndividualCommunicationGuideProps) {
  const pairs = commPairsForRow(row);
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base text-primary">How You Communicate</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            The best way for you, a {row}, to work and communicate with each temperament type.
          </p>
        </CardContent>
      </Card>
      {pairs.map((p) => (
        <Card key={`${p.row}-${p.col}`}>
          <CardHeader>
            <CardTitle className="text-base">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full mr-1.5"
                style={{ backgroundColor: TEMP_COLORS[p.row] }}
              />
              {p.row}
              <span className="text-muted-foreground mx-2">→</span>
              <span
                className="inline-block h-2.5 w-2.5 rounded-full mr-1.5"
                style={{ backgroundColor: TEMP_COLORS[p.col] }}
              />
              {p.col}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <CommDetail label="Best Approach" value={p.data.bestApproach} />
            <CommDetail label="Meeting Style" value={p.data.meetingStyle} />
            <CommDetail label="Feedback Style" value={p.data.feedbackStyle} />
            <CommDetail label="Friction Point" value={p.data.frictionPoint} />
            <CommDetail label="Tip" value={p.data.tip} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function CommDetail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">{label}</p>
      <p className="text-sm text-muted-foreground">{value}</p>
    </div>
  );
}
