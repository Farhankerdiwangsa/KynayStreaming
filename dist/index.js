// server/index-prod.ts
import fs from "node:fs";
import path from "node:path";
import express2 from "express";

// server/app.ts
import express from "express";

// server/routes.ts
import { createServer } from "http";
var SANKAVOLLEREI_BASE_URL = "https://www.sankavollerei.com";
function validatePage(page) {
  const pageNum = parseInt(page, 10);
  return isNaN(pageNum) || pageNum < 1 ? 1 : pageNum;
}
function validateKeyword(keyword) {
  if (!keyword || typeof keyword !== "string" || keyword.trim().length === 0) {
    throw new Error("Keyword is required and cannot be empty");
  }
  return keyword.trim().substring(0, 100);
}
function validateGenreSlug(slug) {
  if (!slug || typeof slug !== "string" || slug.trim().length === 0) {
    throw new Error("Genre slug is required");
  }
  return slug.trim().substring(0, 50);
}
function setCacheHeaders(res, maxAge) {
  res.set("Cache-Control", `public, max-age=${maxAge}`);
  res.set("Expires", new Date(Date.now() + maxAge * 1e3).toUTCString());
}
async function proxyAnimeApi(endpoint) {
  const response = await fetch(`${SANKAVOLLEREI_BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  const json = await response.json();
  if (json.status === "success" && json.data) {
    return json.data;
  }
  return json;
}
async function registerRoutes(app2) {
  app2.get("/api/anime/home", async (_req, res) => {
    try {
      const data = await proxyAnimeApi("/anime/home");
      setCacheHeaders(res, 3600);
      res.json(data);
    } catch (error) {
      console.error("Error fetching home data:", error);
      res.status(500).json({ error: "Failed to fetch anime home data" });
    }
  });
  app2.get("/api/anime/schedule", async (_req, res) => {
    try {
      const data = await proxyAnimeApi("/anime/schedule");
      setCacheHeaders(res, 86400);
      res.json(data);
    } catch (error) {
      console.error("Error fetching schedule:", error);
      res.status(500).json({ error: "Failed to fetch schedule" });
    }
  });
  app2.get("/api/anime/anime/:slug", async (req, res) => {
    try {
      const slug = req.params.slug.substring(0, 100);
      const data = await proxyAnimeApi(`/anime/anime/${slug}`);
      setCacheHeaders(res, 7200);
      res.json(data);
    } catch (error) {
      console.error("Error fetching anime detail:", error);
      res.status(500).json({ error: "Failed to fetch anime detail" });
    }
  });
  app2.get("/api/anime/complete-anime/:page", async (req, res) => {
    try {
      const page = validatePage(req.params.page);
      const data = await proxyAnimeApi(`/anime/complete-anime/${page}`);
      setCacheHeaders(res, 1800);
      res.json(data);
    } catch (error) {
      console.error("Error fetching complete anime:", error);
      res.status(500).json({ error: "Failed to fetch complete anime" });
    }
  });
  app2.get("/api/anime/ongoing-anime", async (req, res) => {
    try {
      const page = validatePage(req.query.page);
      const data = await proxyAnimeApi(`/anime/ongoing-anime?page=${page}`);
      setCacheHeaders(res, 1800);
      res.json(data);
    } catch (error) {
      console.error("Error fetching ongoing anime:", error);
      res.status(500).json({ error: "Failed to fetch ongoing anime" });
    }
  });
  app2.get("/api/anime/genre", async (_req, res) => {
    try {
      const data = await proxyAnimeApi("/anime/genre");
      setCacheHeaders(res, 86400);
      res.json(data);
    } catch (error) {
      console.error("Error fetching genres:", error);
      res.status(500).json({ error: "Failed to fetch genres" });
    }
  });
  app2.get("/api/anime/genre/:slug", async (req, res) => {
    try {
      const slug = validateGenreSlug(req.params.slug);
      const page = validatePage(req.query.page);
      const data = await proxyAnimeApi(`/anime/genre/${slug}?page=${page}`);
      setCacheHeaders(res, 1800);
      res.json(data);
    } catch (error) {
      console.error("Error fetching anime by genre:", error);
      res.status(500).json({ error: "Failed to fetch anime by genre" });
    }
  });
  app2.get("/api/anime/episode/:slug", async (req, res) => {
    try {
      const slug = req.params.slug.substring(0, 100);
      const data = await proxyAnimeApi(`/anime/episode/${slug}`);
      setCacheHeaders(res, 3600);
      res.json(data);
    } catch (error) {
      console.error("Error fetching episode detail:", error);
      res.status(500).json({ error: "Failed to fetch episode detail" });
    }
  });
  app2.get("/api/anime/search/:keyword", async (req, res) => {
    try {
      const keyword = validateKeyword(req.params.keyword);
      const data = await proxyAnimeApi(`/anime/search/${keyword}`);
      setCacheHeaders(res, 1800);
      res.json(data);
    } catch (error) {
      console.error("Error searching anime:", error);
      res.status(400).json({ error: "Invalid search query" });
    }
  });
  app2.get("/api/anime/batch/:slug", async (req, res) => {
    try {
      const slug = req.params.slug.substring(0, 100);
      const data = await proxyAnimeApi(`/anime/batch/${slug}`);
      setCacheHeaders(res, 3600);
      res.json(data);
    } catch (error) {
      console.error("Error fetching batch:", error);
      res.status(500).json({ error: "Failed to fetch batch" });
    }
  });
  app2.post("/api/anime/server", async (req, res) => {
    try {
      const { serverId } = req.body;
      if (!serverId || typeof serverId !== "string") {
        return res.status(400).json({ error: "serverId is required" });
      }
      const data = await proxyAnimeApi(serverId);
      setCacheHeaders(res, 600);
      res.json(data);
    } catch (error) {
      console.error("Error fetching server URL:", error);
      res.status(500).json({ error: "Failed to fetch server URL" });
    }
  });
  app2.get("/api/anime/unlimited", async (_req, res) => {
    try {
      const data = await proxyAnimeApi("/anime/unlimited");
      setCacheHeaders(res, 7200);
      res.json(data);
    } catch (error) {
      console.error("Error fetching all anime:", error);
      res.status(500).json({ error: "Failed to fetch all anime" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/app.ts
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
var app = express();
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path2 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path2.startsWith("/api")) {
      let logLine = `${req.method} ${path2} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
async function runApp(setup) {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  await setup(app, server);
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
}

// server/index-prod.ts
async function serveStatic(app2, _server) {
  const distPath = path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express2.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
(async () => {
  await runApp(serveStatic);
})();
export {
  serveStatic
};
