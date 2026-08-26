import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  addDoc, 
  query, 
  orderBy, 
  getDocs 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { NewsArticle, ArticleComment, NewsPoll } from '../types';
import { SEED_ARTICLES } from '../data/seedNews';
import { useAuth } from './AuthContext';

interface NewsContextType {
  articles: NewsArticle[];
  loading: boolean;
  publishedArticles: NewsArticle[];
  pendingArticles: NewsArticle[];
  breakingNews: NewsArticle[];
  featuredArticles: NewsArticle[];
  bookmarks: string[];
  toggleBookmark: (articleId: string) => void;
  likeArticle: (articleId: string) => Promise<void>;
  createArticle: (data: Partial<NewsArticle>) => Promise<string>;
  updateArticleStatus: (id: string, status: 'draft' | 'pending' | 'published') => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  emergencyAlert: string | null;
  triggerEmergencyAlert: (msg: string) => void;
  clearEmergencyAlert: () => void;
  soundAlertsEnabled: boolean;
  setSoundAlertsEnabled: (enabled: boolean) => void;
  playAlertSound: () => void;
  speakText: (text: string, lang?: string) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
  activePoll: NewsPoll;
  votePoll: (optionId: string) => void;
}

const DEFAULT_POLL: NewsPoll = {
  id: 'poll-001',
  question: 'What is the most pressing priority for South Asian economic cooperation in 2026?',
  options: [
    { id: 'opt-1', text: 'Cross-border Hydro & Solar Grid Interconnection', votes: 1420 },
    { id: 'opt-2', text: 'Digital Trade & Regional Tech Innovation Hubs', votes: 980 },
    { id: 'opt-3', text: 'Cultural Heritage Tourism & Free Visa Movement', votes: 610 },
    { id: 'opt-4', text: 'Agricultural Supply Chain & Climate Resilience', votes: 850 }
  ],
  totalVotes: 3860,
  status: 'active',
  createdAt: new Date().toISOString()
};

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export const NewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile } = useAuth();
  const [articles, setArticles] = useState<NewsArticle[]>(SEED_ARTICLES);
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('rgnn_bookmarks');
      return saved ? JSON.parse(saved) : ['art-001', 'art-003'];
    } catch {
      return ['art-001', 'art-003'];
    }
  });
  const [emergencyAlert, setEmergencyAlert] = useState<string | null>(null);
  const [soundAlertsEnabled, setSoundAlertsEnabled] = useState<boolean>(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activePoll, setActivePoll] = useState<NewsPoll>(DEFAULT_POLL);

  // Firestore Sync
  useEffect(() => {
    let unsubscribe: () => void;
    try {
      const articlesRef = collection(db, 'articles');
      unsubscribe = onSnapshot(articlesRef, (snapshot) => {
        if (!snapshot.empty) {
          const loaded: NewsArticle[] = [];
          snapshot.forEach((d) => {
            loaded.push({ id: d.id, ...(d.data() as any) });
          });
          setArticles(loaded);
        } else {
          // Initialize Firestore with Seed Articles if collection is empty
          SEED_ARTICLES.forEach(async (item) => {
            try {
              await setDoc(doc(db, 'articles', item.id), item);
            } catch (e) {
              console.warn('Seed sync notice:', e);
            }
          });
          setArticles(SEED_ARTICLES);
        }
        setLoading(false);
      }, (err) => {
        console.warn('Firestore articles snapshot fallback to seed:', err);
        setArticles(SEED_ARTICLES);
        setLoading(false);
      });
    } catch (err) {
      console.warn('Firestore listener fallback:', err);
      setArticles(SEED_ARTICLES);
      setLoading(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Save Bookmarks
  const toggleBookmark = (articleId: string) => {
    setBookmarks((prev) => {
      const updated = prev.includes(articleId)
        ? prev.filter((id) => id !== articleId)
        : [...prev, articleId];
      try {
        localStorage.setItem('rgnn_bookmarks', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const playAlertSound = () => {
    if (!soundAlertsEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {
      // Audio context might be restricted before user gesture
    }
  };

  const triggerEmergencyAlert = (msg: string) => {
    setEmergencyAlert(msg);
    playAlertSound();
  };

  const clearEmergencyAlert = () => {
    setEmergencyAlert(null);
  };

  // Text-To-Speech Reader
  const speakText = (text: string, lang = 'en-US') => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const likeArticle = async (articleId: string) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === articleId ? { ...a, likes: a.likes + 1 } : a))
    );
    try {
      const artRef = doc(db, 'articles', articleId);
      const target = articles.find((a) => a.id === articleId);
      if (target) {
        await updateDoc(artRef, { likes: target.likes + 1 });
      }
    } catch (err) {
      console.warn('Like persisted locally (Firestore read-only or auth needed):', err);
    }
  };

  const createArticle = async (data: Partial<NewsArticle>): Promise<string> => {
    const id = 'art-' + Date.now();
    const newArt: NewsArticle = {
      id,
      title: data.title || 'Untitled Article',
      titleTranslations: data.titleTranslations || {},
      content: data.content || '',
      summary: data.summary || '',
      category: (data.category as any) || 'world',
      authorId: profile?.uid || 'author-temp',
      authorName: profile?.displayName || 'Rahul Prasad Rajbanshi',
      authorRole: profile?.role === 'admin' ? 'Chief Editor' : 'Field Reporter',
      imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200&q=80',
      videoUrl: data.videoUrl || '',
      isBreaking: !!data.isBreaking,
      isFeatured: !!data.isFeatured,
      isLiveReport: !!data.isLiveReport,
      status: (data.status as any) || 'published',
      views: 1,
      likes: 0,
      location: data.location || 'Kathmandu, Nepal',
      tags: data.tags || ['RGNN', 'News'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setArticles((prev) => [newArt, ...prev]);

    try {
      await setDoc(doc(db, 'articles', id), newArt);
    } catch (err) {
      console.warn('Created article stored locally:', err);
    }

    if (newArt.isBreaking) {
      triggerEmergencyAlert(`BREAKING: ${newArt.title}`);
    }

    return id;
  };

  const updateArticleStatus = async (id: string, status: 'draft' | 'pending' | 'published') => {
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status, updatedAt: new Date().toISOString() } : a))
    );
    try {
      await updateDoc(doc(db, 'articles', id), {
        status,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Article status updated locally:', err);
    }
  };

  const deleteArticle = async (id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
    try {
      await deleteDoc(doc(db, 'articles', id));
    } catch (err) {
      console.warn('Article deleted locally:', err);
    }
  };

  const votePoll = (optionId: string) => {
    setActivePoll((prev) => {
      const updatedOpts = prev.options.map((opt) =>
        opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
      );
      return {
        ...prev,
        options: updatedOpts,
        totalVotes: prev.totalVotes + 1
      };
    });
  };

  const publishedArticles = articles.filter((a) => a.status === 'published');
  const pendingArticles = articles.filter((a) => a.status === 'pending');
  const breakingNews = publishedArticles.filter((a) => a.isBreaking);
  const featuredArticles = publishedArticles.filter((a) => a.isFeatured);

  return (
    <NewsContext.Provider
      value={{
        articles,
        loading,
        publishedArticles,
        pendingArticles,
        breakingNews,
        featuredArticles,
        bookmarks,
        toggleBookmark,
        likeArticle,
        createArticle,
        updateArticleStatus,
        deleteArticle,
        emergencyAlert,
        triggerEmergencyAlert,
        clearEmergencyAlert,
        soundAlertsEnabled,
        setSoundAlertsEnabled,
        playAlertSound,
        speakText,
        stopSpeaking,
        isSpeaking,
        activePoll,
        votePoll
      }}
    >
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) throw new Error('useNews must be used within a NewsProvider');
  return context;
};
