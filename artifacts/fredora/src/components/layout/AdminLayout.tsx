import { Link, useLocation } from "wouter";
import { LayoutDashboard, Home, Layers, MessageSquare, LogOut, Quote, Mail, Newspaper, BookOpen } from "lucide-react";
import { useGetAdminMe, useAdminLogout } from "@workspace/api-client-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { data: adminMe, isLoading, error } = useGetAdminMe();
  const logout = useAdminLogout();

  useEffect(() => {
    if (!isLoading && (!adminMe || !adminMe.loggedIn || error)) {
      setLocation("/admin/login");
    }
  }, [adminMe, isLoading, error, setLocation]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!adminMe?.loggedIn) {
    return null; // Will redirect via useEffect
  }

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        setLocation("/admin/login");
      }
    });
  };

  const links = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/homepage", label: "Homepage Content", icon: Home },
    { href: "/admin/divisions", label: "Divisions", icon: Layers },
    { href: "/admin/catalogue", label: "Catalogue", icon: BookOpen },
    { href: "/admin/messages", label: "Messages", icon: MessageSquare },
    { href: "/admin/news", label: "News & Blog", icon: Newspaper },
    { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
    { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
  ];

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r flex flex-col">
        <div className="h-16 flex items-center px-6 border-b">
          <span className="font-bold text-lg font-serif text-primary">Fredora Admin</span>
        </div>
        <nav className="flex-1 py-4 flex flex-col gap-1 px-3">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location === link.href || location.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
                  isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t">
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
          <div className="text-sm text-muted-foreground">Logged in as {adminMe.username}</div>
        </header>
        <div className="flex-1 p-8 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
