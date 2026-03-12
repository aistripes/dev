# Taxonomy

> **Brand:** AI Stripes
> **Domain:** aistripes.dev
> **GitHub:** github.com/aistripes
> **Status:** Full taxonomy — 54 niches across 5 categories
> **Last updated:** 2026-03-12

---

## How the Taxonomy Works

The taxonomy is the foundation of the entire content system. Every generated page traces back to two things: a **niche definition** and a **content type**. The cross-product of niches × content types determines the total page count.

```
Niches (N) × Content Types (C) = Total Pages

Example: 80 niches × 6 content types = 480 base pages
With subtopic expansion: 480 × ~3 subtopics = ~1,400+ pages
```

Each niche has structured context that gets injected into generation. This is what prevents the output from being generic template filler.

---

## Niche Schema

Every niche JSON file follows this structure:

```typescript
interface NicheDefinition {
  slug: string;                    // URL-safe identifier
  name: string;                    // Display name
  category: string;                // Parent category (frameworks, ai-patterns, etc.)
  context: {
    audience: string;              // Who builds in this niche
    pain_points: string[];         // What they struggle with
    monetization: string[];        // How they make money (informs content relevance)
    tools_and_stack: string[];     // Common tools they use
    content_that_works: string[];  // Content formats that resonate
    subtopics: string[];           // Specific sub-niches for deeper content
    adjacent_niches: string[];     // Related niches for internal linking
  };
}
```

### Example niche file

```json
// taxonomy/frameworks/nextjs.json
{
  "slug": "nextjs",
  "name": "Next.js",
  "category": "frameworks",
  "context": {
    "audience": "Full-stack developers building React applications, indie hackers shipping SaaS, frontend teams at startups and agencies",
    "pain_points": [
      "App Router vs Pages Router migration decisions",
      "Server Components mental model and data fetching patterns",
      "Deployment costs scaling with SSR and serverless functions",
      "SEO for dynamic and client-rendered content",
      "Integrating AI APIs without exposing keys or hitting rate limits"
    ],
    "monetization": [
      "SaaS subscriptions",
      "Freelance and agency work",
      "Template and starter kit sales",
      "Course and tutorial content"
    ],
    "tools_and_stack": [
      "Vercel", "Cloudflare Pages", "Prisma", "Drizzle",
      "Tailwind CSS", "shadcn/ui", "Stripe", "Clerk", "Auth.js"
    ],
    "content_that_works": [
      "Step-by-step implementation guides",
      "Architecture decision comparisons",
      "Starter template breakdowns",
      "Performance optimization checklists"
    ],
    "subtopics": [
      "Next.js App Router patterns",
      "Next.js + AI SDK integration",
      "Next.js self-hosting on VPS",
      "Next.js ISR and caching strategies",
      "Next.js middleware and edge functions"
    ],
    "adjacent_niches": ["remix", "react", "vercel", "edge-deployment"]
  }
}
```

---

## Niche Categories

### 1. Frameworks

Core web frameworks the audience builds with.

| Slug | Name | Priority | Status | Notes |
|---|---|---|---|---|
| `nextjs` | Next.js | High | ✅ Defined | Largest audience, most AI integration patterns |
| `nuxt` | Nuxt | High | ✅ Defined | Vue ecosystem equivalent, strong in Europe |
| `sveltekit` | SvelteKit | Medium | ✅ Defined | Growing fast, passionate community |
| `remix` | Remix | Medium | ✅ Defined | Data-loading patterns, React Router merger |
| `astro` | Astro | Medium | ✅ Defined | Content-site sweet spot, relevant to our own stack |
| `react` | React (general) | High | ✅ Defined | Framework-agnostic React patterns |
| `vue` | Vue (general) | Medium | ✅ Defined | General Vue patterns outside Nuxt |
| `angular` | Angular | Low | ✅ Defined | Smaller overlap with AI-content audience |
| `django` | Django | Medium | ✅ Defined | Python devs building AI-integrated web apps |
| `rails` | Ruby on Rails | Low | ✅ Defined | Smaller but loyal audience |
| `laravel` | Laravel | Medium | ✅ Defined | PHP ecosystem, surprisingly active in AI adoption |
| `fastapi` | FastAPI | Medium | ✅ Defined | Python API layer, common AI backend |

