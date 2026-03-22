import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { OnboardingFlow } from "../components/OnboardingFlow";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../integrations/supabase/client";

export default function OnboardingPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Check if user already has products
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["products", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("products")
        .select("id")
        .eq("user_id", user.id);
      return data || [];
    },
    enabled: !!user,
  });

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth", { replace: true });
    }
  }, [user, loading, navigate]);

  // Redirect to dashboard if user already has products
  useEffect(() => {
    if (!productsLoading && products && products.length > 0) {
      navigate("/dashboard", { replace: true });
    }
  }, [products, productsLoading, navigate]);

  if (loading || productsLoading) {
    return (
      <div className="min-h-screen w-full bg-[#FAFAFA] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C2410C]" />
      </div>
    );
  }

  if (!user) return null;

  return <OnboardingFlow />;
}
