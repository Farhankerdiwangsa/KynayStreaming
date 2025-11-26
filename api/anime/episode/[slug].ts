import type { VercelRequest, VercelResponse } from "@vercel/node";
import { proxyAnimeApi, setCacheHeaders } from "../../utils";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { slug } = req.query;

  if (!slug || typeof slug !== "string") {
    return res.status(400).json({ error: "Slug is required" });
  }

  try {
    const slugSanitized = slug.substring(0, 100);
    const data = await proxyAnimeApi(`/anime/episode/${slugSanitized}`);
    setCacheHeaders(res, 3600);
    res.json(data);
  } catch (error) {
    console.error("Error fetching episode detail:", error);
    res.status(500).json({ error: "Failed to fetch episode detail" });
  }
}
