import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface LeadMetrics {
  total: number;
  hotLeads: number;
  avgScore: number;
  newThisWeek: number;
}

export function useLeadMetrics(productId: string | null) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['lead-metrics', user?.id, productId],
    queryFn: async (): Promise<LeadMetrics> => {
      if (!user?.id || !productId) {
        return { total: 0, hotLeads: 0, avgScore: 0, newThisWeek: 0 };
      }

      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

      const [totalResult, hotLeadsResult, scoresResult, newThisWeekResult] = await Promise.all([
        supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('product_id', productId)
          .gte('intent_score', 7),

        supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('product_id', productId)
          .gte('intent_score', 9),

        supabase
          .from('leads')
          .select('intent_score')
          .eq('user_id', user.id)
          .eq('product_id', productId)
          .gte('intent_score', 7),

        supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('product_id', productId)
          .gte('intent_score', 7)
          .gte('created_at', oneWeekAgo),
      ]);

      const scores = scoresResult.data ?? [];
      const avgScore = scores.length > 0
        ? scores.reduce((sum, row) => sum + row.intent_score, 0) / scores.length
        : 0;

      return {
        total: totalResult.count ?? 0,
        hotLeads: hotLeadsResult.count ?? 0,
        avgScore,
        newThisWeek: newThisWeekResult.count ?? 0,
      };
    },
    enabled: !!user?.id && !!productId,
  });
}
