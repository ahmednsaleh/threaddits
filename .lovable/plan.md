

## Fix Build Error + Rename & Wire Up Evolution Panels

### Changes

**1. `src/pages/Dashboard.tsx` — Rename "Product Evolution" to "System Evolution"**
Line 501: Change the heading text from `Product Evolution` to `System Evolution`. Single string change.

**2. `src/pages/EditProductPage.tsx` — Wire up "Product Evolution" with real data**
Replace the placeholder (lines 686-700) with a working panel that fetches from `system_actions` filtered by the current product ID.

- Add imports: `useQuery` from tanstack, `supabase`, `formatTimeAgo`, and icons (`ArrowUp`, `ArrowDown`, `TrendingDown`, `TrendingUp`, `CheckCircle2`, `RefreshCw`, `PlusCircle`)
- Add a `useQuery` call fetching `system_actions` where `product_id = id`, ordered by `executed_at desc`, limit 15
- Replace the placeholder div with the same event-list rendering logic from Dashboard (icon mapping by `action_type`, label formatting, time ago display) — but without the product name badge since we're already on a single product page

### Files Changed
- `src/pages/Dashboard.tsx` — 1 line rename
- `src/pages/EditProductPage.tsx` — add imports + query + event list UI (~80 lines)

### Note
The `useLeads.ts` fix (adding `refetchInterval`) was already applied in the last diff, so no further changes needed there.

