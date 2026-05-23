import { useState } from "react";
import { useListAdminTests, getListAdminTestsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatNigerianDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Search, Download, X } from "lucide-react";

export default function TestsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const params = {
    search: search || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    testType: typeFilter !== "all" ? typeFilter : undefined,
  };

  const { data: tests, isLoading, isError } = useListAdminTests(params, {
    query: { queryKey: getListAdminTestsQueryKey(params) }
  });

  const handleExport = () => window.open("/api/admin/export/tests", "_blank");
  const hasFilters = search || statusFilter !== "all" || typeFilter !== "all";
  const clearFilters = () => { setSearch(""); setStatusFilter("all"); setTypeFilter("all"); };

  const handleUnlock = async (id: string) => {
    if (!window.confirm("Unlock this session? The user will be able to view results and download the PDF.")) return;
    const r = await fetch(`/api/tests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paid: true }),
    });
    if (!r.ok) {
      alert("Failed to unlock session");
      return;
    }
    window.location.reload();
  };

  if (isError) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-destructive">Failed to load tests</h2>
          <p className="text-sm text-muted-foreground">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Test Sessions</h1>
          <p className="text-muted-foreground">Monitor temperament assessments across the platform.</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>All Tests</CardTitle>
          <CardDescription>A complete log of all test sessions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by temperament, blend..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Test Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="child_3_5">Ages 3–5</SelectItem>
                <SelectItem value="child_6_9">Ages 6–9</SelectItem>
                <SelectItem value="preteen_10_12">Ages 10–12</SelectItem>
                <SelectItem value="teen_13_17">Ages 13–17</SelectItem>
                <SelectItem value="single_test">Adult</SelectItem>
                <SelectItem value="couples_test">Couples</SelectItem>
                <SelectItem value="corporate_team">Corporate Team</SelectItem>
              </SelectContent>
            </Select>
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="flex items-center gap-1">
                <X className="h-3.5 w-3.5" />Clear
              </Button>
            )}
            <span className="text-sm text-muted-foreground ml-auto">{tests?.length ?? 0} records</span>
          </div>

          {isLoading ? (
            <div className="space-y-4">{[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Blend</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!tests || tests.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="h-24 text-center">No test sessions found.</TableCell></TableRow>
                ) : (
                  tests.map((test) => (
                    <TableRow key={test.id}>
                      <TableCell className="font-mono text-xs">{test.id.substring(0, 8)}</TableCell>
                      <TableCell className="capitalize">{test.testType.replace(/_/g, ' ')}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          test.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                          test.status === 'in_progress' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' :
                          'bg-primary/10 text-primary border-primary/20'
                        }>{test.status.replace(/_/g, ' ')}</Badge>
                      </TableCell>
                      <TableCell>
                        {test.paid ? (
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Paid</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-muted text-muted-foreground">Unpaid</Badge>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{test.blend || '—'}</TableCell>
                      <TableCell>{formatNigerianDate(test.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        {!test.paid && test.status === "completed" && (
                          <Button size="sm" variant="outline" onClick={() => handleUnlock(test.id)}>
                            Unlock
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
