-- 1. SECURITY DEFINER RPC to fetch lead metrics (bypasses RLS on leads)
CREATE OR REPLACE FUNCTION public.get_lead_metrics_for_user(
  p_product_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_total bigint;
  v_hot bigint;
  v_avg float;
  v_new_week bigint;
  v_one_week_ago timestamptz := now() - interval '7 days';
BEGIN
  SELECT COUNT(*),
         COUNT(*) FILTER (WHERE intent_score >= 9),
         COALESCE(AVG(intent_score), 0),
         COUNT(*) FILTER (WHERE created_at >= v_one_week_ago)
  INTO v_total, v_hot, v_avg, v_new_week
  FROM public.leads
  WHERE user_id = auth.uid()
    AND product_id = p_product_id
    AND intent_score >= 7;

  RETURN jsonb_build_object(
    'total', v_total,
    'hotLeads', v_hot,
    'avgScore', round(v_avg::numeric, 1),
    'newThisWeek', v_new_week
  );
END;
$$;

-- 2. Allow authenticated users to SELECT system_actions for their own products
CREATE POLICY "Users can view their own product actions"
ON public.system_actions
FOR SELECT
TO authenticated
USING (
  product_id IN (
    SELECT id FROM public.products WHERE user_id = auth.uid()
  )
);