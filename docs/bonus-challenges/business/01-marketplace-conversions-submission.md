# Marketplace Conversions: Analysis, Hypothesis, Implementation, Measurement

This document is my submission for the bonus product challenge:
**Improve Marketplace Conversions** (`/marketplace` → `/marketplace/[id]` → book/request quote).

Goal: increase click-through from the marketplace grid to detail pages, and increase booking/quote submissions on the detail page, without changing backend/API behavior.

---

## 1) What Felt Off (Conversion Friction)

### Grid → Detail (click-through)
- Cards previously lacked hierarchy, so listings were hard to scan and compare quickly.
- The "why click this" signal was weak (availability + price + publisher context weren't emphasized cleanly).
- Filter interactions were visually basic, which made the browse experience feel low-trust / low-polish.

### Detail → Book/Quote (conversion)
- The CTA area needed stronger structure: one primary action, one clearly secondary.
- Long forms inside modals are high-risk: if the modal isn't readable and scrollable, users drop.

---

## 2) Hypotheses (What Should Increase Conversions)

### Hypothesis A: Better scanning increases click-through
If the grid cards make it easy to compare inventory (publisher + type + availability + starting price + "View" CTA), users will click more listings.

### Hypothesis B: A "primary vs secondary CTA" structure increases form submissions
If the detail page has one dominant CTA (book) and a clear fallback CTA (request quote), more users complete one of the two.

### Hypothesis C: Removing modal friction increases completions
If quote/CRUD modals are readable, scrollable, and work in light/dark themes, fewer users abandon mid-form.

---

## 3) What Was Implemented (UI-Only, Same Flow)

### Marketplace Grid (`/marketplace`)
- Premium glass card layout: simplified structure (title → publisher/type → description → price + CTA).
- Reduced "double-outline" noise and used a subtle default border with an accent hover border.
- Upgraded filter bar styling for a more confident browse experience.

Key files:
- `apps/frontend/app/marketplace/components/ad-slot-grid.tsx`
- `apps/frontend/app/components/ui/*` (Button, Card/Panel styling, Badge, Input/Select)

### Detail Page (`/marketplace/[id]`)
- Sticky price + CTA panel to keep the primary action visible while scrolling.
- Quote request remains a secondary CTA (no flow changes; same endpoint).
- Modal usability fixes (scrolling, readability).

Key files:
- `apps/frontend/app/marketplace/[id]/components/ad-slot-detail.tsx`
- `apps/frontend/app/marketplace/[id]/components/request-quote-modal.tsx`

### Modal Usability / Theme Reliability
- Dialog styling uses theme-aware tokens (light/dark) and a stronger scrim so content is readable.
- Long modal forms are scrollable (forms are flex containers so the body can overflow/scroll).

Key files:
- `apps/frontend/app/components/ui/dialog.tsx`
- `apps/frontend/app/globals.css`

---

## 4) Measurement Plan (How To Know It Worked)

### Funnel Metrics
Track the funnel as:
1. **Grid view** (page view)
2. **Listing click** (grid → detail)
3. **Detail view** (listing view)
4. **CTA click** (Book / Request Quote)
5. **Form submit success** (booking submit / quote submit)

Primary success metrics:
- Grid → Detail click-through rate (CTR)
- Detail → Book conversion rate
- Detail → Quote submission rate

Secondary/diagnostic metrics:
- Filter usage rate (helps explain higher CTR if users find relevance faster)
- Form error rate (validation errors per 100 submits)
- Scroll depth on detail pages (are users reaching objection-handling content?)

### Events (Already Wired for GA4-style tracking)
The codebase includes a small analytics utility and hook:
- `apps/frontend/lib/analytics.ts`
- `apps/frontend/lib/hooks/use-analytics.ts`

These define and send events like:
- `view_listing`
- `click_cta`
- `filter_listings`
- `submit_booking`
- `submit_quote`
- `subscribe_newsletter`

Current instrumentation points:
- Marketplace grid: filter usage + listing click CTA (`apps/frontend/app/marketplace/components/ad-slot-grid.tsx`)
- Listing detail: view + CTA clicks + booking submit (`apps/frontend/app/marketplace/[id]/components/ad-slot-detail.tsx`)

### How I Would Evaluate
- Add a baseline week (current UI) vs. treatment week (new UI), controlling for traffic.
- Segment by listing type (Newsletter/Podcast/etc.) and by availability.
- If running experiments, A/B test CTA wording (already scaffolded via `useABTest` in `ad-slot-detail.tsx`).

---

## 5) How To Verify Locally

1. `pnpm dev`
2. Visit `http://localhost:3847/marketplace`
3. Click a few listings → confirm detail view + sticky CTA panel
4. Click **Request Custom Quote** → confirm modal is readable and scrollable
5. Submit quote request → confirm success state and quoteId response
