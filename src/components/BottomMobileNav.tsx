import { Link, useLocation } from "react-router-dom";
import { Home, Radio, Bookmark, LayoutDashboard, Film } from "lucide-react";
import { useState } from "react";
import ShortsReelsModal from "./ShortsReelsModal";

export default function BottomMobileNav() {
  const location = useLocation();
  const [isShortsOpen, setIsShortsOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/live", label: "Live TV", icon: Radio, pulse: true },
    { path: "/bookmarks", label: "Saved", icon: Bookmark },
    { path: "/admin", label: "Studio", icon: LayoutDashboard },
  ];

  return (
    <>
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#141414]/95 backdrop-blur-lg border-t border-white/10 px-4 py-2 flex justify-around items-center text-white shadow-2xl">
        {navItems.slice(0, 2).map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
                isActive ? "text-[#AA0000] font-black" : "text-neutral-400 hover:text-white"
              }`}
            >
              <div className="relative">
                <Icon size={20} />
                {item.pulse && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#AA0000] rounded-full animate-ping"></span>
                )}
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider">{item.label}</span>
            </Link>
          );
        })}

        {/* Center Shorts Button */}
        <button
          onClick={() => setIsShortsOpen(true)}
          className="flex flex-col items-center gap-1 -mt-5 group"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#AA0000] to-[#FF3333] flex items-center justify-center text-white shadow-lg shadow-[#AA0000]/40 group-hover:scale-105 transition-transform">
            <Film size={22} />
          </div>
          <span className="text-[9px] uppercase font-black tracking-widest text-neutral-300">Shorts</span>
        </button>

        {navItems.slice(2).map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
                isActive ? "text-[#AA0000] font-black" : "text-neutral-400 hover:text-white"
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px] uppercase font-bold tracking-wider">{item.label}</span>
            </Link>
          );
        })}
      </div>

      <ShortsReelsModal isOpen={isShortsOpen} onClose={() => setIsShortsOpen(false)} />
    </>
  );
}
