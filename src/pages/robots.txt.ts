import type { APIRoute } from 'astro';
import { sitePath } from '../lib/site';

export const GET: APIRoute = ({ site }) => new Response(
  `User-agent: *\nAllow: /\nSitemap: ${new URL(sitePath('sitemap.xml'), site)}\n`,
  { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
);
