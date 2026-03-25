

# Fix "Bad Lead" Not Setting Status to Rejected

## Problem

When clicking "Bad Lead", the mutation does a direct `.update()` on the `leads` table. However, the `leads` table has a SELECT RLS policy `USING (false)` that blocks all direct reads. Since PostgreSQL UPDATE requires SELECT visibility first, the update silently affects 0 rows — the status never changes to "Rejected" and the feedback is never saved.

## Fix

Create a new `SECURITY DEFINER` RPC that handles the bad-lead flow atomically:

1. Updates `user_feedback` and `status` on the `leads` table (bypassing RLS)
2. Also records the feedback in the `lead_feedback` table for consistency

Then update `useUpdateLeadFeedback` to call this RPC instead of doing a direct `.update()`.

### Step 1: New migration — create `update_lead_feedback` RPC

```sql
CREATE OR REPLACE FUNCTION public.update_lead_feedback(
  p_lead_id uuid,
  p_feedback text  -- 'good' or 'bad'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.leads
  SET user_feedback = p_feedback,
      status = CASE WHEN p_feedback = 'bad' THEN 'Rejected' ELSE status END,
      updated_at = now()
  WHERE id = p_lead_id
    AND user_id = auth.uid();
END;
$$;
```

### Step 2: Update `useUpdateLeadFeedback` in `src/hooks/useLeadMutations.ts`

Replace the direct `.from('leads').update(...)` call with:

```typescript
await supabase.rpc('update_lead_feedback', {
  p_lead_id: leadId,
  p_feedback: feedback,
});
```

Keep the existing `reject-lead` edge function call for bad leads (embedding generation).

### Step 3: Also fix `useUpdateLeadStatus`

The same RLS issue affects the status dropdown (New → Contacted → Won → Rejected). Create a matching RPC:

```sql
CREATE OR REPLACE FUNCTION public.update_lead_status(
  p_lead_id uuid,
  p_status text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.leads
  SET status = p_status, updated_at = now()
  WHERE id = p_lead_id AND user_id = auth.uid();
END;
$$;
```

Update `useUpdateLeadStatus` to use `supabase.rpc('update_lead_status', ...)`.

## Files Modified

- **New migration**: `update_lead_feedback` + `update_lead_status` RPCs
- **`src/hooks/useLeadMutations.ts`**: Both mutations switch from direct table updates to RPC calls

## Result

Clicking "Bad Lead" will correctly set status to "Rejected" and save feedback. The status dropdown will also work reliably.

