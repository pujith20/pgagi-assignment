import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Menu, Bell, User, Filter } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppSelector';
import { 
  setSearchQuery, 
  clearSearchResults,
  selectSearchQuery 
} from '../../store/slices/dashboardSlice';
import { useDebounce } from '../../hooks/useDebounce';

interface HeaderProps {
  onToggleSidebar: () => void;
  onSearchFocus: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onSearchFocus }) => {
  const dispatch = useAppDispatch();
  
  // Using Redux selectors
  const searchQuery = useAppSelector(selectSearchQuery);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  
  const debouncedSearchQuery = useDebounce(localSearchQuery, 300);

  React.useEffect(() => {
    dispatch(setSearchQuery(debouncedSearchQuery));
  }, [debouncedSearchQuery, dispatch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchQuery(e.target.value);
  };

  const handleSearchFocus = () => {
    onSearchFocus();
  };

  const handleSearchClear = () => {
    setLocalSearchQuery('');
    dispatch(clearSearchResults());
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </motion.button>

          <div className="hidden sm:block">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Personalized Dashboard
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Stay updated with your favorite content
            </p>
          </div>
        </div>

        {/* Center Search */}
        <div className="flex-1 max-w-2xl mx-8">
          <motion.div 
            className="relative"
            whileFocus={{ scale: 1.02 }}
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={localSearchQuery}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              placeholder="Search across news, movies, and social posts..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </motion.div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
          >
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </motion.button>

          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900 dark:text-white">John Doe</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Premium User</p>
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default Header;