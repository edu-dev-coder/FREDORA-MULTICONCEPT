import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { AdminLayout } from "./AdminLayout";
import { Spinner } from "@/components/ui/spinner";
import { Trash2, AlertTriangle } from "lucide-react";

interface TableInfo {
  name: string;
  label: string;
  count: number;
  description: string;
}

export default function DataManagement() {
  const { toast } = useToast();
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState<string | null>(null);

  const fetchCounts = async () => {
    setLoading(true);
    try {
      const [testRes, faqRes, featRes] = await Promise.all([
        fetch("/api/admin/testimonials"),
        fetch("/api/admin/faqs"),
        fetch("/api/admin/features"),
      ]);
      const testimonials = testRes.ok ? await testRes.json() : [];
      const faqs = faqRes.ok ? await faqRes.json() : [];
      const features = featRes.ok ? await featRes.json() : [];
      setTables([
        { name: "testimonials", label: "Testimonials", count: Array.isArray(testimonials) ? testimonials.length : 0, description: "Customer reviews and quotes" },
        { name: "faqs", label: "FAQs", count: Array.isArray(faqs) ? faqs.length : 0, description: "Frequently asked questions" },
        { name: "features", label: "Features", count: Array.isArray(features) ? features.length : 0, description: "Product feature highlights" },
      ]);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCounts(); }, []);

  const handleClear = async (tableName: string, label: string) => {
    if (!window.confirm(`Delete ALL ${label}? This cannot be undone.`)) return;
    setClearing(tableName);
    try {
      const r = await fetch(`/api/admin/${tableName}/all`, { method: "DELETE" });
      if (!r.ok) throw new Error("Failed");
      toast({ title: "Cleared", description: `All ${label} deleted` });
      setTables(prev => prev.map(t => t.name === tableName ? { ...t, count: 0 } : t));
    } catch {
      toast({ title: "Error", description: `Could not clear ${label}`, variant: "destructive" });
    } finally {
      setClearing(null);
    }
  };

  return (
    <AdminLayout title="Data Management">
      <p className="text-sm text-muted-foreground mb-6">
        Clear demo/seed data to free up Supabase storage. User accounts, passcodes, and test sessions are never affected.
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner className="h-6 w-6 text-primary" />
        </div>
      ) : (
        <div className="space-y-4">
          {tables.map(t => (
            <Card key={t.name}>
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-foreground">{t.label}</h3>
                    <Badge className={t.count > 0 ? "bg-amber-100 text-amber-700 border-amber-200" : "bg-green-100 text-green-700 border-green-200"}>
                      {t.count} {t.count === 1 ? "item" : "items"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{t.description}</p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={t.count === 0 || clearing === t.name}
                  onClick={() => handleClear(t.name, t.label)}
                  className="shrink-0"
                >
                  {clearing === t.name ? (
                    <Spinner className="h-4 w-4" />
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Clear All
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}

          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="flex items-start gap-3 p-5">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="font-semibold text-amber-800">What's safe to delete</p>
                <p className="text-amber-700 mt-1">
                  Testimonials, FAQs, and Features are demo content. The frontend displays hardcoded versions when these tables are empty.
                  Users, passcodes, and test sessions are never deleted from this page.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </AdminLayout>
  );
}
