import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import NotFound from "@/pages/not-found";

import Home from "@/pages/Home";
import About from "@/pages/About";
import DivisionDetail from "@/pages/DivisionDetail";
import Contact from "@/pages/Contact";
import News from "@/pages/News";
import NewsDetail from "@/pages/NewsDetail";
import Catalogue from "@/pages/Catalogue";
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminHomepage from "@/pages/admin/Homepage";
import AdminDivisions from "@/pages/admin/Divisions";
import AdminDivisionEdit from "@/pages/admin/DivisionEdit";
import AdminMessages from "@/pages/admin/Messages";
import AdminNews from "@/pages/admin/News";
import AdminTestimonials from "@/pages/admin/Testimonials";
import AdminNewsletter from "@/pages/admin/Newsletter";
import AdminCatalogue from "@/pages/admin/Catalogue";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CartProvider } from "@/contexts/CartContext";
import { CartDrawer } from "@/components/shop/CartDrawer";

// TemperaMap imports
import { AuthProvider, useAuth } from "@/context/AuthContext";
import TemperaMapLanding from "@/pages/temperamap/Landing";
import TemperaMapSignIn from "@/pages/temperamap/SignInPage";
import TemperaMapSignUp from "@/pages/temperamap/SignUpPage";
import TemperaMapDashboard from "@/pages/temperamap/Dashboard";
import TemperaMapSelectTest from "@/pages/temperamap/SelectTest";
import TemperaMapPayment from "@/pages/temperamap/Payment";
import TemperaMapTakeTest from "@/pages/temperamap/TakeTest";
import TemperaMapResults from "@/pages/temperamap/Results";
import TemperaMapInvitePartner from "@/pages/temperamap/InvitePartner";
import TemperaMapJoinPartner from "@/pages/temperamap/JoinPartner";
import TemperaMapCompatibility from "@/pages/temperamap/Compatibility";
import TemperaMapTerms from "@/pages/temperamap/Terms";
import TemperaMapPrivacy from "@/pages/temperamap/Privacy";

// TemperaMap Admin
import { AdminGate as TemperaMapAdminGate } from "@/pages/temperamap/admin/AdminGate";
import TemperaMapAdminDashboard from "@/pages/temperamap/admin/Dashboard";
import TemperaMapAdminPasscodes from "@/pages/temperamap/admin/Passcodes";
import TemperaMapAdminSessions from "@/pages/temperamap/admin/Sessions";
import TemperaMapAdminUsers from "@/pages/temperamap/admin/Users";
import TemperaMapAdminTestimonials from "@/pages/temperamap/admin/Testimonials";
import TemperaMapAdminFAQs from "@/pages/temperamap/admin/FAQs";
import TemperaMapAdminFeatures from "@/pages/temperamap/admin/Features";
import TemperaMapCorporateDashboard from "@/pages/temperamap/admin/CorporateDashboard";
import TemperaMapDataManagement from "@/pages/temperamap/admin/DataManagement";
import TemperaMapAdminSettings from "@/pages/temperamap/admin/Settings";

const queryClient = new QueryClient();

