import { useState } from "react";
import { useListAdminLicenses, getListAdminLicensesQueryKey, useCreateAdminLicense, useUpdateAdminLicense } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { formatNigerianDate } from "@/lib/utils";
import { Plus, Key, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function randomKey() {
  return `LIC-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
}

function CreateLicenseDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    licenseKey: randomKey(),
    purchaserName: "", purchaserEmail: "", testType: "school_license",
    totalSeats: "10", expiresAt: "", notes: "",
  });
  const { mutate: create, isPending } = useCreateAdminLicense();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    create({
      data: {
        licenseKey: form.licenseKey,
        purchaserName: form.purchaserName || undefined,
        purchaserEmail: form.purchaserEmail || undefined,
        testType: form.testType,
        totalSeats: Number(form.totalSeats),
        expiresAt: form.expiresAt || undefined,
        notes: form.notes || undefined,
      }
    }, {
      onSuccess: () => {
        setOpen(false);
        setForm({ licenseKey: randomKey(), purchaserName: "", purchaserEmail: "", testType: "school_license", totalSeats: "10", expiresAt: "", notes: "" });
        onSuccess();
        toast({ title: "License created", description: `License key ${form.licenseKey} has been issued.` });
      },
      onError: () => toast({ title: "Error", description: "Failed to create license.", variant: "destructive" }),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="flex items-center gap-2"><Plus className="h-4 w-4" />Issue License</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Issue New License</DialogTitle>
          <DialogDescription>Create a bulk license for a school or organization.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>License Key</Label>
            <div className="flex gap-2">
              <Input value={form.licenseKey} onChange={(e) => setForm(f => ({ ...f, licenseKey: e.target.value }))} className="font-mono" required />
              <Button type="button" variant="outline" size="sm" onClick={() => setForm(f => ({ ...f, licenseKey: randomKey() }))}>Regenerate</Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Purchaser Name</Label>
              <Input placeholder="School / Org name" value={form.purchaserName} onChange={(e) => setForm(f => ({ ...f, purchaserName: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Purchaser Email</Label>
              <Input type="email" placeholder="contact@school.edu" value={form.purchaserEmail} onChange={(e) => setForm(f => ({ ...f, purchaserEmail: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Test Type</Label>
              <Select value={form.testType} onValueChange={(v) => setForm(f => ({ ...f, testType: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="school_license">School License</SelectItem>
                  <SelectItem value="corporate_team">Corporate Team</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Total Seats</Label>
              <Input type="number" min="1" value={form.totalSeats} onChange={(e) => setForm(f => ({ ...f, totalSeats: e.target.value }))} required />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Expiry Date (optional)</Label>
            <Input type="date" value={form.expiresAt} onChange={(e) => setForm(f => ({ ...f, expiresAt: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label>Notes (optional)</Label>
            <Input placeholder="Internal notes..." value={form.notes} onChange={(e) => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isPending}>{isPending ? "Creating..." : "Issue License"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditSeatsDialog({ license, onSuccess }: { license: { id: string; licenseKey: string; totalSeats: number; usedSeats: number }; onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [seats, setSeats] = useState(String(license.totalSeats));
  const [used, setUsed] = useState(String(license.usedSeats));
  const { mutate: update, isPending } = useUpdateAdminLicense();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    update({ id: license.id, data: { totalSeats: Number(seats), usedSeats: Number(used) } }, {
      onSuccess: () => { setOpen(false); onSuccess(); toast({ title: "License updated" }); },
      onError: () => toast({ title: "Error", description: "Failed to update license.", variant: "destructive" }),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm"><Pencil className="h-3.5 w-3.5" /></Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit License Seats</DialogTitle>
          <DialogDescription className="font-mono text-xs">{license.licenseKey}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Total Seats</Label>
              <Input type="number" min="1" value={seats} onChange={(e) => setSeats(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label>Used Seats</Label>
              <Input type="number" min="0" value={used} onChange={(e) => setUsed(e.target.value)} required />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isPending}>{isPending ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function LicensesPage() {
  const queryClient = useQueryClient();

  const { data: licenses, isLoading, isError } = useListAdminLicenses({
    query: { queryKey: getListAdminLicensesQueryKey() }
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: getListAdminLicensesQueryKey() });

  const isExpired = (expiresAt: string | null) => expiresAt ? new Date(expiresAt) < new Date() : false;

  if (isError) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-destructive">Failed to load licenses</h2>
          <p className="text-sm text-muted-foreground">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">License Management</h1>
          <p className="text-muted-foreground">Manage bulk licenses for schools and organizations.</p>
        </div>
        <CreateLicenseDialog onSuccess={refresh} />
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Key className="h-5 w-5 text-primary" />Active Licenses</CardTitle>
          <CardDescription>Track seat usage for all issued licenses.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>License Key</TableHead>
                  <TableHead>Purchaser</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Seats Used</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!licenses || licenses.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="h-24 text-center text-muted-foreground">No licenses issued yet.</TableCell></TableRow>
                ) : (
                  licenses.map((license) => {
                    const expired = isExpired(license.expiresAt ?? null);
                    const usedPct = license.totalSeats > 0 ? Math.round((license.usedSeats / license.totalSeats) * 100) : 0;
                    return (
                      <TableRow key={license.id}>
                        <TableCell className="font-mono text-xs font-bold">{license.licenseKey}</TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">{license.purchaserName || '—'}</div>
                          {license.purchaserEmail && <div className="text-xs text-muted-foreground">{license.purchaserEmail}</div>}
                        </TableCell>
                        <TableCell className="capitalize">
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">
                            {license.testType.replace(/_/g, ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell className="min-w-[140px]">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span>{license.usedSeats} / {license.totalSeats}</span>
                              <span className={usedPct >= 90 ? "text-red-600 font-bold" : "text-muted-foreground"}>{usedPct}%</span>
                            </div>
                            <Progress value={usedPct} className="h-1.5" />
                          </div>
                        </TableCell>
                        <TableCell>
                          {license.expiresAt ? (
                            <span className={`text-sm ${expired ? 'text-red-500' : 'text-muted-foreground'}`}>
                              {formatNigerianDate(license.expiresAt)}
                            </span>
                          ) : <span className="text-sm text-muted-foreground">Never</span>}
                        </TableCell>
                        <TableCell>
                          {expired ? (
                            <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20">Expired</Badge>
                          ) : usedPct >= 100 ? (
                            <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/20">Full</Badge>
                          ) : (
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Active</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <EditSeatsDialog license={license} onSuccess={refresh} />
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
