import { useState, useEffect } from "react";
import { Search, Mic, MicOff, X, ArrowRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useNews } from "../context/NewsContext";
import { useTranslation } from "react-i18next";

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VoiceSearchModal({ isOpen, onClose }: VoiceSearchModalProps) {
  const { publishedArticles } = useNews();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const startVoiceRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice speech recognition is not supported in your current browser. Please type your search query.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join("");
      setSearchTerm(transcript);
    };

    recognition.onerror = (event: any) => {
      console.warn("Speech error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const filtered = publishedArticles.filter((art) => {
    const matchesCat = selectedCategory === "all" || art.category === selectedCategory;
    const matchesQuery = !searchTerm.trim() || 
      art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.tags?.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  if (!isOpen) return null;

  const categories = [
    { id: "all", label: "All News" },
    { id: "nepal", label: "Nepal" },
    { id: "world", label: "World" },
    { id: "politics", label: "Politics" },
    { id: "business", label: "Business" },
    { id: "tech", label: "Technology" },
    { id: "sports", label: "Sports" },
    { id: "culture", label: "Culture" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#141414] text-white w-full max-w-3xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Search Bar Input */}
        <div className="p-6 border-b border-white/10 flex items-center gap-4 bg-neutral-900/50">
          <Search size={24} className="text-[#AA0000] shrink-0" />
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={isListening ? "Listening now... Speak clearly" : "Search RGNN News wires, archives, categories..."}
            className="w-full bg-transparent text-xl font-bold text-white placeholder-neutral-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={startVoiceRecognition}
            className={`p-3 rounded-full transition-all shrink-0 ${
              isListening ? 'bg-[#AA0000] text-white animate-pulse' : 'bg-white/10 text-neutral-300 hover:bg-[#AA0000] hover:text-white'
            }`}
            title="Voice Search"
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          <button
            onClick={onClose}
            className="p-3 bg-white/5 hover:bg-white/20 text-neutral-400 hover:text-white rounded-full transition-colors shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        {/* Category Filter Chips */}
        <div className="px-6 py-3 bg-black/40 border-b border-white/5 flex gap-2 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`text-xs uppercase tracking-wider font-bold px-3 py-1.5 rounded-full transition ${
                selectedCategory === cat.id
                  ? 'bg-[#AA0000] text-white'
                  : 'bg-white/5 text-neutral-400 hover:bg-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-grow">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-neutral-500">
              <p className="text-lg font-bold">No articles found matching "{searchTerm}"</p>
              <p className="text-xs mt-1">Try different keywords or browse all categories.</p>
            </div>
          ) : (
            filtered.map((art) => (
              <Link
                key={art.id}
                to={`/article/${art.id}`}
                onClick={onClose}
                className="flex gap-4 p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition group border border-transparent hover:border-[#AA0000]/30"
              >
                <div className="w-24 h-20 rounded-xl overflow-hidden shrink-0 bg-neutral-800">
                  <img src={art.imageUrl} alt={art.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#AA0000]">
                      <span>{art.category}</span>
                      <span className="text-neutral-500">•</span>
                      <span className="text-neutral-400 flex items-center gap-1">
                        <Clock size={10} /> {new Date(art.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white group-hover:text-[#AA0000] transition line-clamp-2 mt-1">
                      {art.title}
                    </h4>
                  </div>
                  <span className="text-[11px] text-neutral-400 group-hover:text-white flex items-center gap-1 font-medium mt-1">
                    Read Story <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
