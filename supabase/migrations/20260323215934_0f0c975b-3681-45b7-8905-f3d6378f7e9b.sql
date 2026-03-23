
-- 1. Enable RLS on all maal_* tables with service_role_only policies
ALTER TABLE public.maal_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maal_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maal_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maal_exchange_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maal_merchant_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_only" ON public.maal_goals FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_only" ON public.maal_budgets FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_only" ON public.maal_transactions FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_only" ON public.maal_exchange_rates FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_only" ON public.maal_merchant_categories FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 2. Server-side lead limit enforcement via RLS
-- Create a function to enforce free-tier lead visibility limit
CREATE OR REPLACE FUNCTION public.enforce_lead_limit()
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_tier text;
BEGIN
  -- Get the user's subscription tier
  SELECT subscription_tier INTO user_tier
  FROM public.users WHERE id = auth.uid();

  -- Paid users get unlimited access
  IF user_tier IN ('starter', 'pro') THEN
    RETURN true;
  END IF;

  -- Free users: this function is used in RLS, but we can't easily limit rows via RLS alone.
  -- Instead we return true and rely on a secure database function for fetching.
  RETURN true;
END;
$$;

-- Create a secure server-side function for fetching leads with enforced limits
CREATE OR REPLACE FUNCTION public.get_leads_for_user(
  p_product_id uuid,
  p_status text DEFAULT NULL,
  p_time_after timestamptz DEFAULT NULL,
  p_limit int DEFAULT 500
)
RETURNS SETOF public.leads
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_tier text;
  effective_limit int;
BEGIN
  -- Get subscription tier
  SELECT subscription_tier INTO user_tier
  FROM public.users WHERE id = auth.uid();

  -- Enforce limit for free-tier users
  IF user_tier IS NULL OR user_tier NOT IN ('starter', 'pro') THEN
    effective_limit := LEAST(p_limit, 10);
  ELSE
    effective_limit := p_limit;
  END IF;

  RETURN QUERY
  SELECT *
  FROM public.leads
  WHERE user_id = auth.uid()
    AND product_id = p_product_id
    AND intent_score >= 6
    AND (p_status IS NULL OR status = p_status)
    AND (p_time_after IS NULL OR created_at >= p_time_after)
  ORDER BY created_at DESC
  LIMIT effective_limit;
END;
$$;
