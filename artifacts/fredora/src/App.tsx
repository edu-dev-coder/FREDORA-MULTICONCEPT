import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Home from "@/pages/Home";
import About from "@/pages/About";
import DivisionDetail from "@/pages/DivisionDetail";
import Contact from "@/pages/Contact";
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminHomepage from "@/pages/admin/Homepage";
import AdminDivisions from "@/pages/admin/Divisions";
import AdminDivisionEdit from "@/pages/admin/DivisionEdit";
import AdminMessages from "@/pages/admin/Messages";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/divisions/:slug" component={DivisionDetail} />
      
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/homepage" component={AdminHomepage} />
      <Route path="/admin/divisions" component={AdminDivisions} />
      <Route path="/admin/divisions/:slug" component={AdminDivisionEdit} />
      <Route path="/admin/messages" component={AdminMessages} />
      
      <Route component={NotFound} />
    </Switch>
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
