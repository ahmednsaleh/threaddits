

## Fix: Horizontal Scroll on Landing Page

### Root Cause
The `LandingHero` section (`overflow-visible`) and `ProductShowcase` section (`overflow-visible`) allow decorative elements (blur glows, grid patterns) to extend beyond the viewport. The Homepage wrapper div has `overflow-x-hidden`, but browsers can still scroll horizontally via `<html>`/`<body>`.

### Fix
**File: `src/index.css`** — Add `overflow-x: hidden` to `html` and `body` in the base layer:

```css
html, body {
  overflow-x: hidden;
}
```

This is the standard fix — a single global rule that prevents any section's decorative overflow from causing horizontal scroll, without breaking vertical scrolling or any component behavior.

### Why not fix per-component?
Changing each section to `overflow-hidden` would clip the intentional visual effects (the glow blur in ProductShowcase extends beyond its container by design with `scale-105`). The global `overflow-x: hidden` preserves these effects while eliminating the scroll.

