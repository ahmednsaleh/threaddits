-- Fix 1: Enable RLS on rizq_health_snapshot (internal metrics table)
ALTER TABLE public.rizq_health_snapshot ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_only" ON public.rizq_health_snapshot
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Fix 2: Set bz_project_map view to SECURITY INVOKER
ALTER VIEW public.bz_project_map SET (security_invoker = on);