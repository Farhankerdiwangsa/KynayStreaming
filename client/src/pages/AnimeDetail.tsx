import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Play, ChevronRight, Bookmark, Share2, Sparkles, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { SiWhatsapp, SiFacebook, SiTelegram } from "react-icons/si";
import { Share as TwitterIcon } from "lucide-react";

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
      staggerChildren: 0.03,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 70, damping: 16, mass: 0.8 },
  },
};

const episodeGridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02,
      delayChildren: 0.15,
    },
  },
};

const episodeItemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 70,
      damping: 16,
      mass: 0.8,
    },
  },
};

export default function AnimeDetail() {
  const { slug } = useParams();
  const { toast } = useToast();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const shareMenuRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, error } = useQuery<AnimeDetailResponse>({
    queryKey: ["/api/anime/anime", slug],
    queryFn: async () => {
      const res = await fetch(`/api/anime/anime/${slug}`);
      if (!res.ok) throw new Error("Failed to fetch anime detail");
      return res.json();
    },
  });

  useEffect(() => {
    if (slug) {
      const bookmarks = JSON.parse(localStorage.getItem("anime_bookmarks") || "[]");
      setIsBookmarked(bookmarks.includes(slug));
    }
  }, [slug]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShareMenu(false);
      }
    };

    if (showShareMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showShareMenu]);

  const handleBookmark = () => {
    if (!slug) return;

    const bookmarks = JSON.parse(localStorage.getItem("anime_bookmarks") || "[]");
    if (isBookmarked) {
      const updated = bookmarks.filter((item: string) => item !== slug);
      localStorage.setItem("anime_bookmarks", JSON.stringify(updated));
      setIsBookmarked(false);
      toast({
        title: "Dihapus dari Simpanan",
        description: "Anime telah dihapus dari daftar simpanan Anda",
      });
    } else {
      bookmarks.push(slug);
      localStorage.setItem("anime_bookmarks", JSON.stringify(bookmarks));
      setIsBookmarked(true);
      toast({
        title: "Ditambahkan ke Simpanan",
        description: "Anime telah disimpan untuk ditonton nanti",
      });
    }
  };

  const shareText = `Tonton ${data?.title} di KynayStreams`;
  const url = typeof window !== "undefined" ? window.location.href : "";

  const shareOptions = [
    {
      name: "WhatsApp",
      icon: SiWhatsapp,
      color: "#25D366",
      onClick: () => {
        window.open(
          `https://wa.me/?text=${encodeURIComponent(shareText + "\n" + url)}`,
          "_blank"
        );
      },
    },
    {
      name: "Facebook",
      icon: SiFacebook,
      color: "#1877F2",
      onClick: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          "_blank"
        );
      },
    },
    {
      name: "Telegram",
      icon: SiTelegram,
      color: "#0088cc",
      onClick: () => {
        window.open(
          `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`,
          "_blank"
        );
      },
    },
    {
      name: "Twitter",
      icon: TwitterIcon,
      color: "#1DA1F2",
      onClick: () => {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`,
          "_blank"
        );
      },
    },
    {
      name: "Salin Link",
      icon: Share2,
      color: "#fbbf24",
      onClick: async () => {
        try {
          await navigator.clipboard.writeText(url);
          toast({
            title: "Tautan Disalin",
            description: "URL halaman telah disalin ke clipboard",
          });
          setShowShareMenu(false);
        } catch (err) {
          console.error("Copy failed:", err);
          toast({
            title: "Gagal",
            description: "Tidak dapat menyalin tautan",
            variant: "destructive",
          });
        }
      },
    },
  ];

  const handleShareClick = () => {
    setShowShareMenu(!showShareMenu);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Skeleton className="w-full aspect-[3/5] rounded-xl" />
            <div className="md:col-span-2 space-y-4">
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-6 w-1/2 rounded-lg" />
              <div className="flex gap-3">
                <Skeleton className="h-10 w-32 rounded-lg" />
                <Skeleton className="h-10 w-32 rounded-lg" />
              </div>
              <Skeleton className="h-40 w-full rounded-lg mt-6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <motion.div
        className="min-h-screen bg-neutral-900 flex items-center justify-center"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.4 }}
      >
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <p className="text-white text-lg font-bold mb-4">Anime Tidak Ditemukan</p>
          <Link href="/" className="text-amber-500 hover:text-amber-400 font-semibold" data-testid="button-back-home">
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
      <motion.div
        className="fixed inset-0 opacity-20 blur-3xl scale-125 -z-10"
        style={{
          backgroundImage: `url(${data.poster})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />

      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-neutral-900 via-neutral-900/95 to-neutral-900" />
      <div className="fixed inset-0 -z-10 bg-gradient-to-r from-neutral-900 via-neutral-900/80 to-neutral-900" />

      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.3 }}
      >
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16" variants={itemVariants}>
          <motion.div
            className="flex justify-center md:justify-start"
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 200, damping: 18, mass: 0.5 }}
          >
            <motion.div
              className="relative"
              layoutId="anime-poster"
            >
              <div className="rounded-lg overflow-hidden shadow-2xl border-2 border-amber-500/40 hover:border-amber-500/80 transition-colors">
                <motion.img
                  src={data.poster}
                  alt={data.title}
                  className="w-64 aspect-[3/5] object-cover"
                  data-testid="image-anime-poster"
                  loading="eager"
                  whileHover={{ scale: 1.06 }}
                  transition={{ type: "spring", stiffness: 200, damping: 18, mass: 0.5 }}
                />
              </div>
            </motion.div>
          </motion.div>

          <div className="md:col-span-2 space-y-7">
            <motion.div variants={itemVariants}>
              <motion.h1
                className="text-5xl md:text-6xl font-black text-amber-500 mb-3 leading-tight"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08, type: "spring", stiffness: 70, damping: 16, mass: 0.8 }}
              >
                {data.title}
              </motion.h1>
              {data.japanese_title && (
                <motion.p
                  className="text-neutral-400 text-base md:text-lg font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.12, type: "spring", stiffness: 70, damping: 16, mass: 0.8 }}
                >
                  {data.japanese_title}
                </motion.p>
              )}
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-4 pb-4 border-b border-neutral-700"
            >
              <motion.span
                className={`px-4 py-2 rounded-lg font-bold text-sm ${
                  data.status?.toLowerCase() === "ongoing"
                    ? "bg-green-600/20 text-green-400 border border-green-500/40"
                    : "bg-neutral-700/50 text-neutral-300 border border-neutral-600/40"
                }`}
                whileHover={{ scale: 1.05 }}
              >
                {data.status}
              </motion.span>

              <span className="text-neutral-500">•</span>

              <motion.span className="text-neutral-300 font-semibold" whileHover={{ color: "#fbbf24" }}>
                {data.duration}
              </motion.span>

              <span className="text-neutral-500">•</span>

              <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.05 }}>
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-amber-500 font-bold">{data.rating}</span>
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex gap-3 flex-wrap">
              <Link
                href={data.episode_lists?.[0]?.slug ? `/watch/${data.episode_lists[0].slug}?slug=${data.episode_lists[0].slug}&title=${encodeURIComponent(data.episode_lists[0].episode)}&image=${encodeURIComponent(data.poster)}` : "#"}
                className="inline-flex"
                data-testid="button-watch-now"
              >
                <motion.button
                  className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-lg shadow-lg hover:shadow-amber-500/50 flex items-center gap-2 group"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Play className="w-5 h-5 fill-black group-hover:translate-x-1 transition-transform" />
                  Tonton Sekarang
                </motion.button>
              </Link>
              <motion.button
                onClick={handleBookmark}
                className={`px-6 py-3.5 border-2 font-bold rounded-lg transition-all flex items-center gap-2 ${
                  isBookmarked
                    ? "border-amber-500 bg-amber-500/10 text-amber-500"
                    : "border-amber-500 text-amber-500 hover:bg-amber-500/10"
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                data-testid="button-bookmark"
              >
                {isBookmarked ? <Check className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                {isBookmarked ? "Tersimpan" : "Simpan"}
              </motion.button>
              <div className="relative" ref={shareMenuRef}>
                <motion.button
                  onClick={handleShareClick}
                  className="px-6 py-3.5 border-2 border-neutral-600 text-neutral-300 font-bold rounded-lg hover:border-amber-500 hover:text-amber-500 transition-all flex items-center gap-2"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  data-testid="button-share"
                >
                  <Share2 className="w-5 h-5" />
                </motion.button>

                <AnimatePresence>
                  {showShareMenu && (
                    <motion.div
                      className="absolute top-full mt-2 right-0 bg-neutral-800 border-2 border-amber-500/40 rounded-lg shadow-2xl z-50 w-52 overflow-hidden"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 150, damping: 20, mass: 0.5 }}
                    >
                      {shareOptions.map((option, idx) => (
                        <motion.button
                          key={idx}
                          onClick={() => {
                            option.onClick();
                            setShowShareMenu(false);
                          }}
                          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-neutral-700 transition-colors border-b border-neutral-700 last:border-b-0 group"
                          whileHover={{ backgroundColor: "rgba(107, 114, 128, 0.5)" }}
                          data-testid={`button-share-${option.name.toLowerCase()}`}
                        >
                          <option.icon className="w-5 h-5" style={{ color: option.color }} />
                          <span className="text-neutral-100 font-semibold text-sm flex-1 text-left group-hover:text-amber-400 transition-colors">
                            {option.name}
                          </span>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 gap-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {[
                { label: "Episode", value: data.episode_count },
                { label: "Tipe", value: data.type },
                { label: "Studio", value: data.studio },
                { label: "Rilis", value: data.release_date },
                { label: "Produser", value: data.produser },
                { label: "Status", value: data.status },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ y: -4, backgroundColor: "rgba(107, 114, 128, 0.3)" }}
                  className="bg-neutral-800/40 border border-neutral-700/50 rounded-lg p-3.5 hover:border-amber-500/30 transition-all duration-300 group"
                >
                  <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-1.5">
                    {item.label}
                  </p>
                  <p className="text-white font-bold text-sm line-clamp-2 group-hover:text-amber-400 transition-colors">
                    {item.value}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {data.genres && data.genres.length > 0 && (
          <motion.section variants={itemVariants} className="mb-16 pb-10 border-b border-neutral-700">
            <motion.h2
              className="text-2xl md:text-3xl font-black text-amber-500 mb-5 uppercase tracking-widest"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 70, damping: 16, mass: 0.8 }}
            >
              Genre
            </motion.h2>
            <motion.div
              className="flex flex-wrap gap-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {data.genres.map((genre) => (
                <motion.div key={genre.slug} variants={itemVariants}>
                  <Link
                    href={`/genre?genre=${genre.slug}`}
                    className="inline-block"
                    data-testid={`link-genre-${genre.slug}`}
                  >
                    <motion.div
                      className="px-5 py-2.5 bg-neutral-800/60 border border-amber-500/30 text-amber-500 font-bold text-sm rounded-lg hover:border-amber-500 transition-colors duration-300 cursor-pointer relative overflow-hidden group"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 200, damping: 18, mass: 0.5 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-amber-500 -z-10 rounded-lg"
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 18, mass: 0.5 }}
                        style={{ transformOrigin: "left" }}
                      />
                      <span className="relative group-hover:text-black transition-colors">{genre.name}</span>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        )}


        {data.synopsis && data.synopsis.trim() && (
          <motion.section variants={itemVariants} className="mb-16 pb-10 border-b border-neutral-700">
            <motion.h2
              className="text-2xl md:text-3xl font-black text-amber-500 mb-5 uppercase tracking-widest"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              Sinopsis
            </motion.h2>
            <motion.p
              className="text-neutral-300 text-base leading-relaxed bg-gradient-to-r from-neutral-800/40 to-neutral-800/20 border border-neutral-700/50 rounded-lg p-6 md:p-8 hover:border-amber-500/20 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              whileHover={{ backgroundColor: "rgba(107, 114, 128, 0.08)" }}
            >
              {data.synopsis}
            </motion.p>
          </motion.section>
        )}


        {data.episode_lists && data.episode_lists.length > 0 && (
          <motion.section variants={itemVariants}>
            <motion.h2
              className="text-2xl md:text-3xl font-black text-amber-500 mb-7 uppercase tracking-widest flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              Daftar Episode
              <motion.span
                className="bg-amber-500 text-black px-3 py-1 rounded-lg text-lg font-bold"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, type: "spring", stiffness: 300 }}
              >
                {data.episode_lists.length}
              </motion.span>
            </motion.h2>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5"
              variants={episodeGridVariants}
              initial="hidden"
              animate="visible"
            >
              {data.episode_lists.map((ep) => (
                <motion.div key={`ep-${ep.slug}`} variants={episodeItemVariants}>
                  <Link
                    href={`/watch/${ep.slug}?slug=${ep.slug}&title=${encodeURIComponent(ep.episode)}&image=${encodeURIComponent(data.poster)}`}
                    className="group block"
                    data-testid={`link-episode-${ep.episode_number}`}
                  >
                    <motion.div
                      className="flex items-center gap-4 bg-gradient-to-br from-neutral-800/60 to-neutral-800/30 border border-neutral-700/50 rounded-lg p-4 hover:border-amber-500/50 transition-all duration-300 h-full"
                      whileHover={{
                        y: -4,
                        backgroundColor: "rgba(107, 114, 128, 0.2)",
                        boxShadow: "0 10px 30px rgba(251, 191, 36, 0.1)",
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.div
                        className="flex-shrink-0 w-16 h-14 bg-gradient-to-br from-amber-500/30 to-amber-600/20 border-2 border-amber-500/40 group-hover:border-amber-500/80 rounded-lg flex flex-col items-center justify-center transition-colors duration-300"
                        whileHover={{ scale: 1.1 }}
                      >
                        <p className="text-xs text-neutral-400 font-bold">EP</p>
                        <p className="text-xl font-black text-amber-500">{ep.episode_number}</p>
                      </motion.div>

                      <div className="flex-1 min-w-0">
                        <p className="text-white font-bold text-sm line-clamp-2 group-hover:text-amber-400 transition-colors duration-300">
                          {ep.episode}
                        </p>
                        <p className="text-neutral-500 text-xs mt-1.5">{data.duration}</p>
                      </div>

                      <motion.div
                        className="flex-shrink-0"
                        initial={{ x: 0, opacity: 0.5 }}
                        whileHover={{ x: 4, opacity: 1 }}
                      >
                        <ChevronRight className="w-5 h-5 text-amber-500" />
                      </motion.div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>
        )}


        {(!data.episode_lists || data.episode_lists.length === 0) && (
          <motion.div
            variants={itemVariants}
            className="text-center py-16 bg-neutral-800/40 border border-neutral-700/50 rounded-lg"
          >
            <motion.p
              className="text-neutral-400 text-base font-medium"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Belum ada episode tersedia
            </motion.p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
