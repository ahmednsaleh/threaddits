

# Fix Data Visibility Across Dashboard, Leads, and Products Pages

## Problem Summary

Three root causes are preventing data from displaying:

1. **Lead metrics return 0 everywhere** — `useLeadMetrics` queries the `leads` table directly, but RLS has a `No direct select on leads` policy (`USING (false)`). All 4 direct queries return 0. This affects the Dashboard vitals, Leads page pipeline bar, and Products page lead counts.

2. **System Evolution / Product Evolution show nothing** — The `system_actions` table has a `service_role_only` RLS policy (restricted to `service_role`). Authenticated users get empty results. There are 15 events in the table that should be visible.

3. **Lead intelligence fields are NULL** — `problem_statement_detail`, `urgency_signals_detail`, `competitors_mentioned`, and `competitive_context_detail` are all NULL in the database (the enrichment bot hasn't populated them). The code already handles this with fallbacks ("Not specified"), so the cards will render — they just won't have rich intel data until the bot populates those fields.

## Plan

### Step 1: Create a SECURITY DEFINER RPC for lead metrics

Create a new database function `get_lead_metrics_for_user` that bypasses RLS (like `get_leads_for_user` already does) and returns the 4 metric values: total, hotLeads, avgScore, newThisWeek.

```sql
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
```

### Step 2: Update `useLeadMetrics` hook to use the new RPC

Replace the 4 direct Supabase queries with a single `supabase.rpc('get_lead_metrics_for_user', { p_product_id })` call.

### Step 3: Add RLS policy for system_actions (authenticated users read their own product events)

```sql
CREATE POLICY "Users can view their own product actions"
ON public.system_actions
FOR SELECT
TO authenticated
USING (
  product_id IN (
    SELECT id FROM public.products WHERE user_id = auth.uid()
  )
);
```

### Step 4: Fix Dashboard system_actions query

The current query uses `(supabase as any)` cast — likely to work around a TypeScript issue. After the RLS policy is added, the query will return data. No code change needed for the query logic itself, but we should remove the `as any` cast if possible and ensure the `successful = true` filter works.

### Step 5: Fix EditProductPage Product Evolution query

Check the EditProductPage for the same system_actions query pattern and ensure it also benefits from the new RLS policy.

## Files Modified

- **New migration**: Create `get_lead_metrics_for_user` RPC + system_actions RLS policy
- **`src/hooks/useLeadMetrics.ts`**: Replace 4 direct queries with 1 RPC call

## What This Fixes

| Issue | Before | After |
|-------|--------|-------|
| Dashboard numbers (Actionable, Hot, Avg, New) | Always 0 | Real counts |
| Leads page pipeline bar | Always 0 | Real counts |
| Products page lead count | Always 0 | Real counts |
| System Evolution feed | Always empty | Shows 15+ events |
| Product Evolution feed | Always empty | Shows product-specific events |
| Lead card intelligence fields | Shows "Not specified" | Still "Not specified" until enrichment bot runs — this is a data issue, not a code bug |

