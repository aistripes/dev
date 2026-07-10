# Organic and AI discovery measurement

This playbook connects search visibility to qualified visits without adding personal-data collection. Eurolytics is the on-site analytics source; Google Search Console (GSC) and Bing Webmaster Tools (BWT) remain the authoritative sources for search impressions, clicks, indexing, and crawl diagnostics.

## Page dimensions

Every rendered page exposes stable first-party dimensions on `<body>`:

- `data-page-kind`: `content`, `topic`, `collection`, `search`, `home`, or `other`.
- `data-content-type`: the schema content type on generated content pages.
- `data-topic`: the canonical taxonomy niche slug on content and topic pages.

Analytics rules may read these attributes to segment page views. They contain content classification only, never visitor identifiers. Keep the values aligned with `meta.content_type` and `meta.niche`; do not derive them from page titles.

## Weekly GSC analysis

Use the Search results report or API with `date`, `query`, `page`, `country`, `device`, and `searchAppearance` dimensions.

1. Compare the latest complete 28 days with the preceding 28 days and the same period last year when available.
2. Group pages by URL prefix and join content URLs to `content type` and `topic` using the repository content index.
3. Prioritize truthful opportunities:
   - High impressions, positions 4–15, and below-site-average CTR: improve title/description and answer alignment.
   - Queries split across multiple URLs: inspect intent before consolidating or strengthening canonical internal links.
   - Falling clicks with stable position: check demand and SERP presentation before rewriting content.
   - Rising impressions with weak engagement in Eurolytics: improve the page's first-screen answer and next action.
4. Inspect Page indexing, Crawl stats, Core Web Vitals, and rich-result reports after template releases.
5. Annotate releases so changes are not mistaken for seasonality.

GSC does not expose all query data and API totals can differ from chart totals. Preserve the same filters and aggregation type in comparisons.

## Weekly BWT analysis

Use Search Performance, Site Explorer, URL Inspection, Crawl Information, and Site Scan.

1. Compare clicks, impressions, CTR, and average position by page and keyword.
2. Inspect discovered/crawled/indexed status for newly published pages and topic hubs.
3. Review crawl errors and blocked URLs; validate sitemap processing after releases.
4. Compare Bing and Google deltas. A Bing-only indexing problem usually points to crawl/discovery; a cross-engine loss more often points to content, demand, or a shared technical regression.

## Funnel and decisions

Report weekly at three levels:

| Level | Primary metric | Supporting metric | Decision |
| --- | --- | --- | --- |
| Discovery | GSC/BWT impressions and indexed pages | Average position | Which topics earn further investment |
| Acquisition | Search clicks and Eurolytics search/AI/direct visits | CTR by page group | Which snippets and distribution channels to improve |
| Engagement | Engaged visits by content type/topic | Next-page visits and tool interactions when supported | Which formats satisfy users |

Do not treat rankings, raw page views, or crawler hits as conversions. Define a conversion only when the site offers a real user action (for example newsletter signup, tool completion, or outbound repository visit), then document its exact trigger and test it before reporting.

## Release checks

- Build succeeds and sitemap XML contains only canonical, indexable URLs.
- `noindex` pages are absent from sitemaps.
- Sitemap `lastmod` reflects a real content change, not build time.
- Canonical URLs, structured data, visible breadcrumbs, and page metadata agree.
- GSC and BWT sitemap processing is checked after deployment.
- No verification tokens or API credentials are committed; configure verification through deployment-managed environment or DNS.
