import { useState } from "react";
import { Link } from "react-router-dom";
import { Play, Radio, Eye, Clock, Film } from "lucide-react";
import { useTranslation } from "react-i18next";
import ShortsReelsModal from "./ShortsReelsModal";

const VIDEO_STORIES = [
  {
    id: "v-1",
    title: "Special Report: Inside the High-Altitude Himalayan Glacial Research Station",
    duration: "08:42",
    views: "124K",
    thumbnail: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80",
    category: "Investigative",
    author: "Rahul Prasad Rajbanshi"
  },
  {
    id: "v-2",
    title: "Global Tech Brief: Next-Gen Autonomous AI in Healthcare and Surgery",
    duration: "05:15",
    views: "89K",
    thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    category: "Technology",
    author: "Dr. Elena Rostova"
  },
  {
    id: "v-3",
    title: "Rajbanshi Traditional Silk Artisans: Preserving 500-Year-Old Handloom Secrets",
    duration: "12:10",
    views: "64K",
    thumbnail: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80",
    category: "Documentary",
    author: "Kavita Rajbanshi"
  }
];

export default function VideoSection() {
  const { t } = useTranslation();
  const [activeVideoModal, setActiveVideoModal] = useState<string | null>(null);
  const [isShortsOpen, setIsShortsOpen] = useState(false);

  return (
    <section className="bg-neutral-950 text-white rounded-3xl p-6 md:p-8 border border-white/10 my-10 shadow-2xl">
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#AA0000]">
            <Radio size={16} className="animate-pulse" />
            <span>RGNN MULTIMEDIA</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight italic mt-1">
            {t('video_news')} & Documentaries
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsShortsOpen(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-[#AA0000] to-rose-700 hover:from-[#880000] hover:to-rose-800 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-[#AA0000]/20"
          >
            <Film size={14} />
            <span>Watch RGNN Shorts</span>
          </button>

          <Link
            to="/live"
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition"
          >
            <Radio size={14} className="text-[#AA0000]" />
            <span>{t('live_tv')}</span>
          </Link>
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {VIDEO_STORIES.map((vid) => (
          <div
            key={vid.id}
            onClick={() => setActiveVideoModal(vid.title)}
            className="group cursor-pointer bg-[#141414] rounded-2xl overflow-hidden border border-white/5 hover:border-[#AA0000]/40 transition duration-300 flex flex-col justify-between"
          >
            {/* Thumbnail with duration badge and play icon */}
            <div className="relative aspect-video overflow-hidden bg-neutral-900">
              <img
                src={vid.thumbnail}
                alt={vid.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition"></div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-[#AA0000] text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                  <Play size={20} className="fill-white ml-1" />
                </div>
              </div>

              <span className="absolute bottom-2 right-2 bg-black/80 font-mono text-[10px] text-white px-2 py-0.5 rounded font-bold">
                {vid.duration}
              </span>

              <span className="absolute top-2 left-2 bg-[#AA0000] font-mono text-[9px] uppercase tracking-wider text-white px-2 py-0.5 rounded font-black">
                {vid.category}
              </span>
            </div>

            {/* Video Meta */}
            <div className="p-4 space-y-2">
              <h3 className="text-sm font-bold text-white group-hover:text-[#AA0000] transition line-clamp-2 leading-snug">
                {vid.title}
              </h3>
              <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono pt-1">
                <span>{vid.author}</span>
                <span className="flex items-center gap-1">
                  <Eye size={12} /> {vid.views}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Player Modal (Simulated Broadcast) */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#141414] border border-white/10 rounded-3xl p-6 max-w-2xl w-full text-white space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm truncate max-w-md">{activeVideoModal}</h3>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="text-xs bg-white/10 hover:bg-[#AA0000] px-3 py-1.5 rounded-full font-bold transition"
              >
                Close
              </button>
            </div>
            <div className="aspect-video bg-black rounded-2xl overflow-hidden flex flex-col items-center justify-center border border-white/10 relative">
              <div className="w-16 h-16 rounded-full bg-[#AA0000] flex items-center justify-center text-white animate-pulse">
                <Play size={28} className="fill-white ml-1" />
              </div>
              <p className="text-xs text-neutral-400 mt-4">Playing RGNN High-Definition Broadcast Stream...</p>
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="bg-[#AA0000] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
                  HD 1080p
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shorts Modal */}
      <ShortsReelsModal isOpen={isShortsOpen} onClose={() => setIsShortsOpen(false)} />
    </section>
  );
}
