import fs from 'fs';
import path from 'path';
import { VIEW_URLS } from '../src/routes';
import { CATEGORY_SLUGS } from '../src/components/FluteFaqView';

const baseUrl = 'https://flutesangam.com';

const baseRoutes = Object.values(VIEW_URLS)
  .filter(p => !p.startsWith('/post') && !p.startsWith('/profile') && !p.startsWith('/chats'))
  .map(route => (route === '/community' ? '' : route));

const faqCategoryRoutes = Object.values(CATEGORY_SLUGS)
  .filter(Boolean)
  .map(slug => `/faq/${slug}`);

// Combine base routes and FAQ category routes (ensuring no duplicates)
const allRoutes = Array.from(new Set([...baseRoutes, ...faqCategoryRoutes]));

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    route => `  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
console.log('Sitemap generated successfully in public/sitemap.xml');

