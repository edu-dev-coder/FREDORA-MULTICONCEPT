import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUser, SignIn } from "@clerk/react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { AdminLayout } from "@/components/layout/admin-layout";
import DashboardPage from "@/pages/dashboard";
import UsersPage from "@/pages/users";
import UserDetailPage from "@/pages/user-detail";
import TestsPage from "@/pages/tests";
import PaymentsPage from "@/pages/payments";
import ReportsPage from "@/pages/reports";
import CouponsPage from "@/pages/coupons";
import LicensesPage from "@/pages/licenses";
import RolesPage from "@/pages/roles";
import BroadcastPage from "@/pages/broadcast";

const queryClient = new QueryClient();

function AuthGate({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D1B4B]">
        <div className="w-8 h-8 border-4 border-[#C8961E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0D1B4B] gap-8 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#1B3A6B] border-2 border-[#C8961E] flex items-center justify-center">
            <span className="text-[#C8961E] font-black text-lg">F</span>
          </div>
          <div>
            <p className="text-white font-black text-xl tracking-wide">FREDORA</p>
            <p className="text-[#C8961E] text-xs font-bold tracking-widest">ADMIN PANEL</p>
          </div>
        </div>
        <SignIn routing="hash" />
      </div>
    );
  }

  const isAdmin = (user?.publicMetadata as { role?: string })?.role === "admin";

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0D1B4B] gap-6 p-4 text-center">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#1B3A6B] border-2 border-[#C8961E] flex items-center justify-center">
            <span className="text-[#C8961E] font-black text-lg">F</span>
          </div>
          <div>
            <p className="text-white font-black text-xl tracking-wide">FREDORA</p>
            <p className="text-[#C8961E] text-xs font-bold tracking-widest">ADMIN PANEL</p>
          </div>
        </div>
        <div className="bg-white/10 rounded-2xl p-8 max-w-sm w-full">
          <p className="text-4xl mb-4">🔒</p>
          <p className="text-white font-bold text-lg mb-2">Access Restricted</p>
          <p className="text-blue-200 text-sm mb-6">
            Your account ({user?.primaryEmailAddress?.emailAddress}) does not have admin privileges.
            Contact the platform administrator to request access.
          </p>
          <a
            href="/web/"
            className="inline-block bg-[#C8961E] text-white font-bold px-6 py-3 rounded-xl hover:bg-amber-600 transition-colors text-sm"
          >
            ← Back to App
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function Router() {
  return (
    <AuthGate>
      <AdminLayout>
        <Switch>
          <Route path="/" component={DashboardPage} />
          <Route path="/users" component={UsersPage} />
          <Route path="/users/:userId" component={UserDetailPage} />
          <Route path="/tests" component={TestsPage} />
          <Route path="/payments" component={PaymentsPage} />
          <Route path="/reports" component={ReportsPage} />
          <Route path="/coupons" component={CouponsPage} />
          <Route path="/licenses" component={LicensesPage} />
          <Route path="/roles" component={RolesPage} />
          <Route path="/broadcast" component={BroadcastPage} />
          <Route component={NotFound} />
        </Switch>
      </AdminLayout>
    </AuthGate>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
