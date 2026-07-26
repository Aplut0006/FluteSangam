import fs from 'fs';
import path from 'path';
import { VIEW_URLS } from '../src/routes';

const baseUrl = 'https://flutesangam.com';

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Object.values(VIEW_URLS)
  .filter(path => !path.startsWith('/post') && !path.startsWith('/profile') && !path.startsWith('/chats'))
  .map(route => `  <url>
    <loc>${baseUrl}${route === '/community' ? '' : route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;

const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
console.log('Sitemap generated successfully in public/sitemap.xml');
