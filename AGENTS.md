# AGENTS

This repository is in planning/bootstrap mode. Use the docs below as the source of truth before making structural, content, or deployment changes.

## Canonical Docs

- `docs/TAXONOMY.md`: niche model, content types, and expansion priorities.
- `docs/ARCHITECTURE.md`: technical stack, repo layout, generation flow, and Cloudflare deployment model.

## Working Rules for Agents

1. Keep taxonomy and architecture aligned. If one changes, update related docs.
2. Treat schema-driven JSON content and validation gates as non-negotiable architecture constraints.
3. Prefer static-first delivery (Astro + edge CDN), adding dynamic behavior only where clearly needed.
4. Preserve open-source contribution ergonomics: clear docs, predictable structure, and reviewable changes.

## Cloudflare Deploy Environment

- Cloudflare Pages project created via Wrangler:
  - Project: `aistripes-dev`
  - Production branch: `main`
  - URL: `https://aistripes-dev.pages.dev/`
- Primary deployment workflow:
  - Commit and push to `main` to trigger Cloudflare Pages automatic production deploys.
  - Prefer this auto-deploy path for normal releases.
- To publish a build artifact directory:
  - `npx wrangler pages deploy <directory>`
  - Use manual Wrangler deploys only when explicitly requested or when auto-deploy is unavailable.

## Security for a Public Repo

- This is a public repository: never commit secrets, API keys, tokens, or private credentials.
- Use Cloudflare-managed secrets/environment variables only in Cloudflare settings or secure CI contexts, not in tracked files.
- Assume all committed content is publicly visible and permanent.
