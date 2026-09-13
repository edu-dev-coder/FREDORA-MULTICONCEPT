import { useState, useEffect } from "react";
import { AdminLayout } from "./AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { ClipboardList, Users, KeyRound, CheckCircle2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface Stats {
  total: number;
  totalUsers: number;
  totalPasscodesUsed: number;
  totalPasscodesGenerated: number;
  byStatus: Record<string, number>;
  byType: Record<string, number>;
  temperamentDistribution: Record<string, number>;
}

const STAT_CARDS = [
  {
    key: "total" as const,
    label: "Total Tests",
    icon: ClipboardList,
    bg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    key: "totalUsers" as const,
    label: "Total Users",
    icon: Users,
    bg: "bg-blue-500/10",
    iconColor: "text-blue-600",
  },
  {
    key: "totalPasscodesUsed" as const,
    label: "Active Passcodes",
    icon: KeyRound,
    bg: "bg-amber-500/10",
    iconColor: "text-amber-600",
  },
  {
    key: "totalPasscodesGenerated" as const,
    label: "Tests Completed",
    icon: CheckCircle2,
    bg: "bg-emerald-500/10",
    iconColor: "text-emerald-600",
  },
];

const CHART_COLORS = ["#1B3A6B", "#C8961E", "#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444"];

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  paid: "Paid",
  in_progress: "In Progress",
  completed: "Completed",
};

const TYPE_LABELS: Record<string, string> = {
  child_3_5: "Ages 3-5",
  child_6_9: "Ages 6-9",
  preteen_10_12: "Ages 10-12",
  teen_13_17: "Ages 13-17",
  single_test: "Adult Test",
  couples_test: "Couples Test",
  corporate_team: "Corporate Team",
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/sessions/stats")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch stats");
        return r.json();
      })
      .then((data: Stats) => setStats(data))
      .catch(() => setError("Could not load dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  const barData = stats
    ? Object.entries(stats.byType).map(([key, value]) => ({
        name: TYPE_LABELS[key] ?? key,
        count: value,
      }))
    : [];

  const pieData = stats
    ? Object.entries(stats.byStatus).map(([key, value]) => ({
        name: STATUS_LABELS[key] ?? key,
        value,
      }))
    : [];

  return (
    <AdminLayout title="Dashboard">
      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-24 mb-3" />
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-3 w-20" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex items-center justify-center py-20">
            <Spinner className="h-8 w-8 text-primary" />
          </div>
        </div>
      ) : error ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      ) : stats ? (
        <div className="space-y-6">
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STAT_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <Card key={card.key}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{card.label}</p>
                        <p className="text-3xl font-bold text-foreground">
                          {stats[card.key]?.toLocaleString() ?? 0}
                        </p>
                      </div>
                      <div className={`p-3 rounded-xl ${card.bg}`}>
                        <Icon className={`h-6 w-6 ${card.iconColor}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar chart - temperament distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base text-primary">
                  Temperament Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                {barData.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No data available
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barData}>
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 11 }}
                        interval={0}
                        angle={-30}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                        {barData.map((_, index) => (
                          <Cell
                            key={index}
                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Pie chart - status breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base text-primary">
                  Test Status Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pieData.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No data available
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {pieData.map((_, index) => (
                          <Cell
                            key={index}
                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : null}
    </AdminLayout>
  );
}
