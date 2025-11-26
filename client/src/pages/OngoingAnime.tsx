import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
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

async function fetchOngoingAnime(page: number): Promise<OngoingResponse> {
  const response = await fetch(`/api/anime/ongoing-anime?page=${page}`);
  if (!response.ok) {
    throw new Error("Failed to fetch ongoing anime");
  }
  const data = await response.json();
  return {
    ...data,
    ongoingAnimeData: (data.ongoingAnimeData || [])
      .filter((anime: AnimeItem) => anime && anime.slug && anime.poster)
      .map((anime: AnimeItem) => ({
        ...anime,
        status: "Ongoing",
      })),
  };
}

export default function OngoingAnime() {
  const observerTarget = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["anime", "ongoing"],
    queryFn: ({ pageParam = 1 }) => fetchOngoingAnime(pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.paginationData.has_next_page ? lastPage.paginationData.next_page : undefined,
    initialPageParam: 1,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage &&
          !isLoading
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
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isLoading]);

const allAnimes = data?.pages.flatMap((page) => page.ongoingAnimeData ?? []).filter(Boolean) ?? [];
  const topAnimes = allAnimes.slice(0, 3);

  return (
    <div className="min-h-screen">
      <AnimeHeroSlider slides={topAnimes} isLoading={isLoading} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <section>
          <SectionTitle>Sedang Tayang</SectionTitle>

          {isLoading && (
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

          {error && (
            <div
              className="text-center py-16 bg-card border border-destructive/50 rounded-lg"
              data-testid="error-message"
            >
              <p className="text-destructive text-lg font-medium mb-2">
                Terjadi Kesalahan
              </p>
              <p className="text-muted-foreground">
                Gagal memuat anime yang sedang tayang. Silakan coba lagi nanti.
              </p>
            </div>
          )}

          {allAnimes.length > 0 && (
            <div className="w-full">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                {allAnimes.filter(anime => anime && anime.slug).map((anime, index) => (
                  <div key={anime.slug} className="anime-card-wrapper">
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
        </section>
      </main>
    </div>
  );
}
