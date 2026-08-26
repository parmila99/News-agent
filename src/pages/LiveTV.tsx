import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { 
  Radio, 
  Tv, 
  Users, 
  Send, 
  MessageSquare, 
  Volume2, 
  VolumeX, 
  Layers, 
  Sparkles, 
  Video,
  Globe
} from "lucide-react";
import { collection, onSnapshot, addDoc, query, orderBy, limit } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";

export default function LiveTV() {
  const { t } = useTranslation();
  const { user, profile } = useAuth();
  const [activeStudio, setActiveStudio] = useState<string>("kathmandu");
  const [viewersCount, setViewersCount] = useState(14820);
  const [isAudioLive, setIsAudioLive] = useState(true);

  // Live Chat messages
  const [messages, setMessages] = useState<any[]>([
    { id: "m1", userName: "Aarav Sharma", role: "Viewer", message: "Audio and video clarity are crystal clear from Kathmandu studio." },
    { id: "m2", userName: "Priya Rajbanshi", role: "Editor", message: "Breaking dispatch coming in from Geneva environmental summit shortly." },
    { id: "m3", userName: "Dr. K. Patel", role: "Viewer", message: "Looking forward to the panel discussion on AI regulation." }
  ]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dynamic viewer count fluctuate
    const interval = setInterval(() => {
      setViewersCount(prev => prev + Math.floor(Math.random() * 11) - 5);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    try {
      const chatRef = collection(db, 'liveChat');
      const unsubscribe = onSnapshot(chatRef, (snapshot) => {
        if (!snapshot.empty) {
          const loaded: any[] = [];
          snapshot.forEach((d) => loaded.push({ id: d.id, ...d.data() }));
          setMessages(loaded);
        }
      }, (err) => {
        console.warn('Live chat Firestore snapshot fallback:', err);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn('Live chat listener fallback:', e);
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg = {
      userId: user?.uid || 'guest-' + Date.now(),
      userName: profile?.displayName || 'Rahul Prasad Rajbanshi',
      role: profile?.role === 'admin' ? 'Chief Editor' : 'Viewer',
      message: chatInput.trim(),
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMsg]);
    setChatInput("");

    try {
      await addDoc(collection(db, 'liveChat'), newMsg);
    } catch (err) {
      console.warn('Live chat stored locally:', err);
    }
  };

  const studios = [
    { id: "kathmandu", name: "Studio 1 — Kathmandu HQ", host: "Rahul Prasad Rajbanshi", topic: "South Asian Geopolitics & Himalayan Energy Accord" },
    { id: "geneva", name: "Studio 2 — Geneva Desk", host: "Elena Rostova", topic: "Global Climate Monitoring & Tech Governance" },
    { id: "newyork", name: "Studio 3 — New York Hub", host: "Marcus Vance", topic: "Wall Street & Next-Gen AI Productivity Brief" },
    { id: "fieldcam", name: "Field Unit — Biratnagar / Jhapa", host: "Kavita Rajbanshi", topic: "Rajbanshi Cultural Archive Live Festival" }
  ];

  const currentStudioInfo = studios.find(s => s.id === activeStudio) || studios[0];

  return (
    <div className="container mx-auto px-4 max-w-7xl py-8 space-y-8">
      {/* Top Title Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#AA0000]">
            <Radio size={16} className="animate-pulse" />
            <span>GLOBAL SATELLITE 24/7 BROADCAST</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-white italic tracking-tight mt-1">
            RGNN Live Television & Interactive Stream
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 bg-red-950/80 border border-red-500/40 text-red-300 px-3.5 py-1.5 rounded-full text-xs font-bold font-mono">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <Users size={14} /> {viewersCount.toLocaleString()} Live Viewers
          </span>
          <button
            onClick={() => setIsAudioLive(!isAudioLive)}
            className="p-2 bg-white/10 hover:bg-[#AA0000] text-white rounded-full transition"
            title="Toggle Stream Audio"
          >
            {isAudioLive ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
        </div>
      </div>

      {/* Main Broadcast Grid: Video Player (8 Cols) + Live Chat (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Stream Player Area */}
        <div className="lg:col-span-8 space-y-6">
          <div className="relative aspect-video bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col justify-between p-6">
            {/* Stream Background / Visualizer */}
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black z-0">
              <img
                src={
                  activeStudio === 'kathmandu' 
                    ? "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=80"
                    : activeStudio === 'geneva'
                    ? "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80"
                    : activeStudio === 'newyork'
                    ? "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&q=80"
                    : "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=80"
                }
                alt="Studio Feed"
                className="w-full h-full object-cover opacity-40 mix-blend-luminosity scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60"></div>
            </div>

            {/* Live TV Overlays (Top) */}
            <div className="relative z-10 flex justify-between items-start">
              <div className="flex items-center gap-2">
                <span className="bg-[#AA0000] text-white font-black text-xs uppercase tracking-widest px-3 py-1 rounded-md shadow-lg animate-pulse flex items-center gap-1.5">
                  <Radio size={14} /> LIVE ON AIR
                </span>
                <span className="bg-black/70 text-white font-mono text-[11px] px-2.5 py-1 rounded-md border border-white/10 backdrop-blur">
                  1080p 60FPS • OBS DIRECT
                </span>
              </div>

              <div className="bg-[#AA0000] text-white px-3 py-1 rounded-xl font-black text-lg tracking-tighter shadow-xl">
                RGNN
              </div>
            </div>

            {/* Live Graphic Lower Third (Bottom) */}
            <div className="relative z-10 bg-black/80 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-white space-y-1 max-w-2xl shadow-2xl">
              <div className="flex items-center gap-2 text-[#AA0000] text-[10px] font-black uppercase tracking-widest">
                <span>{currentStudioInfo.name}</span>
                <span>•</span>
                <span>Anchor: {currentStudioInfo.host}</span>
              </div>
              <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-white line-clamp-1">
                {currentStudioInfo.topic}
              </h2>
            </div>
          </div>

          {/* Studio Camera Switcher */}
          <div className="bg-[#1a1a1a] rounded-2xl p-5 border border-white/10 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
              <Video size={16} className="text-[#AA0000]" /> Select Active Studio Feed
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {studios.map((st) => (
                <button
                  key={st.id}
                  onClick={() => setActiveStudio(st.id)}
                  className={`p-3 rounded-xl text-left border transition ${
                    activeStudio === st.id
                      ? "border-[#AA0000] bg-[#AA0000]/15 text-white"
                      : "border-white/5 bg-black/30 text-neutral-400 hover:text-white hover:border-white/20"
                  }`}
                >
                  <p className="text-xs font-bold truncate">{st.name}</p>
                  <p className="text-[10px] text-neutral-500 font-mono mt-1">{st.host}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Broadcast Chat Stream (4 Cols) */}
        <div className="lg:col-span-4 bg-[#141414] rounded-3xl border border-white/10 overflow-hidden flex flex-col h-[580px] shadow-xl">
          {/* Chat Header */}
          <div className="bg-neutral-900 p-4 border-b border-white/10 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-[#AA0000]" />
              <h3 className="text-xs font-black uppercase tracking-wider">Live Broadcast Chat</h3>
            </div>
            <span className="text-[10px] text-neutral-400 font-mono">Real-time</span>
          </div>

          {/* Chat Messages Stream */}
          <div className="flex-grow p-4 overflow-y-auto space-y-3">
            {messages.map((m, i) => (
              <div key={m.id || i} className="text-xs space-y-0.5 bg-white/5 p-2.5 rounded-xl border border-white/5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white text-[11px] flex items-center gap-1.5">
                    {m.userName}
                    {m.role === 'Chief Editor' && (
                      <span className="text-[9px] bg-[#AA0000] text-white px-1.5 py-0.2 rounded font-mono uppercase font-black">
                        Editor
                      </span>
                    )}
                  </span>
                  <span className="text-[9px] text-neutral-500 font-mono">
                    {new Date(m.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-neutral-300 leading-relaxed">{m.message}</p>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSendChat} className="p-3 bg-black border-t border-white/10 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Send message to live broadcast..."
              className="flex-grow bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#AA0000]"
            />
            <button
              type="submit"
              disabled={!chatInput.trim()}
              className="bg-[#AA0000] hover:bg-[#880000] disabled:opacity-40 text-white p-2.5 rounded-xl transition"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
