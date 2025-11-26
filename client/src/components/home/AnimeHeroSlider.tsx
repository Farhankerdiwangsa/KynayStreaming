import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Play, Plus, Star } from 'lucide-react';
import type { AnimeItem } from '@shared/schema';
import { Link } from 'wouter';

interface AnimeHeroSliderProps {
  slides: AnimeItem[];
  isLoading?: boolean;
}

const AnimeHeroSlider: React.FC<AnimeHeroSliderProps> = ({ slides, isLoading = false }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const validSlides = React.useMemo(() => 
    slides && slides.length > 0 
      ? slides.slice(0, 3).filter(slide => slide?.poster)
      : [],
    [slides]
  );

  const slideCount = validSlides.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => {
      if (slideCount > 0) {
        setIsAnimating(true);
        return prev === slideCount - 1 ? 0 : prev + 1;
      }
      return prev;
    });
  }, [slideCount]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => {
      if (slideCount > 0) {
        setIsAnimating(true);
        return prev === 0 ? slideCount - 1 : prev - 1;
      }
      return prev;
    });
  }, [slideCount]);

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  useEffect(() => {
    if (slideCount === 0) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, [nextSlide, slideCount]);

  if (isLoading || slideCount === 0) {
    return null;
  }

  const currentAnime = validSlides[currentSlide];
  const rating = parseFloat(currentAnime?.rating || currentAnime?.score || '0').toFixed(1);

  return (
    <div className="relative w-full h-[400px] md:h-[600px] lg:h-[700px] overflow-hidden bg-zinc-950 font-sans text-white group mb-12">
      
      {validSlides.map((slide, index) => (
        <div
          key={slide.slug}
          className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out ${
            index === currentSlide ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'
          }`}
        >
          <div className="absolute inset-0">
            <img 
              src={slide.poster} 
              alt={slide.title} 
              className="w-full h-full object-cover opacity-80"
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>
        </div>
      ))}

      <div className="relative z-30 container mx-auto h-full px-4 md:px-6 lg:px-12 flex flex-col justify-center">
        {validSlides.map((slide, index) => (
          <div
            key={slide.slug}
            className={`transition-all duration-700 delay-100 absolute left-4 md:left-6 lg:left-12 max-w-xl md:max-w-2xl ${
              index === currentSlide 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10 pointer-events-none'
            }`}
          >
            <div className="flex items-center gap-2 md:gap-4 mb-3 md:mb-4 text-xs md:text-sm font-semibold tracking-widest text-yellow-400 flex-wrap">
              <span className="bg-yellow-500 text-black px-2 py-0.5 rounded-sm text-xs">HD</span>
              <div className="flex items-center gap-1">
                <Star className="w-3 md:w-4 h-3 md:h-4 fill-yellow-400" />
                <span>{rating}</span>
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-7xl font-black italic tracking-tighter mb-2 md:mb-4 leading-none text-white drop-shadow-2xl line-clamp-2">
              {slide.title}
            </h1>

            <p className="text-xs md:text-sm lg:text-base text-zinc-300 leading-relaxed mb-4 md:mb-6 max-w-md line-clamp-2 md:line-clamp-3 border-l-4 border-yellow-500 pl-3">
              {slide.type && `${slide.type} • `}{slide.status}
            </p>

            <div className="flex flex-col sm:flex-row gap-2 md:gap-4">
              <Link href={`/anime/${slide.slug}`}>
                <button className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 md:py-3 px-6 md:px-8 skew-x-[-10deg] transition-transform hover:scale-105 active:scale-95 group/btn text-sm md:text-base">
                  <span className="skew-x-[10deg] flex items-center gap-2">
                    <Play className="w-4 md:w-5 h-4 md:h-5 fill-black" />
                    TONTON
                  </span>
                </button>
              </Link>
              
              <button className="flex items-center justify-center gap-2 bg-transparent border border-zinc-600 hover:border-white text-white font-bold py-2 md:py-3 px-6 md:px-8 skew-x-[-10deg] transition-all hover:bg-white/10 group/btn text-sm md:text-base">
                <span className="skew-x-[10deg] flex items-center gap-2">
                  <Plus className="w-4 md:w-5 h-4 md:h-5" />
                  SIMPAN
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={() => prevSlide()}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-40 p-2 md:p-4 group/nav hover:bg-black/50 transition-colors hidden md:block"
        data-testid="button-hero-prev"
      >
        <ChevronLeft className="w-6 md:w-10 h-6 md:h-10 text-zinc-600 group-hover/nav:text-yellow-500 transition-colors" />
      </button>

      <button 
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-40 p-2 md:p-4 group/nav hover:bg-black/50 transition-colors hidden md:block"
        data-testid="button-hero-next"
      >
        <ChevronRight className="w-6 md:w-10 h-6 md:h-10 text-zinc-600 group-hover/nav:text-yellow-500 transition-colors" />
      </button>

      <div className="absolute bottom-6 md:bottom-8 right-6 md:right-12 z-40 flex items-center gap-2 hidden md:flex">
        <span className="text-yellow-500 font-mono font-bold text-lg">
          0{currentSlide + 1}
        </span>
        <div className="w-12 h-[2px] bg-zinc-700 relative overflow-hidden">
          <div 
            key={currentSlide} 
            className="absolute inset-0 bg-yellow-500 animate-loading-bar" 
          />
        </div>
        <span className="text-zinc-600 font-mono font-bold text-sm">
          0{validSlides.length}
        </span>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 flex gap-2 md:hidden">
        {validSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentSlide ? 'bg-yellow-500 w-6' : 'bg-zinc-600'
            }`}
            data-testid={`button-hero-dot-${idx}`}
          />
        ))}
      </div>

      <div className="absolute top-0 left-0 w-8 md:w-16 h-8 md:h-16 border-t-2 md:border-t-4 border-l-2 md:border-l-4 border-yellow-500 z-20"></div>
      <div className="absolute bottom-0 right-0 w-8 md:w-16 h-8 md:h-16 border-b-2 md:border-b-4 border-r-2 md:border-r-4 border-yellow-500 z-20"></div>

      <style>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0); }
        }
        .animate-loading-bar {
          animation: loading-bar 6s linear;
        }
      `}</style>
    </div>
  );
};

export default AnimeHeroSlider;
