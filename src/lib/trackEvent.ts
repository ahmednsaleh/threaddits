import { supabase } from "../integrations/supabase/client";

/**
 * Fire-and-forget event tracking for Product Quality Agent.
 * Inserts into user_events table — never throws, never blocks UI.
 */
export async function trackEvent(
  eventType: string,
  details?: Record<string, unknown>,
): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("user_events").insert({
      event_type: eventType,
      user_id: user?.id ?? null,
      details: details ?? null,
    });
  } catch {
    // Silently swallow — tracking must never break the UI
  }
}
