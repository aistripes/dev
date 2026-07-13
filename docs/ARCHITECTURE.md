# Architecture

> **Brand:** AI Stripes
> **Domain:** aistripes.dev
> **GitHub:** github.com/aistripes
> **Status:** Live
> **Last updated:** 2026-07-13

---

## Overview

The site is a statically generated content platform built from a public GitHub repository. AI generates structured JSON content. React components render it. Cloudflare serves it at the edge.

```
┌─────────────────────────────────────────────────────────┐
│                    PUBLIC GITHUB REPO                    │
│                                                         │
│  /taxonomy     → niche definitions (JSON)               │
│  /schemas      → content type schemas (TypeScript)      │
│  /content      → generated content files (JSON)         │
│  /src          → site source (Astro + React)            │
│  /src/renderers → content-type-specific components      │
│  /tooling      → content audit scripts                  │
│                                                         │
└──────────────────────┬──────────────────────────────────┘
                       │
                       │  merge / push to main
                       ▼
              ┌────────────────┐
              │ GitHub Actions │
              │                │
              │ npm ci +       │
              │ Astro build    │
              └────────┬───────┘
                       │
                       │  Wrangler uploads dist/
                       ▼
              ┌────────────────┐
              │ Cloudflare     │
              │ Pages + CDN    │
              │                │
              │ Global serving │
              └────────────────┘
```

## Tech Stack

### Framework: Astro

Astro is the primary framework. Reasoning:

- **Content-first by design.** The build reads schema-driven JSON through `src/lib/content.ts`; each content type has a Zod schema and a renderer.
- **Island architecture.** Most pages are static HTML. Interactive elements (tool pages, filtered lists, checklists) hydrate as React islands only where needed. This keeps pages fast and lightweight.
- **Static generation at scale.** Astro handles thousands of static pages well. The `getStaticPaths()` pattern is built for programmatic page generation from data files.
- **Framework-agnostic islands.** Renderers are React components, but Astro doesn't force React on every page. Static content stays as zero-JS HTML.

### UI layer: React + Tailwind CSS

- **React** for interactive renderers (tool pages, filterable lists, checklists). Shared across all content types as island components.
- **Tailwind CSS v4** for styling, with shared global styles and utilities across the six content type renderers.

### Content validation: Zod + TypeScript

Every content type has a Zod schema that mirrors the generation schema. Content files are validated at build time.

The current schema definitions live in `schemas/`. During a normal build, invalid content is reported and omitted from generated routes. Run `npm run audit:content -- --strict` when invalid content must fail the check.

#### Editorial evidence metadata

Every content schema accepts the same optional `meta.editorial` object:

```json
{
  "editorial": {
    "authored_by": "Person or accountable team",
    "reviewed_by": "Person or accountable team",
    "last_reviewed": "2026-07-10",
    "sources": [
      {
        "title": "Primary source title",
        "url": "https://example.org/primary-source",
        "accessed_at": "2026-07-10"
      }
    ]
  }
}
```

These fields are optional so legacy content remains valid, but any supplied values are schema-validated. They must describe work that actually happened: generation time is not a review date, a model is not an author or reviewer, and sources must be pages consulted to verify the content. The generation pipeline must never synthesize these values merely to fill the schema.

Run `npm run audit:content` to report scalable quality issues. CI can run `npm run audit:content -- --strict` to fail on errors while leaving editorial warnings available for prioritized remediation.

#### URL corrections

Published slugs are stable identifiers. When a malformed slug must change, add an explicit permanent redirect to `public/_redirects` in the same change as the corrected `seo.slug`. Cloudflare Pages copies this file into the static build and serves the old URL as a `301`. The content audit verifies that each redirect target is a generated content route.

### Deployment: Cloudflare Pages

- **Cloudflare Pages** for static hosting. GitHub Actions builds the site and deploys `dist/` to the `dev` Pages project on pushes to `main`. The legacy Pages Git integration must remain disconnected so only one production deploy path runs.

Why Cloudflare over Vercel/Netlify:

- Edge-first, globally distributed by default
- Static output requires no application server at runtime
- Aligned with the privacy-conscious, European-friendly positioning
- Cost-effective at scale (generous free tier, predictable pricing)

### Generation pipeline (private)

The content generation system is **not** in the public repo. It lives in a separate private repository.

```
┌─────────────────────────────────────────┐
│          PRIVATE GENERATION REPO        │
│                                         │
│  1. Read taxonomy from public repo      │
│  2. Read schemas from public repo       │
│  3. Generate content via LLM API        │
│     (Gemini Flash for cost/quality)     │
│  4. Validate output against schemas     │
│  5. Commit content JSON to public repo  │
│                                         │
│  Orchestrator: Node.js / Bun            │
│  Concurrency: 50-100 parallel workers   │
│  Validation: Zod (same schemas)         │
│  Output: JSON files committed to repo   │
│                                         │
└─────────────────────────────────────────┘
```

Key design decisions for generation:

