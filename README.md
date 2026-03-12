# AI Stripes

**Structured resources for web developers building AI-powered applications.**

[aistripes.dev](https://aistripes.dev) · Open source · Schema-driven · Community-contributed

---

## What is this?

AI Stripes is a free, open resource site for developers working at the intersection of web development and AI. Every page on the site is generated from structured JSON content, validated against strict schemas, and rendered by purpose-built components.

This repo contains everything: the content, the schemas, the taxonomy, the site source, and the renderers. If you can read JSON and open a pull request, you can contribute.

## How the content system works

Every page on the site traces back to two things: a **niche definition** and a **content type**.

**Niches** are structured context files that describe a topic — its audience, pain points, tools, and subtopics. They live in `taxonomy/`.

```
taxonomy/
├── frameworks/        → Next.js, Nuxt, SvelteKit, Astro, ...
├── ai-patterns/       → RAG, structured output, embeddings, agents, ...
├── infrastructure/    → self-hosting, GDPR, analytics, edge deployment, ...
└── verticals/         → SaaS, e-commerce, devtools, ...
```

**Content types** define the structure and UI for each kind of page. Each type has a Zod schema in `schemas/` and a React renderer in `src/renderers/`.

| Type | Description | Example |
|---|---|---|
| Resources | Idea lists and tip collections | *100 AI Blog Post Ideas for Next.js Developers* |
| Checklists | Interactive, completable checklists | *GDPR Compliance Checklist for SaaS Apps* |
| Comparisons | Head-to-head feature comparisons | *Plausible vs Fathom vs Umami* |
| Guides | Step-by-step implementation guides | *Structured Output Pipeline with Gemini Flash and Zod* |
| Tools | Interactive browser-based utilities | *Meta Tag Generator*, *LLM Cost Calculator* |
| Directories | Filterable tool and resource listings | *AI Coding Tools Directory* |

The cross-product of niches × content types is what produces the site's pages. Adding one niche to the taxonomy can generate content across all six content types.

## Repo structure

```
aistripes/dev
├── taxonomy/              # Niche definitions (JSON)
│   ├── _schema.ts         # Zod schema for niche files
│   ├── frameworks/
│   ├── ai-patterns/
│   ├── infrastructure/
│   └── verticals/
├── schemas/               # Content type schemas (TypeScript + Zod)
├── content/               # Generated content files (JSON)
│   ├── resources/
│   ├── checklists/
│   ├── comparisons/
│   ├── guides/
│   ├── tools/
│   └── directories/
├── src/
│   ├── layouts/
│   ├── pages/             # Astro page routes
│   ├── components/        # Navigation, footer, SEO
│   ├── renderers/         # React components per content type
│   ├── lib/               # Content loading and validation
│   └── styles/
├── docs/
│   ├── ARCHITECTURE.md    # Technical stack and build pipeline
│   └── TAXONOMY.md        # Niche model and content types
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## Tech stack

- **Astro** — static site generation with island architecture
- **React** — interactive renderers (checklists, filters, tools)
- **Tailwind CSS v4** — utility-first styling
- **Zod** — schema validation at build time
- **Cloudflare Pages** — edge deployment

## Contributing

There are several ways to contribute, from easy to involved:

### Fix or improve existing content

Content lives in `content/` as JSON files. If you spot an error, an outdated tool, or a missing detail — edit the JSON and open a PR.

### Add a new niche to the taxonomy

This is the highest-leverage contribution. A single niche file enables content generation across all content types.

1. Create a JSON file in the appropriate `taxonomy/` subdirectory
2. Follow the schema in `taxonomy/_schema.ts`
3. Minimum requirements:
   - `audience` — at least 2 distinct audience segments
   - `pain_points` — at least 4 specific, searchable problems
   - `subtopics` — at least 3 for content depth
   - `adjacent_niches` — at least 2 for internal linking
4. Open a PR with a brief explanation of why this niche belongs

**Quality bar:** Generic context produces generic content. Pain points should be problems someone actually Googles. Subtopics should be specific enough to generate distinct pages.

```
Bad:  "audience": "Web developers who use AI"
Good: "audience": "Indie hackers building AI wrappers with Next.js, startup CTOs
       evaluating LLM providers for production, freelance developers adding AI
       features to client projects"
```

### Improve a renderer

Each content type has a React component in `src/renderers/`. If you see a UX improvement — better filtering, accessibility fixes, mobile layout — PRs are welcome.

### Propose a new content type

Open an issue describing the content type, its schema shape, and example pages it would produce. If it fits the site, we'll add a schema and renderer.

## Running locally

```bash
git clone https://github.com/aistripes/dev.git
cd dev
npm install
npm run dev
```

The site runs at `http://localhost:4321`. Content is loaded from the `content/` directory and validated against schemas at build time.

## Philosophy

AI works best inside constraints. The content on this site isn't written freeform by an LLM — it's generated into strict JSON schemas, validated at build time, and rendered by purpose-built components. The AI produces the data. The frontend handles the presentation. These two layers never mix.

This means every page has consistent structure, predictable quality, and a UI designed for its specific content type. A checklist has interactive checkboxes. A comparison has a feature matrix. A directory has filters. None of them are markdown dumped into a generic template.

Read more in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## License

- **Content** (taxonomy, schemas, content JSON): [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
- **Code** (Astro source, renderers, components): [MIT](https://opensource.org/licenses/MIT)
