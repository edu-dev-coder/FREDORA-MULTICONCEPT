import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { TEAM_ROLES } from "@/lib/corporate-data";
import { WORKPLACE_SCALES, type WorkplaceProfile } from "@/lib/workplace";

const TEMP_EMOJI: Record<string, string> = {
  Sanguine: "☀️",
  Choleric: "🔥",
  Melancholic: "🌊",
  Phlegmatic: "🌿",
};

interface Member {
  memberId: string;
  memberName: string;
  primaryTemp: string;
  secondaryTemp?: string;
  results: Record<string, number>;
  workplace?: WorkplaceProfile | null;
  role: string;
  icon: string;
}

interface MemberCardProps {
  member: Member;
}

export function MemberCard({ member }: MemberCardProps) {
  const [expanded, setExpanded] = useState(false);
  const roleData = TEAM_ROLES[member.primaryTemp];

  return (
    <Card>
      <CardHeader
        className="cursor-pointer pb-3"
        onClick={() => setExpanded((prev) => !prev)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{member.icon}</span>
            <div>
              <CardTitle className="text-base">{member.memberName}</CardTitle>
              <p className="text-sm text-muted-foreground">{member.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">
              {TEMP_EMOJI[member.primaryTemp] || ""} {member.primaryTemp}
            </span>
            {expanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>
      </CardHeader>
      {expanded && (
        <CardContent className="space-y-5">
          {/* Score Breakdown */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-3">
              Temperament Scores
            </p>
            <div className="space-y-2">
              {["Sanguine", "Choleric", "Melancholic", "Phlegmatic"].map(
                (temp) => {
                  const score = member.results[temp] || 0;
                  const colors: Record<string, string> = {
                    Sanguine: "bg-amber-500",
                    Choleric: "bg-red-500",
                    Melancholic: "bg-blue-500",
                    Phlegmatic: "bg-green-500",
                  };
                  return (
                    <div key={temp} className="flex items-center gap-3">
                      <span className="text-xs w-28 text-muted-foreground">
                        {TEMP_EMOJI[temp]} {temp}
                      </span>
                      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full ${colors[temp]}`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium w-10 text-right">
                        {score}
                      </span>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          {/* Workplace Profile */}
          {member.workplace && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-3 flex items-center gap-1">
                Workplace Profile
                {member.workplace.responseQuality.flag !== "ok" && (
                  <span title="Response pattern — interpret with caution">⚠️</span>
                )}
              </p>
              <div className="space-y-2">
                {WORKPLACE_SCALES.map((scale) => {
                  const s = member.workplace?.scales[scale.key];
                  if (!s) return null;
                  return (
                    <div key={scale.key} className="flex items-center gap-3">
                      <span className="text-xs w-36 text-muted-foreground truncate">{scale.label}</span>
                      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${(s.mean / 4) * 100}%` }} />
                      </div>
                      <span className="text-xs font-medium w-12 text-right">P{s.pct}</span>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Percentiles are against a provisional working-adult model, not a real norm sample.
              </p>
            </div>
          )}

          {/* Strengths */}
          {roleData && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-2">
                Strengths
              </p>
              <ul className="space-y-1">
                {roleData.strengths.map((s) => (
                  <li key={s} className="text-sm text-muted-foreground">
                    • {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Growth Areas */}
          {roleData && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-2">
                Growth Areas
              </p>
              <ul className="space-y-1">
                {roleData.watchOutFor.map((g) => (
                  <li key={g} className="text-sm text-muted-foreground">
                    • {g}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Role Description */}
          {roleData && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-2">
                Role Description
              </p>
              <p className="text-sm text-muted-foreground">
                {roleData.description}
              </p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
