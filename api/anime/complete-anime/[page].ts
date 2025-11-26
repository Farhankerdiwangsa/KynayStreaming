import type { VercelRequest, VercelResponse } from "@vercel/node";
import { proxyAnimeApi, setCacheHeaders, validatePage } from "../../utils";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { page } = req.query;

  try {
    const pageNum = validatePage(page);
    const data = await proxyAnimeApi(`/anime/complete-anime/${pageNum}`);
    setCacheHeaders(res, 1800);
    res.json(data);
  } catch (error) {
    console.error("Error fetching complete anime:", error);
    res.status(500).json({ error: "Failed to fetch complete anime" });
  }
}
