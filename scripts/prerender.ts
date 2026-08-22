import fs from 'fs';
import path from 'path';
import { VIEW_URLS } from '../src/routes';
import { CATEGORY_SLUGS } from '../src/data/allFaqData';
import { renderRouteHtml } from '../src/seo/renderRouteHtml';

const distDir = path.join(process.cwd(), 'dist');
const templatePath = path.join(distDir, 'index.html');

if (!fs.existsSync(templatePath)) {
  console.error('[Prerender Error] dist/index.html does not exist. Run vite build first.');
  process.exit(1);
}

const templateHtml = fs.readFileSync(templatePath, 'utf-8');

// Collect all public indexable routes
const baseRoutes = Object.values(VIEW_URLS)
  .filter(p => !p.startsWith('/post') && !p.startsWith('/profile') && !p.startsWith('/chats'));

const faqCategoryRoutes = Object.values(CATEGORY_SLUGS)
  .filter(Boolean)
  .map(slug => `/faq/${slug}`);

const alankarLevelRoutes = ['beginner', 'intermediate', 'advanced'].map(
  lvl => `/learn/alankaras/${lvl}`
);

const raagList = [
  'bhoopali', 'durga', 'yaman', 'hamsadhwani', 'bilawal', 'desh', 'kafi',
  'bageshree', 'bhimpalasi', 'brindavani-sarang', 'khamaj', 'bhairav', 'bihag',
  'malkauns', 'marwa', 'jog', 'todi', 'multani', 'pahadi', 'miyan-ki-malhar',
  'tilang', 'shivranjani'
];

const raagAliasRoutes = raagList.flatMap(r => [
  `/raag/${r}`,
  `/raag-${r}`
]);

const extraAliases = [
  '/privacy',
  '/terms',
  '/search'
];

// Combine all routes into a unique set
const allRoutes = Array.from(new Set([
  '/',
  ...baseRoutes,
  ...faqCategoryRoutes,
  ...alankarLevelRoutes,
  ...raagAliasRoutes,
  ...extraAliases
]));

console.log(`[Prerender] Starting static HTML generation for ${allRoutes.length} public routes...`);

let successCount = 0;

for (const route of allRoutes) {
  try {
    const { html, title } = renderRouteHtml(route, templateHtml);

    if (route === '/') {
      // Overwrite root dist/index.html
      fs.writeFileSync(templatePath, html, 'utf-8');
      successCount++;
      continue;
    }

    // Write to dist/<route>/index.html
    const routeFolder = path.join(distDir, route.replace(/^\//, ''));
    if (!fs.existsSync(routeFolder)) {
      fs.mkdirSync(routeFolder, { recursive: true });
    }
    fs.writeFileSync(path.join(routeFolder, 'index.html'), html, 'utf-8');

    // Also write to dist/<route>.html
    const flatFilePath = path.join(distDir, `${route.replace(/^\//, '')}.html`);
    const parentDir = path.dirname(flatFilePath);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    fs.writeFileSync(flatFilePath, html, 'utf-8');

    successCount++;
  } catch (err) {
    console.error(`[Prerender Error] Failed to generate HTML for route "${route}":`, err);
  }
}

console.log(`[Prerender Success] Successfully pre-rendered ${successCount}/${allRoutes.length} static HTML pages into dist/`);
