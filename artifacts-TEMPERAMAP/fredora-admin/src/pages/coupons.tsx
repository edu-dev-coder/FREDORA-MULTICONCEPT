import { useState } from "react";
import { useListAdminCoupons, getListAdminCouponsQueryKey, useCreateAdminCoupon, useUpdateAdminCoupon, useDeleteAdminCoupon } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNigerianDate } from "@/lib/utils";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function CreateCouponDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ code: "", discountPercent: "10", maxUses: "", expiresAt: "" });
  const { mutate: create, isPending } = useCreateAdminCoupon();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    create({
      data: {
        code: form.code.trim(),
        discountPercent: Number(form.discountPercent),
        maxUses: form.maxUses ? Number(form.maxUses) : undefined,
        expiresAt: form.expiresAt || undefined,
      }
    }, {
      onSuccess: () => {
        setOpen(false);
        setForm({ code: "", discountPercent: "10", maxUses: "", expiresAt: "" });
        onSuccess();
        toast({ title: "Coupon created", description: `Code ${form.code.toUpperCase()} is ready to use.` });
      },
      onError: () => toast({ title: "Error", description: "Failed to create coupon.", variant: "destructive" }),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="flex items-center gap-2"><Plus className="h-4 w-4" />New Coupon</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Coupon Code</DialogTitle>
          <DialogDescription>Create a discount code for marketing campaigns.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Code</Label>
            <Input placeholder="e.g. WELCOME20" value={form.code} onChange={(e) => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Discount %</Label>
              <Input type="number" min="1" max="100" value={form.discountPercent} onChange={(e) => setForm(f => ({ ...f, discountPercent: e.target.value }))} required />
            </div>
            <div className="space-y-1.5">
              <Label>Max Uses (blank = unlimited)</Label>
              <Input type="number" min="1" placeholder="Unlimited" value={form.maxUses} onChange={(e) => setForm(f => ({ ...f, maxUses: e.target.value }))} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Expiry Date (optional)</Label>
            <Input type="date" value={form.expiresAt} onChange={(e) => setForm(f => ({ ...f, expiresAt: e.target.value }))} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isPending}>{isPending ? "Creating..." : "Create Coupon"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function CouponsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: coupons, isLoading, isError } = useListAdminCoupons({
    query: { queryKey: getListAdminCouponsQueryKey() }
  });

  const { mutate: updateCoupon } = useUpdateAdminCoupon();
  const { mutate: deleteCoupon } = useDeleteAdminCoupon();

  const refresh = () => queryClient.invalidateQueries({ queryKey: getListAdminCouponsQueryKey() });

  const toggleActive = (id: string, isActive: boolean) => {
    updateCoupon({ id, data: { isActive: !isActive } }, {
      onSuccess: refresh,
      onError: () => toast({ title: "Error", description: "Failed to update coupon.", variant: "destructive" }),
    });
  };

  const handleDelete = (id: string, code: string) => {
    if (!window.confirm(`Delete coupon "${code}"? This cannot be undone.`)) return;
    deleteCoupon({ id }, {
      onSuccess: () => { refresh(); toast({ title: "Coupon deleted" }); },
      onError: () => toast({ title: "Error", description: "Failed to delete coupon.", variant: "destructive" }),
    });
  };

  const isExpired = (expiresAt: string | null) => expiresAt ? new Date(expiresAt) < new Date() : false;

  if (isError) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-destructive">Failed to load coupons</h2>
          <p className="text-sm text-muted-foreground">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Coupon Codes</h1>
          <p className="text-muted-foreground">Create and manage promotional discount codes.</p>
        </div>
        <CreateCouponDialog onSuccess={refresh} />
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Tag className="h-5 w-5 text-primary" />All Coupons</CardTitle>
          <CardDescription>Discount codes for promotional campaigns.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Uses</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!coupons || coupons.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="h-24 text-center text-muted-foreground">No coupons yet. Create your first promotional code.</TableCell></TableRow>
                ) : (
                  coupons.map((coupon) => {
                    const expired = isExpired(coupon.expiresAt ?? null);
                    return (
                      <TableRow key={coupon.id}>
                        <TableCell className="font-mono font-bold text-sm tracking-wide">{coupon.code}</TableCell>
                        <TableCell>
                          <Badge className="bg-[#C8961E]/10 text-[#C8961E] border-[#C8961E]/20" variant="outline">
                            {coupon.discountPercent}% off
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{coupon.usedCount} / {coupon.maxUses ?? '∞'}</span>
                          {coupon.maxUses && coupon.usedCount >= coupon.maxUses && (
                            <Badge variant="outline" className="ml-2 text-xs bg-red-500/10 text-red-600 border-red-500/20">Exhausted</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {coupon.expiresAt ? (
                            <span className={`text-sm ${expired ? 'text-red-500' : 'text-muted-foreground'}`}>
                              {formatNigerianDate(coupon.expiresAt)}
                              {expired && ' (expired)'}
                            </span>
                          ) : <span className="text-sm text-muted-foreground">Never</span>}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch checked={coupon.isActive && !expired} onCheckedChange={() => toggleActive(coupon.id, coupon.isActive)} disabled={expired} />
                            <span className="text-xs text-muted-foreground">{coupon.isActive && !expired ? "Active" : "Inactive"}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{formatNigerianDate(coupon.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(coupon.id, coupon.code)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
