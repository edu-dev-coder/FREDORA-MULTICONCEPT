import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { MEDIUM_PAIRS, type CommStyle } from "@/lib/corporate-data";

interface CommunicationMatrixProps {
  matrix: Record<string, Record<string, CommStyle>>;
}

const TEMP_COLORS: Record<string, string> = {
  Sanguine: "#f59e0b",
  Choleric: "#ef4444",
  Melancholic: "#3b82f6",
  Phlegmatic: "#22c55e",
};

function getCellStyle(a: string, b: string): string {
  if (a === b) return "bg-green-50 border-green-200";
  const key = `${a}-${b}`;
  if (MEDIUM_PAIRS.includes(key)) return "bg-amber-50 border-amber-200";
  return "bg-red-50 border-red-200";
}

export function CommunicationMatrix({ matrix }: CommunicationMatrixProps) {
  const [selected, setSelected] = useState<{
    row: string;
    col: string;
    data: CommStyle;
  } | null>(null);

  const temps = ["Sanguine", "Choleric", "Melancholic", "Phlegmatic"];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Communication Matrix</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Desktop: grid */}
        <div className="hidden sm:block">
          <div
            className="grid gap-1"
            style={{
              gridTemplateColumns: `100px repeat(${temps.length}, 1fr)`,
            }}
          >
            {/* Header row */}
            <div />
            {temps.map((t) => (
              <div key={t} className="text-center p-2">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full mr-1"
                  style={{ backgroundColor: TEMP_COLORS[t] }}
                />
                <span className="text-xs font-medium">{t}</span>
              </div>
            ))}

            {/* Data rows */}
            {temps.map((row) => (
              <>
                <div
                  key={`label-${row}`}
                  className="flex items-center p-2"
                >
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full mr-1.5"
                    style={{ backgroundColor: TEMP_COLORS[row] }}
                  />
                  <span className="text-xs font-medium">{row}</span>
                </div>
                {temps.map((col) => {
                  const data = matrix[row]?.[col];
                  return (
                    <button
                      key={`${row}-${col}`}
                      onClick={() =>
                        data && setSelected({ row, col, data })
                      }
                      className={`rounded-md border p-2 text-left text-xs hover:opacity-80 transition-opacity ${getCellStyle(row, col)}`}
                    >
                      <div className="font-medium text-foreground truncate">
                        {data?.bestApproach?.slice(0, 40)}...
                      </div>
                      <Info className="h-3 w-3 mt-1 text-muted-foreground" />
                    </button>
                  );
                })}
              </>
            ))}
          </div>
        </div>

        {/* Mobile: card list */}
        <div className="sm:hidden space-y-3">
          {temps.map((row) =>
            temps.map((col) => {
              const data = matrix[row]?.[col];
              if (!data) return null;
              return (
                <button
                  key={`${row}-${col}`}
                  onClick={() => setSelected({ row, col, data })}
                  className={`w-full rounded-lg border p-3 text-left ${getCellStyle(row, col)}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: TEMP_COLORS[row] }}
                    />
                    <span className="text-xs font-medium">{row}</span>
                    <span className="text-muted-foreground">→</span>
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: TEMP_COLORS[col] }}
                    />
                    <span className="text-xs font-medium">{col}</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {data.bestApproach}
                  </p>
                </button>
              );
            })
          )}
        </div>

        {/* Detail overlay */}
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <Card className="w-full max-w-lg max-h-[80vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full mr-1.5"
                      style={{ backgroundColor: TEMP_COLORS[selected.row] }}
                    />
                    {selected.row}
                    <span className="text-muted-foreground mx-2">→</span>
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full mr-1.5"
                      style={{ backgroundColor: TEMP_COLORS[selected.col] }}
                    />
                    {selected.col}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelected(null)}
                  >
                    Close
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CommDetail
                  label="Best Approach"
                  value={selected.data.bestApproach}
                />
                <CommDetail
                  label="Meeting Style"
                  value={selected.data.meetingStyle}
                />
                <CommDetail
                  label="Feedback Style"
                  value={selected.data.feedbackStyle}
                />
                <CommDetail
                  label="Friction Point"
                  value={selected.data.frictionPoint}
                />
                <CommDetail label="Tip" value={selected.data.tip} />
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CommDetail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
        {label}
      </p>
      <p className="text-sm text-muted-foreground">{value}</p>
    </div>
  );
}
