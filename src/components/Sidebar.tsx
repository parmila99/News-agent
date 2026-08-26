import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { 
  TrendingUp, 
  CloudSun, 
  DollarSign, 
  Vote, 
  Send, 
  CheckCircle2, 
  Share2, 
  Sparkles,
  ArrowUpRight,
  Tv,
  Globe
} from "lucide-react";
import { useNews } from "../context/NewsContext";

export default function Sidebar() {
  const { t } = useTranslation();
  const { publishedArticles, activePoll, votePoll } = useNews();
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>("kathmandu");

  const weatherData: Record<string, { temp: number; condition: string; high: number; low: number }> = {
    kathmandu: { temp: 22, condition: "Partly Cloudy", high: 24, low: 13 },
    delhi: { temp: 28, condition: "Sunny", high: 31, low: 20 },
    london: { temp: 15, condition: "Light Rain", high: 17, low: 10 },
    newyork: { temp: 18, condition: "Breezy", high: 21, low: 12 },
    tokyo: { temp: 20, condition: "Clear Sky", high: 22, low: 14 }
  };

  const currentCityWeather = weatherData[selectedCity] || weatherData.kathmandu;

  const markets = [
    { name: "NEPSE", value: "2,748.20", change: "+1.42%", positive: true },
    { name: "S&P 500", value: "5,860.10", change: "+0.85%", positive: true },
    { name: "GOLD (10g)", value: "$2,680.50", change: "+0.32%", positive: true },
    { name: "CRUDE OIL", value: "$74.20", change: "-0.45%", positive: false },
    { name: "BTC / USD", value: "$94,300", change: "+3.10%", positive: true },
  ];

  const trendingArticles = [...publishedArticles]
    .sort((a, b) => b.views - a.views)
    .slice(0, 4);

  const handleVote = (optId: string) => {
    if (hasVoted) return;
    votePoll(optId);
    setHasVoted(true);
  };

  return (
    <aside className="space-y-6">
      {/* 1. Live Weather & Multi-City Widget */}
      <div className="bg-[#1a1a1a] rounded-2xl p-5 border border-white/10 shadow-lg">
        <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#AA0000] flex items-center gap-1.5">
            <CloudSun size={16} /> Global Weather
          </h3>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="bg-black/50 text-[11px] font-bold text-neutral-300 border border-white/10 rounded-lg px-2 py-1 focus:outline-none focus:border-[#AA0000]"
          >
            <option value="kathmandu">Kathmandu</option>
            <option value="delhi">New Delhi</option>
            <option value="london">London</option>
            <option value="newyork">New York</option>
            <option value="tokyo">Tokyo</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-3xl font-black text-white">{currentCityWeather.temp}°C</span>
            <p className="text-xs text-neutral-400 font-medium">{currentCityWeather.condition}</p>
          </div>
          <div className="text-right text-[11px] text-neutral-400 font-mono">
            <p>H: <span className="text-white font-bold">{currentCityWeather.high}°C</span></p>
            <p>L: <span className="text-white font-bold">{currentCityWeather.low}°C</span></p>
          </div>
        </div>
      </div>

      {/* 2. Market Watch Widget */}
      <div className="bg-[#1a1a1a] rounded-2xl p-5 border border-white/10 shadow-lg">
        <h3 className="text-xs font-black uppercase tracking-wider text-[#AA0000] flex items-center gap-1.5 border-b border-white/5 pb-3 mb-3">
          <DollarSign size={16} /> Global Markets
        </h3>
        <div className="space-y-2.5">
          {markets.map((m, i) => (
            <div key={i} className="flex justify-between items-center text-xs">
              <span className="font-bold text-white/90">{m.name}</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-neutral-300">{m.value}</span>
                <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded font-bold ${
                  m.positive ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                }`}>
                  {m.change}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Trending News Section */}
      <div className="bg-[#1a1a1a] rounded-2xl p-5 border border-white/10 shadow-lg">
        <h3 className="text-xs font-black uppercase tracking-wider text-[#AA0000] flex items-center gap-1.5 border-b border-white/5 pb-3 mb-4">
          <TrendingUp size={16} /> {t('trending')}
        </h3>
        <div className="space-y-4">
          {trendingArticles.map((art, idx) => (
            <Link
              key={art.id}
              to={`/article/${art.id}`}
              className="flex items-start gap-3 group"
            >
              <span className="text-2xl font-black text-neutral-600 group-hover:text-[#AA0000] transition font-mono leading-none shrink-0 w-6">
                0{idx + 1}
              </span>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-[#AA0000] transition line-clamp-2 leading-snug">
                  {art.title}
                </h4>
                <div className="flex items-center gap-2 text-[10px] text-neutral-500 font-mono mt-1">
                  <span className="uppercase text-[#AA0000] font-bold">{art.category}</span>
                  <span>•</span>
                  <span>{art.views.toLocaleString()} reads</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 4. Interactive Opinion Poll */}
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#221010] rounded-2xl p-5 border border-[#AA0000]/30 shadow-lg">
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
            <Vote size={16} className="text-[#AA0000]" /> {t('poll_title')}
          </h3>
          <span className="text-[10px] bg-[#AA0000] text-white px-2 py-0.5 rounded font-bold uppercase">
            Live
          </span>
        </div>

        <p className="text-xs font-bold text-neutral-200 mb-4 leading-snug">
          {activePoll.question}
        </p>

        <div className="space-y-2.5">
          {activePoll.options.map((opt) => {
            const percent = activePoll.totalVotes > 0 
              ? Math.round((opt.votes / activePoll.totalVotes) * 100) 
              : 0;

            return (
              <button
                key={opt.id}
                onClick={() => handleVote(opt.id)}
                disabled={hasVoted}
                className={`w-full text-left p-3 rounded-xl border transition relative overflow-hidden group ${
                  hasVoted 
                    ? 'border-white/10 bg-black/40' 
                    : 'border-white/10 hover:border-[#AA0000] bg-white/5'
                }`}
              >
                {/* Progress bar background on vote */}
                {hasVoted && (
                  <div
                    className="absolute inset-0 bg-[#AA0000]/20 z-0 transition-all duration-700"
                    style={{ width: `${percent}%` }}
                  />
                )}

                <div className="relative z-10 flex justify-between items-center text-xs">
                  <span className="font-medium text-white group-hover:text-neutral-100 pr-2">
                    {opt.text}
                  </span>
                  {hasVoted && (
                    <span className="font-mono font-bold text-[#AA0000] shrink-0">
                      {percent}%
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex justify-between items-center text-[10px] text-neutral-400 font-mono mt-3 pt-2 border-t border-white/5">
          <span>{activePoll.totalVotes.toLocaleString()} Total Votes</span>
          {hasVoted && (
            <span className="text-emerald-400 flex items-center gap-1 font-bold">
              <CheckCircle2 size={12} /> Vote Recorded
            </span>
          )}
        </div>
      </div>

      {/* 5. Cultural Heritage Archive Spotlight */}
      <div className="bg-gradient-to-r from-red-950 to-neutral-900 rounded-2xl p-5 border border-red-900/50 shadow-lg text-white">
        <div className="flex items-center gap-2 text-xs font-black uppercase text-yellow-400 mb-2">
          <Sparkles size={14} /> Rajbanshi Heritage Archive
        </div>
        <h4 className="text-sm font-bold leading-snug">
          Explore the digital repository of indigenous languages, folklore, and arts.
        </h4>
        <Link
          to="/category/culture"
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#AA0000] hover:bg-[#880000] px-4 py-2 rounded-xl transition shadow"
        >
          <span>Explore Archives</span>
          <ArrowUpRight size={14} />
        </Link>
      </div>

      {/* 6. Sponsored Banner / Monetization */}
      <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-center text-neutral-500">
        <span className="text-[9px] uppercase tracking-widest block font-mono mb-2">Advertisement</span>
        <div className="h-28 rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900 flex flex-col items-center justify-center p-3 text-neutral-400">
          <p className="text-xs font-bold text-white">Reach 500,000+ Daily Readers on RGNN</p>
          <p className="text-[10px] mt-1 text-neutral-400">Advertise your business with RGNN Global Media</p>
          <span className="text-[10px] text-[#AA0000] font-bold mt-2 hover:underline cursor-pointer">
            partner@rgnn.media
          </span>
        </div>
      </div>
    </aside>
  );
}
