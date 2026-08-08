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
    
    // Serve static files with efficient cache-control headers
    app.use(express.static(distPath, {
      maxAge: '1d',
      setHeaders: (res, filePath) => {
        // Immutable cached assets in dist/assets or hashed files
        if (filePath.includes('/assets/') || filePath.match(/\.[a-f0-9]{8,}\.(js|css|woff2?|png|jpg|webp|svg)$/)) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        } else if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
        } else if (filePath.match(/\.(png|jpg|jpeg|gif|webp|svg|ico|mp3|wav|woff2?)$/i)) {
          res.setHeader('Cache-Control', 'public, max-age=2592000');
        }
      }
    }));
    
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
