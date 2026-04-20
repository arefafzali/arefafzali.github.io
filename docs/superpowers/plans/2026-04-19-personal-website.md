# Personal Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild Aref Afzali's personal site as an Astro static site with an editorial-serif aesthetic, Notion-backed Notes, and copy that foregrounds his founder + researcher identity.

**Architecture:** Astro 4 static build, TypeScript. Markdown content collections for Work / Projects / Publications. Notes fetched from a Notion database at build time (`@notionhq/client` + `notion-to-md`) and rendered as static routes. One home page composed of section components; one notes index; one dynamic notes route. Self-hosted variable fonts, plain CSS with design tokens. Deployed to GitHub Pages via GitHub Actions (build on push; manual `workflow_dispatch` for Notion content refresh).

**Tech Stack:** Astro 4, TypeScript, `@astrojs/check`, `@fontsource-variable/fraunces`, `@fontsource/jetbrains-mono`, `@notionhq/client`, `notion-to-md`, `zod` (via Astro content collections), Playwright + `@axe-core/playwright`, GitHub Actions.

**Reference:** Spec at `docs/superpowers/specs/2026-04-19-personal-website-design.md`.

---

## File Structure

```
/
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── .gitignore                         (update)
├── .node-version                      (new)
├── .github/workflows/deploy.yml       (new)
├── public/
│   ├── Aref_Resume.pdf                (moved from root)
│   ├── favicon.svg                    (new, simple A glyph)
│   └── og.png                         (new)
├── src/
│   ├── assets/
│   │   └── portrait.jpg               (moved from images/my_pic.jpg)
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── Hero.astro
│   │   ├── NumbersStrip.astro
│   │   ├── About.astro
│   │   ├── Trajectory.astro
│   │   ├── ProjectsResearch.astro
│   │   ├── ThesisGraph.astro
│   │   ├── Publications.astro
│   │   ├── Teaching.astro
│   │   ├── NotesPreview.astro
│   │   ├── Personal.astro
│   │   └── Contact.astro
│   ├── content/
│   │   ├── config.ts                  (Zod schemas)
│   │   ├── work/*.md                  (4 entries seeded from resume)
│   │   ├── projects/*.md              (4 entries seeded from resume)
│   │   └── publications/*.md          (2 entries seeded from resume)
│   ├── layouts/
│   │   └── Base.astro
│   ├── lib/
│   │   ├── notion.ts                  (build-time fetcher)
│   │   └── notion.test.ts
│   ├── pages/
│   │   ├── index.astro
│   │   └── notes/
│   │       ├── index.astro
│   │       └── [slug].astro
│   └── styles/
│       ├── tokens.css
│       ├── fonts.css
│       └── global.css
├── tests/
│   ├── smoke.spec.ts
│   └── a11y.spec.ts
├── playwright.config.ts
└── vitest.config.ts
```

Legacy files removed at end of project: `index.html`, `css/`, `js/`, `fonts/`, `images/`, `Aref_s_Resume.pdf`.

---

## Task 1: Initialize Astro project structure

**Files:**
- Create: `package.json`, `tsconfig.json`, `astro.config.mjs`, `.node-version`
- Modify: `.gitignore`

- [ ] **Step 1: Verify Node version**

Run: `node --version`
Expected: `v20.x` or later. If older, upgrade before continuing.

- [ ] **Step 2: Write `.node-version`**

Content:
```
20.11.1
```

- [ ] **Step 3: Write `package.json`**

```json
{
  "name": "aref-afzali-site",
  "version": "1.0.0",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "vitest run",
    "test:watch": "vitest",
    "e2e": "playwright test"
  },
  "dependencies": {
    "astro": "^4.16.0",
    "@astrojs/check": "^0.9.4",
    "@astrojs/sitemap": "^3.2.1",
    "@fontsource-variable/fraunces": "^5.1.0",
    "@fontsource/jetbrains-mono": "^5.1.1",
    "@notionhq/client": "^2.2.15",
    "notion-to-md": "^3.1.1",
    "typescript": "^5.6.3"
  },
  "devDependencies": {
    "@axe-core/playwright": "^4.10.0",
    "@playwright/test": "^1.48.0",
    "@types/node": "^20.16.5",
    "vitest": "^2.1.2"
  }
}
```

- [ ] **Step 4: Write `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "types": ["astro/client"]
  },
  "include": ["src", "tests", "*.config.*"]
}
```

- [ ] **Step 5: Write `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://arefafzali.github.io',
  integrations: [sitemap()],
  build: {
    inlineStylesheets: 'auto'
  },
  vite: {
    resolve: {
      alias: { '@': '/src' }
    }
  }
});
```

Note: `site` URL will be updated when the final deployment domain is known.

- [ ] **Step 6: Update `.gitignore`**

Append the following if not already present:
```
node_modules/
dist/
.astro/
.env
.env.local
playwright-report/
test-results/
```

- [ ] **Step 7: Install dependencies**

Run: `npm install`
Expected: `added N packages` with no errors.

- [ ] **Step 8: Scaffold directories**

Run: `mkdir -p src/{assets,components,content/{work,projects,publications},layouts,lib,pages/notes,styles} public tests`

- [ ] **Step 9: Create placeholder index and verify dev server**

Create `src/pages/index.astro` with:
```astro
---
---
<html lang="en">
  <body>scaffold ok</body>
</html>
```

Run: `npm run dev`
Expected: server starts at `http://localhost:4321`, page shows "scaffold ok".
Stop the server with Ctrl+C.

- [ ] **Step 10: Commit**

```bash
git add package.json package-lock.json tsconfig.json astro.config.mjs .node-version .gitignore src/pages/index.astro
git commit -m "Scaffold Astro project"
```

---

## Task 2: Design tokens and global CSS

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/fonts.css`, `src/styles/global.css`

- [ ] **Step 1: Write `src/styles/tokens.css`**

```css
:root {
  /* palette */
  --paper:      #f4ede2;
  --paper-2:    #efe7d9;
  --ink:        #1f1a15;
  --ink-muted:  rgba(31, 26, 21, 0.62);
  --ink-soft:   rgba(31, 26, 21, 0.45);
  --accent:     #7a5a2b;
  --rule:       rgba(31, 26, 21, 0.18);
  --rule-strong:rgba(31, 26, 21, 0.35);

  /* type */
  --font-serif: 'Fraunces Variable', 'Fraunces', Georgia, serif;
  --font-mono:  'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;

  /* scale */
  --step-0:  clamp(0.95rem, 0.9rem + 0.2vw, 1.05rem);
  --step-1:  clamp(1.1rem,  1.0rem + 0.4vw, 1.25rem);
  --step-2:  clamp(1.35rem, 1.1rem + 1.0vw, 1.75rem);
  --step-3:  clamp(1.75rem, 1.3rem + 2.0vw, 2.5rem);
  --step-4:  clamp(2.5rem,  1.8rem + 3.5vw, 4rem);
  --step-5:  clamp(3.5rem,  2.2rem + 5.5vw, 6rem);

  /* layout */
  --container: 1180px;
  --gutter:    clamp(1.25rem, 2vw, 2.25rem);
  --section-y: clamp(4rem, 7vw, 7rem);
}
```

- [ ] **Step 2: Write `src/styles/fonts.css`**

```css
@import '@fontsource-variable/fraunces/index.css';
@import '@fontsource-variable/fraunces/italic.css';
@import '@fontsource/jetbrains-mono/400.css';
@import '@fontsource/jetbrains-mono/500.css';
```

- [ ] **Step 3: Write `src/styles/global.css`**

```css
@import './fonts.css';
@import './tokens.css';

*, *::before, *::after { box-sizing: border-box; }

html {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

body {
  margin: 0;
  background: var(--paper);
  color: var(--ink);
  font-family: var(--font-serif);
  font-weight: 400;
  font-size: var(--step-1);
  line-height: 1.55;
}

img, svg { display: block; max-width: 100%; }

a {
  color: inherit;
  text-decoration: none;
  background-image: linear-gradient(currentColor, currentColor);
  background-repeat: no-repeat;
  background-size: 0 1px;
  background-position: 0 100%;
  transition: background-size 0.25s ease;
}
a:hover { background-size: 100% 1px; }
a:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
  border-radius: 2px;
}

.container {
  max-width: var(--container);
  margin: 0 auto;
  padding-inline: var(--gutter);
}

.label {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--ink-muted);
}

.rule { height: 1px; background: var(--rule); }

