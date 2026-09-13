import { useState, useEffect } from "react";
import { AdminLayout } from "./AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
}

const EMPTY_FORM = { title: "", description: "", icon: "" };

export default function AdminFeatures() {
  const { toast } = useToast();
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Feature | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchFeatures = async () => {
    try {
      const r = await fetch("/api/admin/features");
      if (!r.ok) throw new Error();
      const data = await r.json();
      const list: Feature[] = Array.isArray(data) ? data : data.features ?? [];
      setFeatures(list.sort((a, b) => a.order - b.order));
    } catch {
      toast({ title: "Error", description: "Could not load features", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFeatures(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (f: Feature) => {
    setEditing(f);
    setForm({ title: f.title, description: f.description, icon: f.icon });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      toast({ title: "Validation", description: "Title and description are required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const url = editing ? `/api/admin/features/${editing.id}` : "/api/admin/features";
      const method = editing ? "PUT" : "POST";
      const r = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!r.ok) throw new Error();
      toast({ title: editing ? "Updated" : "Created", description: `Feature ${editing ? "updated" : "created"} successfully` });
      setDialogOpen(false);
      fetchFeatures();
    } catch {
      toast({ title: "Error", description: "Could not save feature", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const r = await fetch(`/api/admin/features/${deleteId}`, { method: "DELETE" });
      if (!r.ok) throw new Error();
      toast({ title: "Deleted", description: "Feature deleted" });
      setFeatures((prev) => prev.filter((f) => f.id !== deleteId));
    } catch {
      toast({ title: "Error", description: "Could not delete feature", variant: "destructive" });
    } finally {
      setDeleteId(null);
    }
  };

  const handleReorder = async (id: string, direction: "up" | "down") => {
    const idx = features.findIndex((f) => f.id === id);
    if (idx === -1) return;
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= features.length) return;

    const reordered = [...features];
    const [moved] = reordered.splice(idx, 1);
    reordered.splice(targetIdx, 0, moved);
    const updated = reordered.map((f, i) => ({ ...f, order: i }));
    setFeatures(updated);

    try {
      const r = await fetch("/api/admin/features/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: updated.map((f) => ({ id: f.id, order: f.order })) }),
      });
      if (!r.ok) throw new Error();
    } catch {
      toast({ title: "Error", description: "Could not reorder", variant: "destructive" });
      fetchFeatures();
    }
  };

  return (
    <AdminLayout title="Features">
      <div className="mb-6 flex justify-end">
        <Button onClick={openCreate} className="bg-primary hover:bg-primary/90 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Feature
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Spinner className="h-6 w-6 text-primary" />
            </div>
          ) : features.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-muted-foreground">No features found.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Icon</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {features.map((feat, idx) => (
                  <TableRow key={feat.id}>
                    <TableCell className="font-medium text-muted-foreground">{idx + 1}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs">
                        {feat.icon || "—"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{feat.title}</TableCell>
                    <TableCell className="hidden md:table-cell max-w-xs truncate">
                      {feat.description.length > 80 ? feat.description.slice(0, 80) + "…" : feat.description}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-0.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={idx === 0}
                          onClick={() => handleReorder(feat.id, "up")}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={idx === features.length - 1}
                          onClick={() => handleReorder(feat.id, "down")}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openEdit(feat)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteId(feat.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Feature" : "Add Feature"}</DialogTitle>
            <DialogDescription>
              {editing ? "Update the feature details below." : "Fill in the details for the new feature."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Title</label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Personality Insights"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Description</label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Discover your unique personality profile..."
                rows={4}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Icon Name</label>
              <Input
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                placeholder="Brain"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Lucide icon name (e.g. Brain, Heart, Sparkles, Shield)
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-primary hover:bg-primary/90 text-white">
              {saving ? "Saving..." : editing ? "Save Changes" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => { if (!open) setDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Feature?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The feature will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-white hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
