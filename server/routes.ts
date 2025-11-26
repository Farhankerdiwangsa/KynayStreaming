import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

const SANKAVOLLEREI_BASE_URL = "https://www.sankavollerei.com";

function validatePage(page: any): number {
  const pageNum = parseInt(page, 10);
  return isNaN(pageNum) || pageNum < 1 ? 1 : pageNum;
}

function validateKeyword(keyword: any): string {
  if (!keyword || typeof keyword !== "string" || keyword.trim().length === 0) {
    throw new Error("Keyword is required and cannot be empty");
  }
  return keyword.trim().substring(0, 100);
}

function validateGenreSlug(slug: any): string {
  if (!slug || typeof slug !== "string" || slug.trim().length === 0) {
    throw new Error("Genre slug is required");
  }
  return slug.trim().substring(0, 50);
}

function setCacheHeaders(res: any, maxAge: number) {
  res.set("Cache-Control", `public, max-age=${maxAge}`);
  res.set("Expires", new Date(Date.now() + maxAge * 1000).toUTCString());
}

async function proxyAnimeApi(endpoint: string) {
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

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/anime/home", async (_req, res) => {
    try {
      const data = await proxyAnimeApi("/anime/home");
      setCacheHeaders(res, 3600);
      res.json(data);
    } catch (error) {
      console.error("Error fetching home data:", error);
      res.status(500).json({ error: "Failed to fetch anime home data" });
    }
  });

  app.get("/api/anime/schedule", async (_req, res) => {
    try {
      const data = await proxyAnimeApi("/anime/schedule");
      setCacheHeaders(res, 86400);
      res.json(data);
    } catch (error) {
      console.error("Error fetching schedule:", error);
      res.status(500).json({ error: "Failed to fetch schedule" });
    }
  });

  app.get("/api/anime/anime/:slug", async (req, res) => {
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

  app.get("/api/anime/complete-anime/:page", async (req, res) => {
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

  app.get("/api/anime/ongoing-anime", async (req, res) => {
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

  app.get("/api/anime/genre", async (_req, res) => {
    try {
      const data = await proxyAnimeApi("/anime/genre");
      setCacheHeaders(res, 86400);
      res.json(data);
    } catch (error) {
      console.error("Error fetching genres:", error);
      res.status(500).json({ error: "Failed to fetch genres" });
    }
  });

  app.get("/api/anime/genre/:slug", async (req, res) => {
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

  app.get("/api/anime/episode/:slug", async (req, res) => {
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

  app.get("/api/anime/search/:keyword", async (req, res) => {
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

  app.get("/api/anime/batch/:slug", async (req, res) => {
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

  app.post("/api/anime/server", async (req, res) => {
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

  app.get("/api/anime/unlimited", async (_req, res) => {
    try {
      const data = await proxyAnimeApi("/anime/unlimited");
      setCacheHeaders(res, 7200);
      res.json(data);
    } catch (error) {
      console.error("Error fetching all anime:", error);
      res.status(500).json({ error: "Failed to fetch all anime" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
