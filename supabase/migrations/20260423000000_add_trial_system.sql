-- Add trial_ends_at to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS trial_ends_at timestamptz;

-- RPC: start 7-day trial for a free user who hasn't had one yet
-- Idempotent: no-op if trial already started or user is paid
CREATE OR REPLACE FUNCTION public.start_trial()
RETURNS timestamptz
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_trial_ends_at timestamptz;
  v_tier text;
BEGIN
  SELECT subscription_tier, trial_ends_at INTO v_tier, v_trial_ends_at
  FROM public.users WHERE id = auth.uid();

  -- Only start trial for free users who haven't had one
  IF v_tier NOT IN ('starter', 'pro') AND v_trial_ends_at IS NULL THEN
    UPDATE public.users
    SET trial_ends_at = now() + interval '7 days'
    WHERE id = auth.uid()
    RETURNING trial_ends_at INTO v_trial_ends_at;
  END IF;

  RETURN v_trial_ends_at;
END;
$$;

-- Update get_leads_for_user to honour active trial as paid access
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
  user_trial_ends_at timestamptz;
  effective_limit int;
BEGIN
  SELECT subscription_tier, trial_ends_at INTO user_tier, user_trial_ends_at
  FROM public.users WHERE id = auth.uid();

  -- Paid if subscribed OR within active trial window
  IF user_tier IN ('starter', 'pro')
     OR (user_trial_ends_at IS NOT NULL AND user_trial_ends_at > now()) THEN
    effective_limit := p_limit;
  ELSE
    effective_limit := LEAST(p_limit, 10);
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
