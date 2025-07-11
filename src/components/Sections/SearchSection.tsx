import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppSelector';
import { useSearchNewsQuery } from '../../store/api/newsApi';
import { useSearchMoviesQuery } from '../../store/api/moviesApi';
import { useSearchSocialPostsQuery } from '../../store/api/socialApi';
import { 
  setSearchResults, 
  setActiveContentType,
  selectSearchResults,
  selectSearchQuery 
} from '../../store/slices/dashboardSlice';
import { ContentItem, NewsArticle, Movie, SocialPost } from '../../types';
import ContentGrid from '../Content/ContentGrid';
import { Search, Filter } from 'lucide-react';

const SearchSection: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // Using Redux selectors
  const searchResults = useAppSelector(selectSearchResults);
  const searchQuery = useAppSelector(selectSearchQuery);
  const [searchPage, setSearchPage] = React.useState(1);
  const [searchHasMore, setSearchHasMore] = React.useState(true);
  const [searchLoading, setSearchLoading] = React.useState(false);

  // Reset content type filter when entering search
  React.useEffect(() => {
    dispatch(setActiveContentType(null));
  }, [dispatch]);

  const shouldSearch = searchQuery.length >= 2;

  const { data: newsResults, isLoading: newsLoading } = useSearchNewsQuery(
    { query: searchQuery, max: 10 },
    { skip: !shouldSearch }
  );

  const { data: movieResults, isLoading: moviesLoading } = useSearchMoviesQuery(
    { query: searchQuery, page: 1 },
    { skip: !shouldSearch }
  );

  const { data: socialResults, isLoading: socialLoading } = useSearchSocialPostsQuery(
    { query: searchQuery },
    { skip: !shouldSearch }
  );

  useEffect(() => {
    if (shouldSearch && !newsLoading && !moviesLoading && !socialLoading) {
      const results: ContentItem[] = [];

      // Add news results
      if (newsResults?.articles) {
        const newsItems = newsResults.articles.map((article: NewsArticle, index: number) => ({
          id: `search-news-${index}`,
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
        results.push(...newsItems);
      }

      // Add movie results
      if (movieResults?.results) {
        const movieItems = movieResults.results.map((movie: Movie) => ({
          id: `search-movie-${movie.id}`,
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
          category: 'Movies',
          isFavorite: false,
          data: movie
        }));
        results.push(...movieItems);
      }

      // Add social results
      if (socialResults) {
        const socialItems = socialResults.map((post: SocialPost) => ({
          id: `search-social-${post.id}`,
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
        results.push(...socialItems);
      }

      dispatch(setSearchResults(results));
    } else if (!shouldSearch) {
      dispatch(setSearchResults([]));
    }
  }, [newsResults, movieResults, socialResults, newsLoading, moviesLoading, socialLoading, dispatch, shouldSearch]);

  const isLoading = shouldSearch && (newsLoading || moviesLoading || socialLoading);

  // Handle search pagination
  const handleSearchLoadMore = () => {
    if (searchHasMore && !searchLoading && shouldSearch) {
      setSearchLoading(true);
      setSearchPage(prev => prev + 1);
      
      // Simulate loading more search results
      setTimeout(() => {
        const moreResults: ContentItem[] = Array.from({ length: 6 }, (_, index) => ({
          id: `search-more-${searchPage}-${index}`,
          type: ['news', 'movie', 'social'][Math.floor(Math.random() * 3)] as any,
          title: `More ${searchQuery} Results ${searchPage}-${index + 1}`,
          description: `Additional search results for "${searchQuery}". This demonstrates pagination in search.`,
          image: 'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=500',
          source: 'Search',
          timestamp: new Date().toISOString(),
          category: 'Search Results',
          isFavorite: false,
          data: {} as any
        }));
        
        dispatch(setSearchResults([...searchResults, ...moreResults]));
        setSearchLoading(false);
        
        // Stop after 3 pages for demo
        if (searchPage >= 3) {
          setSearchHasMore(false);
        }
      }, 1000);
    }
  };

  // Reset pagination when search query changes
  React.useEffect(() => {
    setSearchPage(1);
    setSearchHasMore(true);
  }, [searchQuery]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-2xl p-8 border border-green-200 dark:border-green-800"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
            <Search className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Search Results
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {searchQuery ? `Results for "${searchQuery}"` : 'Search across all content types'}
            </p>
          </div>
        </div>

        {searchQuery && (
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
            <Filter className="w-4 h-4" />
            <span>Searching news, movies, and social posts</span>
          </div>
        )}
      </motion.div>

      {/* Search Prompt */}
      {!searchQuery && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Start searching
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Use the search bar above to find content across news articles, movies, and social posts. 
            Try searching for topics like "technology", "sports", or specific titles.
          </p>
        </motion.div>
      )}

      {/* Search Results */}
      {searchQuery && (
        <>
          {searchQuery.length < 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <p className="text-gray-500 dark:text-gray-400">
                Type at least 2 characters to search
              </p>
            </motion.div>
          )}

          {searchQuery.length >= 2 && (
            <ContentGrid
              items={searchResults}
              loading={isLoading}
              title={`Search Results (${searchResults.length})`}
              emptyMessage={`No results found for "${searchQuery}"`}
              hasMore={searchHasMore}
              onLoadMore={handleSearchLoadMore}
              enableInfiniteScroll={true}
              error={null}
            />
          )}
        </>
      )}

      {/* Search Tips */}
      {searchResults.length === 0 && searchQuery && searchQuery.length >= 2 && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Search Tips
          </h3>
          <div className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
            <p>• Try different keywords or phrases</p>
            <p>• Search for broader topics like "technology" or "entertainment"</p>
            <p>• Check your spelling</p>
            <p>• Try searching for specific movie titles or news topics</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SearchSection;