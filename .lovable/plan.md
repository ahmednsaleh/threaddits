

# Move "Open Thread" next to "Draft Reply"

## What changes

1. **Remove** the "Open Thread" link from the title metadata row (lines 370-379)
2. **Add** an "Open Thread" button in the footer actions area (next to "Draft Reply"), styled as an outline button with matching height (`h-10`, `rounded-full`) so it visually pairs with the primary CTA
3. The button uses `window.open(post_url, '_blank', 'noreferrer')` on click — same behavior, just as a Button component

## Footer layout (after change)

```text
[Status Dropdown]                    [Open Thread]  [Draft Reply]
```

When draft is visible, the right side becomes:
```text
[Status Dropdown]                    [Open Thread]  [Cancel]  [Copy]
```

## Files modified
- `src/components/LeadCard.tsx` — remove link from line ~370-379, add Button in footer section around line ~475

