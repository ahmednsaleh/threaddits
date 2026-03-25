

# Fix Incorrect Lead Count on Dashboard

## Problem

The `get_lead_metrics_for_user` RPC (created in the last migration) counts **all** leads with `intent_score >= 7` without applying the subscription tier limit. Meanwhile, the leads feed RPC (`get_leads_for_user`) caps free-tier users to 10 leads. This causes the dashboard to show 57 while only 10 are actually visible.

## Root Cause

Both `get_leads_for_user` and `get_leads_count_for_user` check the user's `subscription_tier` and cap results at 10 for free users. The new metrics RPC skips this check entirely.

## Fix

Update `get_lead_metrics_for_user` to apply the same tier-based limit:

```sql
CREATE OR REPLACE FUNCTION public.get_lead_metrics_for_user(p_product_id uuid)
RETURNS jsonb ...
AS $$
DECLARE
  user_tier text;
  effective_limit int;
  ...
BEGIN
  SELECT subscription_tier INTO user_tier
  FROM public.users WHERE id = auth.uid();

  IF user_tier IS NULL OR user_tier NOT IN ('starter', 'pro') THEN
    effective_limit := 10;
  ELSE
    effective_limit := 999999;
  END IF;

  -- Compute metrics only over the leads the user can actually see
  WITH visible_leads AS (
    SELECT intent_score, created_at
    FROM public.leads
    WHERE user_id = auth.uid()
      AND product_id = p_product_id
      AND intent_score >= 7
    ORDER BY created_at DESC
    LIMIT effective_limit
  )
  SELECT COUNT(*),
         COUNT(*) FILTER (WHERE intent_score >= 9),
         COALESCE(AVG(intent_score), 0),
         COUNT(*) FILTER (WHERE created_at >= now() - interval '7 days')
  INTO v_total, v_hot, v_avg, v_new_week
  FROM visible_leads;

  RETURN jsonb_build_object(...);
END;
$$;
```

Also align the `intent_score` threshold: the metrics RPC uses `>= 7` but the feed uses `>= 6`. Both should use `>= 6` for consistency (the feed shows score 6+ leads, so metrics should count them too).

## Files Modified

- **New migration**: Replace `get_lead_metrics_for_user` with tier-aware version

## Result

Dashboard numbers will match what the user actually sees in their feed (10 leads for free tier).

