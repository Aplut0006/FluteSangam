import 'dotenv/config';
import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";

const distPath = path.join(process.cwd(), 'dist');
const isProduction = process.env.NODE_ENV === "production" || fs.existsSync(distPath);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  console.log(`Starting server. NODE_ENV: ${process.env.NODE_ENV}, isProduction: ${isProduction}`);

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/request-notation", async (req, res) => {
    const { songName, singerName, movieName } = req.body;
    if (!songName || !singerName) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: "aplut0006@gmail.com",
        subject: "New Song Notation Request",
        text: `Song: ${songName}\nSinger: ${singerName}\nMovie: ${movieName || 'N/A'}`,
      });
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to send email" });
    }
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
