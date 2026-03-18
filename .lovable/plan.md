

## Plan: Fix Build Errors + 5 Feature Changes

### Build Error Fixes (Prerequisite)

Two tables referenced in code don't exist in the Supabase types: `user_events` (in `trackEvent.ts`) and `system_actions` (in `Dashboard.tsx`).

**Fix `src/lib/trackEvent.ts`**: Replace the Supabase insert with a console.log in dev mode only. The `user_events` table doesn't exist, so remove the DB call entirely. This is a fire-and-forget analytics stub — no DB needed.

**Fix `src/pages/Dashboard.tsx`**: The `system_actions` query (lines 73-74) references a non-existent table. Cast the table name using `.from("system_actions" as any)` to bypass the type error, since this table may exist in the DB but isn't in the generated types file. Alternatively, wrap it with a type assertion on the supabase client.

---

### Change 1: Fix Horizontal Scroll on Dashboard

In `Dashboard.tsx` line 96, add `overflow-x-hidden` to the main container. Also add `min-w-0` to flex children in the context grid (line 283) and top leads section to prevent content from overflowing.

### Change 2: Sidebar Lead Count — All Leads with score >= 7

In `useTotalNewLeadsCount.ts`, remove `.eq('status', 'New')` and add `.gte('intent_score', 7)` so it counts all actionable leads regardless of status.

### Change 3: System Evolution — Show Demotion Reasons

In `Dashboard.tsx` line 422, update the `subreddit_demoted` label from:
`r/${details.subreddit} moved to probation`
to:
`r/${details.subreddit} moved to probation — avg score ${details.avg_score}/10 across ${details.total_leads} leads`

### Change 4: Lead Visibility Threshold + Metric Renaming

**`useLeads.ts`**: Already has `.gte('intent_score', 7)` — no change needed.

**`useLeadMetrics.ts`**:
- `total`: add `.gte('intent_score', 7)` to only count actionable leads
- `new`: add `.gte('intent_score', 7)` to only count unreviewed 7+ leads
- `topMatches`: change threshold from `>= 8` to `>= 9`

**`Dashboard.tsx` metric cards**:
- Card 1: "Total Leads" → "Actionable Leads"
- Card 2: "High Intent (9+)" stays but threshold now uses updated metrics
- Card 3: "Quality Density" → "Hot Lead Rate", subtitle "Signal Ratio" → "Score 9+ / Total Shown"
- Card 4: "New Leads" stays, already filtered by metrics change

**`useTotalNewLeadsCount.ts`**: Already handled in Change 2.

### Change 5: Keywords — Impression Stats + Unused Warning

In `EditProductPage.tsx` keyword table:
- Add info text below header: "Keywords with 0 impressions haven't been included in any crawl run yet."
- In the Performance column (lines 529-542), add a condition: if `kw.impressions === 0 && kw.leads_found === 0`, show a yellow "Not yet scanned" badge instead of "Low Signal"
- Keep "Low Signal" for keywords with impressions > 0 but 0 leads

### Files Modified
1. `src/lib/trackEvent.ts` — remove DB call, use console.log
2. `src/pages/Dashboard.tsx` — overflow fix, type fix, metric labels, demotion label
3. `src/hooks/useTotalNewLeadsCount.ts` — count all 7+ leads
4. `src/hooks/useLeadMetrics.ts` — filter total/new to 7+, topMatches to 9+
5. `src/pages/EditProductPage.tsx` — keyword impressions warning

