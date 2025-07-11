import React from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppSelector';
import { selectFavorites, setActiveContentType } from '../../store/slices/dashboardSlice';
import ContentGrid from '../Content/ContentGrid';
import { Heart, Star } from 'lucide-react';

const FavoritesSection: React.FC = () => {
  const dispatch = useAppDispatch();
  
  // Using Redux selectors
  const favorites = useAppSelector(selectFavorites);

  // Reset content type filter when entering favorites
  React.useEffect(() => {
    dispatch(setActiveContentType(null));
  }, [dispatch]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-2xl p-8 border border-pink-200 dark:border-pink-800"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-full">
            <Heart className="w-6 h-6 text-pink-600 dark:text-pink-400 fill-current" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Your Favorites
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Content you've saved for later
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-pink-600 dark:text-pink-400">
          <Star className="w-4 h-4" />
          <span>{favorites.length} items saved</span>
        </div>
      </motion.div>

      {/* Favorites Content */}
      <ContentGrid
        items={favorites}
        title={favorites.length > 0 ? "Saved Content" : undefined}
        emptyMessage="No favorites yet! Start hearting content you love."
      />

      {/* Tips */}
      {favorites.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            How to save favorites
          </h3>
          <div className="space-y-2 text-gray-600 dark:text-gray-300">
            <p className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-pink-500" />
              Click the heart icon on any content card to save it
            </p>
            <p className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              Access your saved content anytime from this page
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default FavoritesSection;