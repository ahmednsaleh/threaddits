import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./contexts/AuthContext";
import Homepage from "./pages/Homepage";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import LeadsPage from "./pages/LeadsPage";
import ProductsPage from "./pages/ProductsPage";
import EditProductPage from "./pages/EditProductPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import BlogPage from "./pages/BlogPage";
import GummySearchAlternative from "./pages/blog/GummySearchAlternative";
import BestRedditLeadGenTools from "./pages/blog/BestRedditLeadGenTools";
import RedditLeadGenForSaas from "./pages/blog/RedditLeadGenForSaas";
import { AppLayout } from "./components/AppLayout";
import OnboardingPage from "./pages/OnboardingPage";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route
                path="/blog/gummysearch-alternative"
                element={<GummySearchAlternative />}
              />
              <Route
                path="/blog/best-reddit-lead-generation-tools-2026"
                element={<BestRedditLeadGenTools />}
              />
              <Route
                path="/blog/reddit-lead-generation-for-saas"
                element={<RedditLeadGenForSaas />}
              />

              <Route path="/onboarding" element={<OnboardingPage />} />

              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/feed" element={<LeadsPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:id" element={<EditProductPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
