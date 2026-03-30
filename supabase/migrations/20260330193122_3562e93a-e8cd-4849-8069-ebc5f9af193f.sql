
-- Enable RLS on all tables that currently lack it
ALTER TABLE public.rizq_council_verdicts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_engagement_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.maal_budget_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.magd_linkedin_benchmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.magd_linkedin_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.magd_linkedin_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.telegram_link_tokens ENABLE ROW LEVEL SECURITY;

-- Add service_role-only policies for internal/system tables
CREATE POLICY "service_role_only" ON public.rizq_council_verdicts
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_only" ON public.lead_engagement_events
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_only" ON public.maal_budget_alerts
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_only" ON public.magd_linkedin_benchmarks
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_only" ON public.magd_linkedin_data
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_only" ON public.magd_linkedin_suggestions
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_only" ON public.telegram_link_tokens
  FOR ALL TO service_role USING (true) WITH CHECK (true);