.skip-link {
  position: absolute;
  left: -9999px;
  top: 0;
}
.skip-link:focus {
  left: 1rem;
  top: 1rem;
  background: var(--ink);
  color: var(--paper);
  padding: 0.5rem 0.75rem;
  z-index: 100;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add src/styles/
git commit -m "Add design tokens and global styles"
```

---

## Task 3: Base layout

**Files:**
- Create: `src/layouts/Base.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Write `src/layouts/Base.astro`**

```astro
---
import '@/styles/global.css';

interface Props {
  title?: string;
  description?: string;
  pathname?: string;
}

const {
  title = 'Aref Afzali — Software & ML Engineer',
  description = 'Software & ML engineer, co-founder, and graduate researcher. Building LLM agents, retrieval systems, and graph research from Montréal.',
  pathname = Astro.url.pathname
} = Astro.props;

const canonical = new URL(pathname, Astro.site ?? 'https://arefafzali.github.io').toString();
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonical} />
    <meta property="og:image" content="/og.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <title>{title}</title>
  </head>
  <body>
    <a class="skip-link" href="#main">Skip to content</a>
    <slot />
  </body>
</html>
```

- [ ] **Step 2: Update `src/pages/index.astro`**

```astro
---
import Base from '@/layouts/Base.astro';
---
<Base>
  <main id="main" class="container">
    <p style="padding-block: 4rem">Home under construction.</p>
  </main>
</Base>
```

- [ ] **Step 3: Verify dev server renders with global styles**

Run: `npm run dev`
Expected: Page uses cream/paper background and serif type. Stop with Ctrl+C.

- [ ] **Step 4: Add minimal favicon and OG placeholder**

Create `public/favicon.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="#f4ede2"/><text x="16" y="23" text-anchor="middle" font-family="Georgia,serif" font-size="22" font-style="italic" fill="#1f1a15">A</text></svg>
```

Create `public/og.png` as a 1200×630 solid-paper image with serif "Aref Afzali" — acceptable placeholder is a 1-KB PNG. Generate on build if preferred; for now copy any 1200×630 image and note TODO in `docs/` if deferring. For this plan, generate with a one-time Node script:

Create `scripts/make-og.mjs`:
```js
import { writeFileSync } from 'node:fs';
// 1200x630 paper-colored PNG bytes as a minimal placeholder
// Using a 1x1 paper-colored PNG scaled via CSS is fine for v1.
const pxPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2P8f4b9PwAG7gL4rFtXjQAAAABJRU5ErkJggg==',
  'base64'
);
writeFileSync('public/og.png', pxPng);
console.log('wrote public/og.png (placeholder)');
```

Run: `node scripts/make-og.mjs`
Expected: `wrote public/og.png (placeholder)`.

- [ ] **Step 5: Commit**

```bash
git add src/layouts/Base.astro src/pages/index.astro public/favicon.svg public/og.png scripts/make-og.mjs
git commit -m "Add base layout, favicon, OG placeholder"
```

---

## Task 4: Content collections with schemas

**Files:**
- Create: `src/content/config.ts`

- [ ] **Step 1: Write `src/content/config.ts`**

```ts
import { defineCollection, z } from 'astro:content';

const work = defineCollection({
  type: 'content',
  schema: z.object({
    company: z.string(),
    role: z.string(),
    location: z.string(),
    start: z.string(),      // e.g. "Apr 2025"
    end: z.string(),        // e.g. "Oct 2025" or "Present"
    order: z.number(),      // lower = more recent / shown first
    summary: z.string(),    // one-line impact
    bullets: z.array(z.string()).min(1)
  })
});

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    kind: z.enum(['research', 'product', 'thesis', 'open-source']),
    year: z.string(),
    summary: z.string(),
    highlights: z.array(z.string()).default([]),
    order: z.number()
  })
});

const publications = defineCollection({
  type: 'content',
  schema: z.object({
    authors: z.string(),
    year: z.number(),
    title: z.string(),
    venue: z.string(),
    kind: z.enum(['paper', 'poster', 'book']),
    order: z.number()
  })
});

export const collections = { work, projects, publications };
```

- [ ] **Step 2: Run type check**

Run: `npm run check`
Expected: No errors (may warn that no content exists yet — acceptable).

- [ ] **Step 3: Commit**

```bash
git add src/content/config.ts
git commit -m "Define content collection schemas"
```

---

## Task 5: Seed content from resume

**Files:**
- Create: `src/content/work/*.md` (4 files), `src/content/projects/*.md` (4 files), `src/content/publications/*.md` (2 files)

- [ ] **Step 1: Create `src/content/work/qliqless.md`**

```markdown
---
company: "Qliqless.ai"
role: "Co-Founder & ML Engineer"
location: "Montréal, QC"
start: "Apr 2025"
end: "Oct 2025"
order: 1
summary: "Co-founded and shipped an LLM conversational agent MVP; led architecture and infra end-to-end."
bullets:
  - "Built and shipped an AI conversational agent MVP that maps natural-language requests to real business actions via tool endpoints."
  - "Designed a multi-tenant architecture using MCP to provision per-business tool endpoints and customer-specific agent configurations."
  - "Containerized and deployed services with Docker/Kubernetes on AWS (EC2) behind an NGINX reverse proxy for reproducible environments and scalable rollout."
  - "Delivered multiple end-to-end demos to pilot users and iterated weekly on product feedback."
---
```

- [ ] **Step 2: Create `src/content/work/xraise.md`**

```markdown
---
company: "XRaise.ai"
role: "R&D Engineer"
location: "San Francisco, CA (Remote)"
start: "Dec 2024"
end: "Feb 2025"
order: 2
summary: "Built a RAG-based company matcher and LLM pipelines for VC & grant workflows."
bullets:
  - "Built a RAG recommender with LlamaIndex + Qdrant matching startups to similar YC/TechStars companies; integrated Exa Search API for live company data."
  - "Implemented a hybrid retrieval router combining vector similarity and keyword retrieval to improve coverage across sparse and exact-match queries."
  - "Evaluated retrieval quality with DeepEval and RAGAS to tune top-k and compare strategies."
  - "Architected an LLM-assisted pipeline extracting structured fields from VC and grant forms using HTML analysis, multimodal agents (Browser-Use), and HyperBrowser."
---
```

- [ ] **Step 3: Create `src/content/work/romaparvaz.md`**

```markdown
---
company: "RomaParvaz Travel Agency"
role: "Software Team Lead"
location: "Tehran, Iran"
start: "Mar 2022"
end: "Mar 2023"
order: 3
summary: "Led end-to-end delivery of a production airline ticketing platform."
bullets:
  - "Led end-to-end delivery of an airline ticketing platform from design to production using Scrum; coordinated backend, frontend, and integrations."
  - "Architected a microservices, event-driven backend (NestJS) with React frontend and PostgreSQL/MongoDB/Redis."
  - "Integrated multiple GDS providers (Amadeus, TravelPort, Gabriel) with resilient handling for third-party latency and failures."
  - "Owned production delivery: Docker + Compose, GitLab CI, NGINX with TLS + rate limiting, Cloudflare DNS/CDN, centralized logging with the ELK stack."
---
```

- [ ] **Step 4: Create `src/content/work/carriot.md`**

```markdown
---
company: "Carriot"
role: "Data Specialist"
location: "Tehran, Iran"
start: "Jul 2020"
end: "Apr 2021"
order: 4
summary: "Built routing optimization and geospatial analytics for a logistics platform."
bullets:
  - "Built a VRP optimization API in Flask using Google OR-Tools plus custom heuristic/metaheuristic methods, supporting PDPTW, time windows, and multi-depot routing."
  - "Developed a Persian address geocoding service using Sent2Vec embeddings and clustering to improve logistics address resolution."
  - "Implemented vehicle behavior analytics (stop-type detection, acceleration-axis calibration) on speed, acceleration, and geospatial signals."
  - "Built geospatial heatmaps to communicate demand patterns and fleet movement to stakeholders."
---
```

- [ ] **Step 5: Create `src/content/projects/mgcl.md`**

```markdown
---
title: "MGCLTransformer — Multimodal Graph Recommendation"
kind: "research"
year: "2024"
summary: "Graph Transformer + Multimodal Graph Contrastive Learning on user–item interactions with images and titles. +21.4% Hit Ratio, +44.1% NDCG over baselines."
highlights:
  - "PyTorch, PyTorch Geometric, SentenceTransformer, ResNet-50"
  - "Multimodal features fused with contrastive objectives"
order: 1
---
```

- [ ] **Step 6: Create `src/content/projects/thesis.md`**

```markdown
---
title: "Broadcasting Algorithms on K-Path Graphs"
kind: "thesis"
year: "2026"
summary: "M.Sc. thesis at Concordia with Prof. Hovhannes Harutyunyan — studying broadcast time and algorithms on the k-path family of graphs."
highlights:
  - "Graph theory, algorithm design, combinatorial optimization"
  - "Focus on structural properties governing broadcast schemes"
order: 2
---
```

- [ ] **Step 7: Create `src/content/projects/vrp.md`**

```markdown
---
title: "VRP Optimization API"
kind: "product"
year: "2021"
summary: "Flask API solving Vehicle Routing Problems at Carriot — PDPTW, time windows, and multi-depot cases via OR-Tools with custom heuristics."
highlights:
  - "Google OR-Tools + heuristic/metaheuristic search"
  - "Feasibility and objective tuning for real logistics"
order: 3
---
```

- [ ] **Step 8: Create `src/content/projects/basket.md`**

```markdown
---
title: "Basket Recommender — B.Sc. Thesis"
kind: "product"
year: "2022"
summary: "Association-rules recommender with Flask-RESTful backend, VueJS frontend, PostgreSQL, and Power BI analytics. Selected as 2nd-place faculty B.Sc. thesis."
highlights:
  - "Market-basket analysis and targeted customer recommendations"
  - "End-to-end: data → model → API → UI → BI dashboard"
order: 4
---
```

- [ ] **Step 9: Create `src/content/publications/snn.md`**

```markdown
---
authors: "Afzali A., Bashizade M., Akbarein H."
year: 2023
title: "The Application of Spiking Neural Network in Schizophrenia"
venue: "1st International Congress of Artificial Intelligence in Medical Sciences (AIMS 2023) — Poster"
kind: "poster"
order: 1
---
```

- [ ] **Step 10: Create `src/content/publications/discrete-math.md`**

```markdown
---
authors: "Shayegh B., Afzali A., MohammadHashemi S., MohammadTaheri K., Mohammadi S."
year: 2021
title: "Discrete Mathematics: An Introduction with an Academic Approach"
venue: "Open-source book manuscript"
kind: "book"
order: 2
---
```

- [ ] **Step 11: Type check**

Run: `npm run check`
Expected: No errors.

- [ ] **Step 12: Commit**

```bash
git add src/content/work src/content/projects src/content/publications
git commit -m "Seed Work, Projects, and Publications from resume"
```

---

## Task 6: Nav component

**Files:**
- Create: `src/components/Nav.astro`
- Modify: `src/layouts/Base.astro` (insert `<Nav />`)

- [ ] **Step 1: Write `src/components/Nav.astro`**

```astro
---
const links = [
  { href: '#trajectory',  label: 'Work' },
  { href: '#projects',    label: 'Research' },
  { href: '/notes/',      label: 'Notes' },
  { href: '#about',       label: 'About' },
  { href: '#contact',     label: 'Contact' }
];
---
<header class="nav">
  <div class="container nav-inner">
    <a class="nav-name" href="/">Aref Afzali</a>
    <nav aria-label="Primary">
      <ul>
        {links.map(({ href, label }) => (
          <li><a href={href}>{label}</a></li>
        ))}
      </ul>
    </nav>
  </div>
</header>

<style>
.nav {
  position: sticky;
  top: 0;
  z-index: 20;
  background: color-mix(in oklab, var(--paper) 92%, transparent);
  backdrop-filter: saturate(140%) blur(6px);
  -webkit-backdrop-filter: saturate(140%) blur(6px);
  border-bottom: 1px solid var(--rule);
}
.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-block: 0.9rem;
}
.nav-name {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  background: none;
}
.nav-name:hover { background-size: 0 1px; }
nav ul {
  display: flex;
  gap: clamp(0.75rem, 2vw, 1.5rem);
  list-style: none;
  margin: 0;
  padding: 0;
}
nav a {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ink-muted);
}
nav a:hover { color: var(--ink); }
@media (max-width: 640px) {
  nav ul { gap: 0.75rem; }
  nav a { font-size: 0.65rem; letter-spacing: 0.18em; }
}
</style>
```

- [ ] **Step 2: Wire into Base layout**

In `src/layouts/Base.astro`, add after the `skip-link`:
```astro
import Nav from '@/components/Nav.astro';
```
(inside the frontmatter, with the other import)
and inside the body, immediately after the skip link:
```astro
<Nav />
```

- [ ] **Step 3: Verify in dev server**

Run: `npm run dev`
Expected: Sticky nav at top of page with name left, five links right.

- [ ] **Step 4: Commit**

```bash
git add src/components/Nav.astro src/layouts/Base.astro
git commit -m "Add sticky primary nav"
```

---

## Task 7: Hero component

**Files:**
- Create: `src/components/Hero.astro`
- Add: `src/assets/portrait.jpg` (copied from `images/my_pic.jpg`)
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Copy portrait into assets**

Run: `cp "images/my_pic.jpg" src/assets/portrait.jpg`
Expected: File exists at `src/assets/portrait.jpg`.

- [ ] **Step 2: Write `src/components/Hero.astro`**

```astro
---
import { Image } from 'astro:assets';
import portrait from '@/assets/portrait.jpg';
---
<section class="hero" aria-labelledby="hero-title">
  <div class="container hero-inner">
    <p class="label hero-kicker">Software &amp; Machine Learning · Montréal</p>

    <div class="hero-top">
      <h1 id="hero-title" class="hero-title">
        Building quiet systems<br />
        for <em>noisy</em> problems.
      </h1>
      <figure class="hero-portrait">
        <Image
          src={portrait}
          alt="Portrait of Aref Afzali"
          width={220}
          height={280}
          loading="eager"
          format="webp"
          quality={82}
        />
        <figcaption class="hero-plate">Plate I · Afzali</figcaption>
      </figure>
    </div>

    <p class="hero-lede">
      I build, ship, and research ML-driven products — from co-founding <strong>Qliqless.ai</strong>
      to retrieval systems in production to graph research at <strong>Concordia</strong>.
    </p>

    <p class="hero-roles label">
      Co-Founder <span class="dot">·</span> ML Engineer <span class="dot">·</span> Researcher
    </p>

    <div class="rule hero-rule"></div>
    <div class="hero-foot">
      <span>Montréal · QC</span>
      <span>M.Sc. Concordia</span>
      <span>Est. 2017</span>
    </div>
  </div>
</section>

<style>
.hero { padding-block: clamp(3rem, 6vw, 5.5rem) clamp(2.5rem, 5vw, 4.5rem); }
.hero-kicker { margin: 0 0 1.75rem; color: var(--accent); }
.hero-top {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: clamp(1rem, 3vw, 3rem);
  align-items: start;
}
.hero-title {
  font-family: var(--font-serif);
  font-weight: 300;
  font-size: var(--step-5);
  line-height: 0.98;
  letter-spacing: -0.025em;
  margin: 0;
}
.hero-title em {
  font-style: italic;
  color: var(--accent);
  font-weight: 300;
}
.hero-portrait { margin: 0; position: relative; }
.hero-portrait img {
  width: clamp(120px, 14vw, 180px);
  height: auto;
  border-radius: 2px;
  filter: grayscale(0.15) contrast(1.02);
}
.hero-plate {
  position: absolute;
  left: -6px;
  bottom: -10px;
  background: var(--ink);
  color: var(--paper);
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  padding: 3px 7px;
}
.hero-lede {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 300;
  font-size: var(--step-2);
  line-height: 1.4;
  color: #3a3128;
  max-width: 52ch;
  margin: 2rem 0 0;
}
.hero-lede strong { font-style: normal; font-weight: 500; color: var(--ink); }
.hero-roles { margin: 1.25rem 0 0; color: var(--ink-muted); }
.hero-roles .dot { color: var(--rule-strong); padding-inline: 0.4rem; }
.hero-rule { margin: 2.5rem 0 0.9rem; }
.hero-foot {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ink-muted);
}

@media (max-width: 640px) {
  .hero-top { grid-template-columns: 1fr; }
  .hero-portrait { order: -1; }
  .hero-portrait img { width: 120px; }
}

/* staggered fade-in-up on load */
.hero-kicker, .hero-title, .hero-portrait, .hero-lede, .hero-roles, .hero-rule, .hero-foot {
  opacity: 0;
  transform: translateY(8px);
  animation: rise 0.7s cubic-bezier(.2,.6,.2,1) forwards;
}
.hero-kicker   { animation-delay: 0.05s; }
.hero-title    { animation-delay: 0.15s; }
.hero-portrait { animation-delay: 0.20s; }
.hero-lede     { animation-delay: 0.35s; }
.hero-roles    { animation-delay: 0.45s; }
.hero-rule     { animation-delay: 0.55s; }
.hero-foot     { animation-delay: 0.60s; }
@keyframes rise {
  to { opacity: 1; transform: none; }
}
</style>
```

- [ ] **Step 3: Update `src/pages/index.astro`**

```astro
---
import Base from '@/layouts/Base.astro';
import Hero from '@/components/Hero.astro';
---
<Base>
  <main id="main">
    <Hero />
  </main>
</Base>
```

- [ ] **Step 4: Verify in dev server**

Run: `npm run dev`
Expected: Hero renders with kicker, large headline (italic "noisy"), small portrait with "Plate I" chip, italic lede, roles strip, thin rule, and three-item foot row. Staggered fade-in on load.

- [ ] **Step 5: Commit**

```bash
git add src/assets/portrait.jpg src/components/Hero.astro src/pages/index.astro
git commit -m "Add hero with byline portrait and staggered reveal"
```

---

## Task 8: Numbers strip

**Files:**
- Create: `src/components/NumbersStrip.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Write `src/components/NumbersStrip.astro`**

```astro
---
const items = [
  { n: '04', label: 'Roles' },
  { n: '02', label: 'Publications' },
  { n: '01', label: 'Book' },
  { n: '06+', label: 'Years shipping' }
];
---
<section class="strip" aria-label="At a glance">
  <div class="container">
    <dl>
      {items.map(({ n, label }) => (
        <div class="cell">
          <dt class="label">{label}</dt>
          <dd>{n}</dd>
        </div>
      ))}
    </dl>
  </div>
</section>

<style>
.strip {
  border-block: 1px solid var(--rule);
  padding-block: 1.1rem;
}
dl {
  margin: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}
.cell {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.6rem;
}
.cell dd {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.95rem;
  letter-spacing: 0.02em;
  color: var(--ink);
}
.cell .label { margin: 0; }

@media (max-width: 640px) {
  dl { grid-template-columns: repeat(2, 1fr); row-gap: 0.4rem; }
}
</style>
```

- [ ] **Step 2: Mount in `src/pages/index.astro`**

Add import:
```astro
import NumbersStrip from '@/components/NumbersStrip.astro';
```
and render after `<Hero />`:
```astro
<NumbersStrip />
```

- [ ] **Step 3: Verify in dev server**

Run: `npm run dev`
Expected: Thin row of four cells with labels and mono values.

- [ ] **Step 4: Commit**

```bash
git add src/components/NumbersStrip.astro src/pages/index.astro
git commit -m "Add numbers strip"
```

---

## Task 9: About section

**Files:**
- Create: `src/components/About.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Write `src/components/About.astro`**

```astro
---
---
<section id="about" class="about" aria-labelledby="about-title">
  <div class="container about-grid">
    <div class="about-prose">
      <p class="label">§ About</p>
      <h2 id="about-title" class="section-title">On the work.</h2>
      <p>
        Aref is a software and ML engineer, co-founder, and graduate researcher. Most recently he co-founded
        <strong>Qliqless.ai</strong>, where he shipped a multi-tenant LLM conversational agent and led the
        infra end-to-end. Before that he built retrieval and recommendation systems at <strong>XRaise.ai</strong>,
        led an airline-ticketing platform from design to production as team lead at <strong>RomaParvaz</strong>,
        and solved vehicle-routing and geocoding problems at <strong>Carriot</strong>.
      </p>
      <p>
        At Concordia he is completing an M.Sc. under Prof. Hovhannes Harutyunyan on broadcasting algorithms over
        <em>k-path graphs</em>. He has published on spiking neural networks in medicine and co-authored an
        open-source discrete-mathematics textbook. He&rsquo;s happiest when research depth and production taste
        meet in the same project.
      </p>
    </div>
    <aside class="about-facts" aria-label="Quick facts">
      <div><p class="label">Role</p><p>Software &amp; ML Engineer</p></div>
      <div><p class="label">Degree</p><p>M.Sc. CS · Concordia (2024–2026)</p></div>
      <div><p class="label">Location</p><p>Montréal, QC</p></div>
      <div><p class="label">Languages</p><p>English (adv.) · Persian (native) · French, German (elem.)</p></div>
      <div><p class="label">Off the clock</p><p>4th-dan Kyokushin Karate · Guitar</p></div>
    </aside>
  </div>
</section>

<style>
.about { padding-block: var(--section-y); }
.about-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: clamp(1.5rem, 4vw, 4rem);
  align-items: start;
}
.section-title {
  font-family: var(--font-serif);
  font-weight: 300;
  font-size: var(--step-4);
  line-height: 1.02;
  letter-spacing: -0.02em;
  margin: 0.25rem 0 1.25rem;
}
.section-title em { font-style: italic; color: var(--accent); font-weight: 300; }
.about-prose p + p { margin-top: 1.25rem; }
.about-prose strong { font-weight: 500; }
.about-prose em { font-style: italic; color: var(--accent); }
.about-facts {
  border-top: 1px solid var(--rule);
  border-bottom: 1px solid var(--rule);
  padding: 1.1rem 0;
  display: grid;
  row-gap: 0.8rem;
}
.about-facts .label { margin: 0 0 0.15rem; }
.about-facts p:not(.label) { margin: 0; font-size: var(--step-0); }

@media (max-width: 900px) {
  .about-grid { grid-template-columns: 1fr; }
}
</style>
```

- [ ] **Step 2: Mount in `src/pages/index.astro`**

Add import and render after `<NumbersStrip />`.

- [ ] **Step 3: Verify in dev server**

Run: `npm run dev`
Expected: Two-column About with prose on the left and a boxed facts list on the right. Stacks on mobile.

- [ ] **Step 4: Commit**

```bash
git add src/components/About.astro src/pages/index.astro
git commit -m "Add About section"
```

---

## Task 10: Trajectory section

**Files:**
- Create: `src/components/Trajectory.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Write `src/components/Trajectory.astro`**

```astro
---
import { getCollection } from 'astro:content';

const entries = (await getCollection('work')).sort((a, b) => a.data.order - b.data.order);
---
<section id="trajectory" class="trajectory" aria-labelledby="trajectory-title">
  <div class="container">
    <header class="section-head">
      <p class="label">§ Trajectory</p>
      <h2 id="trajectory-title" class="section-title">Where the work has landed.</h2>
    </header>

    <ol class="rows">
      {entries.map(async (e) => {
        const { Content } = await e.render();
        return (
          <li class="row">
            <details>
              <summary>
                <span class="when">{e.data.start} — {e.data.end}</span>
                <span class="who">
                  <span class="role">{e.data.role}</span>
                  <span class="company">{e.data.company}</span>
                </span>
                <span class="what">{e.data.summary}</span>
                <span class="chev" aria-hidden="true">+</span>
              </summary>
              <div class="details">
                <ul>{e.data.bullets.map(b => <li>{b}</li>)}</ul>
                <Content />
              </div>
            </details>
          </li>
        );
      })}
    </ol>
  </div>
</section>

<style>
.trajectory { padding-block: var(--section-y); }
.section-head { margin-bottom: 2rem; }
.section-title {
  font-family: var(--font-serif);
  font-weight: 300;
  font-size: var(--step-4);
  line-height: 1.02;
  letter-spacing: -0.02em;
  margin: 0.25rem 0 0;
}
.rows { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--rule); }
.row { border-bottom: 1px solid var(--rule); }
.row summary {
  display: grid;
  grid-template-columns: 160px 1fr 1.25fr 24px;
  align-items: baseline;
  gap: 1.25rem;
  padding-block: 1.1rem;
  cursor: pointer;
  list-style: none;
}
.row summary::-webkit-details-marker { display: none; }
.row .when {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-muted);
}
.row .role {
  font-family: var(--font-serif);
  font-weight: 500;
  font-size: var(--step-1);
  display: block;
}
.row .company {
  font-family: var(--font-serif);
  font-style: italic;
  color: var(--ink-muted);
  font-size: var(--step-0);
}
.row .what {
  font-family: var(--font-serif);
  font-size: var(--step-0);
  color: var(--ink);
}
.row .chev {
  font-family: var(--font-mono);
  font-size: 1.1rem;
  color: var(--accent);
  justify-self: end;
  transition: transform 0.25s ease;
}
.row details[open] .chev { transform: rotate(45deg); }
.row .details {
  padding: 0 0 1.4rem 160px;
  color: var(--ink);
}
.row .details ul { margin: 0.2rem 0 0.6rem 1.1rem; padding: 0; }
.row .details li + li { margin-top: 0.3rem; }

