# Personal Website — Design Spec

**Owner:** Aref Afzali
**Date:** 2026-04-19
**Status:** Approved for implementation planning

## Goal

Replace the current single-file `index.html` portfolio with a production-grade personal website that represents Aref as a senior software & ML engineer, co-founder, and graduate researcher. The site should read as confident and mature without relying on hype language or visual complexity — seniority communicated through restraint and substance.

## Audience

Blended "senior engineer's public profile" — the single site must land credibly with:

- Hiring managers at AI / product companies
- Academic collaborators and researchers
- Founders, investors, and potential co-founders
- Anyone landing from a Google search of his name

No single bet; the content tiers itself so each audience finds what they want within one scroll.

## Aesthetic direction

**Editorial / serif-led**, warm paper palette, single ink accent. Feel: thoughtful magazine. Mono used sparingly as an undercurrent for technical metadata, so the site still reads as made by an engineer.

### Palette

| Token         | Value                          | Use                               |
| ------------- | ------------------------------ | --------------------------------- |
| `--paper`     | `#f4ede2`                      | Page background                   |
| `--ink`       | `#1f1a15`                      | Body copy and headlines           |
| `--ink-muted` | `rgba(31, 26, 21, 0.62)`       | Secondary copy                    |
| `--accent`    | `#7a5a2b`                      | Italic emphasis, kickers, links   |
| `--rule`      | `rgba(31, 26, 21, 0.18)`       | Hairline dividers                 |

### Type

- **Display / body**: Fraunces (variable serif, weights 300 and 400/500, plus italic)
- **Labels, metadata, tags**: JetBrains Mono, 10–11px, uppercase, `letter-spacing: 0.18em`
- Tight leading on display (0.98–1.02); comfortable leading on body (1.55)
- One emphatic italic word per hero headline in `--accent` — a deliberate Fraunces flex, not repeated elsewhere

### Motion

- Staggered fade-in-up on hero load (≈700ms total)
- Hairline underline draw-on-hover for links (0.25s)
- No scroll-jacking, no parallax, no full-page transitions
- `prefers-reduced-motion: reduce` disables all transforms; fades remain but instantaneous

### Signature details (the memorable bits)

- A very low-contrast animated node-graph SVG inside the M.Sc. thesis card in Projects & Research — nod to Broadcasting Algorithms on K-Path Graphs without being themed throughout.
- Small "Plate I / Plate II" mono captions near the portrait and the thesis graph — a nod to scientific plates.
- Italic ochre emphasis on a single word in the hero headline.
- Hairline grid rulings at section boundaries reminiscent of print layout marks.

## Seniority & entrepreneurship framing

Shown, not told:

- Hero identifier line under name: `Co-Founder · ML Engineer · Researcher` (mono, tracked caps). Three hats named up front.
- Hero lede explicitly includes "co-founding Qliqless.ai", "retrieval systems in production", and "graph research at Concordia".
- A "numbers strip" between Hero and About: hairline row reading `04 roles · 02 publications · 01 book · 06+ yrs shipping`. Factual, not boastful. (Year count dated from 2020, his first production role.)
- Work section titled "Trajectory", with **role** in a heavier serif weight than company — "Co-Founder & ML Engineer" reads before "Qliqless.ai".
- About opening sentence: "Aref is a software and ML engineer, co-founder, and graduate researcher…"

No "Senior" badges, no skill-bar graphics, no testimonial widgets, no hype adjectives.

## Information architecture

One long-scroll home page with anchored nav, plus dedicated routes for notes.

### Routes

- `/` — home page with all sections below
- `/notes/` — index of all notes, reverse chronological
- `/notes/[slug]/` — individual note pages
- `/Aref_Resume.pdf` — static asset

### Home page sections (in order)

