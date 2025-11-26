import type { VercelRequest, VercelResponse } from "@vercel/node";
import { proxyAnimeApi, setCacheHeaders } from "../utils";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

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
}