@media (max-width: 900px) {
  .row summary {
    grid-template-columns: 1fr 24px;
    row-gap: 0.3rem;
  }
  .row .when { grid-column: 1 / -1; }
  .row .who  { grid-column: 1; }
  .row .what { grid-column: 1 / -1; }
  .row .chev { grid-row: 2; grid-column: 2; }
  .row .details { padding-left: 0; }
}
</style>
```

- [ ] **Step 2: Mount and verify**

Import and render `<Trajectory />` after `<About />` in `src/pages/index.astro`.
Run: `npm run dev`
Expected: Four rows in reverse chronological order; clicking a row expands resume bullets. Rule dividers between rows. Role reads first (heavier), company italic beneath.

- [ ] **Step 3: Commit**

```bash
git add src/components/Trajectory.astro src/pages/index.astro
git commit -m "Add Trajectory (Selected Work) section"
```

---

## Task 11: Projects & Research section with thesis graph motif

**Files:**
- Create: `src/components/ThesisGraph.astro`, `src/components/ProjectsResearch.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Write `src/components/ThesisGraph.astro`**

```astro
---
// Low-contrast animated node-graph SVG for the thesis card background.
// Nine nodes arranged on an implicit k-path; edges pulse in sequence.
---
<svg
  class="thesis-graph"
  viewBox="0 0 400 220"
  role="presentation"
  aria-hidden="true"
  preserveAspectRatio="xMidYMid slice"
>
  <defs>
    <radialGradient id="tgFade" cx="30%" cy="30%" r="80%">
      <stop offset="0%" stop-color="rgba(122,90,43,0.22)" />
      <stop offset="100%" stop-color="rgba(122,90,43,0)" />
    </radialGradient>
  </defs>
  <rect width="400" height="220" fill="url(#tgFade)" />
  <g stroke="rgba(31,26,21,0.22)" stroke-width="0.75" fill="none" class="edges">
    <line x1="40"  y1="60"  x2="100" y2="120" />
    <line x1="100" y1="120" x2="170" y2="70"  />
    <line x1="170" y1="70"  x2="240" y2="130" />
    <line x1="240" y1="130" x2="310" y2="80"  />
    <line x1="310" y1="80"  x2="360" y2="150" />
    <line x1="100" y1="120" x2="170" y2="170" />
    <line x1="170" y1="170" x2="240" y2="130" />
  </g>
  <g fill="var(--accent)" class="nodes">
    <circle cx="40"  cy="60"  r="2.6" />
    <circle cx="100" cy="120" r="3.2" />
    <circle cx="170" cy="70"  r="2.4" />
    <circle cx="170" cy="170" r="2.4" />
    <circle cx="240" cy="130" r="3.4" />
    <circle cx="310" cy="80"  r="2.6" />
    <circle cx="360" cy="150" r="2.2" />
  </g>
  <style>
    .thesis-graph .edges line {
      stroke-dasharray: 8 120;
      stroke-dashoffset: 120;
      animation: tgPulse 6s linear infinite;
    }
    .thesis-graph .edges line:nth-child(2) { animation-delay: 0.6s; }
    .thesis-graph .edges line:nth-child(3) { animation-delay: 1.2s; }
    .thesis-graph .edges line:nth-child(4) { animation-delay: 1.8s; }
    .thesis-graph .edges line:nth-child(5) { animation-delay: 2.4s; }
    .thesis-graph .edges line:nth-child(6) { animation-delay: 3.0s; }
    .thesis-graph .edges line:nth-child(7) { animation-delay: 3.6s; }
    @keyframes tgPulse {
      to { stroke-dashoffset: -120; }
    }
    @media (prefers-reduced-motion: reduce) {
      .thesis-graph .edges line { animation: none; stroke-dasharray: none; stroke-dashoffset: 0; }
    }
  </style>
</svg>
```

