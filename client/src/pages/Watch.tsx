import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ArrowLeft, Play, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useLocation, Link } from "wouter";

interface StreamServer {
  name: string;
  id: string;
}

interface StreamQuality {
  quality: string;
  servers: StreamServer[];
}

interface Episode {
  slug: string;
  episode?: string;
}

interface EpisodeData {
  episode: string;
  stream_servers: StreamQuality[];
  has_next_episode?: boolean;
  next_episode?: Episode;
  has_previous_episode?: boolean;
  previous_episode?: Episode;
}

interface ServerResponse {
  status: string;
  url?: string;
  error?: string;
}

function DotLoader() {
  return (
    <div className="flex items-center justify-center gap-1">
      <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
      <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
      <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
    </div>
  );
}

function extractResolution(serverId: string): string {
  const match = serverId.match(/(\d+p)$/i);
  return match ? match[1].toUpperCase() : "Tidak Diketahui";
}

export default function Watch() {
  const { slug } = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const search = new URLSearchParams(window.location.search);
  const title = search.get("title");
  const [selectedQuality, setSelectedQuality] = useState<number | null>(null);
  const [selectedServer, setSelectedServer] = useState<string | null>(null);
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [isLoadingEmbed, setIsLoadingEmbed] = useState(false);
  const [embedError, setEmbedError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/anime/episode", slug],
    queryFn: async () => {
      if (!slug) throw new Error("Slug tidak ditemukan");
      const res = await fetch(`/api/anime/episode/${slug}`);
      if (!res.ok) throw new Error("Gagal memuat episode");
      return res.json() as Promise<EpisodeData>;
    },
    enabled: !!slug,
  });

  useEffect(() => {
    if (data?.stream_servers && data.stream_servers.length > 0 && selectedQuality === null) {
      setSelectedQuality(0);
    }
  }, [data, selectedQuality]);

  const availableServers = useMemo(() => {
    if (!data?.stream_servers || selectedQuality === null) return [];
    return data.stream_servers[selectedQuality]?.servers || [];
  }, [data, selectedQuality]);

  useEffect(() => {
    if (availableServers.length > 0 && !selectedServer) {
      setSelectedServer(availableServers[0].id);
    }
  }, [availableServers, selectedServer]);

  useEffect(() => {
    const fetchEmbedUrl = async () => {
      if (!selectedServer) return;

      setIsLoadingEmbed(true);
      setEmbedError(null);
      setEmbedUrl(null);

      const timeoutId = setTimeout(() => {
        setIsLoadingEmbed(false);
        setEmbedError("Server Error - Timeout 12 detik");
      }, 12000);

      timeoutRef.current = timeoutId;

      try {
        const res = await fetch(`/api/anime/server`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ serverId: selectedServer }),
        });
        clearTimeout(timeoutId);
        timeoutRef.current = null;
        
        if (!res.ok) throw new Error("Gagal memuat server");
        const data: ServerResponse = await res.json();

        if (data.status === "success" && data.url) {
          setEmbedUrl(data.url);
        } else {
          throw new Error("Server tidak tersedia");
        }
      } catch (err) {
        clearTimeout(timeoutId);
        timeoutRef.current = null;
        setEmbedError(err instanceof Error ? err.message : "Error loading server");
        console.error("Error fetching server URL:", err);
      } finally {
        setIsLoadingEmbed(false);
      }
    };

    fetchEmbedUrl();
  }, [selectedServer]);

  const resolutions = useMemo(() => {
    if (!data?.stream_servers) return [];
    return data.stream_servers
      .map((q, idx) => ({
        idx,
        resolution: extractResolution(q.servers[0]?.id || ""),
        serverCount: q.servers.length,
      }))
      .sort((a, b) => {
        const aNum = parseInt(a.resolution);
        const bNum = parseInt(b.resolution);
        return aNum - bNum;
      });
  }, [data]);

  const currentResolution = selectedQuality !== null 
    ? extractResolution(data?.stream_servers[selectedQuality]?.servers[0]?.id || "")
    : "";

  if (!slug) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-white">Slug tidak ditemukan</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-white mb-4">Gagal memuat episode</p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-amber-400 text-black rounded-lg font-semibold hover:bg-amber-300 transition"
            data-testid="button-back-error"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <DotLoader />
          <p className="text-gray-400 text-sm">Memuat episode...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition font-semibold"
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
            Kembali
          </button>
        </div>

        
        <div className="mb-8 border-b border-amber-400/30 pb-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-amber-400 break-words">
            {title || "Episode"}
          </h1>
        </div>

        
        <div className="mb-8">
          <div className="bg-neutral-900 border border-amber-400/20 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
            {isLoadingEmbed ? (
              <div className="flex flex-col items-center gap-3 w-full h-full justify-center">
                <DotLoader />
                <p className="text-gray-400 text-sm">Memuat player...</p>
              </div>
            ) : embedError ? (
              <div className="text-center p-8">
                <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                <p className="text-red-400 font-semibold mb-1">{embedError}</p>
                <p className="text-gray-500 text-sm">Silakan pilih server lain</p>
              </div>
            ) : embedUrl ? (
              <iframe
                src={embedUrl}
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
                allow="fullscreen"
                data-testid="video-player"
                className="w-full h-full"
              />
            ) : (
              <div className="text-center">
                <Play className="w-12 h-12 text-amber-400/50 mx-auto mb-3" />
                <p className="text-gray-400">Pilih kualitas dan server untuk mulai</p>
              </div>
            )}
          </div>
        </div>

        
        <div className="mb-8 flex items-center justify-between gap-3">
          {data?.has_previous_episode && data?.previous_episode ? (
            <Link href={`/watch/${data.previous_episode.slug}?title=${encodeURIComponent(data.previous_episode.episode || "Episode Sebelumnya")}`}>
              <button className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-amber-400 rounded-lg border border-amber-400/30 transition font-semibold text-sm flex-1 sm:flex-none justify-center" data-testid="button-prev-episode">
                <ChevronLeft className="w-4 h-4" />
                Sebelumnya
              </button>
            </Link>
          ) : (
            <button className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-gray-500 rounded-lg border border-gray-700 cursor-not-allowed text-sm font-semibold flex-1 sm:flex-none justify-center" disabled>
              <ChevronLeft className="w-4 h-4" />
              Sebelumnya
            </button>
          )}
          
          <div className="text-gray-400 text-sm font-semibold px-2">Episode</div>
          
          {data?.has_next_episode && data?.next_episode ? (
            <Link href={`/watch/${data.next_episode.slug}?title=${encodeURIComponent(data.next_episode.episode || "Episode Selanjutnya")}`}>
              <button className="flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black rounded-lg border border-amber-400 transition font-semibold text-sm flex-1 sm:flex-none justify-center" data-testid="button-next-episode">
                Selanjutnya
                <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          ) : (
            <button className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-gray-500 rounded-lg border border-gray-700 cursor-not-allowed text-sm font-semibold flex-1 sm:flex-none justify-center" disabled>
              Selanjutnya
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl font-bold text-white">Pilih Kualitas</h2>
              <span className="text-amber-400 text-xs font-semibold bg-amber-400/10 px-2 py-1 rounded">
                {resolutions.length} tersedia
              </span>
            </div>
            {resolutions.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {resolutions.map((item) => (
                  <button
                    key={item.idx}
                    onClick={() => {
                      setSelectedQuality(item.idx);
                      setSelectedServer(null);
                      setEmbedUrl(null);
                    }}
                    className={`p-3 rounded-lg border-2 transition ${
                      selectedQuality === item.idx
                        ? "bg-amber-400 border-amber-400 text-black"
                        : "bg-neutral-900 border-amber-400/30 text-white hover:border-amber-400 hover:bg-neutral-800"
                    }`}
                    data-testid={`button-quality-${item.idx}`}
                  >
                    <div className="font-bold text-base">{item.resolution}</div>
                    <div className={`text-xs mt-1 ${
                      selectedQuality === item.idx ? "text-black/70" : "text-gray-400"
                    }`}>
                      {item.serverCount} server
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-neutral-900 border border-amber-400/20 rounded-lg text-center">
                <p className="text-gray-400 text-sm">Tidak ada kualitas</p>
              </div>
            )}
          </div>

          
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl font-bold text-white">Pilih Server</h2>
              {selectedQuality !== null && (
                <span className="text-amber-400 text-xs font-semibold bg-amber-400/10 px-2 py-1 rounded">
                  {currentResolution}
                </span>
              )}
            </div>
            {selectedQuality !== null && availableServers.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {availableServers.map((server) => (
                  <button
                    key={server.id}
                    onClick={() => setSelectedServer(server.id)}
                    className={`p-3 rounded-lg border-2 transition ${
                      selectedServer === server.id
                        ? "bg-amber-400 border-amber-400 text-black"
                        : "bg-neutral-900 border-amber-400/30 text-white hover:border-amber-400 hover:bg-neutral-800"
                    }`}
                    data-testid={`button-server-${server.id}`}
                  >
                    <div className="font-bold text-sm capitalize">{server.name}</div>
                  </button>
                ))}
              </div>
            ) : selectedQuality === null ? (
              <div className="p-4 bg-neutral-900 border border-amber-400/20 rounded-lg text-center">
                <p className="text-gray-400 text-sm">Pilih kualitas dulu</p>
              </div>
            ) : (
              <div className="p-4 bg-neutral-900 border border-amber-400/20 rounded-lg text-center">
                <p className="text-gray-400 text-sm">Tidak ada server</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
