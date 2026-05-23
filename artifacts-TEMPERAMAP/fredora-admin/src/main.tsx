import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import App from "./App";
import "./index.css";

const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);

if (!clerkPubKey) {
  throw new Error("Missing Clerk publishable key — set CLERK_PUBLISHABLE_KEY in environment secrets.");
}

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

createRoot(document.getElementById("root")!).render(
  <ClerkProvider
    publishableKey={clerkPubKey}
    routerPush={(to) => window.history.pushState(null, "", basePath + to)}
    routerReplace={(to) => window.history.replaceState(null, "", basePath + to)}
  >
    <App />
  </ClerkProvider>
);
