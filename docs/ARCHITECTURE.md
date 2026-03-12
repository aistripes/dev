# Architecture

> **Brand:** AI Stripes
> **Domain:** aistripes.dev
> **GitHub:** github.com/aistripes
> **Status:** Planning phase
> **Last updated:** 2026-03-12

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
│  /renderers    → content-type-specific components       │
│  /tools        → interactive tool components            │
│                                                         │
└──────────────────────┬──────────────────────────────────┘
                       │
                       │  git push / PR merge
                       ▼
              ┌────────────────┐
              │ Cloudflare     │
              │ Pages (build)  │
              │                │
              │ Astro SSG →    │
              │ static HTML    │
              └────────┬───────┘
                       │
                       ▼
              ┌────────────────┐
              │ Cloudflare     │
              │ CDN (edge)     │
              │                │
              │ Global serving │
              │ + Workers for  │
              │   dynamic bits │
              └────────────────┘
```

## Tech Stack

### Framework: Astro

Astro is the primary framework. Reasoning:

- **Content-first by design.** Astro's content collections map directly to the schema-driven JSON content model. Each content type becomes a collection with a Zod schema.
- **Island architecture.** Most pages are static HTML. Interactive elements (tool pages, filtered lists, checklists) hydrate as React islands only where needed. This keeps pages fast and lightweight.
- **Static generation at scale.** Astro handles thousands of static pages well. The `getStaticPaths()` pattern is built for programmatic page generation from data files.
- **Framework-agnostic islands.** Renderers are React components, but Astro doesn't force React on every page. Static content stays as zero-JS HTML.

### UI layer: React + Tailwind CSS

- **React** for interactive renderers (tool pages, filterable lists, checklists). Shared across all content types as island components.
- **Tailwind CSS v4** for styling. Utility-first, no custom CSS files to maintain at scale. Consistent design across 20+ content type renderers.
- **shadcn/ui** as a component foundation where it makes sense (tables, cards, dialogs). Not a hard dependency — used selectively.

### Content validation: Zod + TypeScript

Every content type has a Zod schema that mirrors the generation schema. Content files are validated at build time.

```typescript
// schemas/resource-article.ts
import { z } from 'zod';

