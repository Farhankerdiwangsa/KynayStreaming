import type { VercelRequest, VercelResponse } from "@vercel/node";
import { proxyAnimeApi, setCacheHeaders, validateGenreSlug, validatePage } from "../../utils";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { slug } = req.query;

  if (!slug || typeof slug !== "string") {
    return res.status(400).json({ error: "Slug is required" });
  }

  try {
    const slugSanitized = validateGenreSlug(slug);
    const page = validatePage(req.query.page);
    const data = await proxyAnimeApi(`/anime/genre/${slugSanitized}?page=${page}`);
    setCacheHeaders(res, 1800);
    res.json(data);
  } catch (error) {
    console.error("Error fetching anime by genre:", error);
    res.status(500).json({ error: "Failed to fetch anime by genre" });
  }
}
