import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const __dirname = process.cwd();
const distPath = path.join(__dirname, 'dist');
const isProduction = process.env.NODE_ENV === "production" || fs.existsSync(distPath);

async function startServer() {
  const app = express();
  const PORT = 3000;

  console.log(`Starting server. NODE_ENV: ${process.env.NODE_ENV}, isProduction: ${isProduction}`);

  // API routes
  app.use((req, res, next) => {
    console.log(`Request: ${req.method} ${req.url}`);
    next();
  });
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware
  if (!isProduction) {
    console.log("Running in development mode");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Running in production mode");
    app.use((req, res, next) => {
      console.log(`Request: ${req.method} ${req.url}`);
      next();
    });
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      console.log(`Serving index.html for: ${req.url}`);
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
