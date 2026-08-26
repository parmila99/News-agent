import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { 
  Sparkles, 
  TrendingUp, 
  Radio, 
  ArrowRight, 
  Flame, 
  Filter,
  Layers,
  Globe
} from "lucide-react";
import HeroSlider from "../components/HeroSlider";
import NewsCard from "../components/NewsCard";
import Sidebar from "../components/Sidebar";
import VideoSection from "../components/VideoSection";
import { useNews } from "../context/NewsContext";

export default function Home() {
  const { t } = useTranslation();
  const { publishedArticles, loading } = useNews();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "All News" },
    { id: "nepal", label: "Nepal & South Asia" },
    { id: "world", label: "World Affairs" },
    { id: "politics", label: "Politics" },
    { id: "business", label: "Business" },
    { id: "tech", label: "Technology & AI" },
    { id: "sports", label: "Sports" },
    { id: "culture", label: "Rajbanshi Culture" },
  ];

  const filteredArticles = publishedArticles.filter(
    (a) => selectedCategory === "all" || a.category === selectedCategory
  );

  const nepalNews = publishedArticles.filter((a) => a.category === "nepal");
  const techNews = publishedArticles.filter((a) => a.category === "tech" || a.category === "business");
  const cultureNews = publishedArticles.filter((a) => a.category === "culture");

  return (
    <div className="space-y-10 pb-16">
      {/* 1. Hero Headline Slider */}
      <HeroSlider />

      <div className="container mx-auto px-4 max-w-7xl">
        {/* 2. Main 2-Column News Layout: Feed (Left) + Sidebar (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main News Content Area (8 Cols) */}
          <div className="lg:col-span-8 space-y-10">
            {/* Category Filter Navigation Bar */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 overflow-x-auto scrollbar-hide">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#AA0000] flex items-center gap-1">
                  <Flame size={15} /> Top Stories
                </span>
                <div className="flex gap-1 overflow-x-auto">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.id)}
                      className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider transition shrink-0 ${
                        selectedCategory === c.id
                          ? "bg-[#AA0000] text-white"
                          : "bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* News Cards Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="h-72 bg-neutral-900 rounded-2xl"></div>
                ))}
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="text-center py-16 bg-[#1a1a1a] rounded-2xl border border-white/10">
                <p className="text-sm font-bold text-neutral-400">No published articles under this category yet.</p>
                <Link to="/admin" className="text-xs font-bold text-[#AA0000] hover:underline mt-2 inline-block">
                  Publish a new article in Admin Studio →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredArticles.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            )}

            {/* 3. Nepal & South Asian Focus Desk */}
            {nepalNews.length > 0 && (
              <div className="pt-6 border-t border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base md:text-lg font-black uppercase italic tracking-tight text-white flex items-center gap-2 border-l-4 border-[#AA0000] pl-3">
                    {t('nepal')} News Desk
                  </h3>
                  <Link
                    to="/category/nepal"
                    className="text-xs font-bold text-[#AA0000] hover:underline flex items-center gap-1"
                  >
                    View All <ArrowRight size={13} />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {nepalNews.slice(0, 2).map((item) => (
                    <NewsCard key={item.id} article={item} variant="compact" />
                  ))}
                </div>
              </div>
            )}

            {/* 4. Rajbanshi Cultural Heritage Spotlight */}
            {cultureNews.length > 0 && (
              <div className="pt-6 border-t border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base md:text-lg font-black uppercase italic tracking-tight text-white flex items-center gap-2 border-l-4 border-amber-600 pl-3">
                    {t('culture')} & Folklore
                  </h3>
                  <Link
                    to="/category/culture"
                    className="text-xs font-bold text-amber-500 hover:underline flex items-center gap-1"
                  >
                    Explore Heritage <ArrowRight size={13} />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cultureNews.slice(0, 2).map((item) => (
                    <NewsCard key={item.id} article={item} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Section (4 Cols) */}
          <div className="lg:col-span-4">
            <Sidebar />
          </div>
        </div>

        {/* 5. Video & Multimedia Section */}
        <VideoSection />
      </div>
    </div>
  );
}