- [ ] **Step 2: Write `src/components/ProjectsResearch.astro`**

```astro
---
import { getCollection } from 'astro:content';
import ThesisGraph from '@/components/ThesisGraph.astro';

const items = (await getCollection('projects')).sort((a, b) => a.data.order - b.data.order);
---
<section id="projects" class="projects" aria-labelledby="projects-title">
  <div class="container">
    <header class="section-head">
      <p class="label">§ Projects &amp; Research</p>
      <h2 id="projects-title" class="section-title">A selection, <em>plainly told</em>.</h2>
    </header>

    <div class="grid">
      {items.map((p) => (
        <article class={`card ${p.data.kind === 'thesis' ? 'card-thesis' : ''}`}>
          {p.data.kind === 'thesis' && (
            <>
              <ThesisGraph />
              <p class="plate label">Plate II · Thesis</p>
            </>
          )}
          <p class="label"><span class="k">{p.data.kind}</span> · {p.data.year}</p>
          <h3>{p.data.title}</h3>
          <p class="summary">{p.data.summary}</p>
          {p.data.highlights.length > 0 && (
            <ul class="highlights">
              {p.data.highlights.map(h => <li>{h}</li>)}
            </ul>
          )}
        </article>
      ))}
    </div>
  </div>
</section>

<style>
.projects { padding-block: var(--section-y); }
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(1rem, 2.5vw, 2rem);
}
.card {
  position: relative;
  padding: 1.6rem 1.6rem 1.8rem;
  background: var(--paper-2);
  border: 1px solid var(--rule);
  border-radius: 4px;
  overflow: hidden;
}
.card .label .k { color: var(--accent); text-transform: uppercase; }
.card h3 {
  font-family: var(--font-serif);
  font-weight: 400;
  font-size: var(--step-2);
  line-height: 1.15;
  letter-spacing: -0.01em;
  margin: 0.4rem 0 0.6rem;
}
.card .summary { margin: 0 0 0.75rem; color: var(--ink); }
.highlights { margin: 0; padding-left: 1.1rem; color: var(--ink-muted); font-size: var(--step-0); }
.highlights li + li { margin-top: 0.2rem; }
.section-title {
  font-family: var(--font-serif);
  font-weight: 300;
  font-size: var(--step-4);
  line-height: 1.02;
  letter-spacing: -0.02em;
  margin: 0.25rem 0 2rem;
}
.section-title em { font-style: italic; color: var(--accent); font-weight: 300; }

.card-thesis { background: var(--paper); }
.card-thesis .thesis-graph {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}
.card-thesis > *:not(.thesis-graph) { position: relative; z-index: 1; }
.card-thesis .plate {
  position: absolute;
  top: 0.9rem;
  right: 1rem;
  margin: 0;
  color: var(--ink-muted);
  letter-spacing: 0.22em;
}

@media (max-width: 900px) {
  .grid { grid-template-columns: 1fr; }
}
</style>
```

