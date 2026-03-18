

## Plan: Replace Quality Density with Avg Intent Score

### 1. Rewrite `src/hooks/useLeadMetrics.ts`

Update the interface and queries:

```typescript
export interface LeadMetrics {
  total: number;      // all leads score 7+
  hotLeads: number;   // score 9+
  avgScore: number;   // average intent_score across 7+ leads
  newThisWeek: number; // leads created in last 7 days with score 7+
}
```

Replace the 4 parallel queries:
- **total**: Keep existing (count, head, gte intent_score 7)
- **hotLeads**: Keep existing 9+ query (was topMatches)
- **avgScore**: Fetch all `intent_score` values for 7+ leads (select intent_score only, not head), compute average in JS
- **newThisWeek**: Count query with `.gte('created_at', oneWeekAgo)` where oneWeekAgo = 7 days back ISO string

Remove `new` and `potential` from the interface. Default return becomes `{ total: 0, hotLeads: 0, avgScore: 0, newThisWeek: 0 }`.

### 2. Update `src/pages/Dashboard.tsx`

- **Remove** the `qualityDensity` calculation (lines 87-91)
- **Update default destructuring** from `{ total: 0, new: 0, potential: 0, topMatches: 0 }` to `{ total: 0, hotLeads: 0, avgScore: 0, newThisWeek: 0 }`
- **Card 1**: Keep "Actionable Leads" / `metrics.total` — add subtitle "Score 7+"
- **Card 2**: Change label to "Hot Leads", value to `metrics.hotLeads`, add subtitle "Score 9+"
- **Card 3**: Label "Avg Score", value `${metrics.avgScore.toFixed(1)}/10`, subtitle "Lead Quality"
- **Card 4**: Label "New This Week", value `metrics.newThisWeek`, subtitle "Last 7 days"

### Files Modified
1. `src/hooks/useLeadMetrics.ts` — new interface + queries
2. `src/pages/Dashboard.tsx` — updated metric cards + removed dead code

