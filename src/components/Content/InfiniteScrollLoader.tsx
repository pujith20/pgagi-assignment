import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, ChevronDown } from 'lucide-react';

interface InfiniteScrollLoaderProps {
  loading: boolean;
  hasMore: boolean;
  onLoadMore?: () => void;
  error?: string | null;
}

const InfiniteScrollLoader: React.FC<InfiniteScrollLoaderProps> = ({
  loading,
  hasMore,
  onLoadMore,
  error
}) => {
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-8 text-center"
      >
        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
          <span className="text-red-600 dark:text-red-400 text-xl">⚠️</span>
        </div>
        <p className="text-red-600 dark:text-red-400 font-medium mb-2">Failed to load content</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{error}</p>
        {onLoadMore && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLoadMore}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Try Again
          </motion.button>
        )}
      </motion.div>
    );
  }

  if (!hasMore && !loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-8 text-center"
      >
        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <span className="text-gray-600 dark:text-gray-400 text-xl">✨</span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 font-medium">You've reached the end!</p>
        <p className="text-gray-500 dark:text-gray-500 text-sm">No more content to load</p>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-8"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="mb-4"
        >
          <Loader2 className="w-8 h-8 text-blue-500" />
        </motion.div>
        <p className="text-gray-600 dark:text-gray-400 font-medium">Loading more content...</p>
        <p className="text-gray-500 dark:text-gray-500 text-sm">Please wait while we fetch more items</p>
      </motion.div>
    );
  }

  if (hasMore && onLoadMore) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-8"
      >
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={onLoadMore}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-lg hover:shadow-xl"
        >
          <ChevronDown className="w-5 h-5" />
          Load More Content
        </motion.button>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
          Or scroll down to load automatically
        </p>
      </motion.div>
    );
  }

  return null;
};

export default InfiniteScrollLoader;