import {
  useGetAdminDashboard, getGetAdminDashboardQueryKey,
  useHealthCheck, getHealthCheckQueryKey,
  useGetRevenueTrend, getGetRevenueTrendQueryKey,
  useGetCompletionFunnel, getGetCompletionFunnelQueryKey,
} from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, CreditCard, Activity, TrendingUp, Filter } from "lucide-react";
import { formatCurrency, formatNigerianDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const TEMP_COLORS = {
  Sanguine: "#D4A017",
  Choleric: "#C0392B",
  Melancholic: "#1A5276",
  Phlegmatic: "#1E8449",
};

const FUNNEL_STEPS = [
  { key: "registered", label: "Registered", color: "#1B3A6B" },
  { key: "startedTest", label: "Started Test", color: "#2563EB" },
  { key: "paid", label: "Paid", color: "#C8961E" },
  { key: "completed", label: "Completed", color: "#16A34A" },
  { key: "downloadedPdf", label: "Downloaded PDF", color: "#7C3AED" },
];

export default function DashboardPage() {
  const { data: stats, isLoading, isError } = useGetAdminDashboard({
    query: { queryKey: getGetAdminDashboardQueryKey() }
  });
  const { data: health } = useHealthCheck({
    query: { queryKey: getHealthCheckQueryKey() }
  });
  const { data: revenueTrend } = useGetRevenueTrend({
    query: { queryKey: getGetRevenueTrendQueryKey() }
  });
  const { data: funnel } = useGetCompletionFunnel({
    query: { queryKey: getGetCompletionFunnelQueryKey() }
  });

  if (isLoading) return <DashboardSkeleton />;
  if (isError || !stats) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-destructive">Failed to load dashboard</h2>
          <p className="text-sm text-muted-foreground">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  const testsByTypeData = Object.entries(stats.testsByType).map(([name, value]) => ({
    name: name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value
  }));

  const temperamentData = Object.entries(stats.temperamentBreakdown).map(([name, value]) => ({ name, value }));

  const maxFunnelValue = funnel ? (funnel as Record<string, number>)[FUNNEL_STEPS[0].key] || 1 : 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Overview of platform metrics and recent activity.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Tests</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTests.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">+{stats.testsToday} today</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.revenueTotal)}</div>
            <p className="text-xs text-muted-foreground mt-1">+{formatCurrency(stats.revenueToday)} today</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">System Health</CardTitle>
            <Activity className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{health?.status || 'Operational'}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" />Monthly Revenue Trend</CardTitle>
          <CardDescription>Revenue from successful payments over the last 12 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] w-full">
            {revenueTrend && revenueTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `₦${(v / 100).toLocaleString()}`} />
                  <RechartsTooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                    formatter={(value: number) => [formatCurrency(value), "Revenue"]}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#C8961E" strokeWidth={2.5} dot={{ r: 4, fill: "#C8961E" }} name="Revenue" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-muted-foreground">No revenue data yet.</div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Filter className="h-5 w-5 text-primary" />Completion Funnel</CardTitle>
          <CardDescription>How users progress from registration to PDF download</CardDescription>
        </CardHeader>
        <CardContent>
          {funnel ? (
            <div className="space-y-3">
              {FUNNEL_STEPS.map((step, i) => {
                const value = (funnel as Record<string, number>)[step.key] ?? 0;
                const pct = maxFunnelValue > 0 ? Math.round((value / maxFunnelValue) * 100) : 0;
                const prevValue = i > 0 ? (funnel as Record<string, number>)[FUNNEL_STEPS[i - 1].key] ?? 0 : value;
                const dropOff = i > 0 && prevValue > 0 ? Math.round(((prevValue - value) / prevValue) * 100) : null;
                return (
                  <div key={step.key} className="flex items-center gap-4">
                    <div className="w-32 text-sm font-medium text-right text-muted-foreground">{step.label}</div>
                    <div className="flex-1 relative h-9 bg-muted rounded-md overflow-hidden">
                      <div
                        className="h-full rounded-md flex items-center px-3 transition-all duration-500"
                        style={{ width: `${Math.max(pct, 2)}%`, backgroundColor: step.color }}
                      >
                        <span className="text-white text-xs font-bold whitespace-nowrap">{value.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="w-16 text-right">
                      <span className="text-sm font-bold">{pct}%</span>
                      {dropOff !== null && dropOff > 0 && (
                        <div className="text-xs text-red-500">-{dropOff}%</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <Skeleton className="h-48 w-full" />
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-border bg-card">
          <CardHeader>
            <CardTitle>Tests by Type</CardTitle>
            <CardDescription>Distribution of completed assessments</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={testsByTypeData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip
                    cursor={{ fill: 'hsl(var(--muted))' }}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-border bg-card">
          <CardHeader>
            <CardTitle>Temperament Breakdown</CardTitle>
            <CardDescription>Primary temperament distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full flex items-center justify-center">
              {temperamentData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={temperamentData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                      {temperamentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={TEMP_COLORS[entry.name as keyof typeof TEMP_COLORS] || 'hsl(var(--primary))'} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-sm text-muted-foreground">No temperament data yet.</div>
              )}
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-2">
              {Object.entries(TEMP_COLORS).map(([name, color]) => (
                <div key={name} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-xs text-muted-foreground">{name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
          <CardDescription>Latest transactions across the platform.</CardDescription>
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
              {stats.recentPayments.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="h-24 text-center">No recent payments.</TableCell></TableRow>
              ) : (
                stats.recentPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-mono text-xs">{payment.paystackRef || payment.id.substring(0, 8)}</TableCell>
                    <TableCell>{payment.product?.replace(/_/g, ' ')}</TableCell>
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

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div><Skeleton className="h-9 w-48 mb-2" /><Skeleton className="h-5 w-72" /></div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-border"><CardHeader className="pb-2"><Skeleton className="h-4 w-24" /></CardHeader><CardContent><Skeleton className="h-8 w-20" /></CardContent></Card>
        ))}
      </div>
      <Card className="border-border"><CardHeader><Skeleton className="h-6 w-48 mb-2" /></CardHeader><CardContent><Skeleton className="h-[280px] w-full" /></CardContent></Card>
      <Card className="border-border"><CardHeader><Skeleton className="h-6 w-48 mb-2" /></CardHeader><CardContent><Skeleton className="h-48 w-full" /></CardContent></Card>
    </div>
  );
}
