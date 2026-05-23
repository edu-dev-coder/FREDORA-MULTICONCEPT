import { useEffect } from "react";
import { Switch, Route, useLocation, Router as WouterRouter, Redirect } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Landing from "@/pages/Landing";
import SignInPage from "@/pages/SignInPage";
import SignUpPage from "@/pages/SignUpPage";
import SelectTest from "@/pages/SelectTest";
import Payment from "@/pages/Payment";
import TakeTest from "@/pages/TakeTest";
import Results from "@/pages/Results";
import Dashboard from "@/pages/Dashboard";
import InvitePartner from "@/pages/InvitePartner";
import JoinPartner from "@/pages/JoinPartner";
import Compatibility from "@/pages/Compatibility";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import NotFound from "@/pages/not-found";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function Spinner() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function HomeRedirect() {
  const { user, isLoading } = useAuth();
  if (isLoading) return <Spinner />;
  if (user) return <Redirect to="/dashboard" />;
  return <Landing />;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) setLocation("/sign-in");
  }, [user, isLoading, setLocation]);

  if (isLoading) return <Spinner />;
  if (!user) return null;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Switch>
          <Route path="/" component={HomeRedirect} />
          <Route path="/sign-in" component={SignInPage} />
          <Route path="/sign-up" component={SignUpPage} />
          <Route path="/terms" component={Terms} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/dashboard">
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          </Route>
          <Route path="/select-test">
            <ProtectedRoute><SelectTest /></ProtectedRoute>
          </Route>
          <Route path="/payment/:sessionId">
            <ProtectedRoute><Payment /></ProtectedRoute>
          </Route>
          <Route path="/test/:sessionId">
            <ProtectedRoute><TakeTest /></ProtectedRoute>
          </Route>
          <Route path="/results/:sessionId">
            <ProtectedRoute><Results /></ProtectedRoute>
          </Route>
          <Route path="/invite-partner/:sessionId">
            <ProtectedRoute><InvitePartner /></ProtectedRoute>
          </Route>
          <Route path="/join-partner/:sessionId" component={JoinPartner} />
          <Route path="/compatibility/:sessionId">
            <ProtectedRoute><Compatibility /></ProtectedRoute>
          </Route>
          <Route component={NotFound} />
        </Switch>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </WouterRouter>
  );
}

export default App;
