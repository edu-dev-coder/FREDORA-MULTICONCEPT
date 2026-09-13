import { Link } from "wouter";
import { useGetAdminStats, getGetAdminStatsQueryKey } from "@workspace/api-client-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers, MessageSquare, Briefcase, MailWarning, ShoppingBag, Images, Star, Users } from "lucide-react";

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
    { title: "Total Divisions", value: stats?.totalDivisions ?? 0, icon: Layers, color: "text-blue-500" },
    { title: "Products & Services", value: stats?.totalServices ?? 0, icon: Briefcase, color: "text-purple-500" },
    { title: "Product Catalog", value: stats?.totalProducts ?? 0, icon: ShoppingBag, color: "text-indigo-500" },
    { title: "Gallery Photos", value: stats?.totalGalleryItems ?? 0, icon: Images, color: "text-cyan-500" },
    { title: "Testimonials", value: stats?.totalTestimonials ?? 0, icon: Star, color: "text-yellow-500" },
    { title: "Newsletter Subscribers", value: stats?.totalSubscribers ?? 0, icon: Users, color: "text-green-500" },
    { title: "Total Messages", value: stats?.totalMessages ?? 0, icon: MessageSquare, color: "text-slate-500" },
    { title: "Unread Messages", value: stats?.unreadMessages ?? 0, icon: MailWarning, color: "text-amber-500" },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground">Dashboard Overview</h2>
        <p className="text-muted-foreground">Welcome back to the Fredora Admin Panel.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* TemperaMap Assessment Subsystem Banner */}
      <div className="mt-8">
        <Card className="border-[#1B3A6B]/20 bg-gradient-to-r from-[#1B3A6B]/5 to-amber-500/5">
          <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-lg text-primary flex items-center gap-2">
                🧠 TemperaMap Assessment System
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Manage personality assessments, passcodes, test sessions, users, testimonials, and corporate teams.
              </p>
            </div>
            <Link
              href="/temperamap/admin/dashboard"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-colors shrink-0"
            >
              Open TemperaMap Admin ↗
            </Link>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
