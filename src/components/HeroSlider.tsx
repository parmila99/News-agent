import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Clock, MapPin, Sparkles, ArrowRight, User } from "lucide-react";
import { useNews } from "../context/NewsContext";

export default function HeroSlider() {
  const { t, i18n } = useTranslation();
  const { featuredArticles, publishedArticles } = useNews();
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = featuredArticles.length > 0 ? featuredArticles : publishedArticles.slice(0, 3);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const currentSlide = slides[currentIndex] || slides[0];

  const getLocalizedTitle = (art: typeof currentSlide) => {
    const lang = i18n.language;
    if (art.titleTranslations && art.titleTranslations[lang]) {
      return art.titleTranslations[lang];
    }
    return art.title;
  };

  return (
    <div className="relative w-full h-[460px] md:h-[540px] bg-neutral-950 overflow-hidden group border-b border-white/10">
      {/* Background Hero Image with smooth fade */}
      <div className="absolute inset-0">
        <img
          src={currentSlide.imageUrl}
          alt={currentSlide.title}
          className="w-full h-full object-cover transform transition-transform duration-1000 scale-105 group-hover:scale-100"
        />
        {/* Layered Cinematic Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414]/90 via-transparent to-transparent hidden md:block" />
      </div>

      {/* Hero Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 max-w-5xl">
        <div className="space-y-3 md:space-y-4">
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs">
            <span className="bg-[#AA0000] text-white font-black uppercase tracking-widest px-3 py-1 rounded-md shadow-md text-[10px] md:text-xs">
              {currentSlide.category}
            </span>
            {currentSlide.isBreaking && (
              <span className="bg-yellow-400 text-black font-black uppercase tracking-widest px-2.5 py-1 rounded-md text-[10px] animate-pulse">
                BREAKING
              </span>
            )}
            {currentSlide.location && (
              <span className="text-white/80 flex items-center gap-1 font-mono text-[11px] bg-black/40 px-2.5 py-1 rounded backdrop-blur">
                <MapPin size={12} className="text-[#AA0000]" /> {currentSlide.location}
              </span>
            )}
            <span className="text-white/70 flex items-center gap-1 font-mono text-[11px]">
              <Clock size={12} /> {new Date(currentSlide.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white leading-tight tracking-tight uppercase line-clamp-2 md:line-clamp-3 drop-shadow-lg">
            {getLocalizedTitle(currentSlide)}
          </h2>

          {/* Summary */}
          {currentSlide.summary && (
            <p className="text-sm md:text-base text-neutral-300 line-clamp-2 max-w-3xl drop-shadow">
              {currentSlide.summary}
            </p>
          )}

          {/* Author and Action */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-2 text-white/90 text-xs font-bold">
              <div className="w-7 h-7 rounded-full bg-[#AA0000] flex items-center justify-center text-white text-xs">
                <User size={14} />
              </div>
              <span>{currentSlide.authorName}</span>
            </div>

            <Link
              to={`/article/${currentSlide.id}`}
              className="bg-[#AA0000] hover:bg-[#880000] text-white px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all transform hover:scale-105 shadow-xl shadow-[#AA0000]/30"
            >
              <span>{t('read_more')}</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-[#AA0000] text-white rounded-full transition opacity-0 group-hover:opacity-100 backdrop-blur"
      >
        <ChevronLeft size={22} />
      </button>

      <button
        onClick={() => setCurrentIndex((prev) => (prev + 1) % slides.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-[#AA0000] text-white rounded-full transition opacity-0 group-hover:opacity-100 backdrop-blur"
      >
        <ChevronRight size={22} />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 right-6 md:right-12 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              currentIndex === i ? "w-8 bg-[#AA0000]" : "w-2 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
