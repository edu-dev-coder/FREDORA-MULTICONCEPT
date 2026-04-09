import { useGetAdminStats, getGetAdminStatsQueryKey } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers, MessageSquare, Briefcase, MailWarning } from "lucide-react";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useGetAdminStats({ query: { queryKey: getGetAdminStatsQueryKey() } });

  if (isLoading) {
    return (
      <AdminLayout>
        <div>Loading stats...</div>
      </AdminLayout>
    );
  }

  const statCards = [
    { title: "Total Divisions", value: stats?.totalDivisions || 0, icon: Layers, color: "text-blue-500" },
    { title: "Total Services", value: stats?.totalServices || 0, icon: Briefcase, color: "text-purple-500" },
    { title: "Total Messages", value: stats?.totalMessages || 0, icon: MessageSquare, color: "text-green-500" },
    { title: "Unread Messages", value: stats?.unreadMessages || 0, icon: MailWarning, color: "text-amber-500" },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground">Dashboard Overview</h2>
        <p className="text-muted-foreground">Welcome back to the Fredora Admin Panel.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </AdminLayout>
  );
}
