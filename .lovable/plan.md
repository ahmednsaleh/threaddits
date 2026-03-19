

## Plan: Add Blog Section to Threaddits

### Overview
Add a blog with a listing page and 3 SEO-optimized article pages, matching the existing design system. Add "Blog" link to NavBar. Use `react-helmet-async` for SEO meta tags.

### Files to Create

**1. `src/pages/BlogPage.tsx`** — Blog listing page (`/blog`)
- Hero section with grid overlay, orange "INSIGHTS" badge, heading, subtitle
- 3 article cards in responsive grid (1-col mobile, 3-col desktop)
- Bottom CTA dark section with orange button → `/auth`
- Uses NavBar + FooterSection

**2. `src/pages/blog/GummySearchAlternative.tsx`** — `/blog/gummysearch-alternative`
- "GummySearch Shut Down — Here Are the Best Alternatives in 2026"
- 6 min read, TOOLS category
- Covers GummySearch shutdown, 5 alternatives compared (Threaddits, Syften, SubredditSignals, Redreach, F5Bot)
- Mid-article CTA card + bottom CTA

**3. `src/pages/blog/BestRedditLeadGenTools.tsx`** — `/blog/best-reddit-lead-generation-tools-2026`
- "The 7 Best Reddit Lead Generation Tools in 2026 (Compared)"
- 8 min read, COMPARISON category
- 7 tools compared with table, decision guide

**4. `src/pages/blog/RedditLeadGenForSaas.tsx`** — `/blog/reddit-lead-generation-for-saas`
- "How to Use Reddit for B2B SaaS Lead Generation (Step-by-Step Guide)"
- 7 min read, GUIDE category
- 6-step guide, how Threaddits automates each step

**5. `src/components/blog/ArticleLayout.tsx`** — Shared article wrapper
- Back link, category badge, H1, meta line, prose body, bottom CTA
- Accepts children for article content
- Includes react-helmet-async `<Helmet>` for title + meta description

**6. `src/components/blog/BlogCard.tsx`** — Card component for listing page

### Files to Modify

**7. `src/App.tsx`** — Add 4 new routes + wrap app in `HelmetProvider`
```
/blog → BlogPage
/blog/gummysearch-alternative → GummySearchAlternative
/blog/best-reddit-lead-generation-tools-2026 → BestRedditLeadGenTools
/blog/reddit-lead-generation-for-saas → RedditLeadGenForSaas
```

**8. `src/components/NavBar.tsx`** — Add "Blog" link before login/dashboard button
- Style: `text-slate-600 hover:text-[#C2410C] font-medium transition-colors cursor-pointer`

**9. `src/components/FooterSection.tsx`** — Add "Blog" link under Product column

### Dependencies
- Install `react-helmet-async` for SEO meta tags per page

### Design Details
- All pages use existing color palette: `#C2410C`, `#2C3E50`, `#FAFAFA`, `#E2E8F0`
- Inter font throughout, matching existing typography scale
- Cards: `bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all`
- Article prose: `max-w-3xl mx-auto`, headings in `text-[#2C3E50]`, body `text-slate-600 leading-relaxed`
- Mid-article CTA: white card with `border-l-4 border-[#C2410C]`
- Content is genuine and valuable, Threaddits mentioned naturally

