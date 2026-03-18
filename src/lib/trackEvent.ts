/**
 * Fire-and-forget event tracking stub.
 * Logs to console in development — never throws, never blocks UI.
 */
export async function trackEvent(
  eventType: string,
  details?: Record<string, unknown>,
): Promise<void> {
  try {
    if (import.meta.env.DEV) {
      console.debug("[trackEvent]", eventType, details);
    }
  } catch {
    // Silently swallow — tracking must never break the UI
  }
}
