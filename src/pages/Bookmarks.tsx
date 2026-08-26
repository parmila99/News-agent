import { Link } from "react-router-dom";
import { Bookmark, ArrowLeft, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNews } from "../context/NewsContext";
import NewsCard from "../components/NewsCard";

export default function Bookmarks() {
  const { t } = useTranslation();
  const { publishedArticles, bookmarks, toggleBookmark } = useNews();

  const savedArticles = publishedArticles.filter((a) => bookmarks.includes(a.id));

  return (
    <div className="container mx-auto px-4 max-w-7xl py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 border-b border-white/10 pb-4">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-white transition mb-2"
          >
            <ArrowLeft size={16} /> Back to Headlines
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight flex items-center gap-2">
            <Bookmark size={24} className="text-[#AA0000] fill-[#AA0000]" />
            Saved & Offline Articles ({savedArticles.length})
          </h1>
        </div>
      </div>

      {savedArticles.length === 0 ? (
        <div className="text-center py-20 bg-[#141414] rounded-3xl border border-white/10 space-y-3">
          <Bookmark size={40} className="mx-auto text-neutral-600" />
          <h3 className="text-lg font-bold text-white">No saved articles yet</h3>
          <p className="text-xs text-neutral-400 max-w-md mx-auto">
            Click the bookmark icon on any article across the RGNN platform to save stories for later reading.
          </p>
          <Link
            to="/"
            className="inline-block mt-4 bg-[#AA0000] hover:bg-[#880000] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition"
          >
            Explore Top Stories
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedArticles.map((art) => (
            <NewsCard key={art.id} article={art} />
          ))}
        </div>
      )}
    </div>
  );
}
