import 'dotenv/config';
import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const distPath = path.join(process.cwd(), 'dist');
const isProduction = process.env.NODE_ENV === "production" || fs.existsSync(distPath);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.use((req, res, next) => {
    console.log(`Request received: ${req.method} ${req.path}`);
    next();
  });

  console.log(`Starting server. NODE_ENV: ${process.env.NODE_ENV}, isProduction: ${isProduction}`);

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get('/sitemap.xml', (req, res) => {
    const urls = [
      { loc: 'https://flutesangam.com/', priority: '1.0', freq: 'daily' },
      { loc: 'https://flutesangam.com/learn', priority: '0.9', freq: 'weekly' },
      { loc: 'https://flutesangam.com/learn/ragas', priority: '0.9', freq: 'weekly' },
      { loc: 'https://flutesangam.com/learn/alankars', priority: '0.9', freq: 'weekly' },
      { loc: 'https://flutesangam.com/notations', priority: '0.9', freq: 'daily' },
      { loc: 'https://flutesangam.com/about', priority: '0.7', freq: 'monthly' },
    ];

    const lastmod = new Date().toISOString().split('T')[0];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${u.freq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  });

  // Vite middleware for development
  if (!isProduction) {
    console.log("Running in development mode");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Running in production mode");
    
    // Serve static files
    app.use(express.static(distPath));
    
    // SPA fallback
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
