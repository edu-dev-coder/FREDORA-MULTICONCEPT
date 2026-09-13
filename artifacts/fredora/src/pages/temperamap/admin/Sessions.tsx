import { useState, useEffect } from "react";
import { AdminLayout } from "./AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Filter, Eye, ExternalLink, Trash2 } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

interface Session {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  testType: string;
  status: "pending" | "paid" | "in_progress" | "completed";
  primaryTemp: string | null;
  secondaryTemp: string | null;
  blend: string | null;
  results: Record<string, number> | null;
  createdAt: string;
  completedAt: string | null;
}

const STATUS_FILTERS = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  paid: "bg-blue-100 text-blue-700 border-blue-200",
  in_progress: "bg-purple-100 text-purple-700 border-purple-200",
  completed: "bg-green-100 text-green-700 border-green-200",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  paid: "Paid",
  in_progress: "In Progress",
  completed: "Completed",
};

const TYPE_LABELS: Record<string, string> = {
  child_3_5: "Ages 3-5",
  child_6_9: "Ages 6-9",
  preteen_10_12: "Ages 10-12",
  teen_13_17: "Ages 13-17",
  single_test: "Adult Test",
  couples_test: "Couples Test",
  corporate_team: "Corporate Team",
};

const TEMP_COLOR: Record<string, string> = {
  Sanguine: "text-amber-600",
  Choleric: "text-red-600",
  Melancholic: "text-blue-600",
  Phlegmatic: "text-green-600",
};

