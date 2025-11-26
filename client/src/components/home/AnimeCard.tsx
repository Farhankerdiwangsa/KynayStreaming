import { useEffect, useRef } from "react";
import { Link } from "wouter";
import { Play, Star } from "lucide-react";
import type { AnimeItem } from "@shared/schema";

interface AnimeCardProps {
  anime: AnimeItem;
  index?: number;
}

export function AnimeCard({ anime, index = 0 }: AnimeCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.target instanceof HTMLElement) {
          entry.target.classList.add("animate-in");
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <Link href={`/anime/${anime.slug}`}>
      <div
        ref={cardRef}
        className="group relative w-full max-w-[320px] bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 transition-all duration-500 hover:border-amber-500 hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:scale-105 hover:-translate-y-2 cursor-pointer flex flex-col opacity-0 translate-y-4 card-scroll-fade"
        data-testid={`card-anime-${anime.slug}`}
      >
        <div className="relative aspect-[3/5] overflow-hidden">
          <img
            src={anime.poster}
            alt={anime.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='300'%3E%3Crect width='200' height='300' fill='%231a1a1a'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='16' fill='%23FFDB58'%3ENo Image%3C/text%3E%3C/svg%3E";
            }}
            data-testid={`img-anime-poster-${anime.slug}`}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-90" />

          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-center justify-center backdrop-blur-sm">
            <div className="w-14 h-14 bg-amber-500 rounded-full flex items-center justify-center transform scale-0 group-hover:scale-125 transition-transform duration-500 delay-100 shadow-lg hover-glow">
              <Play fill="black" className="w-6 h-6 text-black ml-1" />
            </div>
          </div>

          <div className="absolute top-3 left-3 flex flex-col gap-2 items-start">
            {anime.type && (
              <span
                className="bg-neutral-950/80 text-amber-500 text-[11px] font-bold px-2.5 py-1 rounded border border-amber-500/20 transition-all duration-300 group-hover:scale-110 group-hover:bg-amber-500/20 group-hover:border-amber-500/50 transform origin-left"
                data-testid={`badge-anime-type-${anime.slug}`}
              >
                {anime.type}
              </span>
            )}
            {anime.status === "Ongoing" && (
              <span
                className="bg-amber-500 text-black text-[11px] font-bold px-2.5 py-1 rounded animate-pulse transition-all duration-300 group-hover:scale-110 transform origin-left shadow-lg shadow-amber-500/50"
                data-testid={`badge-anime-ongoing-${anime.slug}`}
              >
                ONGOING
              </span>
            )}
          </div>

          {anime.score && (
            <div
              className="absolute top-3 right-3 bg-neutral-950/80 backdrop-blur-sm px-2 py-1 rounded flex items-center gap-1.5 border border-neutral-800 transition-all duration-300 group-hover:scale-110 group-hover:bg-neutral-900 group-hover:border-amber-500/50 transform origin-right"
              data-testid={`badge-anime-rating-${anime.slug}`}
            >
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-125" />
              <span className="text-white text-[11px] font-bold">{anime.score}</span>
            </div>
          )}

          {(anime.episode_count || anime.current_episode) && (
            <div
              className="absolute bottom-3 left-3 text-amber-500 text-xs font-medium bg-neutral-950/80 px-2 py-1 rounded border border-amber-500/20"
              data-testid={`badge-anime-episode-${anime.slug}`}
            >
              <span className="text-white">Eps: </span>
              <span className="text-amber-500">{anime.episode_count || anime.current_episode}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 p-4 flex-1 bg-gradient-to-b from-transparent to-neutral-950/20 transition-all duration-300 group-hover:bg-gradient-to-b group-hover:from-transparent group-hover:to-neutral-900/40">
          <h3
            className="text-white font-bold text-base leading-tight line-clamp-2 group-hover:text-amber-400 transition-all duration-300 group-hover:scale-105 origin-left"
            data-testid={`text-anime-title-${anime.slug}`}
          >
            {anime.title}
          </h3>

          <div className="flex flex-col gap-2 text-xs text-neutral-400">
            {anime.status && anime.status !== "Ongoing" && (
              <div
                data-info-item
                className="flex items-center justify-between transition-all duration-300 group-hover:text-neutral-300 group-hover:translate-x-1"
              >
                <span className="text-neutral-500">Status:</span>
                <span className="text-amber-500 font-medium group-hover:text-amber-400">{anime.status}</span>
              </div>
            )}
            {anime.release_day && (
              <div
                data-info-item
                className="flex items-center justify-between transition-all duration-300 group-hover:text-neutral-300 group-hover:translate-x-1"
              >
                <span className="text-neutral-500">Release Day:</span>
                <span className="text-amber-500 font-medium group-hover:text-amber-400">{anime.release_day}</span>
              </div>
            )}
            {anime.release_date && (
              <div
                data-info-item
                className="flex items-center justify-between transition-all duration-300 group-hover:text-neutral-300 group-hover:translate-x-1"
              >
                <span className="text-neutral-500">Start Date:</span>
                <span className="text-white text-[10px]">{anime.release_date}</span>
              </div>
            )}
            {anime.newest_release_date && (
              <div
                data-info-item
                className="flex items-center justify-between transition-all duration-300 group-hover:text-neutral-300 group-hover:translate-x-1"
              >
                <span className="text-neutral-500">Latest Ep:</span>
                <span className="text-white text-[10px]">{anime.newest_release_date}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
