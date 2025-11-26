import { fetcher } from "./fetcher";
import type {
  AnimeHome,
  AnimeDetail,
  AnimeItem,
  Genre,
  SearchResult,
  EpisodeDetail,
  StreamServer,
} from "@shared/schema";

const BASE_URL = "https://www.sankavollerei.com";

export const api = {
  getHome: async (): Promise<AnimeHome> => {
    return fetcher<AnimeHome>(`${BASE_URL}/anime/home`);
  },

  getSchedule: async (): Promise<any> => {
    return fetcher(`${BASE_URL}/anime/schedule`);
  },

  getAnimeDetail: async (slug: string): Promise<AnimeDetail> => {
    return fetcher<AnimeDetail>(`${BASE_URL}/anime/anime/${slug}`);
  },

  getCompleteAnime: async (page: number = 1): Promise<{ animes: AnimeItem[] }> => {
    return fetcher(`${BASE_URL}/anime/complete-anime/${page}`);
  },

  getOngoingAnime: async (page: number = 1): Promise<{ animes: AnimeItem[] }> => {
    return fetcher(`${BASE_URL}/anime/ongoing-anime?page=${page}`);
  },

  getGenres: async (): Promise<Genre[]> => {
    return fetcher<Genre[]>(`${BASE_URL}/anime/genre`);
  },

  getAnimeByGenre: async (
    slug: string,
    page: number = 1
  ): Promise<{ animes: AnimeItem[] }> => {
    return fetcher(`${BASE_URL}/anime/genre/${slug}?page=${page}`);
  },

  getEpisodeDetail: async (slug: string): Promise<EpisodeDetail> => {
    return fetcher<EpisodeDetail>(`${BASE_URL}/anime/episode/${slug}`);
  },

  searchAnime: async (keyword: string): Promise<SearchResult[]> => {
    return fetcher<SearchResult[]>(`${BASE_URL}/anime/search/${keyword}`);
  },

  getBatch: async (slug: string): Promise<any> => {
    return fetcher(`${BASE_URL}/anime/batch/${slug}`);
  },

  getServerUrl: async (serverId: string): Promise<{ url: string }> => {
    return fetcher<{ url: string }>(`${BASE_URL}/anime/server/${serverId}`);
  },

  getAllAnime: async (): Promise<AnimeItem[]> => {
    return fetcher<AnimeItem[]>(`${BASE_URL}/anime/unlimited`);
  },
};

export const {
  getHome,
  getSchedule,
  getAnimeDetail,
  getCompleteAnime,
  getOngoingAnime,
  getGenres,
  getAnimeByGenre,
  getEpisodeDetail,
  searchAnime,
  getBatch,
  getServerUrl,
  getAllAnime,
} = api;

export default api;
