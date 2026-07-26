import fs from 'fs';
import path from 'path';

const routes = [
  '/',
  '/learn',
  '/learn/ragas',
  '/learn/alankars',
  '/notations',
  '/about',
];

const baseUrl = 'https://flutesangam.com'; // Replace with actual domain if known, or handle dynamically

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${baseUrl}${route}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`).join('\n')}
</urlset>`;

const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
console.log('Sitemap generated successfully in public/sitemap.xml');
