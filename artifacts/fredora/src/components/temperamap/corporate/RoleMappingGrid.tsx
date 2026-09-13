import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { TEAM_ROLES } from "@/lib/corporate-data";

interface RoleMember {
  memberId: string;
  memberName: string;
  role: string;
  temperament: string;
  icon: string;
}

interface RoleMappingGridProps {
  roles: RoleMember[];
}

const TEMP_BADGE_COLORS: Record<string, string> = {
  Sanguine: "bg-amber-100 text-amber-800 border-amber-200",
  Choleric: "bg-red-100 text-red-800 border-red-200",
  Melancholic: "bg-blue-100 text-blue-800 border-blue-200",
  Phlegmatic: "bg-green-100 text-green-800 border-green-200",
};

export function RoleMappingGrid({ roles }: RoleMappingGridProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="space-y-4">
      {roles.map((member) => {
        const roleData = TEAM_ROLES[member.temperament];
        const isExpanded = expanded[member.memberId] ?? false;

        return (
          <Card key={member.memberId}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{member.icon}</span>
                  <div>
                    <CardTitle className="text-base">{member.role}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {member.memberName}
                    </p>
                  </div>
                </div>
                <Badge
                  className={`text-xs ${TEMP_BADGE_COLORS[member.temperament] || ""}`}
                >
                  {member.temperament}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                {roleData?.description}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggle(member.memberId)}
                className="text-xs"
              >
                {isExpanded ? (
                  <>
                    Less <ChevronUp className="h-3 w-3 ml-1" />
                  </>
                ) : (
                  <>
                    Role details <ChevronDown className="h-3 w-3 ml-1" />
                  </>
                )}
              </Button>
              {isExpanded && roleData && (
                <div className="mt-4 space-y-4">
                  <RoleSection
                    title="Strengths"
                    items={roleData.strengths}
                  />
                  <RoleSection
                    title="Ideal Responsibilities"
                    items={roleData.idealResponsibilities}
                  />
                  <RoleSection
                    title="Watch Out For"
                    items={roleData.watchOutFor}
                  />
                  <RoleSection
                    title="Motivators"
                    items={roleData.motivators}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function RoleSection({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-2">
        {title}
      </p>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item} className="text-sm text-muted-foreground">
            • {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
