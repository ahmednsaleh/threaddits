import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";


export interface Lead {
  id: string;
  intent_score: number;
  source_subreddit: string;
  author: string;
  created_utc: string | null;
  post_title: string;
  post_content: string;
  post_url: string;
  relevance_summary: string | null;
  problem_statement_detail: string | null;
  urgency_signals_detail: string | null;
  competitors_mentioned: string | null;
  competitive_context_detail: string | null;
  buying_stage_detail: string | null;
  sentiment: string | null;
  status: string;
  user_feedback: string | null;
  is_solution_seeking: boolean | null;
  is_problem_focused: boolean | null;
  product_id: string | null;
  suggested_reply_hook: string | null;
}

export type TimeFilter = "Last 24h" | "Last Week" | "Last Month" | "All Time";
export type StatusFilter =
  | "Show All"
  | "New"
  | "Contacted"
  | "Won"
  | "Rejected";

interface UseLeadsParams {
  productId: string | null;
  statusFilter?: StatusFilter;
  timeFilter?: TimeFilter;
  searchQuery?: string;
  refetchInterval?: number | false;
}

function getTimeFilterDate(filter: TimeFilter): Date | null {
  const now = new Date();
  switch (filter) {
    case "Last 24h":
      return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    case "Last Week":
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case "Last Month":
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case "All Time":
    default:
      return null;
  }
}

export function useLeads({
  productId,
  statusFilter = "Show All",
  timeFilter = "All Time",
  searchQuery = "",
  refetchInterval = false,
}: UseLeadsParams) {
  const { user } = useAuth();

  return useQuery({
    queryKey: [
      "leads",
      user?.id,
      productId,
      statusFilter,
      timeFilter,
      searchQuery,
      subscriptionTier,
    ],
    queryFn: async (): Promise<Lead[]> => {
      if (!user?.id || !productId) return [];

      // Use server-side function that enforces lead limits based on subscription tier
      const timeDate = getTimeFilterDate(timeFilter);
      const { data, error } = await supabase.rpc("get_leads_for_user", {
        p_product_id: productId,
        p_status: statusFilter !== "Show All" ? statusFilter : null,
        p_time_after: timeDate ? timeDate.toISOString() : null,
        p_limit: 500,
      });

      if (error) throw error;

      // Apply search filter client-side (for title and content)
      let filteredData = data || [];
      if (searchQuery) {
        const lowerSearch = searchQuery.toLowerCase();
        filteredData = filteredData.filter(
          (lead) =>
            lead.post_title.toLowerCase().includes(lowerSearch) ||
            lead.post_content.toLowerCase().includes(lowerSearch),
        );
      }

      return filteredData;
    },
    enabled: !!user?.id && !!productId,
    refetchInterval,
  });
}
