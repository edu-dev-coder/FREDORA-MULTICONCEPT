import { useState } from "react";
import { useListAdminRoles, getListAdminRolesQueryKey, useGrantAdminRole, useRevokeAdminRole } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, UserPlus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatNigerianDate } from "@/lib/utils";

function GrantRoleDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const { mutate: grant, isPending } = useGrantAdminRole();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    grant({ data: { userId: userId.trim() } }, {
      onSuccess: () => {
        setOpen(false);
        setUserId("");
        onSuccess();
        toast({ title: "Admin role granted", description: `User ${userId} now has admin access.` });
      },
      onError: () => toast({ title: "Error", description: "Failed to grant admin role. Make sure the user ID is correct.", variant: "destructive" }),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="flex items-center gap-2"><UserPlus className="h-4 w-4" />Grant Admin</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Grant Admin Role</DialogTitle>
          <DialogDescription>
            Enter the Clerk User ID of the person you want to make an admin. You can find this in their Clerk dashboard profile.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Clerk User ID</Label>
            <Input
              placeholder="user_2abc123..."
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="font-mono text-sm"
              required
            />
            <p className="text-xs text-muted-foreground">Format: user_xxxxxxxxxxxxxxxxxxxxxxxx</p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isPending || !userId.startsWith("user_")}>
              {isPending ? "Granting..." : "Grant Admin Role"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function RolesPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: admins, isLoading, isError } = useListAdminRoles({
    query: { queryKey: getListAdminRolesQueryKey() }
  });

  const { mutate: revoke } = useRevokeAdminRole();

  const refresh = () => queryClient.invalidateQueries({ queryKey: getListAdminRolesQueryKey() });

  const handleRevoke = (userId: string, email: string | null) => {
    if (!window.confirm(`Revoke admin access for ${email || userId}?`)) return;
    revoke({ userId }, {
      onSuccess: () => { refresh(); toast({ title: "Admin role revoked" }); },
      onError: () => toast({ title: "Error", description: "Failed to revoke admin role.", variant: "destructive" }),
    });
  };

  if (isError) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-destructive">Failed to load admin roles</h2>
          <p className="text-sm text-muted-foreground">Clerk may not be configured, or the secret key is missing.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Role Manager</h1>
          <p className="text-muted-foreground">Control who has access to this admin panel.</p>
        </div>
        <GrantRoleDialog onSuccess={refresh} />
      </div>

      <Card className="border-l-4 border-l-[#C8961E] bg-[#C8961E]/5 border-border">
        <CardContent className="pt-4 pb-3">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-[#C8961E] mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-semibold text-foreground">Admin privileges are managed via Clerk</p>
              <p className="text-muted-foreground mt-0.5">Admin role is stored in each user's public metadata. Users need to re-log in after role changes take effect.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-primary" />Admin Users</CardTitle>
          <CardDescription>Users with admin access to this panel.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!admins || admins.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="h-24 text-center text-muted-foreground">No admins found.</TableCell></TableRow>
                ) : (
                  admins.map((admin) => (
                    <TableRow key={admin.userId}>
                      <TableCell className="font-medium">{admin.email || '—'}</TableCell>
                      <TableCell>{admin.fullName || '—'}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{admin.userId}</TableCell>
                      <TableCell>
                        <Badge className="bg-[#1B3A6B]/10 text-[#1B3A6B] border-[#1B3A6B]/30" variant="outline">
                          <Shield className="h-3 w-3 mr-1" />
                          Admin
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRevoke(admin.userId, admin.email ?? null)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" />
                          Revoke
                        </Button>
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
