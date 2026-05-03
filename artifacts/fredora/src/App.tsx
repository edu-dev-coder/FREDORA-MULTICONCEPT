import { Switch, Route, Router as WouterRouter } from "wouter";
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
import { WhatsAppButton } from "@/components/WhatsAppButton";

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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/divisions/:slug" component={DivisionDetail} />
      <Route path="/news" component={News} />
      <Route path="/news/:slug" component={NewsDetail} />
      <Route path="/catalogue" component={Catalogue} />
      
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/homepage" component={AdminHomepage} />
      <Route path="/admin/divisions" component={AdminDivisions} />
      <Route path="/admin/divisions/:slug" component={AdminDivisionEdit} />
      <Route path="/admin/messages" component={AdminMessages} />
      <Route path="/admin/news" component={AdminNews} />
      <Route path="/admin/testimonials" component={AdminTestimonials} />
      <Route path="/admin/newsletter" component={AdminNewsletter} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AnalyticsInjector />
          <Router />
          <WhatsAppButton />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
