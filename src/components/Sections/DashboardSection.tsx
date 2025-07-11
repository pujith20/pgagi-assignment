import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppSelector';
import { useGetTopHeadlinesQuery, useGetNewsByCategoryQuery } from '../../store/api/newsApi';
import { useGetTrendingMoviesQuery, useGetPopularMoviesQuery } from '../../store/api/moviesApi';
import { useGetSocialPostsQuery } from '../../store/api/socialApi';
import { 
  setContent, 
  appendContent, 
  setLoading, 
  setHasMore, 
  setActiveContentType,
  incrementNewsPage,
  incrementMoviesPage,
  incrementSocialPage,
  selectFilteredContent,
  selectPreferences,
  selectIsLoading,
  selectActiveContentType,
  selectHasMore,
  selectPaginationInfo
} from '../../store/slices/dashboardSlice';
import { ContentItem, NewsArticle, Movie, SocialPost } from '../../types';
import ContentGrid from '../Content/ContentGrid';

const DashboardSection: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // Using Redux selectors for better performance
  const filteredContent = useAppSelector(selectFilteredContent);
  const preferences = useAppSelector(selectPreferences);
  const loading = useAppSelector(selectIsLoading);
  const activeContentType = useAppSelector(selectActiveContentType);
  const hasMore = useAppSelector(state => state.dashboard.hasMore);
  const content = useAppSelector(state => state.dashboard.content);
  const newsPage = useAppSelector(state => state.dashboard.newsPage);
  const moviesPage = useAppSelector(state => state.dashboard.moviesPage);
  const socialPage = useAppSelector(state => state.dashboard.socialPage);
  
  const paginationInfo = useAppSelector(selectPaginationInfo);

  // Fetch data from APIs
  const { data: newsData, isLoading: newsLoading, isFetching: newsIsFetching } = useGetNewsByCategoryQuery({
    categories: preferences.categories,
    max: 10,
    page: newsPage
  });

  const { data: moviesData, isLoading: moviesLoading, isFetching: moviesIsFetching } = useGetTrendingMoviesQuery({
    page: moviesPage
  });

  const { data: socialData, isLoading: socialLoading, isFetching: socialIsFetching } = useGetSocialPostsQuery({
    hashtags: preferences.categories
  });

  // Transform and combine data
  useEffect(() => {
    if (!newsLoading && !moviesLoading && !socialLoading && newsPage === 1 && moviesPage === 1) {
      const transformedContent: ContentItem[] = [];

      // Transform news articles
      if (newsData?.articles) {
        const newsItems = newsData.articles.map((article: NewsArticle, index: number) => ({
          id: `news-${newsPage}-${index}`,
          type: 'news' as const,
          title: article.title,
          description: article.description,
          image: article.image,
          source: article.source.name,
          timestamp: article.publishedAt,
          url: article.url,
          category: 'News',
          isFavorite: false,
          data: article
        }));
        transformedContent.push(...newsItems);
      }

      // Transform movies
      if (moviesData?.results) {
        const movieItems = moviesData.results.map((movie: Movie) => ({
          id: `movie-${moviesPage}-${movie.id}`,
          type: 'movie' as const,
          title: movie.title,
          description: movie.overview,
          image: movie.poster_path 
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
            : movie.backdrop_path 
            ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
            : 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=500',
          source: 'TMDB',
          timestamp: movie.release_date,
          url: `https://www.themoviedb.org/movie/${movie.id}`,
          category: 'Entertainment',
          isFavorite: false,
          data: movie
        }));
        transformedContent.push(...movieItems.slice(0, 5));
      }

      // Transform social posts
      if (socialData) {
        const socialItems = socialData.map((post: SocialPost) => ({
          id: `social-${socialPage}-${post.id}`,
          type: 'social' as const,
          title: `@${post.author}`,
          description: post.content,
          image: post.image || 'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=500',
          source: 'Social Media',
          timestamp: post.timestamp,
          category: 'Social',
          isFavorite: false,
          data: post
        }));
        transformedContent.push(...socialItems);
      }

      // Shuffle content for better mix
      const shuffledContent = transformedContent.sort(() => Math.random() - 0.5);
      
      dispatch(setContent(shuffledContent));
    }
  }, [newsData, moviesData, socialData, newsPage, moviesPage, socialPage, newsLoading, moviesLoading, socialLoading, dispatch]);

  // Handle load more for infinite scroll
  const handleLoadMore = () => {
    if (hasMore && !loading && !newsIsFetching && !moviesIsFetching && !socialIsFetching) {
      dispatch(setLoading(true));
      
      // Increment pages to fetch more data
      dispatch(incrementNewsPage());
      dispatch(incrementMoviesPage());
    }
  };

  // Handle additional data loading
  useEffect(() => {
    if ((newsPage > 1 || moviesPage > 1) && !newsLoading && !moviesLoading && !socialLoading) {
      const newContent: ContentItem[] = [];

      // Add new news articles
      if (newsData?.articles && newsPage > 1) {
        const newsItems = newsData.articles.map((article: NewsArticle, index: number) => ({
          id: `news-${newsPage}-${index}`,
          type: 'news' as const,
          title: article.title,
          description: article.description,
          image: article.image,
          source: article.source.name,
          timestamp: article.publishedAt,
          url: article.url,
          category: 'News',
          isFavorite: false,
          data: article
        }));
        newContent.push(...newsItems);
      }

      // Add new movies
      if (moviesData?.results && moviesPage > 1) {
        const movieItems = moviesData.results.map((movie: Movie) => ({
          id: `movie-${moviesPage}-${movie.id}`,
          type: 'movie' as const,
          title: movie.title,
          description: movie.overview,
          image: movie.poster_path 
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
            : movie.backdrop_path 
            ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
            : 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=500',
          source: 'TMDB',
          timestamp: movie.release_date,
          url: `https://www.themoviedb.org/movie/${movie.id}`,
          category: 'Entertainment',
          isFavorite: false,
          data: movie
        }));
        newContent.push(...movieItems.slice(0, 5));
      }

      if (newContent.length > 0) {
        const shuffledNewContent = newContent.sort(() => Math.random() - 0.5);
        dispatch(appendContent(shuffledNewContent));
      }
      
      dispatch(setLoading(false));
      
      // Stop loading after 10 pages to prevent infinite requests
      if (newsPage >= 10 || moviesPage >= 10) {
        dispatch(setHasMore(false));
      }
    }
  }, [newsData, moviesData, newsPage, moviesPage, newsLoading, moviesLoading, socialLoading, dispatch]);

  const isLoading = newsLoading || moviesLoading || socialLoading || loading;

  const getFilterTitle = () => {
    if (!activeContentType) return "Your Personalized Feed";
    
    switch (activeContentType) {
      case 'news':
        return "News Articles";
      case 'movie':
        return "Movies & Entertainment";
      case 'social':
        return "Social Media Posts";
      default:
        return "Your Personalized Feed";
    }
  };

  const handleBackToAll = () => {
    dispatch(setActiveContentType(null));
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl p-8 border ${
          activeContentType === 'news'
            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800'
            : activeContentType === 'movie'
            ? 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800'
            : activeContentType === 'social'
            ? 'bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 border-green-200 dark:border-green-800'
            : 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800'
        }`}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {activeContentType ? `${getFilterTitle()}` : 'Welcome to Your Dashboard'}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          {activeContentType 
            ? `Showing ${filteredContent.length} ${activeContentType === 'movie' ? 'movies' : activeContentType} items`
            : 'Discover personalized content from news, movies, and social media all in one place'
          }
        </p>
        {!activeContentType && (
          <div className="flex flex-wrap gap-2 mt-4">
            {preferences.categories.map((category) => (
              <span
                key={category}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium"
              >
                {category}
              </span>
            ))}
          </div>
        )}
        {activeContentType && (
          <div className="mt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBackToAll}
              className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              ← Back to All Content
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Content Grid */}
      <ContentGrid
        items={filteredContent}
        loading={isLoading && filteredContent.length === 0}
        allowDragDrop={!activeContentType && filteredContent.length > 0} // Only allow drag-drop on main feed with content
        title={getFilterTitle()}
        emptyMessage={activeContentType 
          ? `No ${activeContentType === 'movie' ? 'movies' : activeContentType} content available`
          : "No content matches your preferences"
        }
        hasMore={hasMore && !activeContentType}
        onLoadMore={handleLoadMore}
        enableInfiniteScroll={!activeContentType}
        error={null}
      />
    </div>
  );
};

export default DashboardSection;