import type { VercelRequest, VercelResponse } from "@vercel/node";
import { proxyAnimeApi, setCacheHeaders } from "../utils";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const data = await proxyAnimeApi("/anime/unlimited");
    setCacheHeaders(res, 7200);
    res.json(data);
  } catch (error) {
    console.error("Error fetching all anime:", error);
    res.status(500).json({ error: "Failed to fetch all anime" });
  }
}
