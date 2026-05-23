import { useEffect, useRef } from "react";
import { ClerkProvider, SignIn, SignUp, Show, useClerk } from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { shadcn } from "@clerk/themes";
import { Switch, Route, useLocation, Router as WouterRouter, Redirect } from "wouter";
import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
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

const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);

const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
    socialButtonsPlacement: "bottom" as const,
  },
  variables: {
    colorPrimary: "#1B3A6B",
    colorForeground: "#1a2d52",
    colorMutedForeground: "#5a6a8a",
    colorDanger: "#dc2626",
    colorBackground: "#ffffff",
    colorInput: "#f1f3f7",
    colorInputForeground: "#1a2d52",
    colorNeutral: "#c8d0e0",
    fontFamily: "Inter, sans-serif",
    borderRadius: "0.5rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "bg-white rounded-2xl w-[440px] max-w-full overflow-hidden shadow-xl",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "text-[#1B3A6B] font-bold",
    headerSubtitle: "text-[#5a6a8a]",
    socialButtonsBlockButtonText: "text-[#1a2d52] font-medium",
    formFieldLabel: "text-[#1a2d52] font-medium",
    footerActionLink: "text-[#C8961E] font-semibold hover:text-[#a87818]",
    footerActionText: "text-[#5a6a8a]",
    dividerText: "text-[#5a6a8a]",
    identityPreviewEditButton: "text-[#C8961E]",
    formFieldSuccessText: "text-green-600",
    alertText: "text-[#1a2d52]",
    logoBox: "mb-2",
    logoImage: "h-10 w-auto",
    socialButtonsBlockButton: "border border-[#c8d0e0] hover:bg-gray-50 transition-colors",
    formButtonPrimary: "bg-[#1B3A6B] hover:bg-[#15305a] text-white font-semibold transition-colors",
    formFieldInput: "bg-[#f1f3f7] border-[#c8d0e0] text-[#1a2d52] focus:border-[#1B3A6B] focus:ring-[#1B3A6B]",
    footerAction: "bg-gray-50 border-t border-[#eaedf3]",
    dividerLine: "bg-[#e2e6ef]",
    alert: "border border-red-200 bg-red-50",
    otpCodeFieldInput: "border-[#c8d0e0] focus:border-[#1B3A6B]",
    formFieldRow: "gap-3",
    main: "px-8 py-6",
  },
};

function HomeRedirect() {
  return (
    <>
      <Show when="signed-in">
        <Redirect to="/dashboard" />
      </Show>
      <Show when="signed-out">
        <Landing />
      </Show>
    </>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Show when="signed-in">{children}</Show>
      <Show when="signed-out">
        <Redirect to="/sign-in" />
      </Show>
    </>
  );
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
        qc.clear();
      }
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, qc]);

  return null;
}

function AppRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: {
          start: {
            title: "Welcome back",
            subtitle: "Sign in to discover your temperament",
          },
        },
        signUp: {
          start: {
            title: "Begin your journey",
            subtitle: "Create an account to take the TemperaMap test",
          },
        },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <TooltipProvider>
          <Switch>
            <Route path="/" component={HomeRedirect} />
            <Route path="/sign-in/*?" component={SignInPage} />
            <Route path="/sign-up/*?" component={SignUpPage} />
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
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <AppRoutes />
    </WouterRouter>
  );
}

export default App;
