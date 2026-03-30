

# Fix: Core Pain and Urgency Always Showing "Not specified"

## Root Cause

The database has `problem_statement_detail` and `urgency_signals_detail` columns, but **the backend scoring pipeline never populates them** — they are NULL for every lead. The LeadCard falls back to "Not specified".

Only `relevance_summary`, `buying_stage_detail`, and `sentiment` are populated by the pipeline.

## Solution

Create a **backfill edge function** that uses AI (OpenAI) to extract `problem_statement_detail` and `urgency_signals_detail` from the existing `post_content` and `relevance_summary` for all leads where these fields are NULL. Then, also patch the **lead ingestion pipeline** so future leads get these fields populated at insert time.

However, since the ingestion pipeline appears to be external (n8n), the most practical fix is:

**Option A — Client-side derivation (quick fix, no AI cost):**
Derive sensible values from existing data when the fields are NULL:
- **Core Pain**: Extract from `relevance_summary` (it usually describes the problem)
- **Urgency**: Derive from `sentiment` + `buying_stage_detail` (e.g., "Research" + "Positive" → "Exploring options")

This avoids showing "Not specified" and gives meaningful context using data that already exists.

### Changes to `src/pages/LeadsPage.tsx`

Update the LeadCard props to derive values when NULL:

```typescript
problem_statement_detail={
  lead.problem_statement_detail || 
  lead.relevance_summary || 
  "Not specified"
}
urgency_signals_detail={
  lead.urgency_signals_detail || 
  (lead.sentiment === 'Positive' ? 'Actively exploring solutions' :
   lead.sentiment === 'Negative' ? 'Frustrated — may act soon' :
   lead.buying_stage_detail === 'Research' ? 'Early research phase' :
   'Moderate')
}
```

Also update the `sentiment` prop derivation to use the existing `sentiment` column directly when `urgency_signals_detail` is null.

### File Modified
- **`src/pages/LeadsPage.tsx`** — Smarter fallback logic for `problem_statement_detail` and `urgency_signals_detail` props

## Result
Core Pain will show the relevance summary (which describes the user's problem) instead of "Not specified". Urgency will show a derived signal based on sentiment and buying stage. No backend changes needed.

