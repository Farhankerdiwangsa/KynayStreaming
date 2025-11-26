import type { VercelRequest, VercelResponse } from "@vercel/node";
import { proxyAnimeApi, setCacheHeaders } from "../utils";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const data = await proxyAnimeApi("/anime/home");
    setCacheHeaders(res, 3600);
    res.json(data);
  } catch (error) {
    console.error("Error fetching home data:", error);
    res.status(500).json({ error: "Failed to fetch anime home data" });
  }
}