function AnalyticsInjector() {
  const { data: homepage } = useQuery({
    queryKey: ["homepage-analytics"],
    queryFn: async () => {
      const res = await fetch("/api/homepage");
      return res.json();
    },
    staleTime: Infinity,
  });

  useEffect(() => {
    const gaId = homepage?.googleAnalyticsId;
    if (!gaId || document.getElementById("ga-script")) return;

    const script1 = document.createElement("script");
    script1.id = "ga-script";
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script1);

    const script2 = document.createElement("script");
    script2.id = "ga-config";
    script2.innerHTML = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`;
    document.head.appendChild(script2);
  }, [homepage?.googleAnalyticsId]);

  return null;
}

function TemperaMapThemeController() {
  const [location] = useLocation();
  const isTemperaMap =
    location.startsWith("/temperamap") ||
    location === "/divisions/temperamap";

  useEffect(() => {
    if (isTemperaMap) {
      document.documentElement.setAttribute("data-theme", "temperamap");
      document.body.classList.add("temperamap-theme");
    } else {
      document.documentElement.removeAttribute("data-theme");
      document.body.classList.remove("temperamap-theme");
    }
  }, [isTemperaMap]);

  return null;
}

function TemperaMapProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  useEffect(() => {
    if (!isLoading && !user) {
      window.location.href = "/temperamap/sign-in";
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) return null;
  return <>{children}</>;
}

function TemperaMapProtectedOrAdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const isAdmin = typeof window !== "undefined" && sessionStorage.getItem("admin_auth") === "true";

  useEffect(() => {
    if (!isLoading && !user && !isAdmin) {
      window.location.href = "/temperamap/sign-in";
    }
  }, [user, isLoading, isAdmin]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!user && !isAdmin) return null;
  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      {/* Corporate Fredora Routes */}
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/divisions/temperamap" component={TemperaMapLanding} />
      <Route path="/divisions/:slug" component={DivisionDetail} />
      <Route path="/news" component={News} />
      <Route path="/news/:slug" component={NewsDetail} />
      <Route path="/catalogue" component={Catalogue} />

      {/* Fredora Admin Routes */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/homepage" component={AdminHomepage} />
      <Route path="/admin/divisions" component={AdminDivisions} />
      <Route path="/admin/divisions/:slug" component={AdminDivisionEdit} />
      <Route path="/admin/messages" component={AdminMessages} />
      <Route path="/admin/news" component={AdminNews} />
      <Route path="/admin/testimonials" component={AdminTestimonials} />
      <Route path="/admin/newsletter" component={AdminNewsletter} />
      <Route path="/admin/catalogue" component={AdminCatalogue} />

      {/* TemperaMap Assessment Subsystem Routes */}
      <Route path="/temperamap" component={TemperaMapLanding} />
      <Route path="/temperamap/sign-in" component={TemperaMapSignIn} />
      <Route path="/temperamap/sign-up" component={TemperaMapSignUp} />
      <Route path="/temperamap/terms" component={TemperaMapTerms} />
      <Route path="/temperamap/privacy" component={TemperaMapPrivacy} />

      <Route path="/temperamap/dashboard">
        <TemperaMapProtectedRoute><TemperaMapDashboard /></TemperaMapProtectedRoute>
      </Route>
      <Route path="/temperamap/select-test">
        <TemperaMapProtectedRoute><TemperaMapSelectTest /></TemperaMapProtectedRoute>
      </Route>
      <Route path="/temperamap/payment/:sessionId">
        <TemperaMapProtectedRoute><TemperaMapPayment /></TemperaMapProtectedRoute>
      </Route>
      <Route path="/temperamap/test/:sessionId">
        <TemperaMapProtectedRoute><TemperaMapTakeTest /></TemperaMapProtectedRoute>
      </Route>
      <Route path="/temperamap/results/:sessionId">
        <TemperaMapProtectedRoute><TemperaMapResults /></TemperaMapProtectedRoute>
      </Route>
      <Route path="/temperamap/invite-partner/:sessionId">
        <TemperaMapProtectedRoute><TemperaMapInvitePartner /></TemperaMapProtectedRoute>
      </Route>
      <Route path="/temperamap/join-partner/:sessionId" component={TemperaMapJoinPartner} />
      <Route path="/temperamap/compatibility/:sessionId">
        <TemperaMapProtectedOrAdminRoute><TemperaMapCompatibility /></TemperaMapProtectedOrAdminRoute>
      </Route>

      {/* TemperaMap Admin Subsystem Routes */}
      <Route path="/temperamap/admin">
        {() => { window.location.href = "/temperamap/admin/dashboard"; return null; }}
      </Route>
      <Route path="/temperamap/admin/dashboard">
        <TemperaMapAdminGate><TemperaMapAdminDashboard /></TemperaMapAdminGate>
      </Route>
      <Route path="/temperamap/admin/passcodes">
        <TemperaMapAdminGate><TemperaMapAdminPasscodes /></TemperaMapAdminGate>
      </Route>
      <Route path="/temperamap/admin/testimonials">
        <TemperaMapAdminGate><TemperaMapAdminTestimonials /></TemperaMapAdminGate>
      </Route>
      <Route path="/temperamap/admin/faqs">
        <TemperaMapAdminGate><TemperaMapAdminFAQs /></TemperaMapAdminGate>
      </Route>
      <Route path="/temperamap/admin/features">
        <TemperaMapAdminGate><TemperaMapAdminFeatures /></TemperaMapAdminGate>
      </Route>
      <Route path="/temperamap/admin/sessions">
        <TemperaMapAdminGate><TemperaMapAdminSessions /></TemperaMapAdminGate>
      </Route>
      <Route path="/temperamap/admin/results/:sessionId">
        <TemperaMapAdminGate><TemperaMapResults /></TemperaMapAdminGate>
      </Route>
      <Route path="/temperamap/admin/users">
        <TemperaMapAdminGate><TemperaMapAdminUsers /></TemperaMapAdminGate>
      </Route>
      <Route path="/temperamap/admin/corporate">
        <TemperaMapAdminGate><TemperaMapCorporateDashboard /></TemperaMapAdminGate>
      </Route>
      <Route path="/temperamap/admin/data">
        <TemperaMapAdminGate><TemperaMapDataManagement /></TemperaMapAdminGate>
      </Route>
      <Route path="/temperamap/admin/settings">
        <TemperaMapAdminGate><TemperaMapAdminSettings /></TemperaMapAdminGate>
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <AnalyticsInjector />
            <TemperaMapThemeController />
            <AuthProvider>
              <Router />
            </AuthProvider>
            <WhatsAppButton />
            <CartDrawer />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
