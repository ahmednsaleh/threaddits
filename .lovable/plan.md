

# Mark Resolved Security Findings

All three remaining Supabase scan findings have already been fixed directly on the database. The plan is to update the security tracker to reflect this.

## Actions

1. **`SUPA_function_search_path_mutable`** — Already fixed (search_path added to `acquire_reddit_budget` and `get_brain_entries_in_range`). Mark as ignored with reason "Fixed — all custom functions now have search_path set. Remaining entries are pg_trgm internals moved to extensions schema."

2. **`SUPA_extension_in_public`** — Already fixed (pg_trgm moved to extensions schema). Mark as ignored with reason "Fixed — pg_trgm moved to extensions schema."

3. **`SUPA_rls_enabled_no_policy`** — Reminders table, accessed only via service_role (bots). Mark as ignored with reason "Reminders table is only accessed via service_role which bypasses RLS. No user-facing access exists."

## Technical Details

- No code changes or migrations needed — fixes were applied directly to the database
- Use `security--manage_security_finding` to update each finding's status

