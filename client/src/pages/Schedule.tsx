import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimeCard } from "@/components/home/AnimeCard";
import { SectionTitle } from "@/components/home/SectionTitle";
import AnimeHeroSlider from "@/components/home/AnimeHeroSlider";
import type { AnimeItem } from "@shared/schema";

interface ScheduleAnimeData {
  anime_name: string;
  url: string;
  slug: string;
  poster: string;
}

interface ScheduleDay {
  day: string;
  anime_list: ScheduleAnimeData[];
}

const dayOrder = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

async function fetchSchedule(): Promise<ScheduleDay[]> {
  const response = await fetch("/api/anime/schedule");
  if (!response.ok) {
    throw new Error("Failed to fetch schedule");
  }
  const data = await response.json();
  
  const scheduleData = Array.isArray(data) ? data : (data.data || []);
  
  return scheduleData;
}

function transformScheduleAnime(anime: ScheduleAnimeData): AnimeItem {
  return {
    slug: anime.slug,
    title: anime.anime_name,
    poster: anime.poster,
    status: "Ongoing",
  };
}

export default function Schedule() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["anime", "schedule"],
    queryFn: fetchSchedule,
  });

  const [selectedDay, setSelectedDay] = useState(0);

  const sortedSchedule = data
    ? [...data].sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day))
    : [];

  const selectedDayData = sortedSchedule[selectedDay];
  const animeList = selectedDayData?.anime_list || [];

  const topAnimes = sortedSchedule.slice(0, 3).flatMap(day => day.anime_list.slice(0, 1)).map(transformScheduleAnime).slice(0, 3);

  return (
    <div className="min-h-screen">
      <AnimeHeroSlider slides={topAnimes} isLoading={isLoading} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <section>
          <SectionTitle>Jadwal Tayang</SectionTitle>

          <div className="flex flex-wrap gap-2 mb-8">
            {sortedSchedule.map((schedule, index) => (
              <button
                key={schedule.day}
                onClick={() => setSelectedDay(index)}
                className={`px-4 py-2 rounded-md font-semibold transition-all ${
                  selectedDay === index
                    ? "bg-yellow-500 text-black shadow-lg shadow-yellow-500/30"
                    : "bg-muted text-muted-foreground hover:bg-yellow-500/20 border border-transparent hover:border-yellow-500/50"
                }`}
                data-testid={`button-day-${schedule.day}`}
              >
                {schedule.day}
              </button>
            ))}
          </div>

          {error && (
            <div
              className="text-center py-16 bg-card border border-destructive/50 rounded-lg"
              data-testid="error-message"
            >
              <p className="text-destructive text-lg font-medium mb-2">
                Terjadi Kesalahan
              </p>
              <p className="text-muted-foreground">
                Gagal memuat jadwal tayang. Silakan coba lagi nanti.
              </p>
            </div>
          )}

          {isLoading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {[...Array(12)].map((_, i) => (
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
              {animeList.length > 0 ? (
                <div className="w-full">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                    {animeList
                      .filter(anime => anime && anime.slug && anime.poster)
                      .map((anime) => transformScheduleAnime(anime))
                      .map((anime, index) => (
                        <div key={`${anime.slug}-${index}`} className="anime-card-wrapper">
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
                  <p className="text-lg">
                    Tidak ada anime untuk hari {selectedDayData?.day || "yang dipilih"}
                  </p>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}
