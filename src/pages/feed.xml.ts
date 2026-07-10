import type { APIRoute } from 'astro';
import { getAllContentWithPaths } from '../lib/content';

export const prerender = true;

export const GET: APIRoute = ({ site, url }) => {
  const origin = site ?? url;
  const items = getAllContentWithPaths()
    .toSorted((left, right) => Date.parse(right.content.meta.generated_at) - Date.parse(left.content.meta.generated_at))
    .slice(0, 100);

  const entries = items.map(({ content, slug, urlPrefix }) => {
    const pageUrl = new URL(`/${urlPrefix}/${slug}/`, origin).toString();
    return `  <entry>
    <title>${escapeXml(content.seo.title)}</title>
    <link href="${escapeXml(pageUrl)}" />
    <id>${escapeXml(pageUrl)}</id>
    <updated>${escapeXml(content.meta.generated_at)}</updated>
    <summary>${escapeXml(content.seo.description)}</summary>
    <category term="${escapeXml(urlPrefix)}" />
  </entry>`;
  });
  const featured = [
    ['Production RAG Pipeline: Reference Architecture and Code', '/guides/rag-pipeline/', 'A tenant-safe RAG reference architecture with executable offline code, evaluation fixtures, lifecycle controls, and failure diagnosis.', 'flagship-guide', '2026-07-10T00:00:00Z'],
    ['How to Self-Host an LLM: A Practical 2026 Guide', '/guides/self-hosted-llm/', 'A practical decision guide for model servers, hardware sizing, deployment controls, and honest cost comparison.', 'flagship-guide', '2026-07-10T00:00:00Z'],
    ['LLM Observability with OpenTelemetry', '/guides/llm-observability/', 'A vendor-neutral telemetry model and downloadable schema for LLM calls, RAG, agents, privacy, dashboards, and SLOs.', 'flagship-guide', '2026-07-10T00:00:00Z'],
    ['Self-Hosted LLM Cost Calculator', '/tools/self-hosted-llm-cost-calculator/', 'Estimate monthly infrastructure cost, utilization, and a workload-specific API breakeven point using editable assumptions.', 'tool', '2026-07-10T00:00:00Z'],
  ] as const;
  const featuredEntries = featured.map(([title, pathname, summary, category, updated]) => {
    const pageUrl = new URL(pathname, origin).toString();
    return `  <entry>
    <title>${escapeXml(title)}</title>
    <link href="${escapeXml(pageUrl)}" />
    <id>${escapeXml(pageUrl)}</id>
    <updated>${updated}</updated>
    <summary>${escapeXml(summary)}</summary>
    <category term="${category}" />
  </entry>`;
  });
  const feedUpdated = [...featured.map((entry) => entry[4]), ...items.map(({ content }) => content.meta.generated_at)]
    .filter((value) => !Number.isNaN(Date.parse(value)))
    .toSorted((left, right) => Date.parse(right) - Date.parse(left))[0] ?? new Date(0).toISOString();

  const body = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>AI Stripes</title>
  <subtitle>Resources for developers building AI-powered web applications.</subtitle>
  <link href="${escapeXml(new URL('/feed.xml', origin).toString())}" rel="self" />
  <link href="${escapeXml(new URL('/', origin).toString())}" />
  <id>${escapeXml(new URL('/', origin).toString())}</id>
  <updated>${escapeXml(feedUpdated)}</updated>
${[...featuredEntries, ...entries].join('\n')}
</feed>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' },
  });
};

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}