### 2. AI Patterns

How developers integrate AI into their applications.

| Slug | Name | Priority | Status | Notes |
|---|---|---|---|---|
| `rag` | RAG (Retrieval-Augmented Generation) | High | ✅ Defined | Most common AI integration pattern |
| `structured-output` | Structured Output / JSON Mode | High | ✅ Defined | Directly relevant to our pSEO approach |
| `embeddings` | Embeddings & Vector Search | High | ✅ Defined | Foundation for semantic features |
| `agents` | AI Agents & Tool Use | High | ✅ Defined | Rapidly evolving, high search interest |
| `fine-tuning` | Fine-Tuning & Custom Models | Medium | ✅ Defined | More niche, higher technical bar |
| `prompt-engineering` | Prompt Engineering | High | ✅ Defined | Broad, high-volume search terms |
| `streaming` | Streaming LLM Responses | Medium | ✅ Defined | UX pattern every AI app needs |
| `multimodal` | Multimodal AI (Vision, Audio) | Medium | ✅ Defined | Growing with GPT-4o, Gemini |
| `code-generation` | AI Code Generation | High | ✅ Defined | Copilot, Cursor, Claude Code workflows |
| `content-generation` | AI Content Generation | High | ✅ Defined | Core topic for the site |
| `ai-search` | AI-Powered Search | Medium | ✅ Defined | Replacing traditional search in apps |
| `voice-ai` | Voice & Speech AI | Low | ✅ Defined | Emerging, smaller dev audience |

### 3. Infrastructure & Operations

Where and how developers deploy and run AI-powered apps.

| Slug | Name | Priority | Status | Notes |
|---|---|---|---|---|
| `self-hosting` | Self-Hosting | High | ✅ Defined | Strong alignment with privacy positioning |
| `edge-deployment` | Edge Deployment | High | ✅ Defined | Cloudflare, Deno Deploy, Vercel Edge |
| `gdpr-compliance` | GDPR Compliance | High | ✅ Defined | Core to European developer audience |
| `analytics` | Web Analytics | High | ✅ Defined | Privacy-first tools, tracking patterns, compliance |
| `auth` | Authentication & Authorization | Medium | ✅ Defined | Every app needs it, AI adds complexity |
| `databases` | Databases for AI Apps | Medium | ✅ Defined | Postgres, vector DBs, ClickHouse |
| `caching` | Caching Strategies | Medium | ✅ Defined | Critical at scale with AI costs |
| `monitoring` | Monitoring & Observability | Medium | ✅ Defined | LLM cost tracking, error rates |
| `ci-cd` | CI/CD for AI Apps | Low | ✅ Defined | Model deployment, prompt versioning |
| `security` | Security for AI Apps | Medium | ✅ Defined | Prompt injection, data leakage |
| `cost-optimization` | AI API Cost Optimization | High | ✅ Defined | Every AI dev worries about this |
| `privacy` | Privacy-First Architecture | High | ✅ Defined | Core positioning of the site |
| `docker` | Docker & Containers | Medium | ✅ Defined | Standard deployment pattern |
| `vps-hosting` | VPS Hosting (Hetzner, etc.) | Medium | ✅ Defined | European hosting, cost-effective |

### 4. Verticals / Use Cases

Types of applications the audience is building.

