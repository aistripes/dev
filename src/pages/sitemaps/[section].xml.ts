import type { APIRoute } from 'astro';
import { getSitemapEntries, isSitemapSection, renderSitemap, sitemapSections } from '../../lib/sitemap';

export const prerender = true;

export function getStaticPaths() {
  return sitemapSections.map((section) => ({
    params: { section },
  }));
}

export const GET: APIRoute = ({ params, site, url }) => {
  const { section } = params;

  if (!section || !isSitemapSection(section)) {
    return new Response('Not found', { status: 404 });
  }

  const origin = site ?? url;

  return new Response(renderSitemap(getSitemapEntries(origin, section)), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
