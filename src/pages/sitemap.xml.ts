import type { APIRoute } from 'astro';
import { getSitemapIndexEntries, renderSitemapIndex } from '../lib/sitemap';

export const prerender = true;

export const GET: APIRoute = ({ site, url }) => {
  const origin = site ?? url;

  return new Response(renderSitemapIndex(getSitemapIndexEntries(origin)), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
