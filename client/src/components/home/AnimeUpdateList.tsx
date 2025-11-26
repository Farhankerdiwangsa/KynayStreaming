import type { AnimeItem } from "@shared/schema";
import { AnimeCard } from "./AnimeCard";

interface AnimeUpdateListProps {
  animes: AnimeItem[];
  title?: string;
}

export function AnimeUpdateList({ animes, title }: AnimeUpdateListProps) {

  if (animes.length === 0) {
    return (
      <div 
        className="text-center py-16" 
        data-testid="empty-anime-list"
      >
        <p className="text-muted-foreground text-lg">
          Belum ada anime yang tersedia
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6"
        data-testid="grid-anime-list"
      >
        {animes.filter(anime => anime && anime.slug).map((anime, index) => (
          <div key={anime.slug} className="anime-card-wrapper">
            <AnimeCard anime={anime} index={index} />
          </div>
        ))}
      </div>
    </div>
  );
}
