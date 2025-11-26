import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Bookmark } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

interface AnimeDetailResponse {
  title: string;
  slug: string;
  japanese_title: string;
  poster: string;
  rating: string;
  produser: string;
  type: string;
  status: string;
  episode_count: string;
  duration: string;
  release_date: string;
  studio: string;
  genres: Array<{
    name: string;
    slug: string;
  }>;
  synopsis: string;
  batch: string | null;
  episode_lists: Array<{
    episode: string;
    episode_number: number;
    slug: string;
  }>;
}

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 70, damping: 16, mass: 0.8 },
  },
};

export default function Bookmarks() {
  const [bookmarkSlugs, setBookmarkSlugs] = useState<string[]>([]);

  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem("anime_bookmarks") || "[]");
    setBookmarkSlugs(bookmarks);
  }, []);

  const { data: bookmarkData, isLoading } = useQuery<Map<string, AnimeDetailResponse>>({
    queryKey: ["bookmarks", bookmarkSlugs],
    queryFn: async () => {
      if (bookmarkSlugs.length === 0) return new Map();
      
      const dataMap = new Map<string, AnimeDetailResponse>();
      
      await Promise.all(
        bookmarkSlugs.map(async (slug) => {
          const res = await fetch(`/api/anime/anime/${slug}`);
          if (!res.ok) throw new Error("Failed to fetch anime");
          const anime = await res.json();
          dataMap.set(slug, anime);
        })
      );
      
      return dataMap;
    },
    enabled: bookmarkSlugs.length > 0,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl md:text-5xl font-black text-amber-500 mb-8">Simpanan Saya</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, idx) => (
              <Skeleton key={idx} className="w-full aspect-[3/5] rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!bookmarkSlugs.length) {
    return (
      <motion.div
        className="min-h-screen bg-neutral-900 flex items-center justify-center"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.4 }}
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 10 }}
          >
            <Bookmark className="w-16 h-16 text-amber-500 mx-auto mb-4 opacity-50" />
          </motion.div>
          <p className="text-white text-lg font-bold mb-2">Belum Ada Simpanan</p>
          <p className="text-neutral-400 text-sm mb-6">Tambahkan anime ke simpanan untuk menonton nanti</p>
          <Link href="/" className="text-amber-500 hover:text-amber-400 font-semibold" data-testid="link-back-home">
            Kembali ke Beranda
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="relative min-h-screen bg-neutral-900 text-white overflow-hidden"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4 }}
    >
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-neutral-900 via-neutral-900/95 to-neutral-900" />
      <div className="fixed inset-0 -z-10 bg-gradient-to-r from-neutral-900 via-neutral-900/80 to-neutral-900" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-3">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 100, damping: 10 }}
            >
              <Bookmark className="w-8 h-8 text-amber-500" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-black text-amber-500">Simpanan Saya</h1>
          </div>
          <p className="text-neutral-400 text-sm md:text-base">
            {bookmarkSlugs.length} anime telah disimpan
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {bookmarkSlugs.map((slug) => {
            const anime = bookmarkData?.get(slug);
            if (!anime) return null;
            
            return (
            <motion.div key={slug} variants={itemVariants}>
              <Link href={`/anime/${slug}`} className="group block" data-testid={`link-bookmark-${slug}`}>
                <motion.div
                  className="relative overflow-hidden rounded-lg bg-neutral-800 shadow-lg"
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 200, damping: 18, mass: 0.5 }}
                >
                  <div className="relative rounded-lg overflow-hidden border-2 border-amber-500/40 group-hover:border-amber-500/80 transition-colors h-full">
                    <motion.img
                      src={anime.poster}
                      alt={anime.title}
                      className="w-full aspect-[3/5] object-cover"
                      whileHover={{ scale: 1.06 }}
                      transition={{ type: "spring", stiffness: 200, damping: 18, mass: 0.5 }}
                    />

                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-end justify-between p-3"
                      initial={false}
                    >
                      <motion.span
                        className="px-2.5 py-1 bg-amber-500/90 text-black font-bold text-xs rounded"
                        initial={{ opacity: 0, scale: 0 }}
                        whileHover={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        {anime.rating}
                      </motion.span>

                      <div className="w-full">
                        <p className="text-white font-bold text-xs line-clamp-2 group-hover:text-amber-400 transition-colors">
                          {anime.title}
                        </p>
                        <p className="text-neutral-300 text-xs mt-1">{anime.status}</p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
}
