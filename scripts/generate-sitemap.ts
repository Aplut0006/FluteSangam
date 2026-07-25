import fs from 'fs';
import path from 'path';

const routes = [
  '/',
  '/community',
  '/community_members',
  '/chats',
  '/learn_dashboard',
  '/learn_intro',
  '/learn_basics',
  '/learn_alankaras',
  '/learn_raagas',
  '/about_us',
];

const baseUrl = 'https://www.flutesangam.com'; // Replace with actual domain if known, or handle dynamically

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${baseUrl}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;

const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
console.log('Sitemap generated successfully in public/sitemap.xml');
