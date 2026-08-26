export type LanguageCode = 'en' | 'ne' | 'hi' | 'bn' | 'rajbanshi';

export type UserRole = 'user' | 'reporter' | 'editor' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  pressBadgeNumber?: string;
  organization?: string;
  createdAt: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  titleTranslations?: Record<string, string>;
  content: string;
  contentTranslations?: Record<string, string>;
  summary?: string;
  summaryTranslations?: Record<string, string>;
  category: 'world' | 'nepal' | 'politics' | 'business' | 'tech' | 'sports' | 'entertainment' | 'health' | 'culture';
  authorId: string;
  authorName: string;
  authorRole?: string;
  imageUrl: string;
  videoUrl?: string;
  isBreaking?: boolean;
  isFeatured?: boolean;
  isLiveReport?: boolean;
  status: 'draft' | 'pending' | 'published';
  views: number;
  likes: number;
  location?: string;
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface ArticleComment {
  id: string;
  articleId: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  content: string;
  createdAt: string;
}

export interface LiveChatMessage {
  id: string;
  userId?: string;
  userName: string;
  message: string;
  role?: string;
  createdAt: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface NewsPoll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  status: 'active' | 'closed';
  createdAt: string;
}
