import React from "react";
import { Link } from "react-router-dom";
import { Clock, Bookmark, Heart, User, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NewsArticle } from "../types";
import { useNews } from "../context/NewsContext";

export interface NewsCardProps {
  article: NewsArticle;
  variant?: 'standard' | 'compact' | 'featured';
  key?: React.Key;
}

export default function NewsCard({ article, variant = 'standard' }: NewsCardProps) {
  const { i18n } = useTranslation();
  const { bookmarks, toggleBookmark, likeArticle } = useNews();
  const isBookmarked = bookmarks.includes(article?.id);

  if (!article) return null;

  const getLocalizedTitle = () => {
    const lang = i18n.language;
    if (article.titleTranslations && article.titleTranslations[lang]) {
      return article.titleTranslations[lang];
    }
    return article.title;
  };

  const formattedDate = new Date(article.createdAt || Date.now()).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric'
  });

  if (variant === 'compact') {
    return (
      <div className="flex gap-4 p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition group border border-white/5 hover:border-[#AA0000]/30">
        <Link to={`/article/${article.id}`} className="w-24 h-20 rounded-xl overflow-hidden shrink-0 bg-neutral-800 relative">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
          />
        </Link>
        <div className="flex-grow flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#AA0000]">
              <span>{article.category}</span>
              <span className="text-neutral-500">•</span>
              <span className="text-neutral-400 font-mono">{formattedDate}</span>
            </div>
            <Link to={`/article/${article.id}`}>
              <h4 className="text-xs md:text-sm font-bold text-white group-hover:text-[#AA0000] transition line-clamp-2 mt-1">
                {getLocalizedTitle()}
              </h4>
            </Link>
          </div>
          <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-1">
            <span className="truncate max-w-[120px]">{article.authorName}</span>
            <button
              onClick={() => toggleBookmark(article.id)}
              className="hover:text-[#AA0000] transition"
            >
              <Bookmark size={13} className={isBookmarked ? "fill-[#AA0000] text-[#AA0000]" : ""} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-white/10 hover:border-[#AA0000]/40 transition duration-300 flex flex-col justify-between group shadow-lg">
      <div>
        {/* Card Thumbnail */}
        <div className="relative aspect-video overflow-hidden bg-neutral-900">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
          
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="bg-[#AA0000] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow">
              {article.category}
            </span>
            {article.isBreaking && (
              <span className="bg-yellow-400 text-black text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md animate-pulse">
                Breaking
              </span>
            )}
          </div>

          <button
            onClick={() => toggleBookmark(article.id)}
            className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-[#AA0000] text-white rounded-full transition backdrop-blur"
            title={isBookmarked ? "Remove Bookmark" : "Save Article"}
          >
            <Bookmark size={14} className={isBookmarked ? "fill-white" : ""} />
          </button>
        </div>

        {/* Card Body */}
        <div className="p-5">
          <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-mono mb-2">
            {article.location && (
              <span className="flex items-center gap-1 text-white/80">
                <MapPin size={11} className="text-[#AA0000]" /> {article.location} •
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock size={11} /> {formattedDate}
            </span>
          </div>

          <Link to={`/article/${article.id}`}>
            <h3 className="text-base md:text-lg font-bold text-white group-hover:text-[#AA0000] transition line-clamp-2 leading-snug">
              {getLocalizedTitle()}
            </h3>
          </Link>

          {article.summary && (
            <p className="text-xs text-neutral-400 line-clamp-2 mt-2 leading-relaxed">
              {article.summary}
            </p>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between text-xs text-neutral-400 bg-black/20">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-[#AA0000] flex items-center justify-center text-[10px] text-white font-bold">
            <User size={10} />
          </div>
          <span className="font-bold text-white/80 text-[11px] truncate max-w-[110px]">{article.authorName}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => likeArticle(article.id)}
            className="flex items-center gap-1 hover:text-[#AA0000] transition"
          >
            <Heart size={13} className={article.likes > 0 ? "text-[#AA0000]" : ""} />
            <span className="text-[11px] font-bold">{article.likes}</span>
          </button>
          <Link
            to={`/article/${article.id}`}
            className="text-[11px] font-bold text-[#AA0000] hover:underline"
          >
            Read →
          </Link>
        </div>
      </div>
    </div>
  );
}
