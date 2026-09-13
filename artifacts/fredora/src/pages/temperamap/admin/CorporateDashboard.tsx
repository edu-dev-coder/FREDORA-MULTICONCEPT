import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "./AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  TeamDNACard,
  RoleMappingGrid,
  CommunicationMatrix,
  ConflictRiskList,
  MemberCard,
  ExecutiveSummary,
  CreateTeamDialog,
  WorkplaceTab,
} from "@/components/corporate";
import {
  analyzeTeamComposition,
  generateConflictPairs,
  TEAM_ROLES,
  COMMUNICATION_MATRIX,
} from "@/lib/corporate-data";
import {
  aggregateWorkplace,
  rankMembersByScale,
  summarizeResponseQuality,
} from "@/lib/corporate-workplace";
import type { WorkplaceProfile } from "@/lib/workplace";
import { downloadTeamReportPdf } from "@/lib/team-report-pdf";
import { ArrowLeft, Users, Plus, Download } from "lucide-react";

interface CorporateSession {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  primaryTemp: string;
  status: "pending" | "in_progress" | "completed";
  createdAt: string;
  completedAt: string | null;
}

interface Team {
  id: string;
  name: string;
  memberSessionIds: string[];
  createdAt: string;
}

interface ReportMember {
  memberId: string;
  memberName: string;
  primaryTemp: string;
  secondaryTemp?: string;
  results: Record<string, number>;
  workplace?: WorkplaceProfile | null;
  role: string;
  icon: string;
}

interface TeamReport {
  team: Team;
  members: ReportMember[];
  primaryTemps: string[];
  cachedAt?: string | null;
  cached?: boolean;
}

const TEMP_BADGE_COLORS: Record<string, string> = {
  Sanguine: "bg-amber-100 text-amber-800 border-amber-200",
  Choleric: "bg-red-100 text-red-800 border-red-200",
  Melancholic: "bg-blue-100 text-blue-800 border-blue-200",
  Phlegmatic: "bg-green-100 text-green-800 border-green-200",
};

