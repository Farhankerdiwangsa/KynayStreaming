import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Search as SearchIcon } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimeCard } from "@/components/home/AnimeCard";
import AnimeHeroSlider from "@/components/home/AnimeHeroSlider";
import type { AnimeItem } from "@shared/schema";

interface SearchResult extends AnimeItem {
  status: string;
}

async function fetchSearchResults(keyword: string): Promise<SearchResult[]> {
  if (!keyword || keyword.trim().length === 0) {
    return [];
  }
  
  const validatedKeyword = keyword.trim().substring(0, 100);
  
  const response = await fetch(`/api/anime/search/${encodeURIComponent(validatedKeyword)}`);
  if (!response.ok) {
    if (response.status === 400) {
      throw new Error("Kata kunci pencarian tidak valid");
    }
    throw new Error("Failed to search anime");
  }
  
  const data = await response.json();
  const results = Array.isArray(data) ? data : (data.data || []);
  
  return results
    .filter((anime: AnimeItem) => anime && anime.slug && anime.poster)
    .map((anime: AnimeItem) => ({
      ...anime,
      status: "Search Result",
    }));
}

export default function Search() {
  const [_location] = useLocation();
  const [searchInput, setSearchInput] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  const params = new URLSearchParams(window.location.search);
  const urlKeyword = params.get("q") || "";

  const activeQuery = urlKeyword || submittedQuery;

  const { data: results = [], isLoading, error } = useQuery<SearchResult[]>({
    queryKey: ["/api/anime/search", activeQuery],
    queryFn: () => fetchSearchResults(activeQuery),
    enabled: activeQuery.length > 0,
    staleTime: 1000 * 60 * 10,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSubmittedQuery(searchInput);
      window.history.pushState({}, "", `/search?q=${encodeURIComponent(searchInput)}`);
    }
  };

  return (
    <div className="min-h-screen">
      {activeQuery && results.length > 0 && (
        <AnimeHeroSlider slides={results.slice(0, 3)} isLoading={isLoading} />
      )}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Cari anime..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-secondary text-foreground placeholder:text-muted-foreground border-2 border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all"
                  data-testid="input-search-main"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
                data-testid="button-search-submit"
              >
                Cari
              </button>
            </form>
          </motion.div>
        </section>

        {activeQuery && (
          <section>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Hasil Pencarian: <span className="text-primary">"{activeQuery}"</span>
              </h2>
            </motion.div>

            {error && (
              <div className="text-center py-12 bg-card border border-destructive/50 rounded-lg">
                <p className="text-destructive text-lg font-medium mb-2">
                  Gagal Melakukan Pencarian
                </p>
                <p className="text-muted-foreground">
                  Silakan coba lagi nanti.
                </p>
              </div>
            )}

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

            {results.length > 0 && (
              <div className="w-full">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                  {results.map((anime, index) => (
                    <motion.div
                      key={`${anime.slug}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="anime-card-wrapper"
                    >
                      <AnimeCard anime={anime} index={index} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {!isLoading && !error && results.length === 0 && (
              <div className="text-center py-16 bg-card border border-border rounded-lg">
                <SearchIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-lg">
                  Tidak ada hasil untuk "{activeQuery}"
                </p>
                <p className="text-muted-foreground text-sm mt-2">
                  Coba dengan kata kunci lain
                </p>
              </div>
            )}
          </section>
        )}

        {!activeQuery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center py-24"
          >
            <SearchIcon className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-lg">
              Masukkan kata kunci untuk mencari anime
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
