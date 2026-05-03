import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useListDivisions, useListProducts, useGetHomepage, useUpdateHomepage } from "@workspace/api-client-react";
import { Link } from "wouter";
import {
  ShoppingBag, Wrench, Plus, ExternalLink, Save, Info,
  BookOpen, Layers, ArrowRight,
} from "lucide-react";

const divisionAccent: Record<string, string> = {
  foods: "bg-blue-100 text-blue-700 border-blue-200",
  eduservices: "bg-sky-100 text-sky-700 border-sky-200",
  chems: "bg-violet-100 text-violet-700 border-violet-200",
  scents: "bg-pink-100 text-pink-700 border-pink-200",
  transport: "bg-amber-100 text-amber-700 border-amber-200",
};

function DivisionRow({ division }: { division: { slug: string; name: string; services: { id: number; name: string }[] } }) {
  const { data: products } = useListProducts({ divisionSlug: division.slug });
  const accent = divisionAccent[division.slug] ?? "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <div className="rounded-2xl border bg-card p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <h3 className="font-semibold text-base">{division.name}</h3>
          <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${accent}`}>
            {division.slug}
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <ShoppingBag className="h-3.5 w-3.5" />
            {products?.length ?? "—"} product{(products?.length ?? 0) !== 1 ? "s" : ""}
          </span>
          <span className="flex items-center gap-1.5">
            <Wrench className="h-3.5 w-3.5" />
            {division.services.length} service{division.services.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
      <div className="flex gap-2 shrink-0">
        <Button asChild size="sm" variant="outline" className="gap-1.5 rounded-full text-xs">
          <Link href={`/admin/divisions/${division.slug}`}>
            <Plus className="h-3.5 w-3.5" />
            Manage
          </Link>
        </Button>
        <Button asChild size="sm" variant="ghost" className="gap-1.5 rounded-full text-xs">
          <a href={`/catalogue`} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-3.5 w-3.5" />
            Preview
          </a>
        </Button>
      </div>
    </div>
  );
}

export default function AdminCatalogue() {
  const { toast } = useToast();
  const { data: divisions } = useListDivisions();
  const { data: homepage } = useGetHomepage();
  const updateHomepage = useUpdateHomepage();

  const [notes, setNotes] = useState<string | null>(null);
  const currentNotes = notes !== null ? notes : (homepage?.catalogueNotes ?? "");

  const handleSaveNotes = () => {
    updateHomepage.mutate(
      { data: { catalogueNotes: currentNotes || null } },
      {
        onSuccess: () => {
          setNotes(null);
          toast({ title: "Catalogue notes saved", description: "The update note is now visible on the catalogue page." });
        },
        onError: () => {
          toast({ title: "Error", description: "Could not save notes. Please try again.", variant: "destructive" });
        },
      }
    );
  };

  const activeDivisions = divisions?.filter((d) => !d.comingSoon) ?? [];
  const totalProducts = 0;
  const totalServices = divisions?.reduce((s, d) => s + (d.services?.length ?? 0), 0) ?? 0;

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-serif">Catalogue Management</h2>
              <p className="text-muted-foreground text-sm">
                Manage products, services, and catalogue-wide announcements
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="rounded-2xl border bg-card p-4 text-center">
            <Layers className="h-5 w-5 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary">{activeDivisions.length}</div>
            <div className="text-xs text-muted-foreground mt-0.5">Active Divisions</div>
          </div>
          <div className="rounded-2xl border bg-card p-4 text-center">
            <ShoppingBag className="h-5 w-5 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">
              {divisions?.reduce((s, d) => s, 0) ?? "—"}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">Products Listed</div>
          </div>
          <div className="rounded-2xl border bg-card p-4 text-center">
            <Wrench className="h-5 w-5 text-violet-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-violet-600">{totalServices}</div>
            <div className="text-xs text-muted-foreground mt-0.5">Services Listed</div>
          </div>
        </div>

        {/* Catalogue Update Notes */}
        <div className="rounded-2xl border bg-card p-6 mb-8">
          <div className="flex items-start gap-3 mb-4">
            <Info className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold text-base mb-0.5">Catalogue Update Notes</h3>
              <p className="text-sm text-muted-foreground">
                This message appears as a banner on the public catalogue page. Use it for announcements like pricing updates, new arrivals, or seasonal offers.
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <Label htmlFor="catalogueNotes">Update Note / Announcement</Label>
            <Textarea
              id="catalogueNotes"
              placeholder="e.g. New products now available! Prices are in NGN and subject to change. Contact us for bulk order discounts."
              value={currentNotes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Leave empty to hide the banner on the catalogue page.
              </p>
              <Button
                onClick={handleSaveNotes}
                disabled={updateHomepage.isPending || (notes === null)}
                className="gap-2 rounded-full"
                size="sm"
              >
                <Save className="h-4 w-4" />
                {updateHomepage.isPending ? "Saving…" : "Save Note"}
              </Button>
            </div>
          </div>
        </div>

        {/* Divisions & Content */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-base">Divisions in Catalogue</h3>
          <Button asChild size="sm" variant="outline" className="gap-1.5 rounded-full text-xs">
            <Link href="/admin/divisions">
              <Plus className="h-3.5 w-3.5" />
              Manage All Divisions
            </Link>
          </Button>
        </div>

        <div className="space-y-3">
          {activeDivisions.length === 0 ? (
            <div className="rounded-2xl border bg-muted/30 p-10 text-center text-muted-foreground">
              <Layers className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p>No active divisions yet.</p>
              <Button asChild size="sm" className="mt-4 rounded-full gap-1.5">
                <Link href="/admin/divisions">
                  <Plus className="h-4 w-4" />
                  Add Division
                </Link>
              </Button>
            </div>
          ) : (
            activeDivisions.map((d) => (
              <DivisionRow key={d.slug} division={d} />
            ))
          )}
        </div>

        {/* Quick link to public catalogue */}
        <div className="mt-8 rounded-2xl border bg-gradient-to-br from-primary/5 to-blue-50 p-5 flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-sm">View Public Catalogue</p>
            <p className="text-xs text-muted-foreground mt-0.5">See exactly what visitors see when they open the catalogue page.</p>
          </div>
          <Button asChild size="sm" className="rounded-full gap-2 shrink-0">
            <a href="/catalogue" target="_blank" rel="noopener noreferrer">
              Open Catalogue <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
