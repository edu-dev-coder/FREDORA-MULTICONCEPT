import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarRail, SidebarTrigger } from "@/components/ui/sidebar";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Users, FileText, CreditCard, FileOutput, LogOut, Tag, Key, Shield, Megaphone } from "lucide-react";
import { useClerk, useUser } from "@clerk/react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { signOut } = useClerk();
  const { user } = useUser();

  const mainNavigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Users", href: "/users", icon: Users },
    { name: "Tests", href: "/tests", icon: FileText },
    { name: "Payments", href: "/payments", icon: CreditCard },
    { name: "Reports", href: "/reports", icon: FileOutput },
  ];

  const toolsNavigation = [
    { name: "Licenses", href: "/licenses", icon: Key },
    { name: "Coupons", href: "/coupons", icon: Tag },
    { name: "Broadcast", href: "/broadcast", icon: Megaphone },
    { name: "Admin Roles", href: "/roles", icon: Shield },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r border-sidebar-border">
          <SidebarHeader className="p-4">
            <div className="flex items-center gap-2 px-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1B3A6B] flex-shrink-0">
                <span className="text-[#C8961E] font-black text-base leading-none">F</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-sm font-black tracking-wide text-sidebar-foreground">FREDORA</span>
                <span className="text-[10px] font-bold tracking-widest text-[#C8961E]">ADMIN PANEL</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-sidebar-foreground/70">Overview</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {mainNavigation.map((item) => {
                    const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
                    return (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild isActive={isActive} tooltip={item.name}>
                          <Link href={item.href} className="flex items-center gap-3">
                            <item.icon className="h-4 w-4" />
                            <span>{item.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-sidebar-foreground/70">Tools</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {toolsNavigation.map((item) => {
                    const isActive = location === item.href || location.startsWith(item.href);
                    return (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton asChild isActive={isActive} tooltip={item.name}>
                          <Link href={item.href} className="flex items-center gap-3">
                            <item.icon className="h-4 w-4" />
                            <span>{item.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarRail />
        </Sidebar>

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
          <header className="flex h-14 items-center gap-4 border-b bg-card px-6 lg:h-[60px]">
            <SidebarTrigger />
            <div className="flex-1" />
            <div className="flex items-center gap-3">
              {user && (
                <span className="text-sm text-muted-foreground hidden sm:block">
                  {user.primaryEmailAddress?.emailAddress}
                </span>
              )}
              <a href="/web/" className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">← App</a>
              <button
                onClick={() => signOut({ redirectUrl: "/admin/" })}
                className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-red-600 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </button>
            </div>
          </header>
          <div className="flex-1 p-6 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
