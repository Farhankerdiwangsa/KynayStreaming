import type { VercelRequest, VercelResponse } from "@vercel/node";
import { proxyAnimeApi, setCacheHeaders } from "../utils";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { slug } = req.query;

  if (!slug || typeof slug !== "string") {
    return res.status(400).json({ error: "Slug is required" });
  }

  try {
    const slugSanitized = slug.substring(0, 100);
    const data = await proxyAnimeApi(`/anime/anime/${slugSanitized}`);
    setCacheHeaders(res, 7200);
    res.json(data);
  } catch (error) {
    console.error("Error fetching anime detail:", error);
    res.status(500).json({ error: "Failed to fetch anime detail" });
  }
}
