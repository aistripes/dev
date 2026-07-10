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

  const body = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>AI Stripes</title>
  <subtitle>Resources for developers building AI-powered web applications.</subtitle>
  <link href="${escapeXml(new URL('/feed.xml', origin).toString())}" rel="self" />
  <link href="${escapeXml(new URL('/', origin).toString())}" />
  <id>${escapeXml(new URL('/', origin).toString())}</id>
  <updated>${escapeXml(items[0]?.content.meta.generated_at ?? new Date(0).toISOString())}</updated>
${entries.join('\n')}
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
