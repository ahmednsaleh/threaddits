import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface LeadMetrics {
  total: number;
  new: number;
  potential: number;
  topMatches: number;
}

export function useLeadMetrics(productId: string | null) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['lead-metrics', user?.id, productId],
    queryFn: async (): Promise<LeadMetrics> => {
      if (!user?.id || !productId) {
        return { total: 0, new: 0, potential: 0, topMatches: 0 };
      }

      // Fetch all counts in parallel
      const [totalResult, newResult, potentialResult, topMatchesResult] = await Promise.all([
        // Actionable leads (score >= 7)
        supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('product_id', productId)
          .gte('intent_score', 7),
        
        // New leads (status = 'New', score >= 7)
        supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('product_id', productId)
          .eq('status', 'New')
          .gte('intent_score', 7),
        
        // Potential leads (intent_score 7-8)
        supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('product_id', productId)
          .gte('intent_score', 7)
          .lte('intent_score', 8),
        
        // Hot leads (intent_score >= 9)
        supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('product_id', productId)
          .gte('intent_score', 9),
      ]);

      return {
        total: totalResult.count ?? 0,
        new: newResult.count ?? 0,
        potential: potentialResult.count ?? 0,
        topMatches: topMatchesResult.count ?? 0,
      };
    },
    enabled: !!user?.id && !!productId,
  });
}
