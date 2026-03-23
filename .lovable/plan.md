

## Fix: Sign Out Button on "Where Should We Hunt?" Page

### Root Cause
The sign-out button in `OnboardingFlow.tsx` (line 405-411) bypasses the `useAuth` context and directly imports `supabase.auth.signOut()`. It then immediately calls `navigate("/")` before the auth state change propagates through the context, creating a race condition where the user appears still logged in after navigation.

### Fix
**File: `src/components/OnboardingFlow.tsx`** — Replace the inline dynamic import with the `signOut` function from `useAuth()` (which is already available in the component), and `await` it before navigating:

```tsx
onClick={async () => {
  await signOut();
  navigate("/");
}}
```

This ensures the Supabase session is fully cleared before redirecting. The `signOut` from `useAuth` is the canonical way to sign out across the app and triggers PostHog reset as well.

### Scope
Single file change, ~5 lines modified in `src/components/OnboardingFlow.tsx`.

