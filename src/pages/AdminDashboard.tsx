import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  PenTool, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Eye, 
  Radio, 
  FileText, 
  Users, 
  Languages, 
  Mic, 
  MicOff, 
  MapPin, 
  AlertTriangle,
  Send,
  Plus,
  RefreshCw,
  Award
} from "lucide-react";
import { useNews } from "../context/NewsContext";
import { useAuth } from "../context/AuthContext";
import { generateHeadline, summarizeArticle, factCheckArticle, translateText } from "../lib/gemini";
import { NewsArticle, UserRole } from "../types";

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { 
    articles, 
    publishedArticles, 
    pendingArticles, 
    createArticle, 
    updateArticleStatus, 
    deleteArticle,
    triggerEmergencyAlert 
  } = useNews();
  const { profile, switchRole, isAdmin, isReporter } = useAuth();

  const [activeTab, setActiveTab] = useState<'analytics' | 'write' | 'review' | 'alerts' | 'articles'>('write');

  // Form State for new article
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState<NewsArticle['category']>("nepal");
  const [imageUrl, setImageUrl] = useState("https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&q=80");
  const [videoUrl, setVideoUrl] = useState("");
  const [location, setLocation] = useState("Kathmandu, Nepal");
  const [isBreaking, setIsBreaking] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [tags, setTags] = useState("RGNN, Breaking, SouthAsia");

  // AI Assistance states
  const [loadingAiHeadline, setLoadingAiHeadline] = useState(false);
  const [suggestedHeadlines, setSuggestedHeadlines] = useState<string[]>([]);
  const [loadingAiSummary, setLoadingAiSummary] = useState(false);
  const [factCheckResult, setFactCheckResult] = useState<any>(null);
  const [loadingFactCheck, setLoadingFactCheck] = useState(false);
  const [isDictating, setIsDictating] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState(false);

  // Emergency Siren Message
  const [urgentAlertMessage, setUrgentAlertMessage] = useState("");

  // Voice to text dictation for field journalists
  const toggleVoiceDictation = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (isDictating) {
      setIsDictating(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsDictating(true);
    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join("");
      setContent(prev => prev + " " + transcript);
    };
    recognition.onerror = () => setIsDictating(false);
    recognition.onend = () => setIsDictating(false);
    recognition.start();
  };

  // AI Headline Generator
  const handleGenerateHeadline = async () => {
    if (!content.trim()) {
      alert("Please enter article text content first so AI can craft headlines.");
      return;
    }
    setLoadingAiHeadline(true);
    try {
      const res = await generateHeadline(content);
      if (res.headline) {
        setTitle(res.headline);
      }
      if (res.alternativeHeadlines) {
        setSuggestedHeadlines(res.alternativeHeadlines);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAiHeadline(false);
    }
  };

  // AI Summarizer
  const handleGenerateSummary = async () => {
    if (!content.trim()) {
      alert("Please enter article content first.");
      return;
    }
    setLoadingAiSummary(true);
    try {
      const res = await summarizeArticle(content);
      if (res.brief) {
        setSummary(res.brief);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAiSummary(false);
    }
  };

  // AI Fact Checker
  const handleFactCheck = async () => {
    if (!content.trim() || !title.trim()) {
      alert("Please provide both headline and content for verification.");
      return;
    }
    setLoadingFactCheck(true);
    try {
      const res = await factCheckArticle(title, content);
      setFactCheckResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingFactCheck(false);
    }
  };

  // Submit Article
  const handleSubmitArticle = async (status: 'draft' | 'pending' | 'published') => {
    if (!title.trim() || !content.trim()) {
      alert("Please provide headline and content.");
      return;
    }

    await createArticle({
      title,
      content,
      summary,
      category,
      imageUrl,
      videoUrl,
      location,
      isBreaking,
      isFeatured,
      tags: tags.split(",").map(t => t.trim()),
      status
    });

    setPublishedSuccess(true);
    setTimeout(() => setPublishedSuccess(false), 4000);

    // Reset Form
    setTitle("");
    setContent("");
    setSummary("");
    setFactCheckResult(null);
    setSuggestedHeadlines([]);
  };

  const handleBroadcastEmergency = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urgentAlertMessage.trim()) return;
    triggerEmergencyAlert(urgentAlertMessage.trim());
    setUrgentAlertMessage("");
    alert("Emergency breaking alert broadcasted to all connected devices!");
  };

  const totalViews = publishedArticles.reduce((acc, a) => acc + (a.views || 0), 0);

  return (
    <div className="container mx-auto px-4 max-w-7xl py-8 space-y-8">
      {/* Dashboard Top Header */}
      <div className="bg-[#1a1a1a] rounded-3xl p-6 md:p-8 border border-white/10 flex flex-wrap justify-between items-center gap-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#AA0000] flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-[#AA0000]/30">
            RGNN
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white italic">
                Newsroom & Editorial Studio
              </h1>
              <span className="bg-[#AA0000] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded font-mono">
                {profile?.role || 'Admin'}
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-mono mt-1">
              Journalist: <span className="text-white font-bold">{profile?.displayName || 'Rahul Prasad Rajbanshi'}</span> • Badge: <span className="text-yellow-400 font-bold">{profile?.pressBadgeNumber || 'RGNN-PRESS-001'}</span>
            </p>
          </div>
        </div>

        {/* Role Switcher for seamless test review */}
        <div className="flex items-center gap-2 bg-black/50 p-2 rounded-2xl border border-white/10">
          <span className="text-[11px] text-neutral-400 uppercase font-mono px-2">Role:</span>
          {(['admin', 'editor', 'reporter'] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => switchRole(r)}
              className={`px-3 py-1 rounded-xl text-xs font-bold uppercase transition ${
                profile?.role === r ? "bg-[#AA0000] text-white" : "text-neutral-400 hover:text-white"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Analytics Counter Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#141414] rounded-2xl p-5 border border-white/10">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-bold uppercase">
            <span>Total Reads</span>
            <Eye size={16} className="text-[#AA0000]" />
          </div>
          <p className="text-2xl font-black text-white mt-2">{totalViews.toLocaleString()}</p>
          <span className="text-[10px] text-emerald-400 font-mono">+18.4% this week</span>
        </div>

        <div className="bg-[#141414] rounded-2xl p-5 border border-white/10">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-bold uppercase">
            <span>Published Stories</span>
            <FileText size={16} className="text-blue-400" />
          </div>
          <p className="text-2xl font-black text-white mt-2">{publishedArticles.length}</p>
          <span className="text-[10px] text-neutral-400 font-mono">Live on network</span>
        </div>

        <div className="bg-[#141414] rounded-2xl p-5 border border-white/10">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-bold uppercase">
            <span>Pending Review</span>
            <AlertTriangle size={16} className="text-yellow-400" />
          </div>
          <p className="text-2xl font-black text-white mt-2">{pendingArticles.length}</p>
          <span className="text-[10px] text-yellow-400 font-mono">Awaiting Chief Approval</span>
        </div>

        <div className="bg-[#141414] rounded-2xl p-5 border border-white/10">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-bold uppercase">
            <span>Live Satellite Viewers</span>
            <Radio size={16} className="text-rose-500 animate-pulse" />
          </div>
          <p className="text-2xl font-black text-white mt-2">14,820</p>
          <span className="text-[10px] text-emerald-400 font-mono">4 Global Studios</span>
        </div>
      </div>

      {/* Studio Navigation Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-2 overflow-x-auto">
        {[
          { id: 'write', label: 'Write & Publish Article', icon: PenTool },
          { id: 'review', label: `Editorial Approval (${pendingArticles.length})`, icon: ShieldAlert },
          { id: 'articles', label: `All Articles (${articles.length})`, icon: FileText },
          { id: 'alerts', label: 'Emergency Siren Broadcaster', icon: Radio },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition ${
                activeTab === tab.id
                  ? 'bg-[#AA0000] text-white shadow-lg shadow-[#AA0000]/20'
                  : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: WRITE & PUBLISH ARTICLE */}
      {activeTab === 'write' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Article Inputs (8 Cols) */}
          <div className="lg:col-span-8 bg-[#141414] rounded-3xl p-6 md:p-8 border border-white/10 space-y-6">
            {publishedSuccess && (
              <div className="bg-emerald-950 border border-emerald-500/50 text-emerald-300 p-4 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 size={16} /> Article successfully published to RGNN Global network and synced with Firestore!
              </div>
            )}

            {/* Title & AI Headline Suggester */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                  Headline Title *
                </label>
                <button
                  type="button"
                  onClick={handleGenerateHeadline}
                  disabled={loadingAiHeadline}
                  className="flex items-center gap-1.5 text-xs font-bold text-yellow-400 bg-yellow-950/40 hover:bg-yellow-950 border border-yellow-500/30 px-3 py-1 rounded-full transition"
                >
                  <Sparkles size={13} />
                  <span>{loadingAiHeadline ? "Generating..." : "AI Catchy Headline"}</span>
                </button>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Historic Himalayan Summit: Leaders Sign Landmark Regional Green Energy Pact"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-base font-bold text-white placeholder-neutral-500 focus:outline-none focus:border-[#AA0000]"
              />

              {suggestedHeadlines.length > 0 && (
                <div className="pt-2 space-y-1">
                  <span className="text-[10px] font-bold text-yellow-400 uppercase">AI Alternative Suggestions (Click to apply):</span>
                  {suggestedHeadlines.map((sh, idx) => (
                    <div
                      key={idx}
                      onClick={() => setTitle(sh)}
                      className="text-xs text-neutral-300 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-[#AA0000]/20 cursor-pointer border border-white/5 transition"
                    >
                      {sh}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Article Content & Voice-to-Text */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                  Article Body Content *
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleVoiceDictation}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition ${
                      isDictating ? 'bg-red-600 text-white animate-pulse' : 'bg-white/10 text-neutral-300 hover:text-white'
                    }`}
                  >
                    {isDictating ? <MicOff size={13} /> : <Mic size={13} />}
                    <span>{isDictating ? "Dictating..." : "Voice Dictate"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleGenerateSummary}
                    disabled={loadingAiSummary}
                    className="flex items-center gap-1.5 text-xs font-bold text-purple-300 bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 px-3 py-1 rounded-full transition"
                  >
                    <Sparkles size={13} />
                    <span>{loadingAiSummary ? "Summarizing..." : "AI Summarize"}</span>
                  </button>
                </div>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write full investigative report, quotes, context, and data..."
                rows={8}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#AA0000] leading-relaxed"
              />
            </div>

            {/* Article Summary */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                Executive Brief Summary
              </label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="2-sentence executive summary for homepage and breaking alerts..."
                rows={2}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#AA0000]"
              />
            </div>

            {/* AI Fact-Checking Suite */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-wider text-neutral-300 flex items-center gap-2">
                  <ShieldAlert size={16} className="text-[#AA0000]" /> RGNN AI Fact-Check & Integrity Suite
                </span>
                <button
                  type="button"
                  onClick={handleFactCheck}
                  disabled={loadingFactCheck}
                  className="bg-white/10 hover:bg-[#AA0000] text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase transition"
                >
                  {loadingFactCheck ? "Analyzing Credibility..." : "Run Fact Check"}
                </button>
              </div>

              {factCheckResult && (
                <div className="bg-neutral-900 border border-white/15 rounded-2xl p-4 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-neutral-400 uppercase">Credibility Score</span>
                    <span className={`font-mono text-sm font-black px-2.5 py-0.5 rounded ${
                      factCheckResult.credibilityScore >= 80 ? 'bg-emerald-950 text-emerald-400' : 'bg-yellow-950 text-yellow-400'
                    }`}>
                      {factCheckResult.credibilityScore} / 100
                    </span>
                  </div>
                  <p className="text-white font-medium">{factCheckResult.analysis}</p>
                  {factCheckResult.redFlags?.length > 0 && (
                    <div className="pt-2 border-t border-white/10">
                      <span className="text-[10px] text-yellow-400 uppercase font-bold">Points for verification:</span>
                      <ul className="list-disc list-inside text-neutral-400 mt-1 space-y-0.5">
                        {factCheckResult.redFlags.map((rf: string, i: number) => (
                          <li key={i}>{rf}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Publishing Controls & Metadata Sidebar (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#141414] rounded-3xl p-6 border border-white/10 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-white border-b border-white/10 pb-3">
                Publishing Controls
              </h3>

              {/* Category */}
              <div>
                <label className="text-[11px] font-bold text-neutral-400 uppercase block mb-1">
                  News Category Desk
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-white/5 text-xs text-white border border-white/10 rounded-xl p-2.5 focus:outline-none focus:border-[#AA0000]"
                >
                  <option value="nepal">Nepal & South Asia</option>
                  <option value="world">World Affairs</option>
                  <option value="politics">Politics</option>
                  <option value="business">Business & Economy</option>
                  <option value="tech">Technology & AI</option>
                  <option value="sports">Sports</option>
                  <option value="health">Health & Science</option>
                  <option value="culture">Rajbanshi Culture & Arts</option>
                </select>
              </div>

              {/* Location Geotag */}
              <div>
                <label className="text-[11px] font-bold text-neutral-400 uppercase block mb-1">
                  Dateline Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-white/5 text-xs text-white border border-white/10 rounded-xl p-2.5 focus:outline-none focus:border-[#AA0000]"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="text-[11px] font-bold text-neutral-400 uppercase block mb-1">
                  Thumbnail Image URL
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-white/5 text-xs text-white border border-white/10 rounded-xl p-2.5 focus:outline-none focus:border-[#AA0000]"
                />
              </div>

              {/* Flags */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBreaking}
                    onChange={(e) => setIsBreaking(e.target.checked)}
                    className="accent-[#AA0000] w-4 h-4 rounded"
                  />
                  <span>Mark as Breaking News Ticker</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="accent-[#AA0000] w-4 h-4 rounded"
                  />
                  <span>Feature in Hero Slider</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="space-y-2 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => handleSubmitArticle('published')}
                  className="w-full bg-[#AA0000] hover:bg-[#880000] text-white font-bold py-3 rounded-2xl text-xs uppercase tracking-wider transition shadow-lg shadow-[#AA0000]/30"
                >
                  Publish Immediately (Live)
                </button>

                <button
                  type="button"
                  onClick={() => handleSubmitArticle('pending')}
                  className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-2.5 rounded-2xl text-xs uppercase tracking-wider transition"
                >
                  Submit for Editorial Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EDITORIAL APPROVAL */}
      {activeTab === 'review' && (
        <div className="bg-[#141414] rounded-3xl p-6 md:p-8 border border-white/10 space-y-6">
          <h2 className="text-base font-black uppercase text-white tracking-wider flex items-center gap-2">
            <ShieldAlert size={18} className="text-[#AA0000]" /> Pending Editorial Verification Queue
          </h2>

          {pendingArticles.length === 0 ? (
            <div className="p-12 text-center text-neutral-500 bg-neutral-900 rounded-2xl">
              <CheckCircle2 size={32} className="mx-auto text-emerald-400 mb-2" />
              <p className="text-sm font-bold text-white">All reporter submissions have been reviewed!</p>
              <p className="text-xs mt-1">New field submissions will appear here for verification.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingArticles.map((art) => (
                <div
                  key={art.id}
                  className="p-5 bg-neutral-900 rounded-2xl border border-white/10 flex flex-wrap justify-between items-center gap-4"
                >
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2 text-[10px] text-[#AA0000] font-black uppercase">
                      <span>{art.category}</span>
                      <span>•</span>
                      <span>Reporter: {art.authorName}</span>
                    </div>
                    <h4 className="text-base font-bold text-white">{art.title}</h4>
                    <p className="text-xs text-neutral-400 line-clamp-2">{art.content}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateArticleStatus(art.id, 'published')}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase transition flex items-center gap-1.5"
                    >
                      <CheckCircle2 size={15} /> Approve & Publish
                    </button>
                    <button
                      onClick={() => updateArticleStatus(art.id, 'draft')}
                      className="bg-white/10 hover:bg-rose-950 text-rose-300 px-4 py-2 rounded-xl text-xs font-bold uppercase transition flex items-center gap-1.5"
                    >
                      <XCircle size={15} /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ALL ARTICLES */}
      {activeTab === 'articles' && (
        <div className="bg-[#141414] rounded-3xl p-6 md:p-8 border border-white/10 space-y-6">
          <h2 className="text-base font-black uppercase text-white tracking-wider">
            All Network Articles ({articles.length})
          </h2>
          <div className="space-y-3">
            {articles.map((art) => (
              <div
                key={art.id}
                className="p-4 bg-neutral-900 rounded-2xl border border-white/5 flex justify-between items-center gap-4"
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2 text-[10px] font-mono">
                    <span className="bg-[#AA0000] text-white px-2 py-0.2 rounded uppercase font-black">
                      {art.category}
                    </span>
                    <span className="text-neutral-400">{art.status.toUpperCase()}</span>
                    <span className="text-neutral-500">• {new Date(art.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white line-clamp-1">{art.title}</h4>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    to={`/article/${art.id}`}
                    className="p-2 bg-white/5 hover:bg-white/20 text-neutral-300 rounded-xl transition"
                    title="View Article"
                  >
                    <Eye size={16} />
                  </Link>
                  <button
                    onClick={() => deleteArticle(art.id)}
                    className="p-2 bg-white/5 hover:bg-rose-900 text-rose-400 rounded-xl transition"
                    title="Delete Article"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: EMERGENCY SIREN BROADCASTER */}
      {activeTab === 'alerts' && (
        <div className="bg-gradient-to-br from-red-950/60 to-neutral-950 rounded-3xl p-6 md:p-8 border border-red-500/40 space-y-6">
          <div className="flex items-center gap-3">
            <Radio size={24} className="text-red-500 animate-ping" />
            <div>
              <h2 className="text-lg font-black uppercase text-white tracking-tight">
                Global Emergency Breaking News Broadcaster
              </h2>
              <p className="text-xs text-red-200">
                Trigger real-time emergency banners & audio sirens across all connected reader sessions.
              </p>
            </div>
          </div>

          <form onSubmit={handleBroadcastEmergency} className="space-y-4">
            <input
              type="text"
              value={urgentAlertMessage}
              onChange={(e) => setUrgentAlertMessage(e.target.value)}
              placeholder="e.g. URGENT: Major earthquake reported near Eastern border, relief teams deployed."
              className="w-full bg-black/60 border border-red-500/50 rounded-2xl p-4 text-sm text-white placeholder-red-300/50 focus:outline-none focus:border-red-400"
            />
            <button
              type="submit"
              disabled={!urgentAlertMessage.trim()}
              className="bg-[#AA0000] hover:bg-red-600 disabled:opacity-40 text-white font-black px-6 py-3 rounded-2xl text-xs uppercase tracking-wider transition flex items-center gap-2 shadow-xl shadow-red-900/50"
            >
              <Radio size={16} />
              <span>Broadcast Emergency Siren</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
