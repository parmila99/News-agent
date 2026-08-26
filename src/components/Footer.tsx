import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Radio, 
  ShieldCheck, 
  Send, 
  Heart,
  FileText
} from "lucide-react";
import React, { useState } from "react";

export default function Footer() {
  const { t, i18n } = useTranslation();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubscribed(true);
    setNewsletterEmail("");
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
    <footer className="bg-black text-neutral-400 text-xs border-t border-white/10 pt-16 pb-24 lg:pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Top Newsletter & Network Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="bg-[#AA0000] text-white px-3 py-1.5 rounded-xl font-black text-xl tracking-tighter">
                RGNN
              </div>
              <div>
                <h3 className="text-base font-black text-white tracking-tight uppercase italic leading-none">
                  RAJBANSHI GLOBAL
                </h3>
                <p className="text-[8px] text-neutral-400 font-mono tracking-widest uppercase">
                  NEWS NETWORK
                </p>
              </div>
            </Link>
            <p className="text-neutral-400 leading-relaxed">
              An international multi-language independent news organization delivering verified investigative reporting, regional South Asian affairs, and cultural heritage journalism.
            </p>
            <div className="space-y-1 text-[11px] font-mono text-neutral-400">
              <p className="flex items-center gap-2">
                <MapPin size={13} className="text-[#AA0000]" /> Kathmandu • New York • Geneva
              </p>
              <p className="flex items-center gap-2">
                <Mail size={13} className="text-[#AA0000]" /> editorial@rgnn.media
              </p>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-wider mb-4 border-l-2 border-[#AA0000] pl-2.5">
              News Desks
            </h4>
            <ul className="grid grid-cols-2 gap-2">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    to={`/category/${c.slug}`}
                    className="hover:text-white transition uppercase font-bold text-[11px]"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/live" className="text-[#AA0000] hover:underline font-bold text-[11px] uppercase flex items-center gap-1">
                  <Radio size={12} className="animate-pulse" /> Live TV
                </Link>
              </li>
            </ul>
          </div>

          {/* Editorial Standards & Integrity */}
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-wider mb-4 border-l-2 border-[#AA0000] pl-2.5">
              Integrity & Standards
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li className="flex items-center gap-1.5 hover:text-white transition cursor-pointer">
                <ShieldCheck size={13} className="text-emerald-400" /> Fact-Checking Policy & Verification
              </li>
              <li className="flex items-center gap-1.5 hover:text-white transition cursor-pointer">
                <FileText size={13} className="text-blue-400" /> Corrections & Editorial Code of Ethics
              </li>
              <li className="hover:text-white transition cursor-pointer">
                Investigative Whistleblower Security
              </li>
              <li className="hover:text-white transition cursor-pointer">
                Rajbanshi Cultural Archive Governance
              </li>
              <li>
                <Link to="/admin" className="text-white/80 hover:text-[#AA0000] font-bold">
                  Journalist & Reporter Portal →
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-wider mb-4 border-l-2 border-[#AA0000] pl-2.5">
              Global News Wire
            </h4>
            <p className="text-[11px] text-neutral-400 mb-3">
              Receive breaking news alerts and daily morning briefs directly in your inbox.
            </p>
            {subscribed ? (
              <div className="bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 p-3 rounded-xl text-center text-xs font-bold">
                ✓ Subscribed to RGNN Daily Brief!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#AA0000]"
                />
                <button
                  type="submit"
                  className="w-full bg-[#AA0000] hover:bg-[#880000] text-white font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
                >
                  <Send size={13} />
                  <span>Subscribe to Wire</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Attribution & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-neutral-400">
          <div className="text-center md:text-left space-y-1">
            <p className="font-bold text-neutral-300">
              © {new Date().getFullYear()} Rajbanshi Global News Network (RGNN). All Rights Reserved.
            </p>
            <p className="text-[10px] text-neutral-400 font-mono">
              Chief Editor & Founder: <span className="text-white font-bold">Rahul Prasad Rajbanshi</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span className="hover:text-white cursor-pointer transition">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer transition">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer transition">Sitemap</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer transition">Advertise with RGNN</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