- [ ] **Step 3: Mount and verify**

Import and render `<ProjectsResearch />` after `<Trajectory />`.
Run: `npm run dev`
Expected: Four project cards, two per row. Thesis card has a faint animated node-graph behind the text and a "Plate II · Thesis" caption top-right. Animation halts when system prefers reduced motion.

- [ ] **Step 4: Commit**

```bash
git add src/components/ThesisGraph.astro src/components/ProjectsResearch.astro src/pages/index.astro
git commit -m "Add Projects & Research with thesis graph motif"
```

---

## Task 12: Publications section

**Files:**
- Create: `src/components/Publications.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Write `src/components/Publications.astro`**

```astro
---
import { getCollection } from 'astro:content';
const pubs = (await getCollection('publications')).sort((a, b) => a.data.order - b.data.order);
---
<section id="publications" class="pubs" aria-labelledby="pubs-title">
  <div class="container">
    <header class="section-head">
      <p class="label">§ Publications</p>
      <h2 id="pubs-title" class="section-title">What&rsquo;s in print.</h2>
    </header>
    <ol class="list">
      {pubs.map(p => (
        <li>
          <p class="authors">{p.data.authors} ({p.data.year}).</p>
          <p class="title"><em>{p.data.title}.</em></p>
          <p class="venue label">{p.data.venue}</p>
        </li>
      ))}
    </ol>
  </div>
</section>

<style>
.pubs { padding-block: var(--section-y); }
.list { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--rule); }
.list li { padding-block: 1.25rem; border-bottom: 1px solid var(--rule); }
.authors { margin: 0; color: var(--ink-muted); }
.title { margin: 0.1rem 0; font-size: var(--step-1); }
.title em { font-style: italic; color: var(--ink); }
.venue { margin: 0.2rem 0 0; color: var(--ink-muted); letter-spacing: 0.16em; }
.section-title {
  font-family: var(--font-serif);
  font-weight: 300;
  font-size: var(--step-4);
  line-height: 1.02;
  margin: 0.25rem 0 1.25rem;
}
</style>
```

- [ ] **Step 2: Mount, verify, commit**

Import and render `<Publications />` after `<ProjectsResearch />`.
Run: `npm run dev` and check the rendered list.

```bash
git add src/components/Publications.astro src/pages/index.astro
git commit -m "Add Publications section"
```

---

## Task 13: Teaching section

**Files:**
- Create: `src/components/Teaching.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Write `src/components/Teaching.astro`**

```astro
---
---
<section id="teaching" class="teaching" aria-labelledby="teaching-title">
  <div class="container">
    <p class="label">§ Teaching</p>
    <h2 id="teaching-title" class="section-title">On passing it along.</h2>
    <p>
      Aref has taught and mentored across computer-science disciplines — from introductory programming
      to applied statistics — and co-authored an open-source discrete-mathematics textbook (2021)
      used by undergraduates as an approachable on-ramp to proofs and combinatorics.
    </p>
  </div>
</section>

<style>
.teaching { padding-block: var(--section-y); }
.section-title {
  font-family: var(--font-serif);
  font-weight: 300;
  font-size: var(--step-4);
  line-height: 1.02;
  margin: 0.25rem 0 1rem;
}
.teaching p { max-width: 60ch; }
</style>
```

- [ ] **Step 2: Mount, verify, commit**

Import and render after `<Publications />`.

```bash
git add src/components/Teaching.astro src/pages/index.astro
git commit -m "Add Teaching section"
```

---

## Task 14: Personal section

