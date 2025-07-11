import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ExternalLink, Calendar, User, TrendingUp, MessageCircle, GripVertical } from 'lucide-react';
import { ContentItem } from '../../types';
import { useAppDispatch } from '../../hooks/useAppSelector';
import { toggleFavorite } from '../../store/slices/dashboardSlice';
import { formatDistanceToNow } from 'date-fns';

interface ContentCardProps {
  item: ContentItem;
  index: number;
  isDragging: boolean;
  dragHandleProps?: any;
}

const ContentCard: React.FC<ContentCardProps> = ({ 
  item, 
  index, 
  isDragging, 
  dragHandleProps 
}) => {
  const dispatch = useAppDispatch();

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    dispatch(toggleFavorite(item.id));
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      return;
    }
    if (item.url) {
      window.open(item.url, '_blank');
    }
  };

  const getTypeIcon = () => {
    switch (item.type) {
      case 'news':
        return <TrendingUp className="w-4 h-4" />;
      case 'movie':
        return <User className="w-4 h-4" />;
      case 'social':
        return <MessageCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getTypeColor = () => {
    switch (item.type) {
      case 'news':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'movie':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'social':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatReleaseDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.getFullYear().toString();
    } catch {
      return dateString;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        scale: isDragging ? 1.05 : 1,
        rotateZ: isDragging ? 2 : 0,
        zIndex: isDragging ? 1000 : 1
      }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration: 0.3, 
        delay: index * 0.05,
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      whileHover={{ 
        y: isDragging ? 0 : -4,
        transition: { duration: 0.2 }
      }}
      className={`group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 relative ${
        isDragging 
          ? 'shadow-2xl ring-2 ring-blue-500 ring-opacity-50 cursor-grabbing transform' 
          : 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750'
      }`}
      onClick={handleCardClick}
    >
      {/* Drag Handle */}
      {dragHandleProps && (
        <div
          {...dragHandleProps}
          className="absolute top-2 left-2 z-20 p-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-grab active:cursor-grabbing shadow-lg border border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600"
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={(e) => e.stopPropagation()}
          style={{ 
            transition: 'all 0.3s ease',
            transform: 'translateZ(0)' // Force hardware acceleration
          }}
        >
          <GripVertical className="w-5 h-5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" />
        </div>
      )}

      {/* Image */}
      {item.image && (
        <div className="relative overflow-hidden h-48">
          <motion.img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            whileHover={{ scale: isDragging ? 1 : 1.1 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Type Badge */}
          <div className={`absolute top-3 ${dragHandleProps ? 'left-20' : 'left-3'} transition-all duration-300`}>
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor()}`}>
              {getTypeIcon()}
              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
            </span>
          </div>

          {/* Favorite Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleFavoriteToggle}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-300 z-10 ${
              item.isFavorite
                ? 'bg-red-500 text-white'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <Heart className={`w-4 h-4 ${item.isFavorite ? 'fill-current' : ''}`} />
          </motion.button>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Drag overlay when dragging */}
        {isDragging && (
          <div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-400/10 rounded-xl border-2 border-dashed border-blue-500 dark:border-blue-400 flex items-center justify-center z-10">
            <div className="bg-blue-500 dark:bg-blue-400 text-white px-3 py-1 rounded-full text-sm font-medium">
              Drop to reorder
            </div>
          </div>
        )}

        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {item.title}
          </h3>
          {item.url && (
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500 flex-shrink-0 ml-2" />
          )}
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
          {item.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-3 h-3" />
            <span>
              {item.type === 'movie' 
                ? formatReleaseDate(item.timestamp)
                : formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })
              }
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium">{item.source}</span>
          </div>
        </div>

        {/* Category */}
        <div className="mt-3">
          <span className={`inline-block px-2 py-1 text-xs rounded-full ${
            item.type === 'movie' 
              ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}>
            {item.category}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ContentCard;