| Slug | Name | Priority | Status | Notes |
|---|---|---|---|---|
| `saas` | SaaS Applications | High | ✅ Defined | Primary audience use case |
| `ecommerce` | E-Commerce | Medium | ✅ Defined | AI for product descriptions, recommendations |
| `content-platforms` | Content Platforms & CMS | High | ✅ Defined | Directly relevant to AI content |
| `devtools` | Developer Tools | High | ✅ Defined | Building tools for other devs |
| `marketplaces` | Marketplaces | Low | ✅ Defined | Niche but high value |
| `internal-tools` | Internal Tools & Admin Panels | Medium | ✅ Defined | Retool/Appsmith alternative crowd |
| `api-products` | API-First Products | Medium | ✅ Defined | Building APIs that wrap AI |
| `chrome-extensions` | Browser Extensions | Medium | ✅ Defined | Lots of AI extension development |
| `mobile-web` | Mobile Web / PWA | Low | ✅ Defined | Smaller but growing with AI |
| `no-code-low-code` | No-Code / Low-Code Platforms | Low | ✅ Defined | Adjacent audience |

### 5. SEO & Content Strategy

For developers who are also responsible for growth.

| Slug | Name | Priority | Status | Notes |
|---|---|---|---|---|
| `programmatic-seo` | Programmatic SEO | High | ✅ Defined | Meta-relevant — what this site does |
| `technical-seo` | Technical SEO for Web Apps | High | ✅ Defined | Core dev concern |
| `content-strategy` | AI Content Strategy | High | ✅ Defined | Planning, not just generating |
| `link-building` | Link Building for Dev Tools | Medium | ✅ Defined | Relevant for devtool marketing |
| `seo-for-spas` | SEO for Single-Page Apps | Medium | ✅ Defined | Persistent pain point |
| `international-seo` | International SEO | Low | ✅ Defined | Relevant for European audience |

---

## Content Types

Each content type has its own schema, renderer, and URL prefix.

### Type 1: Resource Articles

**URL prefix:** `/resources/`
**Description:** Idea lists, tip collections, and curated resources. The highest-volume content type.
**Schema constraints:** 3-5 sections, 15-20 items per section, each with title + description + difficulty + potential rating. Exactly 5 pro tips.
**Example pages:**
- `100 Blog Post Ideas for SaaS Developers`
- `50 AI Integration Ideas for E-Commerce`
- `75 Side Project Ideas Using RAG`

### Type 2: Checklists

**URL prefix:** `/checklists/`
**Description:** Interactive, completable checklists. Items have checkboxes that persist in local state. High engagement, high bookmarkability.
**Schema constraints:** 5-8 sections, 5-10 items per section, each with title + description + priority (critical/recommended/optional).
**Example pages:**
- `GDPR Compliance Checklist for SaaS Apps`
- `Next.js Production Deployment Checklist`
- `AI Feature Launch Security Checklist`

### Type 3: Comparisons

**URL prefix:** `/comparisons/`
**Description:** Structured head-to-head or multi-option comparisons. Tables, feature matrices, verdict summaries.
**Schema constraints:** 2-6 options compared, 8-15 comparison criteria, each with per-option values + winner indication. Verdict section with use-case-based recommendations.
**Example pages:**
- `Plausible vs Fathom vs Umami: Privacy-First Analytics Compared`
- `Vercel vs Cloudflare Pages vs Netlify for AI Apps`
- `OpenAI vs Anthropic vs Google AI: Structured Output Compared`

### Type 4: Guides

**URL prefix:** `/guides/`
**Description:** Step-by-step implementation guides. Deeper than resources, more structured than blog posts. Include code examples.
**Schema constraints:** 5-10 steps, each with explanation + code block (optional) + common pitfalls. Prerequisites section. Estimated time.
**Example pages:**
- `Implementing RAG with Next.js and Pinecone`
- `Adding Privacy-First Analytics to Your SvelteKit App`
- `Building a Structured Output Pipeline with Gemini Flash`

### Type 5: Tools

**URL prefix:** `/tools/`
**Description:** Interactive, functional tools that run in the browser. Not just content — actual utilities. Highest engagement, strongest link magnet.
**Schema constraints:** Tool-specific. Each tool has its own schema for configuration, examples, and niche-specific context. The React component does the heavy lifting.
**Example pages:**
- `Meta Tag Generator for AI-Powered Content Sites`
- `GDPR Cookie Consent Checker`
- `Schema Markup Validator`
- `LLM Cost Calculator`
- `robots.txt Generator`