export const ResourceArticleSchema = z.object({
  meta: z.object({
    content_type: z.string(),
    niche: z.string(),
    generated_at: z.string().datetime(),
    schema_version: z.string(),
  }),
  seo: z.object({
    title: z.string(),
    description: z.string().max(160),
    keywords: z.array(z.string()),
  }),
  content: z.object({
    intro: z.string(),
    sections: z.array(z.object({
      heading: z.string(),
      items: z.array(z.object({
        title: z.string(),
        description: z.string(),
        difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
        potential: z.enum(['high', 'medium', 'standard']).optional(),
      })).min(10).max(25),
    })),
    pro_tips: z.array(z.string()).length(5),
  }),
});
```

If a content file doesn't validate, the build fails. No malformed pages reach production.

### Deployment: Cloudflare Pages + Workers

- **Cloudflare Pages** for static hosting. Git-integrated builds on push to `main`. Preview deployments on PRs.
- **Cloudflare Workers** for dynamic functionality that can't be static:
  - Search API (lightweight full-text search over content index)
  - Newsletter signup endpoint
  - Analytics event ingestion
  - GitHub webhook handler for contribution notifications
- **Cloudflare R2** for any static assets that don't belong in the repo (generated OG images, etc.)

Why Cloudflare over Vercel/Netlify:

- Edge-first, globally distributed by default
- Workers provide serverless compute without a separate backend
- R2 for storage without egress fees
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
├── README.md
├── CONTRIBUTING.md
├── LICENSE                          # Content: CC BY-SA 4.0, Code: MIT
│
├── taxonomy/
│   ├── _schema.ts                   # Zod schema for niche definitions
│   ├── frameworks/
│   │   ├── nextjs.json
│   │   ├── nuxt.json
│   │   ├── sveltekit.json
│   │   ├── remix.json
│   │   └── astro.json
│   ├── ai-patterns/
│   │   ├── rag.json
│   │   ├── structured-output.json
│   │   ├── embeddings.json
│   │   ├── agents.json
│   │   └── fine-tuning.json
│   ├── infrastructure/
│   │   ├── self-hosting.json
│   │   ├── edge-deployment.json
│   │   ├── gdpr-compliance.json
│   │   └── analytics.json
│   └── verticals/
│       ├── saas.json
│       ├── ecommerce.json
│       ├── content-platforms.json
│       └── devtools.json
│
├── schemas/
│   ├── resource-article.ts
│   ├── checklist.ts
│   ├── comparison.ts
│   ├── tool-page.ts
│   ├── guide.ts
│   └── directory.ts
│
├── content/
│   ├── resources/
│   │   ├── nextjs-ai-blog-ideas.json
│   │   ├── rag-implementation-checklist.json
│   │   └── ...
│   ├── comparisons/
│   │   ├── analytics-tools-privacy.json
│   │   └── ...
│   ├── guides/
│   │   ├── structured-output-nextjs.json
│   │   └── ...
│   ├── checklists/
│   │   ├── gdpr-compliance-saas.json
│   │   └── ...
│   ├── tools/
│   │   ├── meta-tag-generator.json
│   │   └── ...
│   └── directories/
│       ├── ai-coding-tools.json
│       └── ...
│
├── src/
│   ├── layouts/
│   │   └── Base.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── [...slug].astro          # Dynamic route for all content
│   │   └── search.astro
│   ├── components/
│   │   ├── Navigation.astro
│   │   ├── Footer.astro
│   │   ├── SEOHead.astro
│   │   └── SearchBar.tsx            # React island
│   └── renderers/                   # One per content type (React islands)
│       ├── ResourceArticle.tsx
│       ├── Checklist.tsx
│       ├── Comparison.tsx
│       ├── ToolPage.tsx
│       ├── Guide.tsx
│       └── Directory.tsx
│
├── public/
│   └── og/                          # Generated OG images
│
├── astro.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Content-to-Page Pipeline

```
taxonomy/frameworks/nextjs.json
        +
schemas/checklist.ts
        │
        ▼  (private generation pipeline)
        │
content/checklists/nextjs-ai-seo-checklist.json
        │
        ▼  (Astro build)
        │
src/pages/[...slug].astro
        │
        ├── reads content JSON
        ├── validates against Zod schema
        ├── selects renderer by content_type
        └── renders Checklist.tsx as React island
        │
        ▼
/checklists/nextjs-ai-seo-checklist/index.html
        │
        ▼  (Cloudflare Pages)
        │
https://aistripes.dev/checklists/nextjs-ai-seo-checklist
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
/guides/structured-output-nextjs            → guide page
/tools/                                     → tools index
/tools/meta-tag-generator                   → tool page
/directories/                               → directory index
/directories/ai-coding-tools                → directory page
/search                                     → search page
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
    │                     CI validates:                       │
    │                     ├── Zod schema check                │
    │                     ├── Lint + format                   │
    │                     └── Build preview                   │
    │                            │                            │
    │                     Preview deploy ────────────────────►│
    │                            │                     Preview URL
    │                            │                            │
    │                     Maintainer review                   │
    │                     + merge to main                     │
    │                            │                            │
    │                     Generation pipeline                 │
    │                     picks up new taxonomy               │
    │                     → generates content                 │
    │                     → commits to repo                   │
    │                            │                            │
    │                     Auto-deploy ──────────────────────►│
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

## Future Considerations

- **Search.** Start with a static JSON index built at build time (Pagefind or Fuse.js). Upgrade to Cloudflare Workers-backed search if needed.
- **Newsletter.** Integrate with a privacy-respecting provider (Buttondown, Listmonk self-hosted). Signup via Workers endpoint.
- **RSS.** Full content RSS feed generated at build time. Developers still use RSS.
- **API.** If demand exists, expose the content as a public JSON API via Workers. The content is already structured — serving it as an API is trivial.
- **i18n.** Architecture supports it (JSON content can be regenerated per locale) but not a priority for launch.
