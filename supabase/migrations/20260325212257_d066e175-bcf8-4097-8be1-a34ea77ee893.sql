
CREATE OR REPLACE FUNCTION public.update_lead_feedback(
  p_lead_id uuid,
  p_feedback text
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
