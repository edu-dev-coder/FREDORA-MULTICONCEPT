import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import FrederaLogo from "@/components/FrederaLogo";
import {
  LayoutDashboard,
  KeyRound,
  Quote,
  HelpCircle,
  Sparkles,
  ClipboardList,
  Users,
  Settings,
  Building2,
  Database,
  Menu,
  X,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/temperamap/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/temperamap/admin/passcodes", label: "Passcodes", icon: KeyRound },
  { href: "/temperamap/admin/testimonials", label: "Testimonials", icon: Quote },
  { href: "/temperamap/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/temperamap/admin/features", label: "Features", icon: Sparkles },
  { href: "/temperamap/admin/sessions", label: "Sessions", icon: ClipboardList },
  { href: "/temperamap/admin/users", label: "Users", icon: Users },
  { href: "/temperamap/admin/corporate", label: "Corporate", icon: Building2 },
  { href: "/temperamap/admin/data", label: "Data Management", icon: Database },
  { href: "/temperamap/admin/settings", label: "Settings", icon: Settings },
];

export function AdminLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [location, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    setLocation("/temperamap");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top header */}
      <header className="sticky top-0 z-40 bg-primary text-white shadow-md">
        <div className="flex items-center h-14 px-4 justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-md hover:bg-white/10 transition-colors lg:hidden"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <FrederaLogo size="sm" onDark />
            <div className="h-4 w-px bg-white/20 hidden sm:block" />
            <span className="text-xs font-semibold text-white/90 hidden sm:inline">TemperaMap Admin</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/admin/dashboard"
              className="text-xs text-amber-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 transition-all font-semibold"
            >
              ← Fredora Admin
            </Link>
            <Link
              href="/temperamap"
              className="text-xs text-blue-200 hover:text-white hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all font-medium"
            >
              <ArrowLeft className="h-3 w-3" /> View Site
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-xs text-white/80 hover:text-white hover:bg-white/10 gap-1 rounded-full h-8 px-3"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:sticky top-14 lg:top-14 z-30
            h-[calc(100vh-3.5rem)]
            w-64 bg-white border-r border-border
            transform transition-transform duration-200 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            overflow-y-auto flex flex-col justify-between
          `}
        >
          <nav className="p-3 space-y-1">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">
              TemperaMap Controls
            </div>
            {NAV_ITEMS.map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${
                      isActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }
                  `}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t">
            <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Exit Admin
            </Button>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b">
              <div>
                <h1 className="text-2xl font-bold text-foreground">{title}</h1>
                <p className="text-xs text-muted-foreground mt-0.5">TemperaMap Psychometric & Assessment Management</p>
              </div>
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