- **Gemini Flash** as the primary model (native JSON output, strong cost-to-quality ratio at scale). Can swap models without changing the pipeline.
- **Deterministic titles.** Titles are template-generated, not AI-generated. Templates like `"100 {ContentType} for {Niche} in {Year}"` produce consistent, SEO-predictable titles.
- **Schema-constrained generation.** The LLM fills a strict JSON schema. It never produces freeform content. This is the single most important architectural decision.
- **Validation gate.** Every generated file is validated against its Zod schema before being committed. Invalid output is logged, retried, or flagged — never shipped.
- **Niche context injection.** Each generation call includes the full niche context (audience, pain points, subtopics) from the taxonomy. This is what makes output niche-specific rather than generic.

## Repository Structure

```
aistripes/
├── AGENTS.md
├── README.md
├── LICENSE                          # Content: CC BY-SA 4.0, Code: MIT
├── taxonomy/
│   ├── _schema.ts                   # Zod schema for niche definitions
│   ├── ai-patterns/
│   ├── frameworks/
│   ├── infrastructure/
│   ├── seo-content/
│   └── verticals/
├── schemas/
│   ├── checklist.ts
│   ├── comparison.ts
│   ├── directory.ts
│   ├── editorial.ts
│   ├── guide.ts
│   ├── resource-article.ts
│   └── tool-page.ts
├── content/
│   ├── checklists/
│   ├── comparisons/
│   ├── directories/
│   ├── guides/
│   ├── resources/
│   └── tools/
├── src/
│   ├── components/
│   ├── layouts/
│   ├── lib/                         # Content, taxonomy, and sitemap loading
│   ├── pages/
│   │   ├── [prefix]/               # Collection indexes and content routes
│   │   ├── guides/                  # Flagship guide routes
│   │   ├── sitemaps/
│   │   ├── tools/                   # Flagship tool routes
│   │   ├── topics/
│   │   ├── feed.xml.ts
│   │   ├── index.astro
│   │   ├── sitemap.xml.ts
│   │   └── search.astro
│   ├── renderers/                   # One per content type
│   └── styles/
├── examples/rag-pipeline/
├── public/                          # Static assets, redirects, robots, and downloads
├── tooling/                         # Content audit script
├── .github/workflows/deploy.yml
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## Content-to-Page Pipeline

```
taxonomy/frameworks/nextjs.json
        +
schemas/checklist.ts
        │
        ▼  (private generation pipeline)
        │
content/checklists/nextjs-checklist-nextjs-implementation-checklist.json
        │
        ▼  (Astro build)
        │
src/pages/[prefix]/[slug].astro
        │
        ├── reads content JSON
        ├── validates against Zod schema
        ├── selects renderer by content_type
        └── renders Checklist.tsx as React island
        │
        ▼
/checklists/nextjs-checklist-nextjs-implementation-checklist/index.html
        │
        ▼  (Cloudflare Pages)
        │
https://aistripes.dev/checklists/nextjs-checklist-nextjs-implementation-checklist
```

## URL Structure

```
/                                           → homepage
/resources/                                 → resource index
/resources/nextjs-ai-blog-ideas             → resource page
/checklists/                                → checklist index
/checklists/gdpr-compliance-saas            → checklist page
/comparisons/                               → comparison index
/comparisons/analytics-tools-privacy        → comparison page
/guides/                                    → guide index
/guides/structured-output-gemini-zod        → guide page
/tools/                                     → tools index
/tools/rag-context-window-calculator        → tool page
/directories/                               → directory index
/directories/ai-coding-tools                → directory page
/topics/                                    → topic index
/topics/rag                                 → topic page
/search                                     → search page
/feed.xml                                   → Atom feed
/sitemap.xml                                → sitemap index
```

## Community Contribution Flow

```
Contributor                    GitHub                      Cloudflare
    │                            │                            │
    ├── Fork repo ──────────────►│                            │
    │                            │                            │
    ├── Add taxonomy/            │                            │
    │   niche JSON file          │                            │
    │   (or fix content file)    │                            │
    │                            │                            │
    ├── Open PR ────────────────►│                            │
    │                            │                            │
    │                     Maintainer review                   │
    │                     + merge to main                     │
    │                            │                            │
    │                     GitHub Actions:                     │
    │                     npm ci + build                      │
    │                     + Wrangler deploy ────────────────►│
    │                            │                     Production
    │                            │                            │
```

## Performance Targets

| Metric | Target |
|---|---|
| Lighthouse Performance | 95+ |
| First Contentful Paint | < 1.0s |
| Total Blocking Time | < 100ms |
| Cumulative Layout Shift | < 0.05 |
| Time to Interactive | < 1.5s |
| Page weight (static content) | < 50KB |
| Page weight (interactive tool) | < 150KB |

Astro's zero-JS-by-default and Cloudflare's edge CDN make these achievable without heroic optimization.

## Current Supporting Routes

- **Search.** `/search` embeds a static index of schema-driven content at build time and filters it in the browser.
- **Feed.** `/feed.xml` is a statically generated Atom feed.
- **Sitemaps.** `/sitemap.xml` indexes section sitemaps generated from content and taxonomy data.

## Future Considerations

- **Newsletter.** Integrate with a privacy-respecting provider (Buttondown, Listmonk self-hosted). Signup via Workers endpoint.
- **API.** If demand exists, expose the content as a public JSON API via Workers. The content is already structured — serving it as an API is trivial.
- **i18n.** Architecture supports it (JSON content can be regenerated per locale), but it is not currently implemented.
