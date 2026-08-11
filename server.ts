import 'dotenv/config';
import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { renderRouteHtml } from "./src/seo/renderRouteHtml";

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

  // Serve static files in production mode with extensions & cache control
  if (isProduction) {
    console.log("Running in production mode");
    
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
    console.log("Running in development mode");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);
  }

  // Dynamic / Prerendered HTML Page Fallback for both production and dev
  app.get('*', (req, res, next) => {
    // Skip asset or API files
    if (req.path.includes('.') && !req.path.endsWith('.html')) {
      return next();
    }

    const cleanPath = req.path;
    
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

    // Dynamic rendering fallback using renderRouteHtml
    const templatePath = isProduction 
      ? path.join(distPath, 'index.html') 
      : path.join(process.cwd(), 'index.html');

    if (fs.existsSync(templatePath)) {
      const templateHtml = fs.readFileSync(templatePath, 'utf-8');
      const { html } = renderRouteHtml(cleanPath, templateHtml);
      return res.setHeader('Content-Type', 'text/html').send(html);
    }

    next();
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
