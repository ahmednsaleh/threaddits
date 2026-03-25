

# Fix 3 Sentry Production Errors

## Bug 1 — LeadCard.tsx: `user_feedback` ReferenceError

**Current state**: The prop `user_feedback` is aliased to `userFeedback` on line 118, and line 129 correctly uses `userFeedback`. The code appears consistent now, but the Sentry errors suggest a previous version or edge case.

**Fix**: As a defensive measure, rename the prop in the interface from `user_feedback` to `userFeedback` (matching JS conventions) and remove the alias destructuring. This eliminates any ambiguity.

- `LeadCardProps` interface: rename `user_feedback?` → `userFeedback?`
- Destructuring: change `user_feedback: userFeedback = null` → `userFeedback = null`
- Verify all callers pass `userFeedback` (or update them)

---

## Bug 2 — AuthContext.tsx + OnboardingFlow.tsx: `Cannot read properties of undefined (reading 'auth')`

**Fix in `AuthContext.tsx`** (line ~73):
```typescript
const signOut = async () => {
  if (!supabase?.auth) {
    console.error("Supabase auth client is not available.");
    return;
  }
  await supabase.auth.signOut();
};
```

**Fix in `OnboardingFlow.tsx`** (line ~406):
```typescript
onClick={async () => {
  try {
    await signOut();
    navigate("/");
  } catch (error) {
    console.error("Sign out failed:", error);
    localStorage.clear();
    navigate("/");
  }
}}
```

---

## Bug 3 — EditProductPage.tsx: `insertBefore` DOM error

**Fix** (lines 617-621):
- Remove `divide-y divide-slate-100` from the parent `<div>` on line 617
- Add `border-b border-slate-100 last:border-b-0` to each child `<div>` on line 619
- Change key from `kw.id` to `` `keyword-${kw.id}-${kw.keyword}` `` for stable reconciliation

---

## Files Modified
1. `src/components/LeadCard.tsx` — rename prop, remove alias
2. `src/contexts/AuthContext.tsx` — null-check on signOut
3. `src/components/OnboardingFlow.tsx` — try/catch on sign-out click
4. `src/pages/EditProductPage.tsx` — replace divide-y, improve keys