**Files:**
- Create: `src/components/Personal.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Write `src/components/Personal.astro`**

```astro
---
---
<section id="personal" class="personal" aria-labelledby="personal-title">
  <div class="container">
    <p class="label">§ Off the clock</p>
    <h2 id="personal-title" class="section-title">A life in <em>two</em> registers.</h2>
    <p>
      Outside engineering, Aref is a 4th-dan black belt and instructor in Kyokushin Karate — a
      long-running counterweight to the screen-bound half of his life. He plays guitar,
      reads broadly, and is fluent in Persian and English, with elementary French and German.
    </p>
  </div>
</section>

<style>
.personal { padding-block: var(--section-y); }
.section-title {
  font-family: var(--font-serif);
  font-weight: 300;
  font-size: var(--step-4);
  line-height: 1.02;
  margin: 0.25rem 0 1rem;
}
.section-title em { font-style: italic; color: var(--accent); }
.personal p { max-width: 60ch; }
</style>
```

- [ ] **Step 2: Mount, verify, commit**

Import and render after `<Teaching />`.

```bash
git add src/components/Personal.astro src/pages/index.astro
git commit -m "Add Personal section"
```

---

## Task 15: Contact section + footer

**Files:**
- Create: `src/components/Contact.astro`
- Modify: `src/pages/index.astro`, `src/layouts/Base.astro`

- [ ] **Step 1: Write `src/components/Contact.astro`**

```astro
---
const links = [
  { href: 'mailto:afzaliaref.aa@gmail.com', label: 'afzaliaref.aa@gmail.com' },
  { href: 'https://www.linkedin.com/in/arefafzali/', label: 'LinkedIn → in/arefafzali' },
  { href: 'https://github.com/arefafzali', label: 'GitHub → @arefafzali' },
  { href: 'https://telegram.im/@arefafzali', label: 'Telegram → @arefafzali' }
];
---
<section id="contact" class="contact" aria-labelledby="contact-title">
  <div class="container">
    <p class="label">§ Contact</p>
    <h2 id="contact-title" class="section-title">Say hello.</h2>
    <ul class="links">
      {links.map(l => (
        <li>
          <a href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}>{l.label}</a>
        </li>
      ))}
      <li>
        <a href="/Aref_Resume.pdf" target="_blank" rel="noopener noreferrer">Download CV →</a>
      </li>
    </ul>
  </div>
</section>

<footer class="site-foot">
  <div class="container foot-inner">
    <span>© {new Date().getFullYear()} Aref Afzali</span>
    <span>Built in Astro · Montréal</span>
  </div>
</footer>

<style>
.contact { padding-block: var(--section-y) clamp(2rem, 4vw, 3rem); }
.section-title {
  font-family: var(--font-serif);
  font-weight: 300;
  font-size: var(--step-4);
  line-height: 1.02;
  margin: 0.25rem 0 1.25rem;
}
.links { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--rule); }
.links li { padding-block: 0.9rem; border-bottom: 1px solid var(--rule); }
.links a {
  font-family: var(--font-mono);
  font-size: 0.95rem;
  letter-spacing: 0.02em;
}
.site-foot {
  border-top: 1px solid var(--rule);
  padding-block: 1.5rem;
  background: var(--paper-2);
}
.foot-inner {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--ink-muted);
}
</style>
```

- [ ] **Step 2: Move resume to `public/`**

Run: `cp Aref_s_Resume.pdf public/Aref_Resume.pdf`
Expected: File exists.

- [ ] **Step 3: Mount contact in index**

Import and render `<Contact />` after `<Personal />`.

- [ ] **Step 4: Verify and commit**

Run: `npm run dev`
Expected: Contact link list renders, CV link downloads the PDF.

```bash
git add src/components/Contact.astro public/Aref_Resume.pdf src/pages/index.astro
git commit -m "Add Contact section and footer"
```

---

## Task 16: Notion fetcher (library + unit test)

**Files:**
- Create: `src/lib/notion.ts`, `src/lib/notion.test.ts`, `vitest.config.ts`, `.env.example`

- [ ] **Step 1: Write `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts']
  },
  resolve: { alias: { '@': '/src' } }
});
```

- [ ] **Step 2: Write `.env.example`**

```
NOTION_TOKEN=
NOTION_NOTES_DATABASE_ID=
```

- [ ] **Step 3: Write the failing test at `src/lib/notion.test.ts`**

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@notionhq/client', () => {
  const queryImpl = vi.fn();
  class Client {
    databases = { query: queryImpl };
    constructor() {}
  }
  return { Client, __queryImpl: queryImpl };
});

vi.mock('notion-to-md', () => {
  class NotionToMarkdown {
    constructor() {}
    async pageToMarkdown() { return [{ parent: 'body', children: [] }]; }
    toMarkdownString(_: unknown) { return { parent: '# sample body' }; }
  }
  return { NotionToMarkdown };
});

import { fetchPublishedNotes } from './notion';
import * as notion from '@notionhq/client';

describe('fetchPublishedNotes', () => {
  beforeEach(() => {
    (notion as any).__queryImpl.mockReset();
  });

  it('returns only pages where Published = true, mapped to NoteEntry shape', async () => {
    (notion as any).__queryImpl.mockResolvedValue({
      results: [
        {
          id: 'p1',
          last_edited_time: '2026-04-01T12:00:00Z',
          properties: {
            Title: { type: 'title', title: [{ plain_text: 'First note' }] },
            Slug:  { type: 'rich_text', rich_text: [{ plain_text: 'first-note' }] },
            Published: { type: 'checkbox', checkbox: true },
            Date: { type: 'date', date: { start: '2026-04-01' } },
            Dek:  { type: 'rich_text', rich_text: [{ plain_text: 'A short dek.' }] }
          }
        }
      ],
      has_more: false,
      next_cursor: null
    });

    const notes = await fetchPublishedNotes({ token: 't', databaseId: 'db' });
    expect(notes).toHaveLength(1);
    expect(notes[0]).toMatchObject({
      id: 'p1',
      slug: 'first-note',
      title: 'First note',
      dek: 'A short dek.',
      date: '2026-04-01',
      body: '# sample body'
    });
  });

  it('returns [] when Notion returns no results', async () => {
    (notion as any).__queryImpl.mockResolvedValue({ results: [], has_more: false, next_cursor: null });
    const notes = await fetchPublishedNotes({ token: 't', databaseId: 'db' });
    expect(notes).toEqual([]);
  });

  it('derives slug from title when Slug property missing', async () => {
    (notion as any).__queryImpl.mockResolvedValue({
      results: [{
        id: 'p2',
        last_edited_time: '2026-04-01T12:00:00Z',
        properties: {
          Title: { type: 'title', title: [{ plain_text: 'My Great Post!' }] },
          Published: { type: 'checkbox', checkbox: true },
          Date: { type: 'date', date: { start: '2026-04-02' } }
        }
      }],
      has_more: false, next_cursor: null
    });
    const notes = await fetchPublishedNotes({ token: 't', databaseId: 'db' });
    expect(notes[0].slug).toBe('my-great-post');
  });
});
```

- [ ] **Step 4: Run the test and verify it fails**

Run: `npm test`
Expected: FAIL — module `./notion` not found.

- [ ] **Step 5: Implement `src/lib/notion.ts`**

```ts
import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';

export interface NoteEntry {
  id: string;
  slug: string;
  title: string;
  dek: string;
  date: string;          // ISO date (YYYY-MM-DD)
  lastEdited: string;    // ISO datetime
  body: string;          // markdown body
}

export interface FetchOpts {
  token: string;
  databaseId: string;
}

function plain(prop: any): string {
  if (!prop) return '';
  if (prop.type === 'title') return (prop.title ?? []).map((t: any) => t.plain_text).join('');
  if (prop.type === 'rich_text') return (prop.rich_text ?? []).map((t: any) => t.plain_text).join('');
  return '';
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export async function fetchPublishedNotes(opts: FetchOpts): Promise<NoteEntry[]> {
  const notion = new Client({ auth: opts.token });
  const n2m = new NotionToMarkdown({ notionClient: notion });

  const notes: NoteEntry[] = [];
  let cursor: string | undefined = undefined;

  do {
    const resp: any = await notion.databases.query({
      database_id: opts.databaseId,
      filter: { property: 'Published', checkbox: { equals: true } },
      sorts: [{ property: 'Date', direction: 'descending' }],
      start_cursor: cursor
    });

    for (const page of resp.results ?? []) {
      const title = plain(page.properties?.Title);
      const slug =
        plain(page.properties?.Slug) ||
        slugify(title);
      const dek = plain(page.properties?.Dek);
      const date = page.properties?.Date?.date?.start ?? '';

      const blocks = await n2m.pageToMarkdown(page.id);
      const md = n2m.toMarkdownString(blocks);

      notes.push({
        id: page.id,
        slug,
        title,
        dek,
        date,
        lastEdited: page.last_edited_time,
        body: md.parent ?? ''
      });
    }

    cursor = resp.has_more ? resp.next_cursor : undefined;
  } while (cursor);

  return notes;
}
```

- [ ] **Step 6: Run tests and verify pass**

