ALTER TABLE public.task_patterns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_only" ON public.task_patterns
  FOR ALL TO service_role USING (true) WITH CHECK (true);

ALTER TABLE public.task_updates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_only" ON public.task_updates
  FOR ALL TO service_role USING (true) WITH CHECK (true);