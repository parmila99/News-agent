import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { AlertCircle, Volume2, X } from "lucide-react";
import { useNews } from "../context/NewsContext";

export default function BreakingNewsTicker() {
  const { t } = useTranslation();
  const { breakingNews, emergencyAlert, clearEmergencyAlert } = useNews();

  const newsItems = breakingNews.length > 0 
    ? breakingNews 
    : [
        { id: "art-001", title: "Historic Himalayan Summit: Leaders Sign Landmark Regional Green Energy Pact" },
        { id: "art-002", title: "Global Markets Rally as Next-Gen Artificial Intelligence Drives Record Productivity Surge" },
        { id: "art-003", title: "Preserving the Rich Heritage: The Renaissance of Rajbanshi Art, Language, and Culture" },
      ];

  return (
    <>
      {/* Emergency Global Alert Banner */}
      {emergencyAlert && (
        <div className="bg-red-700 text-white px-4 py-2 flex items-center justify-between shadow-xl animate-pulse">
          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wider">
            <AlertCircle size={20} className="shrink-0" />
            <span>{emergencyAlert}</span>
          </div>
          <button
            onClick={clearEmergencyAlert}
            className="p-1 hover:bg-black/20 rounded-full transition"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Breaking Marquee Ticker */}
      <div className="bg-black text-white py-2 flex items-center border-b border-[#AA0000]/30 overflow-hidden text-xs md:text-sm font-medium">
        <div className="bg-[#AA0000] px-4 py-1 flex items-center gap-2 whitespace-nowrap z-10 shrink-0 font-black uppercase italic shadow-md">
          <span className="animate-ping bg-white w-2 h-2 rounded-full"></span>
          {t('breaking_news')}
        </div>
        
        <div className="relative flex items-center flex-grow overflow-hidden">
          <div className="flex gap-12 animate-marquee whitespace-nowrap">
            {newsItems.map((item, i) => (
              <Link
                key={`item-${i}`}
                to={`/article/${item.id}`}
                className="hover:text-[#AA0000] cursor-pointer transition-colors flex items-center gap-2 font-bold"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#AA0000]"></span>
                {item.title}
              </Link>
            ))}
            {/* Duplicate for seamless continuous loop */}
            {newsItems.map((item, i) => (
              <Link
                key={`dup-${i}`}
                to={`/article/${item.id}`}
                className="hover:text-[#AA0000] cursor-pointer transition-colors flex items-center gap-2 font-bold"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#AA0000]"></span>
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