export default function AdminSessions() {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [detailSession, setDetailSession] = useState<Session | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchSessions = async (status: string) => {
    setLoading(true);
    try {
      const url = status ? `/api/admin/sessions?status=${status}` : "/api/admin/sessions";
      const r = await fetch(url);
      if (!r.ok) throw new Error();
      const data = await r.json();
      setSessions(Array.isArray(data) ? data : data.sessions ?? []);
    } catch {
      toast({ title: "Error", description: "Could not load sessions", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSessions(statusFilter); }, [statusFilter]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const r = await fetch(`/api/admin/sessions/${deleteId}`, { method: "DELETE" });
      if (!r.ok) throw new Error();
      const data = await r.json();
      toast({
        title: "Deleted",
        description: data.freedPasscode
          ? `Session deleted. Passcode ${data.freedPasscode} is reusable.`
          : "Session deleted.",
      });
      setSessions((prev) => prev.filter((s) => s.id !== deleteId));
    } catch {
      toast({ title: "Error", description: "Could not delete session", variant: "destructive" });
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <AdminLayout title="Test Sessions">
      {/* Summary stats */}
      {sessions.length > 0 && (
        <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-black text-primary">{sessions.length}</p>
              <p className="text-xs text-muted-foreground">Total Sessions</p>
            </CardContent>
          </Card>
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-black text-green-600">{sessions.filter(s => s.status === "completed").length}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-black text-amber-600">{sessions.filter(s => s.primaryTemp === "Sanguine").length + sessions.filter(s => s.primaryTemp === "Choleric").length + sessions.filter(s => s.primaryTemp === "Melancholic").length + sessions.filter(s => s.primaryTemp === "Phlegmatic").length}</p>
              <p className="text-xs text-muted-foreground">With Results</p>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-3 text-center">
              <p className="text-2xl font-black text-blue-600">{new Set(sessions.map(s => s.userId)).size}</p>
              <p className="text-xs text-muted-foreground">Unique Users</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filter buttons */}
      <div className="mb-6 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => (
          <Button
            key={f.value}
            variant={statusFilter === f.value ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(f.value)}
            className={
              statusFilter === f.value
                ? "bg-primary hover:bg-primary/90 text-white"
                : ""
            }
          >
            <Filter className="h-3.5 w-3.5 mr-1.5" />
            {f.label}
          </Button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Spinner className="h-6 w-6 text-primary" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-muted-foreground">No sessions found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead>Test Type</TableHead>
                  <TableHead className="hidden sm:table-cell">Result</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Created</TableHead>
                  <TableHead className="hidden lg:table-cell">Completed</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.userName || "—"}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {s.userEmail || "—"}
                    </TableCell>
                    <TableCell>{TYPE_LABELS[s.testType] ?? s.testType}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {s.primaryTemp ? (
                        <span className={`text-sm font-semibold ${TEMP_COLOR[s.primaryTemp] ?? ""}`}>
                          {s.primaryTemp}
                          {s.secondaryTemp ? <span className="text-muted-foreground font-normal"> / {s.secondaryTemp}</span> : null}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={STATUS_STYLES[s.status] ?? ""}>
                        {STATUS_LABELS[s.status] ?? s.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                      {s.completedAt ? new Date(s.completedAt).toLocaleDateString() : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDetailSession(s)}
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {s.status === "completed" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              window.location.href = `/admin/results/${s.id}`;
                            }}
                            title="View full results"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                        {s.status === "pending" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteId(s.id)}
                            title="Delete pending session"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!detailSession} onOpenChange={(open) => { if (!open) setDetailSession(null); }}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Session Results</DialogTitle>
            <DialogDescription>
              {detailSession?.id} — {TYPE_LABELS[detailSession?.testType ?? ""] ?? detailSession?.testType}
            </DialogDescription>
          </DialogHeader>
          {detailSession && (
            <div className="space-y-4 text-sm">
              {/* User info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-0.5">User</p>
                  <p className="font-medium">{detailSession.userName || "—"}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-0.5">Email</p>
                  <p className="font-medium">{detailSession.userEmail || "—"}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-0.5">Status</p>
                  <Badge variant="outline" className={STATUS_STYLES[detailSession.status] ?? ""}>
                    {STATUS_LABELS[detailSession.status] ?? detailSession.status}
                  </Badge>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-0.5">Test Type</p>
                  <p className="font-medium">{TYPE_LABELS[detailSession.testType] ?? detailSession.testType}</p>
                </div>
              </div>

              {/* Temperament result */}
              {detailSession.primaryTemp && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-primary mb-2">Temperament Result</p>
                  <p className={`text-xl font-black ${TEMP_COLOR[detailSession.primaryTemp] ?? ""}`}>
                    {detailSession.primaryTemp}
                  </p>
                  {detailSession.secondaryTemp && (
                    <p className="text-sm text-muted-foreground">
                      Secondary: {detailSession.secondaryTemp}
                    </p>
                  )}
                  {detailSession.blend && (
                    <p className="text-xs text-muted-foreground mt-1">Blend: {detailSession.blend}</p>
                  )}
                </div>
              )}

              {/* Score breakdown */}
              {detailSession.results && Object.keys(detailSession.results).length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Score Breakdown</p>
                  <div className="space-y-2">
                    {Object.entries(detailSession.results)
                      .sort((a, b) => b[1] - a[1])
                      .map(([temp, score]) => {
                        const maxScore = ["child_3_5", "child_6_9", "preteen_10_12"].includes(detailSession.testType) ? 75 : 60;
                        const pct = Math.round((score / maxScore) * 100);
                        return (
                          <div key={temp}>
                            <div className="flex justify-between text-xs mb-0.5">
                              <span className={`font-semibold ${temp === detailSession.primaryTemp ? "text-primary" : "text-muted-foreground"}`}>
                                {temp} {temp === detailSession.primaryTemp ? "★" : ""}
                              </span>
                              <span className="font-bold">{pct}%</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  temp === "Sanguine" ? "bg-amber-500" :
                                  temp === "Choleric" ? "bg-red-500" :
                                  temp === "Melancholic" ? "bg-blue-500" :
                                  "bg-green-500"
                                }`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="border-t pt-3 space-y-1 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Created</span>
                  <span>{new Date(detailSession.createdAt).toLocaleString()}</span>
                </div>
                {detailSession.completedAt && (
                  <div className="flex justify-between">
                    <span>Completed</span>
                    <span>{new Date(detailSession.completedAt).toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* View full results */}
              {detailSession.status === "completed" && (
                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={() => {
                    window.location.href = `/temperamap/admin/results/${detailSession.id}`;
                  }}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Full Results
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete pending session confirm */}
      <Dialog open={!!deleteId} onOpenChange={(open) => { if (!open) setDeleteId(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete pending session?</DialogTitle>
            <DialogDescription>
              This session's one-time passcode slot will be freed and the code can be reused.
              This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              className="flex-1 bg-destructive text-white hover:bg-destructive/90"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
