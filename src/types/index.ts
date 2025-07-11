export interface NewsArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
}

export interface Movie {
  id: number;
  title: string;
  original_title?: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  adult: boolean;
  original_language: string;
  video: boolean;
  media_type?: string;
}

export interface SocialPost {
  id: string;
  content: string;
  author: string;
  avatar: string;
  timestamp: string;
  likes: number;
  shares: number;
  hashtags: string[];
  image?: string;
}

export interface ContentItem {
  id: string;
  type: 'news' | 'movie' | 'social';
  title: string;
  description: string;
  image: string;
  source: string;
  timestamp: string;
  url?: string;
  category: string;
  isFavorite: boolean;
  data: NewsArticle | Movie | SocialPost;
}

export type ContentType = 'news' | 'movie' | 'social';

export interface UserPreferences {
  categories: string[];
  darkMode: boolean;
  language: string;
}

export interface DashboardState {
  content: ContentItem[];
  favorites: ContentItem[];
  trending: ContentItem[];
  searchResults: ContentItem[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  preferences: UserPreferences;
  currentPage: number;
  hasMore: boolean;
  activeContentType: ContentType | null;
  newsPage: number;
  moviesPage: number;
  socialPage: number;
}