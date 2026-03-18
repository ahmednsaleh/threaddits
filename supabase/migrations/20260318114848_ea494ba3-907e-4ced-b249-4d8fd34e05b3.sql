
-- Enable RLS and add service-role-only policies on all unprotected internal/ops tables

-- 1. tasks
ALTER TABLE IF EXISTS public.tasks ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'tasks') THEN
    CREATE POLICY "service_role_only" ON public.tasks FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

-- 2. rizq_v3_evidence
ALTER TABLE IF EXISTS public.rizq_v3_evidence ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'rizq_v3_evidence') THEN
    CREATE POLICY "service_role_only" ON public.rizq_v3_evidence FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

-- 3. rizq_v3_synthesis
ALTER TABLE IF EXISTS public.rizq_v3_synthesis ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'rizq_v3_synthesis') THEN
    CREATE POLICY "service_role_only" ON public.rizq_v3_synthesis FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

-- 4. rizq_v3_runs
ALTER TABLE IF EXISTS public.rizq_v3_runs ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'rizq_v3_runs') THEN
    CREATE POLICY "service_role_only" ON public.rizq_v3_runs FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

-- 5. rizq_v3_worker_outputs
ALTER TABLE IF EXISTS public.rizq_v3_worker_outputs ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'rizq_v3_worker_outputs') THEN
    CREATE POLICY "service_role_only" ON public.rizq_v3_worker_outputs FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

-- 6. rizq_ideas
ALTER TABLE IF EXISTS public.rizq_ideas ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'rizq_ideas') THEN
    CREATE POLICY "service_role_only" ON public.rizq_ideas FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

-- 7. rizq_opportunity_scores
ALTER TABLE IF EXISTS public.rizq_opportunity_scores ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'rizq_opportunity_scores') THEN
    CREATE POLICY "service_role_only" ON public.rizq_opportunity_scores FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

-- 8. rizq_signal_history
ALTER TABLE IF EXISTS public.rizq_signal_history ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'rizq_signal_history') THEN
    CREATE POLICY "service_role_only" ON public.rizq_signal_history FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

-- 9. bz_projects
ALTER TABLE public.bz_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_only" ON public.bz_projects FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 10. bz_ventures
ALTER TABLE public.bz_ventures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_only" ON public.bz_ventures FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 11. bz_system_state
ALTER TABLE public.bz_system_state ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_only" ON public.bz_system_state FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 12. bz_active_bets
ALTER TABLE public.bz_active_bets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_only" ON public.bz_active_bets FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 13. bz_pipeline_events
ALTER TABLE public.bz_pipeline_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_only" ON public.bz_pipeline_events FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 14. product_quality_events
ALTER TABLE public.product_quality_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_only" ON public.product_quality_events FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 15. system_actions
ALTER TABLE IF EXISTS public.system_actions ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'system_actions') THEN
    CREATE POLICY "service_role_only" ON public.system_actions FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

-- 16. magd_content_calendar
ALTER TABLE public.magd_content_calendar ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_only" ON public.magd_content_calendar FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 17. reddit_subreddit_pool
ALTER TABLE IF EXISTS public.reddit_subreddit_pool ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'reddit_subreddit_pool') THEN
    CREATE POLICY "service_role_only" ON public.reddit_subreddit_pool FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

-- 18. github_watcher_state
ALTER TABLE public.github_watcher_state ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_only" ON public.github_watcher_state FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 19. git_listener
ALTER TABLE public.git_listener ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_only" ON public.git_listener FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 20. reddit_api_log
ALTER TABLE public.reddit_api_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_only" ON public.reddit_api_log FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 21. reddit_api_state
ALTER TABLE IF EXISTS public.reddit_api_state ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'reddit_api_state') THEN
    CREATE POLICY "service_role_only" ON public.reddit_api_state FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

-- 22. crawl_events
ALTER TABLE public.crawl_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_only" ON public.crawl_events FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 23. dahab_settings
ALTER TABLE public.dahab_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_only" ON public.dahab_settings FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 24. haris_incidents
ALTER TABLE public.haris_incidents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_only" ON public.haris_incidents FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 25. haris_metrics
ALTER TABLE public.haris_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_only" ON public.haris_metrics FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 26. insight_deliveries
ALTER TABLE public.insight_deliveries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_only" ON public.insight_deliveries FOR ALL TO service_role USING (true) WITH CHECK (true);
