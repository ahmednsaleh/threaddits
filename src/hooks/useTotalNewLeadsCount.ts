import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

export function useTotalNewLeadsCount() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["total-new-leads-count", user?.id],
    queryFn: async (): Promise<number> => {
      if (!user?.id) return 0;

      // Use server-side RPC that enforces tier-based limits
      const { data, error } = await supabase.rpc("get_leads_count_for_user", {
        p_min_intent_score: 6,
      });

      if (error) {
        console.error("Error fetching new leads count:", error);
        return 0;
      }

      return data ?? 0;
    },
    enabled: !!user?.id,
    staleTime: 30000,
  });

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel("sidebar-leads-count")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "leads",
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: ["total-new-leads-count"],
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  return query;
}
