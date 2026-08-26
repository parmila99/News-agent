import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
  Clock, 
  User, 
  MapPin, 
  Bookmark, 
  Heart, 
  Share2, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Languages, 
  QrCode, 
  MessageSquare, 
  Send, 
  ArrowLeft,
  CheckCircle,
  Copy,
  Layers
} from "lucide-react";
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy 
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useNews } from "../context/NewsContext";
import { useAuth } from "../context/AuthContext";
import { summarizeArticle, translateText } from "../lib/gemini";
import NewsCard from "../components/NewsCard";
import Sidebar from "../components/Sidebar";

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const { publishedArticles, bookmarks, toggleBookmark, likeArticle, speakText, stopSpeaking, isSpeaking } = useNews();
  const { user, profile } = useAuth();

  const article = publishedArticles.find((a) => a.id === id);

  // AI Summary State
  const [summaryData, setSummaryData] = useState<{ brief: string; keyTakeaways: string[] } | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  // AI Translation State
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);
  const [loadingTranslation, setLoadingTranslation] = useState(false);
  const [activeLang, setActiveLang] = useState<string>("en");

  // QR Modal
  const [showQrModal, setShowQrModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Comments State
  const [comments, setComments] = useState<any[]>([
    {
      id: "c1",
      userName: "Sujan Rajbanshi",
      content: "Crucial and timely report. Regional cross-border cooperation is the only sustainable way forward for our mountain ecosystems.",
      createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString()
    },
    {
      id: "c2",
      userName: "Dr. Arvind Mehta",
      content: "Great journalistic depth from RGNN. The technical specifics regarding the regional grid interconnects are spot on.",
      createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString()
    }
  ]);
  const [newComment, setNewComment] = useState("");

  // Sync comments with Firestore subcollection
  useEffect(() => {
    if (!id) return;
    try {
      const commentsRef = collection(db, 'articles', id, 'comments');
      const unsubscribe = onSnapshot(commentsRef, (snapshot) => {
        if (!snapshot.empty) {
          const loaded: any[] = [];
          snapshot.forEach((d) => loaded.push({ id: d.id, ...d.data() }));
          setComments(loaded);
        }
      }, (err) => {
        console.warn('Comments Firestore snapshot notice:', err);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn('Comments listener fallback:', e);
    }
  }, [id]);

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-20 text-center text-white">
        <h2 className="text-2xl font-bold">Article not found</h2>
        <p className="text-neutral-400 mt-2">The requested story could not be located or may have been updated.</p>
        <Link to="/" className="inline-block mt-4 bg-[#AA0000] text-white px-6 py-2 rounded-full font-bold text-xs uppercase">
          Back to Homepage
        </Link>
      </div>
    );
  }

  const isBookmarked = bookmarks.includes(article.id);

  const handleGenerateSummary = async () => {
    if (summaryData) return;
    setLoadingSummary(true);
    try {
      const res = await summarizeArticle(article.content, i18n.language);
      setSummaryData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleTranslate = async (lang: string) => {
    setActiveLang(lang);
    if (lang === 'en') {
      setTranslatedContent(null);
      return;
    }
    setLoadingTranslation(true);
    try {
      const res = await translateText(article.content, lang);
      setTranslatedContent(res.translatedText);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingTranslation(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const commentObj = {
      articleId: article.id,
      userId: user?.uid || 'guest-' + Date.now(),
      userName: profile?.displayName || 'Rahul Prasad Rajbanshi',
      userPhoto: profile?.photoURL || '',
      content: newComment.trim(),
      createdAt: new Date().toISOString()
    };

    setComments(prev => [commentObj, ...prev]);
    setNewComment("");

    try {
      await addDoc(collection(db, 'articles', article.id, 'comments'), commentObj);
    } catch (err) {
      console.warn('Comment persisted in local state:', err);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const relatedArticles = publishedArticles
    .filter((a) => a.id !== article.id && a.category === article.category)
    .slice(0, 3);

  const currentUrl = window.location.href;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(currentUrl)}`;

  return (
    <div className="container mx-auto px-4 max-w-7xl py-8 space-y-10">
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-white transition"
      >
        <ArrowLeft size={16} /> Back to Wire
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Article Column (8 Cols) */}
        <article className="lg:col-span-8 space-y-8">
          {/* Header Metadata */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="bg-[#AA0000] text-white font-black uppercase tracking-widest px-3 py-1 rounded-md text-[10px]">
                {article.category}
              </span>
              {article.isBreaking && (
                <span className="bg-yellow-400 text-black font-black uppercase tracking-widest px-2 py-1 rounded-md text-[10px] animate-pulse">
                  Breaking
                </span>
              )}
              {article.location && (
                <span className="text-neutral-400 flex items-center gap-1 font-mono text-[11px] bg-white/5 px-2.5 py-1 rounded">
                  <MapPin size={12} className="text-[#AA0000]" /> {article.location}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-white leading-tight tracking-tight uppercase">
              {article.title}
            </h1>

            {article.summary && (
              <p className="text-base sm:text-lg text-neutral-300 font-serif italic border-l-2 border-[#AA0000] pl-4 leading-relaxed">
                {article.summary}
              </p>
            )}

            {/* Author & Publication Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-white/10 text-xs text-neutral-400">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#AA0000] flex items-center justify-center font-bold text-white uppercase text-sm">
                  {article.authorName[0]}
                </div>
                <div>
                  <p className="font-bold text-white text-sm leading-none">{article.authorName}</p>
                  <p className="text-[11px] text-neutral-500 font-mono mt-0.5">{article.authorRole || 'Correspondent'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 font-mono text-[11px]">
                <Clock size={14} />
                <span>{new Date(article.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>
              </div>
            </div>

            {/* Audio Reader & AI Toolbar */}
            <div className="bg-[#1a1a1a] rounded-2xl p-4 border border-white/10 flex flex-wrap items-center justify-between gap-3">
              {/* TTS Listen button */}
              <button
                onClick={() => {
                  if (isSpeaking) stopSpeaking();
                  else speakText(`${article.title}. ${article.content}`);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                  isSpeaking ? 'bg-amber-500 text-black animate-pulse' : 'bg-white/10 text-white hover:bg-[#AA0000]'
                }`}
              >
                {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
                <span>{isSpeaking ? "Stop Audio Reader" : t('listen_audio')}</span>
              </button>

              {/* AI Summary Trigger */}
              <button
                onClick={handleGenerateSummary}
                disabled={loadingSummary}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/30 hover:bg-purple-800 text-purple-200 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition"
              >
                <Sparkles size={16} className="text-yellow-400" />
                <span>{loadingSummary ? "Generating AI Brief..." : t('ai_brief')}</span>
              </button>

              {/* Language Switcher */}
              <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10 text-[11px]">
                <Languages size={14} className="text-neutral-400" />
                <span className="text-neutral-400 font-mono">Translate:</span>
                {['en', 'ne', 'hi', 'bn', 'rajbanshi'].map((l) => (
                  <button
                    key={l}
                    onClick={() => handleTranslate(l)}
                    className={`px-2 py-0.5 rounded font-black uppercase text-[10px] transition ${
                      activeLang === l ? 'bg-[#AA0000] text-white' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Summary Box (if generated) */}
            {summaryData && (
              <div className="bg-gradient-to-br from-[#1a1325] to-[#121212] border border-purple-500/40 rounded-2xl p-6 text-white space-y-3 animate-in fade-in duration-300">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-purple-400 tracking-wider">
                  <Sparkles size={16} className="text-yellow-400" />
                  <span>RGNN AI Executive Brief</span>
                </div>
                <p className="text-sm font-medium text-purple-100 leading-relaxed">
                  {summaryData.brief}
                </p>
                {summaryData.keyTakeaways && (
                  <ul className="space-y-1.5 pt-2 border-t border-purple-500/20 text-xs text-neutral-300 list-disc list-inside">
                    {summaryData.keyTakeaways.map((takeaway, i) => (
                      <li key={i}>{takeaway}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Hero Feature Image */}
          <div className="rounded-2xl overflow-hidden border border-white/10 bg-neutral-900 aspect-video">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Text Content */}
          <div className="prose prose-invert max-w-none text-neutral-200 text-base md:text-lg leading-relaxed space-y-6">
            {loadingTranslation ? (
              <div className="p-8 text-center bg-white/5 rounded-2xl text-sm italic text-neutral-400 animate-pulse">
                Translating article with RGNN AI Translation Engine...
              </div>
            ) : translatedContent ? (
              <div className="whitespace-pre-line font-serif">
                {translatedContent}
              </div>
            ) : (
              <div className="whitespace-pre-line font-serif">
                {article.content}
              </div>
            )}
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
              {article.tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-white/5 hover:bg-[#AA0000]/20 text-neutral-400 hover:text-white px-3 py-1 rounded-full text-xs font-mono transition cursor-pointer border border-white/5"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Social Engagement & Share Bar */}
          <div className="bg-[#1a1a1a] rounded-2xl p-5 border border-white/10 flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => likeArticle(article.id)}
                className="flex items-center gap-2 bg-white/5 hover:bg-[#AA0000] text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow"
              >
                <Heart size={16} className={article.likes > 0 ? "fill-white text-[#AA0000]" : ""} />
                <span>{article.likes} Likes</span>
              </button>

              <button
                onClick={() => toggleBookmark(article.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                  isBookmarked ? 'bg-[#AA0000] text-white' : 'bg-white/5 hover:bg-white/10 text-neutral-300'
                }`}
              >
                <Bookmark size={16} className={isBookmarked ? "fill-white" : ""} />
                <span>{isBookmarked ? "Saved" : "Bookmark"}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="p-2.5 bg-white/5 hover:bg-white/10 text-neutral-300 rounded-xl transition flex items-center gap-1.5 text-xs font-bold"
                title="Copy Link"
              >
                {copiedLink ? <CheckCircle size={16} className="text-emerald-400" /> : <Copy size={16} />}
                <span>{copiedLink ? "Copied!" : "Copy"}</span>
              </button>

              <button
                onClick={() => setShowQrModal(true)}
                className="p-2.5 bg-white/5 hover:bg-white/10 text-neutral-300 rounded-xl transition flex items-center gap-1.5 text-xs font-bold"
                title="QR Code Share"
              >
                <QrCode size={16} />
                <span>QR</span>
              </button>

              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-[#1DA1F2]/20 hover:bg-[#1DA1F2] text-white rounded-xl transition text-xs font-bold"
              >
                X / Twitter
              </a>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(article.title + ' ' + currentUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-emerald-600/20 hover:bg-emerald-600 text-white rounded-xl transition text-xs font-bold"
              >
                WhatsApp
              </a>
            </div>
          </div>

          {/* Comments Section */}
          <div className="space-y-6 pt-6 border-t border-white/10">
            <h3 className="text-lg font-black uppercase text-white tracking-tight flex items-center gap-2">
              <MessageSquare size={18} className="text-[#AA0000]" />
              {t('comments')} ({comments.length})
            </h3>

            {/* Post Comment Form */}
            <form onSubmit={handleAddComment} className="space-y-3">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your journalistic feedback or verified perspective..."
                rows={3}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-2xl p-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#AA0000] transition"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="bg-[#AA0000] hover:bg-[#880000] disabled:opacity-40 text-white font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider transition flex items-center gap-2 shadow"
                >
                  <Send size={14} />
                  <span>Post Comment</span>
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((c) => (
                <div key={c.id} className="bg-[#1a1a1a] rounded-2xl p-4 border border-white/5 space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#AA0000] flex items-center justify-center font-bold text-white text-xs uppercase">
                        {c.userName ? c.userName[0] : 'R'}
                      </div>
                      <span className="font-bold text-white text-xs">{c.userName}</span>
                    </div>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed pl-9">
                    {c.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </article>

        {/* Sidebar Column (4 Cols) */}
        <div className="lg:col-span-4 space-y-8">
          <Sidebar />

          {/* Related Stories */}
          {relatedArticles.length > 0 && (
            <div className="bg-[#1a1a1a] rounded-2xl p-5 border border-white/10 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#AA0000] border-b border-white/5 pb-2">
                Related Stories
              </h3>
              <div className="space-y-3">
                {relatedArticles.map((rel) => (
                  <NewsCard key={rel.id} article={rel} variant="compact" />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* QR Code Sharing Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#141414] border border-white/10 rounded-3xl p-6 max-w-sm w-full text-center text-white space-y-4">
            <h3 className="font-black text-sm uppercase tracking-wider">Scan QR Code to Read on Mobile</h3>
            <div className="bg-white p-4 rounded-2xl inline-block shadow-xl">
              <img src={qrUrl} alt="Article QR" className="w-48 h-48 mx-auto" />
            </div>
            <p className="text-xs text-neutral-400">Share this story instantly with friends or scan with your smartphone camera.</p>
            <button
              onClick={() => setShowQrModal(false)}
              className="w-full bg-white/10 hover:bg-[#AA0000] text-white py-2 rounded-xl text-xs font-bold uppercase transition"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
