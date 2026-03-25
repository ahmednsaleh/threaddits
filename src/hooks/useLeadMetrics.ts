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

      const { data, error } = await supabase.rpc('get_lead_metrics_for_user', {
        p_product_id: productId,
      } as any);

      if (error) {
        console.error('Error fetching lead metrics:', error);
        return { total: 0, hotLeads: 0, avgScore: 0, newThisWeek: 0 };
      }

      const metrics = data as any;
      return {
        total: metrics?.total ?? 0,
        hotLeads: metrics?.hotLeads ?? 0,
        avgScore: Number(metrics?.avgScore ?? 0),
        newThisWeek: metrics?.newThisWeek ?? 0,
      };
    },
    enabled: !!user?.id && !!productId,
  });
}
