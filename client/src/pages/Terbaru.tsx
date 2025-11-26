import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimeCard } from "@/components/home/AnimeCard";
import { SectionTitle } from "@/components/home/SectionTitle";
import AnimeHeroSlider from "@/components/home/AnimeHeroSlider";
import type { AnimeItem } from "@shared/schema";

interface OngoingResponse {
  ongoingAnimeData: AnimeItem[];
  paginationData: {
    current_page: number;
    has_next_page: boolean;
    next_page: number | null;
  };
}

async function fetchLatestAnime(): Promise<AnimeItem[]> {
  const response = await fetch("/api/anime/ongoing-anime?page=1");
  if (!response.ok) {
    throw new Error("Failed to fetch latest anime");
  }
  const data: OngoingResponse = await response.json();
  return (data.ongoingAnimeData || [])
    .filter(anime => anime && anime.slug && anime.poster)
    .slice(0, 16)
    .map(anime => ({
      ...anime,
      status: "Ongoing",
    }));
}

export default function Terbaru() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["anime", "terbaru"],
    queryFn: fetchLatestAnime,
  });

  const animes = data || [];
  const topAnimes = animes.slice(0, 3);

  return (
    <div className="min-h-screen">
      <AnimeHeroSlider slides={topAnimes} isLoading={isLoading} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <section>
          <SectionTitle>Anime Terbaru</SectionTitle>

          {error && (
            <div
              className="text-center py-16 bg-card border border-destructive/50 rounded-lg"
              data-testid="error-message"
            >
              <p className="text-destructive text-lg font-medium mb-2">
                Terjadi Kesalahan
              </p>
              <p className="text-muted-foreground">
                Gagal memuat anime terbaru. Silakan coba lagi nanti.
              </p>
            </div>
          )}

          {isLoading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {[...Array(16)].map((_, i) => (
                <div
                  key={i}
                  className="space-y-3"
                >
                  <Skeleton className="aspect-[3/5] w-full bg-muted rounded-lg" />
                  <Skeleton className="h-4 w-3/4 bg-muted rounded-md" />
                  <Skeleton className="h-3 w-1/2 bg-muted rounded-md" />
                </div>
              ))}
            </div>
          )}

          {!isLoading && !error && (
            <>
              {animes.length > 0 ? (
                <div className="w-full">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                    {animes
                      .filter(anime => anime && anime.slug)
                      .map((anime, index) => (
                        <div key={anime.slug} className="anime-card-wrapper">
                          <AnimeCard anime={anime} index={index} />
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                <div
                  className="text-center py-16 text-muted-foreground"
                  data-testid="empty-state"
                >
                  <p className="text-lg">Tidak ada anime terbaru untuk ditampilkan</p>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}
