import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Flame, Filter } from "lucide-react";
import { useNews } from "../context/NewsContext";
import NewsCard from "../components/NewsCard";
import Sidebar from "../components/Sidebar";

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const { t } = useTranslation();
  const { publishedArticles } = useNews();

  const articles = publishedArticles.filter((a) => a.category === category);

  const categoryNames: Record<string, string> = {
    nepal: "Nepal & South Asia",
    world: "World Affairs",
    politics: "Politics & Diplomacy",
    business: "Business & Economy",
    tech: "Technology & AI",
    sports: "Sports",
    health: "Health & Science",
    culture: "Rajbanshi Culture & Arts"
  };

  const currentCategoryName = (category && categoryNames[category]) || category?.toUpperCase() || "News";

  return (
    <div className="container mx-auto px-4 max-w-7xl py-8 space-y-8">
      {/* Top Banner */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-white transition mb-3"
        >
          <ArrowLeft size={16} /> All Headlines
        </Link>
        <div className="bg-[#1a1a1a] rounded-3xl p-6 md:p-8 border border-white/10 flex flex-wrap justify-between items-center gap-4">
          <div>
            <span className="text-[10px] bg-[#AA0000] text-white font-black uppercase tracking-widest px-3 py-1 rounded">
              NEWS DESK
            </span>
            <h1 className="text-2xl sm:text-4xl font-black uppercase text-white tracking-tight mt-2 italic">
              {currentCategoryName}
            </h1>
            <p className="text-xs text-neutral-400 font-mono mt-1">
              Showing {articles.length} verified news reports & analyses
            </p>
          </div>
        </div>
      </div>

      {/* Grid + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          {articles.length === 0 ? (
            <div className="text-center py-20 bg-[#141414] rounded-3xl border border-white/10 space-y-3">
              <p className="text-base font-bold text-white">No articles published under this desk yet.</p>
              <Link
                to="/admin"
                className="inline-block mt-2 bg-[#AA0000] text-white px-5 py-2 rounded-full text-xs font-bold uppercase"
              >
                Publish New Report
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map((art) => (
                <NewsCard key={art.id} article={art} />
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-4">
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
