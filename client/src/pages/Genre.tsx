import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimeCard } from "@/components/home/AnimeCard";
import { SectionTitle } from "@/components/home/SectionTitle";
import type { Genre, AnimeItem } from "@shared/schema";

interface GenreFilterResponse {
  anime: AnimeItem[];
  total_page?: number;
  current_page?: number;
  has_next_page?: boolean;
}

async function fetchGenres(): Promise<Genre[]> {
  const response = await fetch("/api/anime/genre");
  if (!response.ok) {
    throw new Error("Failed to fetch genres");
  }
  return response.json();
}

async function fetchAnimeByGenre(slug: string, page: number = 1): Promise<GenreFilterResponse> {
  const response = await fetch(`/api/anime/genre/${slug}?page=${page}`);
  if (!response.ok) {
    throw new Error("Failed to fetch anime by genre");
  }
  return response.json();
}

export default function Genre() {
  const observerTarget = useRef<HTMLDivElement>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const { data: genres = [], isLoading: genresLoading, error: genresError } = useQuery<Genre[]>({
    queryKey: ["/api/anime/genre"],
    queryFn: fetchGenres,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: animeLoading,
    error: animeError,
    status,
  } = useInfiniteQuery({
    queryKey: ["/api/anime/genre", selectedGenre],
    queryFn: ({ pageParam = 1 }) => fetchAnimeByGenre(selectedGenre!, pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.has_next_page || (lastPage.current_page && lastPage.total_page && lastPage.current_page < lastPage.total_page)) {
        return (lastPage.current_page || 1) + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!selectedGenre,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage &&
          !animeLoading &&
          selectedGenre
        ) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, animeLoading, selectedGenre]);

  const allAnimes = data?.pages.flatMap((page) => page.anime ?? []).filter(Boolean) ?? [];

  const handleGenreSelect = (genreSlug: string) => {
    setSelectedGenre(genreSlug);
  };

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="mb-12">
          <SectionTitle>Genre Anime</SectionTitle>

          {genresError && (
            <div className="text-center py-12 bg-card border border-destructive/50 rounded-lg">
              <p className="text-destructive text-lg font-medium mb-2">
                Gagal Memuat Genre
              </p>
              <p className="text-muted-foreground">
                Silakan coba lagi nanti.
              </p>
            </div>
          )}

          {genresLoading && (
            <div className="flex flex-wrap gap-2">
              {[...Array(10)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-10 w-20 bg-muted rounded-md"
                />
              ))}
            </div>
          )}

          {genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <motion.button
                  key={genre.slug}
                  onClick={() => handleGenreSelect(genre.slug)}
                  className={`px-4 py-2 rounded-md font-semibold transition-all ${
                    selectedGenre === genre.slug
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 border border-transparent hover:border-primary/30"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  data-testid={`button-genre-${genre.slug}`}
                >
                  {genre.name}
                </motion.button>
              ))}
            </div>
          )}
        </section>

        {selectedGenre && (
          <section>
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Anime - {genres.find((g) => g.slug === selectedGenre)?.name}
              </h2>
            </div>

            {animeError && status === "error" && (
              <div className="text-center py-12 bg-card border border-destructive/50 rounded-lg">
                <p className="text-destructive text-lg font-medium mb-2">
                  Gagal Memuat Anime
                </p>
                <p className="text-muted-foreground">
                  Silakan coba genre lain atau coba lagi nanti.
                </p>
              </div>
            )}

            {animeLoading && status === "pending" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="space-y-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                  >
                    <Skeleton className="aspect-[2/3] w-full bg-muted rounded-lg" />
                    <Skeleton className="h-4 w-3/4 bg-muted rounded-md" />
                    <Skeleton className="h-3 w-1/2 bg-muted rounded-md" />
                  </motion.div>
                ))}
              </div>
            )}

            {allAnimes.length > 0 && (
              <div className="w-full">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                  {allAnimes
                    .filter((anime) => anime && anime.slug && anime.poster)
                    .map((anime, index) => (
                      <div key={`${anime.slug}-${index}`} className="anime-card-wrapper">
                        <AnimeCard anime={anime} index={index} />
                      </div>
                    ))}

                  {isFetchingNextPage && (
                    <>
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={`skeleton-${i}`}
                          className="space-y-3"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: i * 0.05 }}
                        >
                          <Skeleton className="aspect-[2/3] w-full bg-muted rounded-lg" />
                          <Skeleton className="h-4 w-3/4 bg-muted rounded-md" />
                          <Skeleton className="h-3 w-1/2 bg-muted rounded-md" />
                        </motion.div>
                      ))}
                    </>
                  )}
                </div>

                <div
                  ref={observerTarget}
                  className="h-1"
                  data-testid="infinite-scroll-trigger"
                />

                {!hasNextPage && allAnimes.length > 0 && (
                  <p className="text-muted-foreground text-center mt-8">
                    Tidak ada lagi anime untuk ditampilkan
                  </p>
                )}
              </div>
            )}

            {allAnimes.length === 0 && !animeLoading && status === "success" && (
              <div className="text-center py-16 bg-card border border-border rounded-lg">
                <p className="text-muted-foreground text-lg">
                  Tidak ada anime untuk genre ini.
                </p>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