### Type 6: Directories

**URL prefix:** `/directories/`
**Description:** Curated, categorized listings of tools, services, and resources. Filterable and searchable.
**Schema constraints:** 10-50 entries per directory, each with name + description + category + pricing model + URL + pros/cons. Filter dimensions defined per directory.
**Example pages:**
- `AI Coding Tools Directory`
- `Privacy-First Analytics Tools`
- `Open Source LLM Hosting Platforms`
- `European Cloud Providers for AI Workloads`

---

## Cross-Product Matrix (Illustrative)

Shows how niches × content types generate pages. Not every combination makes sense — the generation pipeline skips low-relevance intersections.

| | Resources | Checklists | Comparisons | Guides | Tools | Directories |
|---|---|---|---|---|---|---|
| **Next.js** | 100 AI Blog Ideas for Next.js Devs | Next.js Production Checklist | Next.js vs Remix for AI Apps | Implementing RAG in Next.js | Next.js Bundle Analyzer | Next.js Starter Templates |
| **RAG** | 50 RAG Use Case Ideas | RAG Implementation Checklist | RAG Frameworks Compared | Building RAG with LangChain | RAG Chunk Size Calculator | RAG Tooling Directory |
| **GDPR** | 75 GDPR Blog Topics | GDPR Compliance Checklist | Privacy Analytics Compared | Adding GDPR Consent to React | Cookie Consent Checker | EU-Compliant SaaS Tools |
| **SaaS** | 100 SaaS AI Feature Ideas | SaaS Launch Checklist | SaaS Analytics Compared | AI Pricing Page Generator Guide | MRR Calculator | SaaS Boilerplate Directory |

---

## Expansion Strategy

### Phase 1: Foundation (Launch)

- 54 niches fully defined across all 5 categories ✅
- All 6 content types active
- Target: ~500-800 initial pages
- Focus: Frameworks + AI Patterns (highest search volume)
- Mix of established technologies (React, Django, Docker) and emerging patterns (RAG, Agents)

### Phase 2: Depth (Month 2-3)

- Expand to 40-50 niches
- Add subtopic-level pages (e.g., "Next.js App Router" as a distinct generation context, not just "Next.js")
- Target: 2,000-3,000 pages
- Open for community taxonomy contributions

### Phase 3: Breadth (Month 4-6)

- 80+ niches including long-tail verticals
- Community-contributed niches going through PR review
- Cross-niche content (e.g., "RAG + Next.js + SaaS" three-way intersections)
- Target: 5,000+ pages

### Phase 4: Compounding (Month 6+)

- Taxonomy feedback loop: analytics data informs which niches and content types to expand
- Community-driven growth outpaces core team generation
- Automated re-generation with updated niche context
- Target: 10,000+ pages

---

## Taxonomy Contribution Guide

*(To be expanded in CONTRIBUTING.md)*

### Adding a new niche

1. Create a JSON file in the appropriate `taxonomy/` subdirectory
2. Follow the niche schema exactly
3. Minimum requirements:
   - `audience`: at least 2 distinct audience segments
   - `pain_points`: at least 4 specific, actionable pain points
   - `subtopics`: at least 3 subtopics for content depth
   - `adjacent_niches`: at least 2 for internal linking
4. Open a PR with a brief explanation of why this niche belongs

### Quality bar for niche context

The niche context is the most important input to the generation system. Generic context produces generic content. The bar for acceptance:

- **Audience** must name specific roles or builder types, not just "developers"
- **Pain points** must be problems someone actually Googles, not abstract challenges
- **Subtopics** must be specific enough to generate distinct content, not synonyms of the parent niche
- **Tools and stack** must be current (no deprecated tools)

Bad: `"audience": "Web developers who use AI"`
Good: `"audience": "Indie hackers building AI wrappers with Next.js, startup CTOs evaluating LLM providers for production, freelance developers adding AI features to client projects"`
