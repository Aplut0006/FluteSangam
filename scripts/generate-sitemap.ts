import fs from 'fs';
import path from 'path';
import { VIEW_URLS } from '../src/routes';
import { CATEGORY_SLUGS } from '../src/data/allFaqData';

const baseUrl = 'https://flutesangam.com';

const baseRoutes = Object.values(VIEW_URLS)
  .filter(p => !p.startsWith('/post') && !p.startsWith('/profile') && !p.startsWith('/chats') && p !== '/404' && p !== '/members')
  .map(route => (route === '/community' ? '' : route));

const faqCategoryRoutes = Object.values(CATEGORY_SLUGS)
  .filter(Boolean)
  .map(slug => `/faq/${slug}`);

const alankarLevelRoutes = ['beginner', 'intermediate', 'advanced'].map(
  lvl => `/learn/alankaras/${lvl}`
);

// Combine base routes, FAQ category routes, and Alankar level routes (ensuring no duplicates)
const allRoutes = Array.from(new Set([...baseRoutes, ...faqCategoryRoutes, ...alankarLevelRoutes]));

const publicDir = path.join(process.cwd(), 'public');
const sitemapPath = path.join(publicDir, 'sitemap.xml');

// Explicit historic publication / update dates
const ROUTE_MOD_DATES: Record<string, string> = {
  '': '2026-09-18',
  '/learn/intro': '2026-09-18',
  '/learn/choose-flute': '2026-09-18',
  '/tuner': '2026-09-18',
  '/learn/basics': '2026-09-18',
  '/learn/fingering-chart': '2026-09-18',
  '/learn/alankaras': '2026-09-18',
  '/learn/daily-practice-guide': '2026-09-18',
  '/learn/flute-scales-octaves': '2026-09-18',
  '/learn/common-flute-mistakes': '2026-09-18',
  '/alankar-generator': '2026-09-18',
  '/learn/raagas': '2026-09-18',
  '/learn/raga-bhoopali': '2026-09-18',
  '/learn/raga-durga': '2026-09-18',
  '/learn/raga-yaman': '2026-09-18',
  '/learn/raga-hamsadhwani': '2026-09-18',
  '/learn/raga-bilawal': '2026-09-18',
  '/learn/raga-desh': '2026-09-18',
  '/learn/raga-kafi': '2026-09-18',
  '/learn/raga-bageshree': '2026-09-18',
  '/learn/raga-bhimpalasi': '2026-09-18',
  '/learn/raga-brindavani-sarang': '2026-09-18',
  '/learn/raga-khamaj': '2026-09-18',
  '/learn/raga-bhairav': '2026-09-18',
  '/learn/raga-bihag': '2026-09-18',
  '/learn/raga-malkauns': '2026-09-18',
  '/learn/raga-marwa': '2026-09-18',
  '/learn/raga-jog': '2026-09-18',
  '/learn/raga-todi': '2026-09-18',
  '/learn/raga-multani': '2026-09-18',
  '/learn/raga-pahadi': '2026-09-18',
  '/learn/raga-miyan-ki-malhar': '2026-09-18',
  '/learn/raga-tilang': '2026-09-18',
  '/learn/raga-shivranjani': '2026-09-18',
  '/learn/raga-jaunpuri': '2026-09-18',
  '/about': '2026-09-18',
  '/founder': '2026-09-18',
  '/contact': '2026-09-18',
  '/learn': '2026-09-18',
  '/notations': '2026-09-18',
  '/notations/happy-birthday-flute-notes': '2026-09-19',
  '/notations/jingle-bells-flute-notes': '2026-09-19',
  '/notations/my-heart-will-go-on-flute-notes': '2026-09-19',
  '/notations/tum-hi-ho-flute-notes': '2026-09-19',
  '/notations/achyutam-keshavam-flute-notes': '2026-09-21',
  '/notations/radha-krishna-flute-notes': '2026-09-23',
  '/privacy-policy': '2026-09-18',
  '/terms-of-service': '2026-09-18',
  '/faq': '2026-09-18',
  '/tools/flute-note-key-converter': '2026-09-18',
  '/learn/how-to-find-scale-of-a-song-on-flute': '2026-09-18',
  '/learn/how-to-read-bansuri-notation': '2026-09-18',
  '/faq/getting-started': '2026-09-18',
  '/faq/learning-the-flute': '2026-09-18',
  '/faq/adult-learners': '2026-09-18',
  '/faq/choosing-the-right-flute': '2026-09-18',
  '/faq/playing-techniques': '2026-09-18',
  '/faq/advanced-techniques': '2026-09-18',
  '/faq/daily-practice': '2026-09-18',
  '/faq/scales-and-alankars': '2026-09-18',
  '/faq/raagas': '2026-09-18',
  '/faq/flute-care-and-maintenance': '2026-09-18',
  '/faq/health-and-breathing': '2026-09-18',
  '/faq/children-and-beginners': '2026-09-18',
  '/faq/music-theory': '2026-09-18',
  '/faq/tuning-and-pitch': '2026-09-18',
  '/faq/flute-accessories': '2026-09-18',
  '/faq/flute-types': '2026-09-18',
  '/faq/platform': '2026-09-18',
  '/learn/alankaras/beginner': '2026-09-18',
  '/learn/alankaras/intermediate': '2026-09-18',
  '/learn/alankaras/advanced': '2026-09-18'
};

const getRouteLastMod = (route: string): string => {
  // ONLY radha-krishna-flute-notes is set to 2026-09-23
  if (route === '/notations/radha-krishna-flute-notes') {
    return '2026-09-23';
  }
  return ROUTE_MOD_DATES[route] || '2026-09-18';
};

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    route => `  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${getRouteLastMod(route)}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

fs.writeFileSync(sitemapPath, sitemap);
console.log('Sitemap generated successfully in public/sitemap.xml with strictly isolated lastmod dates');
