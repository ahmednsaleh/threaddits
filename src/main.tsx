import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import posthog from "posthog-js";
import App from "./App.tsx";
import "./index.css";

posthog.init("phc_LiabqvKxIWaKPl2IBCjODMFaufdS8LoBapPOeKdlVPO", {
  api_host: "https://us.i.posthog.com",
  person_profiles: "identified_only",
});

Sentry.init({
  dsn: "https://e9eaaaf2bd6857049e9a0a7af1cbc86b@o4510981903286272.ingest.de.sentry.io/4510981912592464",
  environment: import.meta.env.MODE,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

createRoot(document.getElementById("root")!).render(<App />);
