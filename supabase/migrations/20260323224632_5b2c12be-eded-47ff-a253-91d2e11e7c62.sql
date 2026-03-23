
-- 1. Drop the permissive SELECT policy on leads
DROP POLICY IF EXISTS "Users can view their own leads" ON public.leads;

-- 2. Create a restrictive SELECT policy that blocks direct table reads
-- The SECURITY DEFINER RPCs bypass RLS, so they still work
CREATE POLICY "No direct select on leads"
  ON public.leads
  FOR SELECT
  TO authenticated
  USING (false);

-- 3. Create a count RPC so useTotalNewLeadsCount can still work
CREATE OR REPLACE FUNCTION public.get_leads_count_for_user(
  p_min_intent_score int DEFAULT 6
)
RETURNS bigint
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  lead_count bigint;
  user_tier text;
BEGIN
  SELECT subscription_tier INTO user_tier
  FROM public.users WHERE id = auth.uid();

  IF user_tier IS NULL OR user_tier NOT IN ('starter', 'pro') THEN
    -- Free users: cap visible count at 10
    SELECT LEAST(COUNT(*), 10) INTO lead_count
    FROM public.leads
    WHERE user_id = auth.uid()
      AND intent_score >= p_min_intent_score;
  ELSE
    SELECT COUNT(*) INTO lead_count
    FROM public.leads
    WHERE user_id = auth.uid()
      AND intent_score >= p_min_intent_score;
  END IF;

  RETURN lead_count;
END;
$$;
