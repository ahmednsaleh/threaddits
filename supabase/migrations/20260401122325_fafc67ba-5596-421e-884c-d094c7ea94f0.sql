-- Secure n8n_products_view: revoke API access since it's only used by service_role (n8n)
REVOKE SELECT ON public.n8n_products_view FROM anon, authenticated;

-- Also set security_invoker as defense-in-depth so if grants are re-added, RLS applies
ALTER VIEW public.n8n_products_view SET (security_invoker = on);