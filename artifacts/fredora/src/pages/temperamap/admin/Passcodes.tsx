import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { AdminLayout } from "./AdminLayout";
import { Spinner } from "@/components/ui/spinner";

interface PasscodeRecord {
  id: number;
  code: string;
  testType: string;
  status: string;
  maxUses: number;
  currentUses: number;
  expiresAt: string | null;
  createdAt: string;
  usedAt: string | null;
  usedBy: string | null;
}

const TEST_TYPE_LABELS: Record<string, string> = {
  child_3_5: "Child 3-5",
  child_6_9: "Child 6-9",
  preteen_10_12: "Preteen 10-12",
  teen_13_17: "Teen 13-17",
  single_test: "Adult",
  couples_test: "Couples",
  corporate_team: "Corporate",
  group_test: "Group",
};

const TEST_TYPE_COLORS: Record<string, string> = {
  single_test: "bg-blue-100 text-blue-700 border-blue-200",
  couples_test: "bg-pink-100 text-pink-700 border-pink-200",
  corporate_team: "bg-purple-100 text-purple-700 border-purple-200",
  group_test: "bg-green-100 text-green-700 border-green-200",
  child_3_5: "bg-yellow-100 text-yellow-700 border-yellow-200",
  child_6_9: "bg-orange-100 text-orange-700 border-orange-200",
  preteen_10_12: "bg-amber-100 text-amber-700 border-amber-200",
  teen_13_17: "bg-red-100 text-red-700 border-red-200",
};

function getStatus(p: PasscodeRecord): { label: string; color: string } {
  if (p.status === "exhausted") return { label: "Exhausted", color: "bg-muted text-muted-foreground border-border" };
  if (p.expiresAt && new Date(p.expiresAt) < new Date()) return { label: "Expired", color: "bg-red-100 text-red-700 border-red-200" };
  if (p.currentUses >= p.maxUses) return { label: "Full", color: "bg-orange-100 text-orange-700 border-orange-200" };
  return { label: "Active", color: "bg-green-100 text-green-700 border-green-200" };
}

export default function AdminPasscodes() {
  const { toast } = useToast();
  const [passcodes, setPasscodes] = useState<PasscodeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("single_test");
  const [maxUses, setMaxUses] = useState(1);
  const [expiresAt, setExpiresAt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const fetchPasscodes = async () => {
    try {
      const r = await fetch("/api/passcodes");
      if (r.ok) {
        const data = await r.json() as PasscodeRecord[];
        setPasscodes(data);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPasscodes(); }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const body: Record<string, unknown> = { testType: selectedType, maxUses };
      if (expiresAt) body.expiresAt = new Date(expiresAt).toISOString();
      const r = await fetch("/api/passcodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!r.ok) throw new Error("Failed to generate");
      const record = await r.json() as PasscodeRecord;
      setPasscodes(prev => [record, ...prev]);
      toast({ title: "Passcode Generated", description: `${record.code} — ${maxUses} slot${maxUses > 1 ? "s" : ""} for ${TEST_TYPE_LABELS[record.testType] ?? record.testType}` });
      setMaxUses(1);
      setExpiresAt("");
    } catch {
      toast({ title: "Error", description: "Could not generate passcode", variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast({ title: "Copied!", description: code });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filtered = filterType === "all" ? passcodes : passcodes.filter(p => p.testType === filterType);

  const totalSlots = passcodes.reduce((s, p) => s + p.maxUses, 0);
  const totalUsed = passcodes.reduce((s, p) => s + p.currentUses, 0);
  const activeCount = passcodes.filter(p => {
    const st = getStatus(p);
    return st.label === "Active";
  }).length;

  return (
    <AdminLayout title="Passcodes">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{passcodes.length}</div>
            <div className="text-xs text-muted-foreground">Total Codes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{activeCount}</div>
            <div className="text-xs text-muted-foreground">Active</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{totalSlots}</div>
            <div className="text-xs text-muted-foreground">Total Slots</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{totalUsed}</div>
            <div className="text-xs text-muted-foreground">Slots Used</div>
          </CardContent>
        </Card>
      </div>

      {/* Generate form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base text-primary">Generate New Passcode</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {Object.entries(TEST_TYPE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Slots</label>
              <input
                type="number"
                min={1}
                max={10000}
                value={maxUses}
                onChange={e => setMaxUses(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Expires (optional)</label>
              <input
                type="datetime-local"
                value={expiresAt}
                onChange={e => setExpiresAt(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <Button
              onClick={handleGenerate}
              disabled={generating}
              className="bg-primary hover:bg-primary/90 text-white h-10 mt-auto"
            >
              {generating ? "Generating..." : "Generate"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Passcodes table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base text-primary">All Passcodes</CardTitle>
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="flex h-8 w-40 rounded-lg border border-input bg-background px-2 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="all">All Types</option>
            {Object.entries(TEST_TYPE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Spinner className="h-6 w-6 text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No passcodes found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="pb-3 font-medium">Code</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Slots</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Expires</th>
                    <th className="pb-3 font-medium">Created</th>
                    <th className="pb-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p, i) => {
                    const st = getStatus(p);
                    const slotPct = p.maxUses > 0 ? (p.currentUses / p.maxUses) * 100 : 0;
                    const isExpired = p.expiresAt && new Date(p.expiresAt) < new Date();
                    return (
                      <tr key={i} className="border-b border-border/50">
                        <td className="py-3 font-mono font-bold text-sm">{p.code}</td>
                        <td className="py-3">
                          <Badge className={`text-xs ${TEST_TYPE_COLORS[p.testType] || ""}`}>
                            {TEST_TYPE_LABELS[p.testType] ?? p.testType}
                          </Badge>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium">{p.currentUses}/{p.maxUses}</span>
                            <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${slotPct >= 100 ? "bg-red-500" : slotPct >= 70 ? "bg-orange-500" : "bg-green-500"}`}
                                style={{ width: `${Math.min(100, slotPct)}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <Badge className={`text-xs ${st.color}`}>{st.label}</Badge>
                        </td>
                        <td className="py-3 text-xs text-muted-foreground">
                          {p.expiresAt
                            ? isExpired
                              ? <span className="text-red-600">Expired</span>
                              : new Date(p.expiresAt).toLocaleDateString()
                            : "\u2014"}
                        </td>
                        <td className="py-3 text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</td>
                        <td className="py-3">
                          <Button
                            variant={copiedCode === p.code ? "default" : "outline"}
                            size="sm"
                            onClick={() => copyCode(p.code)}
                            className="text-xs h-7"
                          >
                            {copiedCode === p.code ? "Copied" : "Copy"}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
