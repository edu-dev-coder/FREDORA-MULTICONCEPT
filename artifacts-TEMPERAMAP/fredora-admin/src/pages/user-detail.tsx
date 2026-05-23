import { useParams } from "wouter";
import { useGetAdminUser, getGetAdminUserQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatNigerianDate } from "@/lib/utils";
import { ArrowLeft, User, FileText, CreditCard, Download } from "lucide-react";
import { Link } from "wouter";

export default function UserDetailPage() {
  const { userId } = useParams<{ userId: string }>();

  const { data: user, isLoading, isError } = useGetAdminUser(userId!, {
    query: { queryKey: getGetAdminUserQueryKey(userId!) }
  });

  if (isLoading) return <UserDetailSkeleton />;

  if (isError || !user) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" asChild className="flex items-center gap-2">
          <Link href="/users"><ArrowLeft className="h-4 w-4" />Back to Users</Link>
        </Button>
        <div className="flex h-[40vh] items-center justify-center">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-destructive">User not found</h2>
            <p className="text-sm text-muted-foreground">This user does not exist or has been deleted.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" asChild size="sm">
          <Link href="/users" className="flex items-center gap-2"><ArrowLeft className="h-4 w-4" />Back to Users</Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{user.fullName || 'Unknown User'}</h1>
          <p className="text-muted-foreground">{user.email || 'No email'}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tests Taken</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{user.tests.length}</div></CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Payments Made</CardTitle>
            <CreditCard className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(user.payments.filter((p) => p.status === "success").reduce((sum, p) => sum + p.amount, 0))}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Reports</CardTitle>
            <Download className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{user.reports.length}</div></CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Joined</CardTitle>
            <User className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent><div className="text-sm font-bold mt-1">{formatNigerianDate(user.createdAt)}</div></CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Full Name", value: user.fullName },
            { label: "Email", value: user.email },
            { label: "Phone", value: user.phone },
            { label: "Age Group", value: user.ageGroup?.replace(/_/g, ' ') },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
              <p className="text-sm font-medium mt-1">{value || '—'}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Test History</CardTitle>
          <CardDescription>All temperament assessments taken by this user.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Blend</TableHead>
                <TableHead>Primary</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {user.tests.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="h-16 text-center text-muted-foreground">No tests taken yet.</TableCell></TableRow>
              ) : (
                user.tests.map((test) => (
                  <TableRow key={test.id}>
                    <TableCell className="font-mono text-xs">{test.id.substring(0, 8)}</TableCell>
                    <TableCell className="capitalize">{test.testType.replace(/_/g, ' ')}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        test.status === 'completed' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                        test.status === 'in_progress' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' :
                        'bg-muted text-muted-foreground'
                      }>{test.status.replace(/_/g, ' ')}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{test.blend || '—'}</TableCell>
                    <TableCell>{test.primaryTemp || '—'}</TableCell>
                    <TableCell>
                      {test.paid ? (
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">Paid</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-muted text-muted-foreground text-xs">Unpaid</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">{formatNigerianDate(test.createdAt)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>All transactions for this user.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {user.payments.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="h-16 text-center text-muted-foreground">No payments yet.</TableCell></TableRow>
              ) : (
                user.payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-mono text-xs">{payment.paystackRef || payment.id.substring(0, 8)}</TableCell>
                    <TableCell className="capitalize">{payment.product?.replace(/_/g, ' ') || '—'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        payment.status === 'success' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                        payment.status === 'pending' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' :
                        'bg-red-500/10 text-red-600 border-red-500/20'
                      }>{payment.status}</Badge>
                    </TableCell>
                    <TableCell>{formatNigerianDate(payment.createdAt)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(payment.amount)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function UserDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-40" />
      <div><Skeleton className="h-9 w-64 mb-2" /><Skeleton className="h-5 w-48" /></div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => <Card key={i} className="border-border"><CardHeader className="pb-2"><Skeleton className="h-4 w-24" /></CardHeader><CardContent><Skeleton className="h-8 w-20" /></CardContent></Card>)}
      </div>
      <Card className="border-border"><CardContent className="pt-6"><div className="space-y-4">{[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-12 w-full" />)}</div></CardContent></Card>
    </div>
  );
}