Run: `npm test`
Expected: All three tests pass.

- [ ] **Step 7: Commit**

```bash
git add src/lib/notion.ts src/lib/notion.test.ts vitest.config.ts .env.example
git commit -m "Add Notion fetcher with unit tests"
```

---

## Task 17: Notes index + dynamic route

**Files:**
- Create: `src/pages/notes/index.astro`, `src/pages/notes/[slug].astro`
- Create: `src/components/NotesPreview.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Write a build-time wrapper for Notion access**

Edit `src/lib/notion.ts` — add at the bottom:

```ts
export async function loadNotes(): Promise<NoteEntry[]> {
  const token = import.meta.env.NOTION_TOKEN;
  const databaseId = import.meta.env.NOTION_NOTES_DATABASE_ID;
  if (!token || !databaseId) {
    if (import.meta.env.PROD) {
      throw new Error('NOTION_TOKEN and NOTION_NOTES_DATABASE_ID must be set for production builds.');
    }
    return [];
  }
  return fetchPublishedNotes({ token, databaseId });
}
```

- [ ] **Step 2: Write `src/pages/notes/index.astro`**

```astro
---
import Base from '@/layouts/Base.astro';
import Nav from '@/components/Nav.astro';
import { loadNotes } from '@/lib/notion';

const notes = await loadNotes();
---
<Base title="Notes — Aref Afzali" description="Writing by Aref Afzali.">
  <Nav />
  <main id="main" class="container notes">
    <header>
      <p class="label">§ Notes</p>
      <h1 class="title">Writing, occasionally.</h1>
    </header>
    {notes.length === 0 ? (
      <p class="empty">No published notes yet. Check back shortly.</p>
    ) : (
      <ol class="list">
        {notes.map(n => (
          <li>
            <a href={`/notes/${n.slug}/`}>
              <time class="label">{n.date}</time>
              <h2>{n.title}</h2>
              {n.dek && <p class="dek">{n.dek}</p>}
            </a>
          </li>
        ))}
      </ol>
    )}
  </main>
</Base>

<style>
.notes { padding-block: clamp(3rem, 6vw, 5rem); }
.title { font-family: var(--font-serif); font-weight: 300; font-size: var(--step-4); line-height: 1.02; margin: 0.25rem 0 2rem; }
.list { list-style: none; padding: 0; margin: 0; border-top: 1px solid var(--rule); }
.list li { border-bottom: 1px solid var(--rule); }
.list a { display: block; padding-block: 1.1rem; background: none; }
.list a:hover h2 { color: var(--accent); }
.list h2 { font-family: var(--font-serif); font-weight: 400; font-size: var(--step-2); margin: 0.1rem 0 0.2rem; }
.list .dek { margin: 0; color: var(--ink-muted); }
.empty { color: var(--ink-muted); }
</style>
```

- [ ] **Step 3: Write `src/pages/notes/[slug].astro`**

```astro
---
import Base from '@/layouts/Base.astro';
import Nav from '@/components/Nav.astro';
import { loadNotes } from '@/lib/notion';
import { marked } from 'marked';

export async function getStaticPaths() {
  const notes = await loadNotes();
  return notes.map(n => ({ params: { slug: n.slug }, props: { note: n } }));
}

const { note } = Astro.props;
const html = marked.parse(note.body);
---
<Base title={`${note.title} — Aref Afzali`} description={note.dek}>
  <Nav />
  <main id="main" class="container note">
    <p class="label"><a href="/notes/">← Notes</a> · <time>{note.date}</time></p>
    <h1>{note.title}</h1>
    {note.dek && <p class="dek">{note.dek}</p>}
    <article set:html={html} />
  </main>
</Base>

<style>
.note { padding-block: clamp(3rem, 6vw, 5rem); max-width: 720px; }
.note h1 { font-family: var(--font-serif); font-weight: 400; font-size: var(--step-4); line-height: 1.05; letter-spacing: -0.02em; margin: 0.25rem 0 0.5rem; }
.note .dek { color: var(--ink-muted); font-style: italic; margin: 0 0 2rem; font-size: var(--step-1); }
.note article h2 { font-family: var(--font-serif); font-weight: 500; font-size: var(--step-2); margin-top: 2rem; }
.note article p { line-height: 1.7; }
.note article code { font-family: var(--font-mono); font-size: 0.9em; background: var(--paper-2); padding: 0.1em 0.3em; border-radius: 2px; }
.note article pre { background: var(--paper-2); padding: 1rem; border-radius: 4px; overflow-x: auto; }
.note article pre code { background: none; padding: 0; }
.note article blockquote { border-left: 2px solid var(--accent); margin-left: 0; padding-left: 1rem; color: var(--ink-muted); font-style: italic; }
</style>
```

- [ ] **Step 4: Install `marked` for markdown→HTML**

Run: `npm install marked@^14.1.3`
Expected: Installed.

- [ ] **Step 5: Write `src/components/NotesPreview.astro`**

```astro
---
import { loadNotes } from '@/lib/notion';
const notes = (await loadNotes()).slice(0, 5);
---
<section id="notes" class="notes-preview" aria-labelledby="notes-title">
  <div class="container">
    <header class="section-head">
      <p class="label">§ Notes</p>
      <h2 id="notes-title" class="section-title">Recent writing.</h2>
    </header>

    {notes.length === 0 ? (
      <p class="empty">No published notes yet. <a href="/notes/">Coming soon →</a></p>
    ) : (
      <ol class="list">
        {notes.map(n => (
          <li>
            <a href={`/notes/${n.slug}/`}>
              <time class="label">{n.date}</time>
              <span class="title">{n.title}</span>
              {n.dek && <span class="dek">— {n.dek}</span>}
            </a>
          </li>
        ))}
      </ol>
    )}
    <p class="all"><a href="/notes/">View all notes →</a></p>
  </div>
</section>

<style>
.notes-preview { padding-block: var(--section-y); }
.section-title { font-family: var(--font-serif); font-weight: 300; font-size: var(--step-4); line-height: 1.02; margin: 0.25rem 0 2rem; }
.list { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--rule); }
.list li { border-bottom: 1px solid var(--rule); }
.list a {
  display: grid;
  grid-template-columns: 110px 1fr auto;
  gap: 1rem;
  align-items: baseline;
  padding-block: 0.9rem;
  background: none;
}
.list a:hover .title { color: var(--accent); }
.list time { color: var(--ink-muted); letter-spacing: 0.18em; }
.list .title { font-family: var(--font-serif); font-size: var(--step-1); }
.list .dek { color: var(--ink-muted); font-style: italic; font-size: var(--step-0); grid-column: 2 / -1; }
.all { margin-top: 1.5rem; }
.empty { color: var(--ink-muted); }
@media (max-width: 640px) {
  .list a { grid-template-columns: 1fr; gap: 0.2rem; }
}
</style>
```

- [ ] **Step 6: Mount `<NotesPreview />` on the home page**

Import and render after `<Publications />` but before `<Teaching />`:
```astro
import NotesPreview from '@/components/NotesPreview.astro';
```
```astro
<NotesPreview />
```

- [ ] **Step 7: Verify with no Notion credentials set**

Run: `npm run dev`
Expected: Home page renders; Notes section shows "Coming soon →" fallback. `/notes/` shows empty state. No crash.

- [ ] **Step 8: Run build to confirm dev-time fallback does not crash build without env vars**

Temporarily remove the production-env guard check by setting `NOTION_TOKEN` absent and running `astro build`. Expected: build fails with the explicit error from `loadNotes()`. This is correct — production requires the env vars.

Then set dummy placeholders in the shell to verify the code path:
```bash
NOTION_TOKEN=dev NOTION_NOTES_DATABASE_ID=dev npm run build
```
Expected: Build calls the Notion API and fails with a Notion authentication error (expected — we used a dummy token). This proves wiring is correct.

For local dev, leave env vars unset — `loadNotes()` returns `[]` and everything renders.

- [ ] **Step 9: Commit**

```bash
git add src/pages/notes src/lib/notion.ts src/components/NotesPreview.astro src/pages/index.astro package.json package-lock.json
git commit -m "Add Notes index, dynamic routes, and home preview"
```

---

## Task 18: Smoke tests with Playwright

**Files:**
- Create: `playwright.config.ts`, `tests/smoke.spec.ts`

- [ ] **Step 1: Write `playwright.config.ts`**

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'retain-on-failure'
  },
  webServer: {
    command: 'npm run build && npm run preview -- --port 4321',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 120000
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
  ]
});
```

- [ ] **Step 2: Install browser binaries**

Run: `npx playwright install chromium`
Expected: Chromium installed.

- [ ] **Step 3: Write `tests/smoke.spec.ts`**

