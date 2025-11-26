import { z } from "zod";

// Anime Data Types from Sankavollerei API

export interface AnimeItem {
  slug: string;
  title: string;
  poster: string;
  current_episode?: string;
  episode_count?: string;
  status?: string;
  release_day?: string;
  newest_release_date?: string;
  otakudesu_url?: string;
  type?: string;
  score?: string;
  release_date?: string;
  rating?: string;
  last_release_date?: string;
}

export interface AnimeHome {
  ongoing_anime: AnimeItem[];
  complete_anime: AnimeItem[];
}

export interface AnimeDetail {
  slug: string;
  title: string;
  poster: string;
  synopsis: string;
  status: string;
  type: string;
  total_episode: string;
  score: string;
  duration: string;
  release_date: string;
  studio: string;
  genres: string[];
  episodes: Episode[];
}

export interface Episode {
  slug: string;
  episode: string;
  release_date: string;
}

export interface Genre {
  slug: string;
  name: string;
}

export interface SearchResult {
  slug: string;
  title: string;
  poster: string;
  status: string;
  score: string;
}

export interface StreamServer {
  id: string;
  name: string;
  url: string;
}

export interface EpisodeDetail {
  title: string;
  episode: string;
  anime_slug: string;
  prev_episode?: string;
  next_episode?: string;
  stream_servers: StreamServer[];
}

// Zod schemas for validation
export const animeItemSchema = z.object({
  slug: z.string(),
  title: z.string(),
  poster: z.string(),
  episode_count: z.string(),
  status: z.string(),
  type: z.string().optional(),
  score: z.string().optional(),
  release_date: z.string().optional(),
});

export const animeHomeSchema = z.object({
  ongoing_anime: z.array(animeItemSchema),
  complete_anime: z.array(animeItemSchema),
});

export type AnimeItemType = z.infer<typeof animeItemSchema>;
export type AnimeHomeType = z.infer<typeof animeHomeSchema>;