export default function CorporateDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [generatingReportPdf, setGeneratingReportPdf] = useState(false);

  const sessionsQuery = useQuery<CorporateSession[]>({
    queryKey: ["corporate-sessions"],
    queryFn: async () => {
      const r = await fetch("/api/corporate/sessions");
      if (!r.ok) throw new Error("Failed to fetch sessions");
      return r.json();
    },
  });

  const teamsQuery = useQuery<Team[]>({
    queryKey: ["corporate-teams"],
    queryFn: async () => {
      const r = await fetch("/api/corporate/teams");
      if (!r.ok) throw new Error("Failed to fetch teams");
      return r.json();
    },
  });

  const teamReportQuery = useQuery<TeamReport>({
    queryKey: ["corporate-team-report", selectedTeamId],
    queryFn: async () => {
      const r = await fetch(`/api/corporate/teams/${selectedTeamId}/report`, {
        method: "POST",
      });
      if (!r.ok) throw new Error("Failed to fetch team report");
      return r.json();
    },
    enabled: !!selectedTeamId,
  });

  const createTeamMutation = useMutation({
    mutationFn: async ({ name, memberSessionIds }: { name: string; memberSessionIds: string[] }) => {
      const r = await fetch("/api/corporate/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, memberSessionIds }),
      });
      if (!r.ok) throw new Error("Failed to create team");
      return r.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["corporate-teams"] });
      toast({ title: "Team created", description: "Your new team has been created." });
    },
    onError: () => {
      toast({ title: "Error", description: "Could not create team.", variant: "destructive" });
    },
  });

  const completedSessions = (sessionsQuery.data ?? []).filter(
    (s) => s.status === "completed"
  );

  const selectedTeam = teamReportQuery.data;
  const composition = selectedTeam
    ? analyzeTeamComposition(selectedTeam.primaryTemps)
    : null;
  const workplaceAgg = useMemo(
    () => aggregateWorkplace(selectedTeam ? selectedTeam.members.map((m) => m.workplace) : []),
    [selectedTeam]
  );
  const ranks = useMemo(
    () =>
      rankMembersByScale(
        (selectedTeam?.members ?? []).map((m) =>
          m.workplace
            ? { memberId: m.memberId, memberName: m.memberName, workplace: m.workplace }
            : null
        )
      ),
    [selectedTeam]
  );
  const rqSummary = useMemo(
    () => summarizeResponseQuality((selectedTeam?.members ?? []).map((m) => m.workplace)),
    [selectedTeam]
  );
  const conflictPairs = selectedTeam
    ? generateConflictPairs(selectedTeam.primaryTemps)
    : [];

  const membersWithRoles = useMemo(
    () =>
      (selectedTeam?.members ?? []).map((m) => ({
        ...m,
        role: m.role || TEAM_ROLES[m.primaryTemp]?.role || "",
        icon: m.icon || TEAM_ROLES[m.primaryTemp]?.icon || "",
      })),
    [selectedTeam]
  );

  const roleMembers = membersWithRoles.map((m) => ({
    memberId: m.memberId,
    memberName: m.memberName,
    role: m.role,
    temperament: m.primaryTemp,
    icon: m.icon,
  }));

  if (selectedTeamId) {
    return (
      <AdminLayout title="Team Report">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4"
          onClick={() => setSelectedTeamId(null)}
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Back to Teams
        </Button>

        {teamReportQuery.isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner className="h-6 w-6 text-primary" />
          </div>
        ) : teamReportQuery.isError ? (
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-muted-foreground">Could not load team report.</p>
            </CardContent>
          </Card>
        ) : selectedTeam && composition ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">{selectedTeam.team.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {selectedTeam.members.length} members
                </p>
                {selectedTeam.cachedAt && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedTeam.cached ? "Cached report from" : "Report generated"}{" "}
                    {new Date(selectedTeam.cachedAt).toLocaleString()}
                  </p>
                )}
              </div>
              <Button
                size="sm"
                variant="outline"
                disabled={generatingReportPdf}
                onClick={async () => {
                  if (!composition) return;
                  setGeneratingReportPdf(true);
                  try {
                    await downloadTeamReportPdf({
                      teamName: selectedTeam.team.name,
                      generatedAt: new Date().toISOString(),
                      cachedAt: selectedTeam.cachedAt ?? null,
                      composition,
                      conflictPairs,
                      roleMembers,
                      members: membersWithRoles,
                      agg: workplaceAgg,
                    });
                  } finally {
                    setGeneratingReportPdf(false);
                  }
                }}
              >
                <Download className="h-4 w-4 mr-1.5" />
                {generatingReportPdf ? "Generating…" : "Download Team Report"}
              </Button>
            </div>

            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="roles">Roles</TabsTrigger>
                <TabsTrigger value="communication">Communication</TabsTrigger>
                <TabsTrigger value="conflict">Conflict</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="workplace">Workplace</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-6">
                <ExecutiveSummary
                  report={{
                    memberCount: selectedTeam.members.length,
                    dominantStyle: composition.dominantStyle,
                    balanceScore: composition.balanceScore,
                    balanceGaps: composition.balanceGaps,
                    recommendations: composition.recommendations,
                    executiveSummary: composition.executiveSummary,
                  }}
                />
                <TeamDNACard
                  composition={composition.composition}
                  percentages={composition.percentages}
                  balanceScore={composition.balanceScore}
                  balanceGaps={composition.balanceGaps}
                  dominantStyle={composition.dominantStyle}
                />
              </TabsContent>

              <TabsContent value="roles" className="mt-6">
                <RoleMappingGrid roles={roleMembers} />
              </TabsContent>

              <TabsContent value="communication" className="mt-6">
                <CommunicationMatrix matrix={COMMUNICATION_MATRIX} />
              </TabsContent>

              <TabsContent value="conflict" className="mt-6">
                <ConflictRiskList risks={conflictPairs} />
              </TabsContent>

              <TabsContent value="members" className="mt-6">
                <div className="space-y-4">
                  {membersWithRoles.map((member) => (
                    <MemberCard key={member.memberId} member={member} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="workplace" className="mt-6">
                {workplaceAgg.memberCount > 0 ? (
                  <WorkplaceTab agg={workplaceAgg} ranks={ranks} rqSummary={rqSummary} />
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <p className="text-muted-foreground">No workplace data for these members yet.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        ) : null}
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Corporate Teams">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          Manage corporate teams and generate temperament reports.
        </p>
        <Button
          size="sm"
          className="bg-primary hover:bg-primary/90 text-white"
          onClick={() => setCreateDialogOpen(true)}
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Create Team
        </Button>
      </div>

      {/* Team Cards */}
      <Card className="mb-6">
        <CardContent className="p-0">
          {teamsQuery.isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner className="h-6 w-6 text-primary" />
            </div>
          ) : (teamsQuery.data ?? []).length === 0 ? (
            <div className="py-12 text-center">
              <Users className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No teams yet. Create one to get started.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Team Name</TableHead>
                  <TableHead className="hidden md:table-cell">Members</TableHead>
                  <TableHead className="hidden lg:table-cell">Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(teamsQuery.data ?? []).map((team) => (
                  <TableRow key={team.id}>
                    <TableCell className="font-medium">{team.name}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {team.memberSessionIds.length} members
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                      {new Date(team.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedTeamId(team.id)}
                      >
                        View Report
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Completed Corporate Sessions */}
      <h2 className="text-lg font-semibold mb-3">Corporate Test Sessions</h2>
      <Card>
        <CardContent className="p-0">
          {sessionsQuery.isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner className="h-6 w-6 text-primary" />
            </div>
          ) : completedSessions.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No completed corporate sessions found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead>Temperament</TableHead>
                  <TableHead className="hidden lg:table-cell">Completed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completedSessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className="font-medium">{session.userName || "—"}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {session.userEmail || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={TEMP_BADGE_COLORS[session.primaryTemp] || ""}
                      >
                        {session.primaryTemp}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                      {session.completedAt
                        ? new Date(session.completedAt).toLocaleDateString()
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <CreateTeamDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        sessions={completedSessions.map((s) => ({
          id: s.id,
          primaryTemp: s.primaryTemp,
          userEmail: s.userEmail,
          userName: s.userName,
        }))}
        onSubmit={(name, sessionIds) =>
          createTeamMutation.mutate({ name, memberSessionIds: sessionIds })
        }
      />
    </AdminLayout>
  );
}