```ts
import { test, expect } from '@playwright/test';

test.describe('home page', () => {
  test('renders hero with name, identity, and lede', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Building quiet systems');
    await expect(page.locator('.hero-lede')).toContainText('co-founding Qliqless.ai');
    await expect(page.locator('.hero-roles')).toContainText('Co-Founder');
    await expect(page.locator('.hero-roles')).toContainText('ML Engineer');
    await expect(page.locator('.hero-roles')).toContainText('Researcher');
  });

  test('renders all primary sections', async ({ page }) => {
    await page.goto('/');
    for (const id of ['about', 'trajectory', 'projects', 'publications', 'notes', 'teaching', 'personal', 'contact']) {
      await expect(page.locator(`#${id}`)).toBeVisible();
    }
  });

  test('trajectory shows all four roles', async ({ page }) => {
    await page.goto('/');
    const summaries = page.locator('#trajectory .row summary .role');
    await expect(summaries).toHaveCount(4);
    await expect(summaries.nth(0)).toContainText('Co-Founder');
    await expect(summaries.nth(3)).toContainText('Data Specialist');
  });

  test('numbers strip shows the four quantities', async ({ page }) => {
    await page.goto('/');
    const cells = page.locator('.strip dl .cell');
    await expect(cells).toHaveCount(4);
  });

  test('contact exposes email and CV link', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'afzaliaref.aa@gmail.com' })).toHaveAttribute('href', /mailto:/);
    await expect(page.getByRole('link', { name: /Download CV/ })).toHaveAttribute('href', '/Aref_Resume.pdf');
  });

  test('notes index route renders without crashing', async ({ page }) => {
    await page.goto('/notes/');
    await expect(page.locator('h1')).toContainText('Writing');
  });
});
```

- [ ] **Step 4: Run tests**

Run: `npm run e2e`
Expected: 6 tests pass.

- [ ] **Step 5: Commit**

```bash
git add playwright.config.ts tests/smoke.spec.ts
git commit -m "Add Playwright smoke tests"
```

---

## Task 19: Accessibility tests

**Files:**
- Create: `tests/a11y.spec.ts`

- [ ] **Step 1: Write `tests/a11y.spec.ts`**

```ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('accessibility', () => {
  test('home page has no critical axe violations', async ({ page }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    const critical = results.violations.filter(v => v.impact === 'critical' || v.impact === 'serious');
    expect(critical, JSON.stringify(critical, null, 2)).toEqual([]);
  });

  test('notes index has no critical axe violations', async ({ page }) => {
    await page.goto('/notes/');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    const critical = results.violations.filter(v => v.impact === 'critical' || v.impact === 'serious');
    expect(critical, JSON.stringify(critical, null, 2)).toEqual([]);
  });

  test('skip link is reachable by keyboard', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skip = page.locator('.skip-link');
    await expect(skip).toBeFocused();
    await expect(skip).toHaveText(/Skip/i);
  });
});
```

- [ ] **Step 2: Run tests**

Run: `npm run e2e -- tests/a11y.spec.ts`
Expected: 3 tests pass. If any violation is reported, read the JSON, fix the markup in the implicated component, and rerun.

- [ ] **Step 3: Commit**

```bash
git add tests/a11y.spec.ts
git commit -m "Add axe-core accessibility smoke tests"
```

---

## Task 20: Remove legacy files

**Files:**
- Delete: `index.html`, `css/`, `js/`, `fonts/`, `images/`, `Aref_s_Resume.pdf`, `Aref_Resume.pdf` (root)

- [ ] **Step 1: Confirm Astro build still renders correctly**

Run: `npm run build && npm run preview -- --port 4321`
In a browser, load `http://localhost:4321` and click through: home scroll, Notes link, CV link. All should work.
Stop the server.

- [ ] **Step 2: Delete legacy files**

```bash
git rm -r index.html css js fonts images Aref_s_Resume.pdf
# (Aref_Resume.pdf at the root is already removed per the status in the spec context)
```

- [ ] **Step 3: Re-run build and smoke tests**

Run: `npm run build && npm run e2e`
Expected: All tests pass.

- [ ] **Step 4: Commit**

```bash
git commit -m "Remove legacy static site in favor of Astro build"
```

---

## Task 21: GitHub Pages deploy workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Enable GitHub Pages for the repo**

In GitHub → repo Settings → Pages → Build source: **GitHub Actions**.

- [ ] **Step 2: Add repository secrets**

In GitHub → repo Settings → Secrets and variables → Actions, add:
- `NOTION_TOKEN`
- `NOTION_NOTES_DATABASE_ID`

- [ ] **Step 3: Write `.github/workflows/deploy.yml`**

```yaml
name: Deploy site

on:
  push:
    branches: [master]
  workflow_dispatch:

concurrency:
  group: pages
  cancel-in-progress: false

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: .node-version
          cache: npm
      - run: npm ci
      - run: npm run check
      - run: npm test
      - run: npm run build
        env:
          NOTION_TOKEN: ${{ secrets.NOTION_TOKEN }}
          NOTION_NOTES_DATABASE_ID: ${{ secrets.NOTION_NOTES_DATABASE_ID }}
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deploy.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deploy
```

- [ ] **Step 4: Update `astro.config.mjs` `site` URL**

If deploying to `https://<user>.github.io/<repo>`, update `site` and set `base` accordingly. For the default user-site `https://arefafzali.github.io`, `site: 'https://arefafzali.github.io'` is correct and `base` stays unset.

- [ ] **Step 5: Commit and push**

```bash
git add .github/workflows/deploy.yml astro.config.mjs
git commit -m "Add GitHub Pages deploy workflow"
git push
```

- [ ] **Step 6: Verify the Action runs**

In GitHub → Actions tab, confirm the workflow runs green. Visit the Pages URL and smoke-check the site manually.

---

## Task 22: README

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Rewrite `README.md`**

```markdown
# aref-afzali-site

Personal website at arefafzali.github.io.

## Stack

- Astro 4 (static)
- TypeScript
- Fraunces + JetBrains Mono, self-hosted
- Notion-backed Notes via `@notionhq/client` + `notion-to-md`
- Playwright + axe for smoke and a11y tests
- GitHub Pages for hosting

## Local development

```bash
npm install
npm run dev        # http://localhost:4321
```

Notes will render empty without Notion credentials set. To wire them:

```bash
cp .env.example .env
# fill in NOTION_TOKEN and NOTION_NOTES_DATABASE_ID
```

## Publishing a note

1. Create a page in the Notion "Notes" database.
2. Fill `Title`, `Dek` (optional), `Date`, check `Published`.
3. Trigger a site rebuild — either push a commit or run the "Deploy site" Action manually (workflow_dispatch).

## Tests

```bash
npm test           # unit tests (vitest)
npm run e2e        # Playwright smoke + a11y
```

## Deploy

Pushes to `master` trigger a build-and-deploy via GitHub Actions.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "Update README for Astro stack and Notion workflow"
```

---

## Self-Review

**Spec coverage:**

| Spec section | Task(s) |
| --- | --- |
| Palette + type tokens | Task 2 |
| Motion: staggered hero reveal | Task 7 |
| Hairline underline on links | Task 2 (global.css) |
| Signature node-graph motif | Task 11 (ThesisGraph) |
| Plate I / Plate II captions | Task 7 (hero), Task 11 (thesis card) |
| Italic ochre emphasis | Task 7 (hero "noisy"), Task 11 (projects title), Task 14 (personal title) |
| Top nav (sticky, hairline, mono) | Task 6 |
| Hero treatment #2 | Task 7 |
| Numbers strip | Task 8 |
| About (2-col + facts) | Task 9 |
| Trajectory (4 roles, expandable) | Task 10 + Task 5 |
| Projects & Research (thesis card motif) | Task 11 + Task 5 |
| Publications list | Task 12 + Task 5 |
| Teaching | Task 13 |
| Notes preview (5 latest) + `/notes/` index + `/notes/[slug]/` | Task 17 |
| Personal | Task 14 |
| Contact + footer | Task 15 |
| Astro + TypeScript + self-hosted fonts | Task 1, Task 2 |
| Notion-backed Notes | Tasks 16–17 |
| Image pipeline (`<Image>`) | Task 7 |
| Performance (inlineStylesheets, zero-JS default) | Task 1 (config) |
| Accessibility (semantic, skip link, AAA contrast, reduced-motion) | Task 2, Task 3, Task 11, Task 19 |
| Responsive behavior | Breakpoints in each component |
| Remove legacy files | Task 20 |
| Deploy to GitHub Pages | Task 21 |
| README | Task 22 |

All spec items covered.

**Placeholder scan:** No TBDs, TODOs, "implement later", or untyped references remain. The OG image is intentionally a 1-KB placeholder — explicitly flagged as the v1 choice in Task 3.

**Type consistency:** `NoteEntry`, `FetchOpts`, `fetchPublishedNotes`, `loadNotes`, and the `Published`/`Title`/`Slug`/`Date`/`Dek` Notion property names are used consistently across Tasks 16 and 17.

**Ambiguity:** Deploy target is concretely GitHub Pages. The Notion property schema is explicit. Env var names are explicit.
