import fs from 'fs';
import path from 'path';
import { VIEW_URLS } from '../src/routes';

const baseUrl = 'https://flutesangam.com';

const baseRoutes = Object.values(VIEW_URLS)
  .filter(p => !p.startsWith('/post') && !p.startsWith('/profile') && !p.startsWith('/chats') && p !== '/404' && p !== '/members');

const rankedAlankarRoutes = [
  '/learn/alankaras/beginner',
  '/learn/alankaras/intermediate',
  '/learn/alankaras/advanced'
];

// Explicit historic publication / update dates
const ROUTE_MOD_DATES: Record<string, string> = {
  '/': '2026-11-07',
  '/community': '2026-11-07',
  '/learn/intro': '2026-10-18',
  '/learn/choose-flute': '2026-10-18',
  '/tuner': '2026-09-18',
  '/learn/basics': '2026-10-18',
  '/learn/fingering-chart': '2026-10-18',
  '/learn/alankaras': '2026-10-18',
  '/learn/alankaras/beginner': '2026-10-18',
  '/learn/alankaras/intermediate': '2026-10-18',
  '/learn/alankaras/advanced': '2026-10-18',
  '/learn/daily-practice-guide': '2026-10-18',
  '/learn/flute-scales-octaves': '2026-11-13',
  '/learn/common-flute-mistakes': '2026-11-13',
  '/alankar-generator': '2026-10-18',
  '/learn/raagas': '2026-11-13',
  '/learn/raga-bhoopali': '2026-11-13',
  '/learn/raga-durga': '2026-11-13',
  '/learn/raga-yaman': '2026-11-13',
  '/learn/raga-hamsadhwani': '2026-11-13',
  '/learn/raga-bilawal': '2026-11-13',
  '/learn/raga-desh': '2026-11-13',
  '/learn/raga-kafi': '2026-11-13',
  '/learn/raga-bageshree': '2026-11-13',
  '/learn/raga-bhimpalasi': '2026-11-13',
  '/learn/raga-brindavani-sarang': '2026-11-13',
  '/learn/raga-khamaj': '2026-11-13',
  '/learn/raga-bhairav': '2026-11-13',
  '/learn/raga-bihag': '2026-11-13',
  '/learn/raga-malkauns': '2026-11-13',
  '/learn/raga-marwa': '2026-11-13',
  '/learn/raga-jog': '2026-11-13',
  '/learn/raga-todi': '2026-11-13',
  '/learn/raga-multani': '2026-11-13',
  '/learn/raga-pahadi': '2026-11-13',
  '/learn/raga-miyan-ki-malhar': '2026-11-13',
  '/learn/raga-tilang': '2026-11-13',
  '/learn/raga-shivranjani': '2026-11-13',
  '/learn/raga-jaunpuri': '2026-11-13',
  '/about': '2026-11-07',
  '/founder': '2026-11-07',
  '/contact': '2026-11-07',
  '/learn': '2026-10-18',
  '/notations': '2026-11-07',
  '/notations/happy-birthday-flute-notes': '2026-11-07',
  '/notations/jingle-bells-flute-notes': '2026-11-07',
  '/notations/my-heart-will-go-on-flute-notes': '2026-11-07',
  '/notations/tum-hi-ho-flute-notes': '2026-11-07',
  '/notations/kal-ho-naa-ho-flute-notes': '2026-11-07',
  '/notations/achyutam-keshavam-flute-notes': '2026-11-07',
  '/notations/radha-krishna-flute-notes': '2026-11-07',
  '/notations/jana-gana-mana-flute-notes': '2026-11-07',
  '/notations/mahabharat-krishna-theme-flute-notes': '2026-11-07',
  '/notations/shri-krishna-govind-hare-murari-flute-notes': '2026-11-07',
  '/notations/hothon-se-chhoo-lo-tum-flute-notes': '2026-11-07',
  '/notations/krrish-theme-flute-notes': '2026-11-07',
  '/notations/enchanting-flute-krishna-aur-kans-flute-notes': '2026-11-07',
  '/notations/lag-ja-gale-flute-notes': '2026-11-07',
  '/notations/chhu-kar-mere-mann-ko-flute-notes': '2026-11-07',
  '/notations/tujhe-dekha-to-flute-notes': '2026-11-07',
  '/notations/yeh-shaam-mastani-flute-notes': '2026-11-07',
  '/notations/hero-1983-flute-theme-notes': '2026-11-22',
  '/notations/bombay-theme-flute-notes': '2026-11-24',
  '/notations/zara-zara-flute-notes': '2026-11-25',
  '/notations/pehla-nasha-flute-notes': '2026-11-27',
  '/privacy-policy': '2026-09-18',
  '/terms-of-service': '2026-09-18',
  '/copyright-policy': '2026-10-02',
  '/faq': '2026-11-13',
  '/tools/tanpura': '2026-11-15',
  '/tools/metronome': '2026-11-15',
  '/tools/flute-note-key-converter': '2026-10-18',
  '/learn/how-to-find-scale-of-a-song-on-flute': '2026-11-13',
  '/learn/how-to-read-bansuri-notation': '2026-10-18'
};

// Combine base routes and ranked Alankar routes (thin /faq/* filter sub-routes and /post/* excluded)
const allRoutes = Array.from(new Set([...baseRoutes, ...rankedAlankarRoutes]));

const publicDir = path.join(process.cwd(), 'public');
const sitemapPath = path.join(publicDir, 'sitemap.xml');

const getRouteLastMod = (route: string): string => {
  return ROUTE_MOD_DATES[route] || '2026-09-18';
};

const getRouteSeoConfig = (route: string): { changefreq: string; priority: string } => {
  if (route === '/') {
    return { changefreq: 'daily', priority: '1.0' };
  }
  if (route === '/community') {
    return { changefreq: 'daily', priority: '0.9' };
  }
  if (
    route === '/learn' ||
    route === '/learn/raagas' ||
    route === '/notations' ||
    route === '/learn/alankaras' ||
    route === '/tuner' ||
    route === '/tools/tanpura' ||
    route === '/tools/metronome' ||
    route === '/tools/flute-note-key-converter' ||
    route === '/alankar-generator' ||
    route === '/faq'
  ) {
    return { changefreq: 'weekly', priority: '0.9' };
  }
  if (
    route.startsWith('/notations/') ||
    route.startsWith('/learn/')
  ) {
    return { changefreq: 'weekly', priority: '0.8' };
  }
  if (route === '/about' || route === '/founder' || route === '/contact') {
    return { changefreq: 'monthly', priority: '0.7' };
  }
  if (route === '/privacy-policy' || route === '/terms-of-service' || route === '/copyright-policy') {
    return { changefreq: 'yearly', priority: '0.4' };
  }
  return { changefreq: 'weekly', priority: '0.8' };
};

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(route => {
    const { changefreq, priority } = getRouteSeoConfig(route);
    return `  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${getRouteLastMod(route)}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  })
  .join('\n')}
</urlset>`;

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

fs.writeFileSync(sitemapPath, sitemap);
console.log('Sitemap generated successfully in public/sitemap.xml with strictly isolated lastmod dates');
process.exit(0);
