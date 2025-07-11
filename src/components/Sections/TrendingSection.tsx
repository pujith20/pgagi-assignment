import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppSelector';
import { useGetTopHeadlinesQuery } from '../../store/api/newsApi';
import { useGetTrendingMoviesQuery } from '../../store/api/moviesApi';
import { 
  setTrending, 
  setActiveContentType,
  selectTrending 
} from '../../store/slices/dashboardSlice';
import { ContentItem, NewsArticle, Movie } from '../../types';
import ContentGrid from '../Content/ContentGrid';
import { TrendingUp, Siren as Fire } from 'lucide-react';

const TrendingSection: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // Using Redux selectors
  const trending = useAppSelector(selectTrending);
  const [trendingPage, setTrendingPage] = React.useState(1);
  const [trendingHasMore, setTrendingHasMore] = React.useState(true);
  const [trendingLoading, setTrendingLoading] = React.useState(false);

  // Reset content type filter when entering trending
  React.useEffect(() => {
    dispatch(setActiveContentType(null));
  }, [dispatch]);

  const { data: trendingNews, isLoading: newsLoading } = useGetTopHeadlinesQuery({
    category: 'general',
    max: 6
  });

  const { data: trendingMovies, isLoading: moviesLoading } = useGetTrendingMoviesQuery({
    page: 1
  });

  useEffect(() => {
    if (!newsLoading && !moviesLoading) {
      const trendingContent: ContentItem[] = [];

      // Add trending news
      if (trendingNews?.articles) {
        const newsItems = trendingNews.articles.map((article: NewsArticle, index: number) => ({
          id: `trending-news-${index}`,
          type: 'news' as const,
          title: article.title,
          description: article.description,
          image: article.image,
          source: article.source.name,
          timestamp: article.publishedAt,
          url: article.url,
          category: 'Trending News',
          isFavorite: false,
          data: article
        }));
        trendingContent.push(...newsItems);
      }

      // Add trending movies
      if (trendingMovies?.results) {
        const movieItems = trendingMovies.results.slice(0, 8).map((movie: Movie) => ({
          id: `trending-movie-${movie.id}`,
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
          category: 'Trending Movies',
          isFavorite: false,
          data: movie
        }));
        trendingContent.push(...movieItems);
      }

      dispatch(setTrending(trendingContent));
    }
  }, [trendingNews, trendingMovies, newsLoading, moviesLoading, dispatch]);

  const isLoading = newsLoading || moviesLoading;

  // Handle trending pagination
  const handleTrendingLoadMore = () => {
    if (trendingHasMore && !trendingLoading) {
      setTrendingLoading(true);
      setTrendingPage(prev => prev + 1);
      
      // Simulate loading more trending content
      setTimeout(() => {
        const moreTrending: ContentItem[] = Array.from({ length: 6 }, (_, index) => ({
          id: `trending-more-${trendingPage}-${index}`,
          type: ['news', 'movie'][Math.floor(Math.random() * 2)] as any,
          title: `More Trending Content ${trendingPage}-${index + 1}`,
          description: 'Additional trending content loaded via infinite scroll.',
          image: 'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=500',
          source: 'Trending',
          timestamp: new Date().toISOString(),
          category: 'Trending',
          isFavorite: false,
          data: {} as any
        }));
        
        dispatch(setTrending([...trending, ...moreTrending]));
        setTrendingLoading(false);
        
        // Stop after 3 pages for demo
        if (trendingPage >= 3) {
          setTrendingHasMore(false);
        }
      }, 1000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-8 border border-orange-200 dark:border-orange-800"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
            <Fire className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Trending Now
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              The hottest content everyone's talking about
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400">
          <TrendingUp className="w-4 h-4" />
          <span>Updated every hour with the latest trends</span>
        </div>
      </motion.div>

      {/* Trending Content */}
      <ContentGrid
        items={trending}
        loading={isLoading}
        title="Hot Right Now"
        emptyMessage="No trending content available"
        hasMore={trendingHasMore}
        onLoadMore={handleTrendingLoadMore}
        enableInfiniteScroll={true}
        error={null}
      />

      {/* Stats */}
      {trending.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {trending.filter(item => item.type === 'news').length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Trending News</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Fire className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {trending.filter(item => item.type === 'movie').length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Hot Movies</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {trending.length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Items</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TrendingSection;