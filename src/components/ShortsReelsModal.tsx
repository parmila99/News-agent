import { useState } from "react";
import { X, Heart, MessageSquare, Share2, Play, Pause, ChevronUp, ChevronDown, Volume2, VolumeX } from "lucide-react";

interface ShortsReelsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const REELS = [
  {
    id: 1,
    title: "Inside the Himalayan Clean Energy Corridor project - High Altitude Survey",
    author: "Rahul Prasad Rajbanshi",
    role: "Chief Correspondent",
    likes: 4230,
    comments: 290,
    videoThumbnail: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80",
    tags: ["#Nepal", "#CleanEnergy", "#RGNN"]
  },
  {
    id: 2,
    title: "Rajbanshi traditional weavers showcase centuries-old silk and bamboo craft",
    author: "Kavita Rajbanshi",
    role: "Cultural Historian",
    likes: 8910,
    comments: 540,
    videoThumbnail: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80",
    tags: ["#Heritage", "#Rajbanshi", "#Culture"]
  },
  {
    id: 3,
    title: "Quantum Computing Lab demonstrates real-time climate simulation breakthrough",
    author: "Dr. Elena Rostova",
    role: "Tech Editor",
    likes: 6100,
    comments: 310,
    videoThumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    tags: ["#Tech", "#Quantum", "#Science"]
  }
];

export default function ShortsReelsModal({ isOpen, onClose }: ShortsReelsModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [likesCount, setLikesCount] = useState<Record<number, number>>({
    1: 4230,
    2: 8910,
    3: 6100
  });
  const [hasLiked, setHasLiked] = useState<Record<number, boolean>>({});

  if (!isOpen) return null;

  const currentReel = REELS[currentIndex];

  const handleLike = (id: number) => {
    setHasLiked(prev => {
      const isLiked = !!prev[id];
      setLikesCount(cnt => ({
        ...cnt,
        [id]: isLiked ? cnt[id] - 1 : cnt[id] + 1
      }));
      return { ...prev, [id]: !isLiked };
    });
  };

  const nextReel = () => {
    setCurrentIndex(prev => (prev + 1) % REELS.length);
  };

  const prevReel = () => {
    setCurrentIndex(prev => (prev - 1 + REELS.length) % REELS.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-50 p-3 bg-white/10 hover:bg-[#AA0000] text-white rounded-full transition"
      >
        <X size={24} />
      </button>

      <div className="relative w-full max-w-sm h-[90vh] max-h-[780px] bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl border border-white/20 flex flex-col justify-between">
        {/* Video simulation / Thumbnail */}
        <div className="absolute inset-0 z-0">
          <img
            src={currentReel.videoThumbnail}
            alt={currentReel.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90"></div>
        </div>

        {/* Top Controls */}
        <div className="relative z-10 p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <span className="bg-[#AA0000] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full animate-pulse">
              RGNN SHORTS
            </span>
            <span className="text-xs font-bold text-white/80">{currentIndex + 1} / {REELS.length}</span>
          </div>
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 bg-black/40 rounded-full hover:bg-black/60 transition"
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>

        {/* Play / Pause tap overlay */}
        <div
          onClick={() => setIsPlaying(!isPlaying)}
          className="relative z-10 flex-grow flex items-center justify-center cursor-pointer"
        >
          {!isPlaying && (
            <div className="w-16 h-16 bg-black/60 rounded-full flex items-center justify-center text-white backdrop-blur">
              <Play size={28} className="fill-white ml-1" />
            </div>
          )}
        </div>

        {/* Bottom Details & Side Action Bar */}
        <div className="relative z-10 p-5 flex items-end justify-between">
          <div className="space-y-2 max-w-[75%] text-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#AA0000] flex items-center justify-center font-bold text-xs">
                {currentReel.author[0]}
              </div>
              <div>
                <p className="text-xs font-bold leading-none">{currentReel.author}</p>
                <p className="text-[10px] text-white/60">{currentReel.role}</p>
              </div>
            </div>
            <p className="text-sm font-bold leading-snug line-clamp-3">{currentReel.title}</p>
            <div className="flex gap-2 text-xs font-bold text-[#AA0000]">
              {currentReel.tags.map((t, idx) => (
                <span key={idx}>{t}</span>
              ))}
            </div>
          </div>

          {/* Vertical Actions */}
          <div className="flex flex-col items-center gap-5 text-white">
            <button
              onClick={() => handleLike(currentReel.id)}
              className="flex flex-col items-center gap-1 group"
            >
              <div className={`p-3 rounded-full backdrop-blur transition ${
                hasLiked[currentReel.id] ? 'bg-[#AA0000] text-white' : 'bg-black/40 text-white hover:bg-white/20'
              }`}>
                <Heart size={20} className={hasLiked[currentReel.id] ? 'fill-white' : ''} />
              </div>
              <span className="text-[10px] font-bold">{likesCount[currentReel.id]}</span>
            </button>

            <button className="flex flex-col items-center gap-1">
              <div className="p-3 bg-black/40 rounded-full hover:bg-white/20 transition backdrop-blur">
                <MessageSquare size={20} />
              </div>
              <span className="text-[10px] font-bold">{currentReel.comments}</span>
            </button>

            <button className="flex flex-col items-center gap-1">
              <div className="p-3 bg-black/40 rounded-full hover:bg-white/20 transition backdrop-blur">
                <Share2 size={20} />
              </div>
              <span className="text-[10px] font-bold">Share</span>
            </button>
          </div>
        </div>

        {/* Up / Down Arrow Navigation */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20">
          <button
            onClick={prevReel}
            className="p-2 bg-black/50 hover:bg-[#AA0000] text-white rounded-full transition backdrop-blur"
          >
            <ChevronUp size={20} />
          </button>
          <button
            onClick={nextReel}
            className="p-2 bg-black/50 hover:bg-[#AA0000] text-white rounded-full transition backdrop-blur"
          >
            <ChevronDown size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
