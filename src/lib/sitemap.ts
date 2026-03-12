import { getAllContentWithPaths, type ContentWithPath } from './content';

export const collectionSitemapSections = [
  'resources',
  'checklists',
  'comparisons',
  'guides',
  'tools',
  'directories',
] as const;

export const sitemapSections = ['pages', ...collectionSitemapSections] as const;

export type SitemapSection = (typeof sitemapSections)[number];

type SitemapEntry = {
  loc: string;
  lastmod?: string;
};

export function isSitemapSection(value: string): value is SitemapSection {
  return sitemapSections.includes(value as SitemapSection);
}

export function getSitemapIndexEntries(site: URL): SitemapEntry[] {
  return sitemapSections.map((section) => ({
    loc: absoluteUrl(site, `/sitemaps/${section}.xml`),
  }));
}

export function getSitemapEntries(site: URL, section: SitemapSection): SitemapEntry[] {
  const allContent = getAllContentWithPaths();

  if (section === 'pages') {
    return [
      {
        loc: absoluteUrl(site, '/'),
        lastmod: getLatestLastmod(allContent),
      },
      {
        loc: absoluteUrl(site, '/search/'),
      },
    ];
  }

  const sectionContent = allContent.filter((item) => item.urlPrefix === section);

  return [
    {
      loc: absoluteUrl(site, `/${section}/`),
      lastmod: getLatestLastmod(sectionContent),
    },
    ...sectionContent.map(({ content, slug }) => ({
      loc: absoluteUrl(site, `/${section}/${slug}/`),
      lastmod: content.meta.generated_at,
    })),
  ];
}

export function renderSitemapIndex(entries: SitemapEntry[]): string {
  const body = entries
    .map(
      ({ loc, lastmod }) => `  <sitemap>
    <loc>${escapeXml(loc)}</loc>${lastmod ? `
    <lastmod>${escapeXml(lastmod)}</lastmod>` : ''}
  </sitemap>`,
    )
    .join('\n');

  return withXmlHeader(`<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</sitemapindex>`);
}

export function renderSitemap(entries: SitemapEntry[]): string {
  const body = entries
    .map(
      ({ loc, lastmod }) => `  <url>
    <loc>${escapeXml(loc)}</loc>${lastmod ? `
    <lastmod>${escapeXml(lastmod)}</lastmod>` : ''}
  </url>`,
    )
    .join('\n');

  return withXmlHeader(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`);
}

function absoluteUrl(site: URL, pathname: string): string {
  return new URL(pathname, site).toString();
}

function getLatestLastmod(items: ContentWithPath[]): string | undefined {
  const dates = items
    .map(({ content }) => content.meta.generated_at)
    .filter((value) => !Number.isNaN(Date.parse(value)))
    .sort((left, right) => Date.parse(right) - Date.parse(left));

  return dates[0];
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function withXmlHeader(body: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>\n${body}\n`;
}
