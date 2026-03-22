
-- 1. Drop the existing unrestricted UPDATE policy on users
DROP POLICY IF EXISTS "Profiles: update own (authenticated)" ON public.users;

-- 2. Create a BEFORE UPDATE trigger to block changes to sensitive columns
CREATE OR REPLACE FUNCTION public.protect_user_sensitive_fields()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
AS $$
BEGIN
  -- Only service_role can change subscription_tier or stripe_customer_id
  IF current_setting('request.jwt.claim.role', true) IS DISTINCT FROM 'service_role' THEN
    -- Preserve the original values for sensitive fields
    NEW.subscription_tier := OLD.subscription_tier;
    NEW.stripe_customer_id := OLD.stripe_customer_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_protect_user_sensitive_fields
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_user_sensitive_fields();

-- 3. Re-create the UPDATE policy (still scoped to own row)
CREATE POLICY "Profiles: update own (authenticated)"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
