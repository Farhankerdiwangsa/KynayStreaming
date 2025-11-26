import type { VercelRequest, VercelResponse } from "@vercel/node";
import { proxyAnimeApi, setCacheHeaders, validateKeyword } from "../../utils";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { keyword } = req.query;

  if (!keyword || typeof keyword !== "string") {
    return res.status(400).json({ error: "Keyword is required" });
  }

  try {
    const keywordSanitized = validateKeyword(keyword);
    const data = await proxyAnimeApi(`/anime/search/${keywordSanitized}`);
    setCacheHeaders(res, 1800);
    res.json(data);
  } catch (error) {
    console.error("Error searching anime:", error);
    res.status(400).json({ error: "Invalid search query" });
  }
}
