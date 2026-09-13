import { Link, useLocation } from "wouter";
import { LayoutDashboard, Home, Layers, MessageSquare, LogOut, Quote, Mail, Newspaper, BookOpen, BrainCircuit } from "lucide-react";
import { useGetAdminMe, useAdminLogout } from "@workspace/api-client-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { data: adminMe, isLoading, error } = useGetAdminMe();
  const logout = useAdminLogout();
  const isSessionAuth = typeof window !== "undefined" && sessionStorage.getItem("admin_auth") === "true";

  useEffect(() => {
    if (!isLoading && !adminMe?.loggedIn && !isSessionAuth) {
      setLocation("/admin/login");
    }
  }, [adminMe, isLoading, isSessionAuth, setLocation]);

  if (isLoading && !isSessionAuth) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!adminMe?.loggedIn && !isSessionAuth) {
    return null; // Will redirect via useEffect
  }

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        sessionStorage.removeItem("admin_auth");
        setLocation("/admin/login");
      }
    });
  };

  const corporateLinks = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/homepage", label: "Homepage Content", icon: Home },
    { href: "/admin/divisions", label: "Divisions", icon: Layers },
    { href: "/admin/catalogue", label: "Catalogue", icon: BookOpen },
    { href: "/admin/messages", label: "Messages", icon: MessageSquare },
    { href: "/admin/news", label: "News & Blog", icon: Newspaper },
    { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
    { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
  ];

  const temperamapLinks = [
    { href: "/temperamap/admin/dashboard", label: "TM Analytics", icon: BrainCircuit },
    { href: "/temperamap/admin/passcodes", label: "Passcodes", icon: Layers },
    { href: "/temperamap/admin/sessions", label: "Test Sessions", icon: BookOpen },
    { href: "/temperamap/admin/users", label: "TM Users", icon: Home },
    { href: "/temperamap/admin/corporate", label: "Corporate Teams", icon: Layers },
    { href: "/temperamap/admin/testimonials", label: "TM Reviews", icon: Quote },
    { href: "/temperamap/admin/faqs", label: "TM FAQs", icon: MessageSquare },
    { href: "/temperamap/admin/features", label: "TM Features", icon: Newspaper },
    { href: "/temperamap/admin/data", label: "Data Management", icon: Mail },
    { href: "/temperamap/admin/settings", label: "Settings", icon: LayoutDashboard },
  ];

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r flex flex-col">
        <div className="h-16 flex items-center px-6 border-b shrink-0">
          <span className="font-bold text-lg font-serif text-primary">Fredora Admin</span>
        </div>
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {/* Fredora Corporate section */}
          <div>
            <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">
              Corporate Management
            </div>
            <nav className="flex flex-col gap-1">
              {corporateLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location === link.href || (link.href !== "/admin/dashboard" && location.startsWith(`${link.href}/`));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
                      isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* TemperaMap Assessment System section */}
          <div>
            <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              TemperaMap System
            </div>
            <nav className="flex flex-col gap-1">
              {temperamapLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location === link.href || location.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
                      isActive ? "bg-amber-600 text-white" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
        <div className="p-4 border-t shrink-0">
          <Button variant="ghost" className="w-full justify-start gap-3" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b bg-card flex items-center px-8 justify-between">
          <h1 className="font-semibold text-lg">Admin Control Panel</h1>
          <div className="text-sm text-muted-foreground">Logged in as {adminMe?.username || "admin"}</div>
        </header>
        <div className="flex-1 p-8 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
