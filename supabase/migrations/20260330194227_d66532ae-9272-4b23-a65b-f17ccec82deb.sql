-- Remove 'users' table from Realtime publication to prevent PII broadcast
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'users' AND schemaname = 'public'
  ) THEN
    ALTER PUBLICATION supabase_realtime DROP TABLE public.users;
  END IF;
END $$;

-- Add SELECT policy on onboarding_events so only the owning user can read their events
CREATE POLICY "Users can read own onboarding events"
  ON public.onboarding_events
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);