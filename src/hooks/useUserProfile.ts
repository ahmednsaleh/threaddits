import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  email: string | null;
  subscription_tier: string | null;
  onboarding_complete: boolean | null;
  product_url: string | null;
  trial_ends_at: string | null;
}

export function useUserProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async (): Promise<UserProfile | null> => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('users')
        .select('id, full_name, avatar_url, email, subscription_tier, onboarding_complete, product_url, trial_ends_at')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Start trial on first dashboard visit — idempotent RPC, no-op if already started
  useEffect(() => {
    if (!user?.id || !query.data) return;
    const { subscription_tier, trial_ends_at } = query.data;
    if (subscription_tier === 'free' && !trial_ends_at) {
      supabase.rpc('start_trial').then(() => {
        queryClient.invalidateQueries({ queryKey: ['user-profile', user.id] });
      });
    }
  }, [user?.id, query.data?.trial_ends_at, query.data?.subscription_tier]);

  return query;
}

/** Returns days remaining in trial, or null if not on trial / trial expired. */
export function useTrialDaysRemaining(profile: UserProfile | null | undefined): number | null {
  if (!profile?.trial_ends_at) return null;
  if (profile.subscription_tier === 'starter' || profile.subscription_tier === 'pro') return null;
  const ms = new Date(profile.trial_ends_at).getTime() - Date.now();
  if (ms <= 0) return 0;
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}