1. **Top nav** — sticky, thin, near-transparent background with hairline bottom rule. Name left. Anchor links right: Work · Research · Notes · About · Contact. All mono, tracked caps.
2. **Hero (treatment #2)** — mono kicker, big Fraunces headline with italic accent, italic lede paragraph, small byline-style portrait top-right with a mono name chip. Foot row: `Montréal · QC — M.Sc. Concordia — Est. 2017`.
3. **Numbers strip** — single hairline-bordered row, mono, centered: `04 roles · 02 publications · 01 book · 06+ yrs shipping`.
4. **About** — two-column editorial. Left: two-paragraph bio built from the resume summary, naming co-founding, leading teams, and research explicitly. Right: fact box (role, education, location, languages, one personal line).
5. **Trajectory (Selected Work)** — four entries in reverse chronological order:
   - Qliqless.ai — Co-Founder & ML Engineer (Apr 2025 – Oct 2025)
   - XRaise.ai — R&D Engineer (Dec 2024 – Feb 2025)
   - RomaParvaz Travel Agency — Software Team Lead (Mar 2022 – Mar 2023)
   - Carriot — Data Specialist (Jul 2020 – Apr 2021)

   Each row: mono year range (left) · role in heavier serif + company (center) · one-line impact (right) · expandable details chevron that reveals 2–3 resume bullets.
6. **Projects & Research** — 2-column card grid:
   - Multimodal Graph Recommendation (MGCLTransformer)
   - VRP Optimization API (Carriot)
   - Basket Recommender (B.Sc. thesis, 2nd-place faculty pick)
   - M.Sc. Thesis — Broadcasting Algorithms on K-Path Graphs (the card with the animated node-graph SVG)
7. **Publications** — two items, clean list: author line, year, italic title, venue.
   - Afzali A., Bashizade M., Akbarein H. (2023). *The Application of Spiking Neural Network in Schizophrenia.* AIMS 2023.
   - Shayegh B., Afzali A., et al. (2021). *Discrete Mathematics: An Introduction with an Academic Approach.* Open-source book manuscript.
8. **Teaching** — short section (2–3 sentences) on mentoring, TA work, and the discrete math book.
9. **Notes** — index of the 5 most recent posts: title (serif), mono date, one-line dek. "View all notes →" link to `/notes/`.
10. **Personal** — single warm-but-brief paragraph. Kyokushin Karate (4th-dan black belt, instructor), guitar, languages (Persian native, English advanced, French & German elementary).
11. **Contact / footer** — email, LinkedIn, GitHub, Telegram, Instagram as mono text links (no PNG icons). "Download CV →" link to the PDF. Copyright and build year.

## Copy

- Hero headline: "Building quiet systems for *noisy* problems." (italic on "noisy")
- Hero lede: "I build, ship, and research ML-driven products — from co-founding Qliqless.ai to retrieval systems in production to graph research at Concordia."
- All other copy derived directly from the resume; no placeholders in the shipped site.

## Tech stack

- **Framework**: Astro (static output, zero client JS by default).
- **Language**: TypeScript. Components authored as `.astro`.
- **Content sources**:
  - `src/content/work/` — Markdown frontmatter entries for each Trajectory item.
  - `src/content/projects/` — Markdown frontmatter entries for each Projects & Research item.
  - `src/content/publications/` — Markdown frontmatter entries.
  - **Notes** — fetched at build time from a Notion database using `@notionhq/client` + `notion-to-md`, then emitted into Astro's content collection and rendered as static pages. Only pages marked `Published=true` in Notion are built.
- **Fonts**: Self-hosted via `@fontsource-variable/fraunces` and `@fontsource/jetbrains-mono` so there's no runtime font-CDN dependency.
- **Styling**: Plain CSS with custom properties. No Tailwind, no CSS-in-JS — fits the restrained aesthetic and keeps the build output tiny.
- **Images**: Astro `<Image>` for the portrait (AVIF/WebP with fallback, fixed dimensions, `loading="lazy"` below the fold).
- **Deploy target**: Netlify or Vercel (either works; recommend Netlify for the simpler Notion-webhook rebuild hook). GitHub Pages viable but requires a GitHub Action for rebuilds.
- **Build triggers**: Git push rebuilds. Notion webhook (or a manual `workflow_dispatch`) rebuilds when Notes change.

## Performance targets

- Lighthouse score 100 on `/` (all four categories) for a throttled mid-tier mobile profile.
- LCP < 1.0 s on a 25 Mbps cable connection, cold cache.
- Total first-load transferred bytes < 120 KB (hero HTML + hero portrait + variable font subsets).
- No third-party runtime requests on `/` (analytics optional; if added, must be cookieless and self-hosted or off the critical path).

## Accessibility

- Semantic landmarks (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`).
- Skip-to-content link.
- Color contrast: ink on paper passes WCAG AAA for body text.
- Keyboard focus visible (underline-grow treatment shared with hover).
- `prefers-reduced-motion: reduce` fully supported.
- All images have meaningful `alt` or empty `alt=""` when decorative.
- Node-graph SVG in the thesis card marked `aria-hidden="true"`.

## Responsive behavior

- Breakpoints at 640px and 1024px.
- Below 640px: hero portrait moves above the headline; numbers strip wraps to two lines; two-column About becomes stacked; Trajectory rows stack vertically with year range becoming a label above the role.
- Type scale reduces by ≈20% on the smallest breakpoint.
- Never truncates content; gracefully rewraps.

## Out of scope for v1

- Dark mode. (Can be added later; initial design is light-paper only.)
- Comments or reactions on notes.
- Search.
- Multilingual variants (Persian / French).
- Any analytics dashboard.
- RSS feed (could be added during implementation if trivial in Astro).

## Assets to carry over

- `Aref_s_Resume.pdf` → renamed to `Aref_Resume.pdf` to match existing link convention.
- `images/my_pic.jpg` → re-encoded via Astro's image pipeline.
- Nothing else from the current site (CSS, jQuery, slick carousel, social PNGs) is reused.

## Success criteria

- Anyone landing on `/` understands within 5 seconds that Aref is a software/ML engineer **and** a co-founder **and** a researcher.
- The site reads as made in 2026 by someone senior, without feeling "designed".
- Aref can publish a new note by creating a Notion page and triggering a rebuild — no code or Markdown editing required.
- Passes all performance and accessibility targets above.
