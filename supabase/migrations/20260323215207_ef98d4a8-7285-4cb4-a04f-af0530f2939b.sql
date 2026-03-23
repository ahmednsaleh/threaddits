
-- 1. Enable RLS on rawi_runs and rawi_pipeline_events with service_role_only policies
ALTER TABLE public.rawi_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rawi_pipeline_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_only" ON public.rawi_runs FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_only" ON public.rawi_pipeline_events FOR ALL TO service_role USING (true) WITH CHECK (true);

-- 2. Fix n8n_products_view: set security_invoker and revoke client access
ALTER VIEW public.n8n_products_view SET (security_invoker = on);
REVOKE SELECT ON public.n8n_products_view FROM anon, authenticated;

-- 3. Fix open_commitments_view: set security_invoker and revoke client access
ALTER VIEW public.open_commitments_view SET (security_invoker = on);
REVOKE SELECT ON public.open_commitments_view FROM anon, authenticated;

-- 4. Add BEFORE INSERT trigger on products to enforce subscription tier product limits server-side
CREATE OR REPLACE FUNCTION public.enforce_product_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_tier text;
  product_count int;
  max_products int;
BEGIN
  SELECT subscription_tier INTO user_tier
  FROM public.users WHERE id = NEW.user_id;

  SELECT COUNT(*) INTO product_count
  FROM public.products WHERE user_id = NEW.user_id;

  -- Determine limit based on tier
  IF user_tier = 'pro' THEN
    max_products := 3;
  ELSIF user_tier = 'starter' THEN
    max_products := 1;
  ELSE
    -- free tier
    max_products := 1;
  END IF;

  IF product_count >= max_products THEN
    RAISE EXCEPTION 'Product limit reached for your plan (% allowed). Upgrade to add more products.', max_products;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER enforce_product_limit_trigger
  BEFORE INSERT ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_product_limit();
