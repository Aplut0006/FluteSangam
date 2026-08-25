import 'dotenv/config';
import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { renderRouteHtml } from "./src/seo/renderRouteHtml";

const distPath = path.join(process.cwd(), 'dist');
const isProduction = process.env.NODE_ENV === "production";

async function startServer() {
  const app = express();
  const PORT = 3000;
  let vite: any = null;

  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // 301/302 Redirects for legacy and alias URLs
  app.get('/practice', (req, res) => {
    res.redirect(301, '/learn/daily-practice-guide');
  });
  app.get('/ragas', (req, res) => {
    res.redirect(301, '/learn/raagas');
  });
  app.get('/community', (req, res) => {
    res.redirect(302, '/#recent-discussions-section');
  });

  // Specific static routes with explicit MIME and Cache-Control headers
  app.get('/sitemap.xml', (req, res) => {
    const publicSitemap = path.join(process.cwd(), 'public', 'sitemap.xml');
    const distSitemap = path.join(distPath, 'sitemap.xml');
    const targetPath = fs.existsSync(publicSitemap) ? publicSitemap : distSitemap;
    
    if (fs.existsSync(targetPath)) {
      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      return res.sendFile(targetPath);
    }
    res.status(404).send('Sitemap not found');
  });

  app.get('/robots.txt', (req, res) => {
    const publicRobots = path.join(process.cwd(), 'public', 'robots.txt');
    const distRobots = path.join(distPath, 'robots.txt');
    const targetPath = fs.existsSync(publicRobots) ? publicRobots : distRobots;
    
    if (fs.existsSync(targetPath)) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      return res.sendFile(targetPath);
    }
    res.status(404).send('robots.txt not found');
  });

  // Serve static files in production mode with extensions & cache control
  if (isProduction) {
    app.use(express.static(distPath, {
      maxAge: '1d',
      extensions: ['html'],
      setHeaders: (res, filePath) => {
        if (filePath.includes('/assets/') || filePath.match(/\.[a-f0-9]{8,}\.(js|css|woff2?|png|jpg|webp|svg)$/)) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        } else if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
        } else if (filePath.match(/\.(png|jpg|jpeg|gif|webp|svg|ico|mp3|wav|woff2?)$/i)) {
          res.setHeader('Cache-Control', 'public, max-age=2592000');
        }
      }
    }));
  } else {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  // Dynamic / Prerendered HTML Page Fallback for both production and dev
  app.get('*', async (req, res, next) => {
    // Skip asset or API files
    if (req.path.includes('.') && !req.path.endsWith('.html')) {
      return next();
    }

    const cleanPath = req.path;
    
    if (isProduction) {
      if (cleanPath === '/404' || cleanPath === '/404.html') {
        const possible404s = [
          path.join(distPath, '404', 'index.html'),
          path.join(distPath, '404.html'),
        ];
        for (const filePath of possible404s) {
          if (fs.existsSync(filePath)) {
            return res.status(404).sendFile(filePath);
          }
        }
      }

      // Check if pre-rendered HTML file exists in dist
      const possibleFiles = [
        path.join(distPath, cleanPath, 'index.html'),
        path.join(distPath, `${cleanPath.replace(/^\//, '')}.html`),
      ];

      for (const filePath of possibleFiles) {
        if (fs.existsSync(filePath)) {
          return res.sendFile(filePath);
        }
      }

      const templatePath = path.join(distPath, 'index.html');
      if (fs.existsSync(templatePath)) {
        const templateHtml = fs.readFileSync(templatePath, 'utf-8');
        const { html, is404 } = renderRouteHtml(cleanPath, templateHtml);
        return res.status(is404 ? 404 : 200).setHeader('Content-Type', 'text/html').send(html);
      }
    } else {
      // Development mode: use Vite to transform index.html
      const templatePath = path.join(process.cwd(), 'index.html');
      if (fs.existsSync(templatePath)) {
        let templateHtml = fs.readFileSync(templatePath, 'utf-8');
        if (vite) {
          templateHtml = await vite.transformIndexHtml(req.originalUrl || cleanPath, templateHtml);
        }
        const { html, is404 } = renderRouteHtml(cleanPath, templateHtml);
        return res.status(is404 ? 404 : 200).setHeader('Content-Type', 'text/html').send(html);
      }
    }

    next();
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
