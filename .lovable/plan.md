

# Fix: Keywords Showing "Active" Even When Low Signal

## Problem
The keyword status badge (`TierBadge`) always shows "Active" because the `keyword_performance.status` column defaults to `'active'` and is never updated by the backend pipeline. Meanwhile, the Performance column correctly identifies low-signal keywords (impressions > 0 but leads_found = 0), creating a contradiction.

## Solution
Derive the display status client-side based on keyword metrics, rather than relying on the database `status` field that the backend never updates.

### Changes to `src/pages/EditProductPage.tsx`

Compute a derived status for each keyword before rendering:
- **`low_signal`** — impressions > 0 but leads_found === 0 (scanned, found nothing)
- **`not_scanned`** — impressions === 0 and leads_found === 0 (never included in a crawl)
- **`active`** — leads_found > 0 (producing results)
- Keep original status if it's `learning`

Replace line 627 (`<TierBadge tier={kw.status} />`) with a computed tier:
```
tier = kw.status === 'learning' ? 'learning'
     : kw.impressions === 0 && kw.leads_found === 0 ? 'not_scanned'
     : kw.leads_found === 0 ? 'low_signal'
     : 'active'
```

Add `not_scanned` to the `TierBadge` styles/labels:
- Style: amber/yellow (like Learning)
- Label: "Not Scanned"

## Files Modified
- **`src/pages/EditProductPage.tsx`** — Add computed status logic + `not_scanned` badge variant

