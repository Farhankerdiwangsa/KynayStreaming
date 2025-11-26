import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimeCard } from "@/components/home/AnimeCard";
import { SectionTitle } from "@/components/home/SectionTitle";
import AnimeHeroSlider from "@/components/home/AnimeHeroSlider";
import type { AnimeItem } from "@shared/schema";

interface CompleteResponse {
  completeAnimeData: AnimeItem[];
}

async function fetchPopularAnime(): Promise<AnimeItem[]> {
  const response = await fetch("/api/anime/complete-anime/1");
  if (!response.ok) {
    throw new Error("Failed to fetch popular anime");
  }
  const data: CompleteResponse = await response.json();
  
  return (data.completeAnimeData || [])
    .filter(anime => anime && anime.slug && anime.poster && anime.rating)
    .map(anime => ({
      ...anime,
      status: "Completed",
      score: anime.rating || anime.score,
    }))
    .sort((a, b) => {
      const ratingA = parseFloat(a.rating || "0");
      const ratingB = parseFloat(b.rating || "0");
      return ratingB - ratingA;
    })
    .slice(0, 16);
}

export default function Populer() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["anime", "populer"],
    queryFn: fetchPopularAnime,
    staleTime: 1000 * 60 * 60,
  });

  const animes = data || [];
  const topAnimes = animes.slice(0, 3);

  return (
    <div className="min-h-screen">
      <AnimeHeroSlider slides={topAnimes} isLoading={isLoading} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <section>
          <SectionTitle>Anime Populer</SectionTitle>

          {error && (
            <div
              className="text-center py-16 bg-card border border-destructive/50 rounded-lg"
              data-testid="error-message"
            >
              <p className="text-destructive text-lg font-medium mb-2">
                Terjadi Kesalahan
              </p>
              <p className="text-muted-foreground">
                Gagal memuat anime populer. Silakan coba lagi nanti.
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
                  <p className="text-lg">Tidak ada anime populer untuk ditampilkan</p>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}
