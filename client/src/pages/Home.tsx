import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Hero } from "@/components/home/Hero";
import { SectionTitle } from "@/components/home/SectionTitle";
import { AnimeUpdateList } from "@/components/home/AnimeUpdateList";
import { Skeleton } from "@/components/ui/skeleton";
import type { AnimeHome } from "@shared/schema";

async function fetchAnimeHome(): Promise<AnimeHome> {
  const response = await fetch("/api/anime/home");
  if (!response.ok) {
    throw new Error("Failed to fetch anime home data");
  }
  return response.json();
}

export default function Home() {
  const { data, isLoading, error } = useQuery<AnimeHome>({
    queryKey: ["anime", "home"],
    queryFn: fetchAnimeHome,
  });

  return (
    <div className="min-h-screen">
      <Hero />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <section className="mb-20">
          <SectionTitle>Sedang Tayang</SectionTitle>
          
          {isLoading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {[...Array(8)].map((_, i) => (
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
                Gagal memuat data anime. Silakan coba lagi nanti.
              </p>
            </div>
          )}

          {data && data.ongoing_anime && (
            <AnimeUpdateList animes={data.ongoing_anime} />
          )}
        </section>

        <section>
          <SectionTitle>Sudah Tamat</SectionTitle>
          
          {isLoading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {[...Array(8)].map((_, i) => (
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

          {data && data.complete_anime && (
            <AnimeUpdateList animes={data.complete_anime} />
          )}
        </section>
      </main>
    </div>
  );
}
