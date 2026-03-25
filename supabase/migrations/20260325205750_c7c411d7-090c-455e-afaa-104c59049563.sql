CREATE OR REPLACE FUNCTION public.get_lead_metrics_for_user(p_product_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_tier text;
  effective_limit int;
  v_total bigint;
  v_hot bigint;
  v_avg float;
  v_new_week bigint;
BEGIN
  SELECT subscription_tier INTO user_tier
  FROM public.users WHERE id = auth.uid();

  IF user_tier IS NULL OR user_tier NOT IN ('starter', 'pro') THEN
    effective_limit := 10;
  ELSE
    effective_limit := 999999;
  END IF;

  WITH visible_leads AS (
    SELECT intent_score, created_at
    FROM public.leads
    WHERE user_id = auth.uid()
      AND product_id = p_product_id
      AND intent_score >= 6
    ORDER BY created_at DESC
    LIMIT effective_limit
  )
  SELECT COUNT(*),
         COUNT(*) FILTER (WHERE intent_score >= 9),
         COALESCE(AVG(intent_score), 0),
         COUNT(*) FILTER (WHERE created_at >= now() - interval '7 days')
  INTO v_total, v_hot, v_avg, v_new_week
  FROM visible_leads;

  RETURN jsonb_build_object(
    'total', v_total,
    'hotLeads', v_hot,
    'avgScore', round(v_avg::numeric, 1),
    'newThisWeek', v_new_week
  );
END;
$$;