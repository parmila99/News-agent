import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { 
  Search, 
  Menu, 
  User, 
  Radio, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Bookmark, 
  Clock, 
  Mic, 
  X,
  ShieldAlert
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNews } from "../context/NewsContext";
import { useAuth } from "../context/AuthContext";
import AiNewsAssistantModal from "./AiNewsAssistantModal";
import VoiceSearchModal from "./VoiceSearchModal";

export default function Header() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { bookmarks, soundAlertsEnabled, setSoundAlertsEnabled } = useNews();
  const { user, profile, signInWithGoogle, logout } = useAuth();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const categories = [
    { name: t('nepal'), slug: 'nepal' },
    { name: t('world'), slug: 'world' },
    { name: t('politics'), slug: 'politics' },
    { name: t('business'), slug: 'business' },
    { name: t('tech'), slug: 'tech' },
    { name: t('sports'), slug: 'sports' },
    { name: t('health'), slug: 'health' },
    { name: t('culture'), slug: 'culture' },
  ];

  return (
    <>
      <header className="bg-[#141414] text-white sticky top-0 z-40 shadow-2xl border-b border-white/10">
        {/* Top Global Bar */}
        <div className="bg-[#AA0000] py-1.5 px-4 flex flex-wrap justify-between items-center text-[11px] font-bold tracking-wider">
          <div className="flex items-center gap-4">
            <span className="uppercase font-black flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
              Rajbanshi Global News Network (RGNN)
            </span>
            <span className="hidden md:inline text-white/70 font-mono">|</span>
            <span className="hidden md:flex items-center gap-1 text-white/90 font-mono text-[10px]">
              <Clock size={12} /> {currentTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} • {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-black/30 rounded-full px-2 py-0.5 text-[10px]">
              {[
                { code: 'en', label: 'EN' },
                { code: 'ne', label: 'NE (नेपाली)' },
                { code: 'hi', label: 'HI (हिंदी)' },
                { code: 'bn', label: 'BN (বাংলা)' },
                { code: 'rajbanshi', label: 'RAJ (राजवंशी)' },
              ].map((lng) => (
                <button
                  key={lng.code}
                  onClick={() => changeLanguage(lng.code)}
                  className={`px-2 py-0.5 rounded-full transition font-black ${
                    i18n.language === lng.code
                      ? 'bg-white text-[#AA0000] shadow'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {lng.label}
                </button>
              ))}
            </div>

            {/* Sound Alerts Toggle */}
            <button
              onClick={() => setSoundAlertsEnabled(!soundAlertsEnabled)}
              className="p-1 hover:bg-black/30 rounded-full transition"
              title={soundAlertsEnabled ? "Audio Alerts: ON" : "Audio Alerts: MUTED"}
            >
              {soundAlertsEnabled ? <Volume2 size={15} /> : <VolumeX size={15} className="opacity-60" />}
            </button>
          </div>
        </div>

        {/* Main Branding & Navigation Row */}
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="bg-[#AA0000] text-white px-3 py-1.5 rounded-xl font-black text-2xl tracking-tighter group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-[#AA0000]/30">
              RGNN
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tighter leading-none italic uppercase">
                RAJBANSHI GLOBAL
              </h1>
              <p className="text-[9px] opacity-70 tracking-[0.25em] font-mono uppercase text-neutral-300">
                NEWS NETWORK • INDEPENDENT JOURNALISM
              </p>
            </div>
          </Link>

          {/* Desktop Categories */}
          <nav className="hidden xl:flex items-center gap-5 font-bold text-xs">
            {categories.map((cat) => {
              const isActive = location.pathname === `/category/${cat.slug}`;
              return (
                <Link
                  key={cat.slug}
                  to={`/category/${cat.slug}`}
                  className={`hover:text-[#AA0000] transition-colors uppercase tracking-tight py-1 border-b-2 ${
                    isActive ? "border-[#AA0000] text-[#AA0000]" : "border-transparent text-neutral-300"
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
            <Link
              to="/live"
              className="flex items-center gap-1.5 bg-[#AA0000]/20 text-[#AA0000] hover:bg-[#AA0000] hover:text-white px-3 py-1 rounded-full border border-[#AA0000]/40 transition uppercase font-black"
            >
              <Radio size={14} className="animate-pulse" />
              <span>{t('live_tv')}</span>
            </Link>
          </nav>

          {/* Action Suite (AI, Search, Bookmarks, Studio, Profile) */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* AI Assistant Button */}
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-[#4B0082]/30 to-[#800080]/30 hover:from-[#4B0082] hover:to-[#800080] text-purple-200 border border-purple-500/30 px-3 py-1.5 rounded-full text-xs font-bold transition shadow-sm"
              title="RGNN AI Assistant"
            >
              <Sparkles size={14} className="text-yellow-400" />
              <span className="hidden sm:inline">AI News Assistant</span>
            </button>

            {/* Global Search Button */}
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-neutral-300 hover:text-white flex items-center gap-1.5"
              title="Search News Wires"
            >
              <Search size={18} />
              <Mic size={14} className="hidden sm:inline text-neutral-400" />
            </button>

            {/* Bookmarks */}
            <Link
              to="/bookmarks"
              className="relative p-2 hover:bg-white/10 rounded-full transition-colors text-neutral-300 hover:text-white"
              title="Saved Articles"
            >
              <Bookmark size={18} />
              {bookmarks.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#AA0000] text-white text-[9px] font-black rounded-full flex items-center justify-center">
                  {bookmarks.length}
                </span>
              )}
            </Link>

            {/* Admin / Studio Entry */}
            <Link
              to="/admin"
              className="hidden sm:flex items-center gap-1.5 bg-white/10 hover:bg-[#AA0000] text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition border border-white/10"
            >
              <ShieldAlert size={14} />
              <span>Studio</span>
            </Link>

            {/* User Profile / Login */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/admin" className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#AA0000] flex items-center justify-center font-bold text-xs uppercase overflow-hidden border border-white/20">
                    {profile?.photoURL ? (
                      <img src={profile.photoURL} alt={profile.displayName} className="w-full h-full object-cover" />
                    ) : (
                      profile?.displayName?.charAt(0) || 'R'
                    )}
                  </div>
                </Link>
                <button
                  onClick={logout}
                  className="hidden md:inline text-[10px] uppercase font-bold text-neutral-400 hover:text-[#AA0000] transition"
                >
                  {t('logout')}
                </button>
              </div>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-neutral-300 hover:text-white"
                title="Sign In"
              >
                <User size={18} />
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="xl:hidden p-2 hover:bg-white/10 rounded-full transition-colors text-neutral-300"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="xl:hidden bg-[#1a1a1a] border-t border-white/10 p-4 space-y-3 animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-white/10">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/category/${cat.slug}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm font-bold uppercase tracking-tight py-2 px-3 rounded-lg bg-white/5 hover:bg-[#AA0000] text-neutral-200 hover:text-white transition"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
            <div className="flex justify-between items-center pt-2">
              <Link
                to="/live"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 text-[#AA0000] font-black uppercase text-sm"
              >
                <Radio size={16} className="animate-pulse" /> {t('live_tv')}
              </Link>
              <Link
                to="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="text-xs font-bold uppercase bg-[#AA0000] text-white px-4 py-1.5 rounded-lg"
              >
                {t('admin')}
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Modals */}
      <AiNewsAssistantModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />
      <VoiceSearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} />
    </>
  );
}
