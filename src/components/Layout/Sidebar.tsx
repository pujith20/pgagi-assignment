import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  TrendingUp, 
  Heart, 
  Search, 
  Settings, 
  Moon, 
  Sun,
  Filter,
  Newspaper,
  Film,
  MessageCircle
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppSelector';
import { 
  updatePreferences, 
  setActiveContentType,
  selectPreferences,
  selectActiveContentType 
} from '../../store/slices/dashboardSlice';
import { ContentType } from '../../types';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeSection, 
  onSectionChange, 
  isCollapsed,
  onToggleCollapse 
}) => {
  const dispatch = useAppDispatch();
  
  // Using Redux selectors
  const preferences = useAppSelector(selectPreferences);
  const activeContentType = useAppSelector(selectActiveContentType);

  const toggleDarkMode = () => {
    const newDarkMode = !preferences.darkMode;
    dispatch(updatePreferences({ darkMode: newDarkMode }));
    document.documentElement.classList.toggle('dark', !preferences.darkMode);
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'search', label: 'Search', icon: Search },
  ];

  const contentTypes = [
    { id: 'news' as ContentType, label: 'News', icon: Newspaper },
    { id: 'movie' as ContentType, label: 'Movies', icon: Film },
    { id: 'social' as ContentType, label: 'Social', icon: MessageCircle },
  ];

  const handleContentTypeClick = (contentType: ContentType) => {
    if (activeContentType === contentType) {
      dispatch(setActiveContentType(null));
    } else {
      dispatch(setActiveContentType(contentType));
    }
    onSectionChange('dashboard');
  };

  const handleMenuItemClick = (sectionId: string) => {
    // Reset content type filter when navigating to different sections
    if (sectionId !== 'dashboard') {
      dispatch(setActiveContentType(null));
    }
    onSectionChange(sectionId);
  };

  return (
    <motion.aside
      initial={{ width: isCollapsed ? 80 : 280 }}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3 }}
      className={`bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 h-full flex flex-col ${
        isCollapsed ? 'items-center' : ''
      }`}
    >
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <motion.div 
          className="flex items-center gap-3"
          animate={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Filter className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xl font-bold text-gray-900 dark:text-white"
            >
              ContentHub
            </motion.h1>
          )}
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => handleMenuItemClick(item.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                } ${isCollapsed ? 'justify-center' : ''}`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </motion.button>
            );
          })}
        </div>

        {!isCollapsed && (
          <div className="pt-6">
            <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Content Types
            </h3>
            <div className="space-y-1">
              {contentTypes.map((item) => {
                const Icon = item.icon;
                const isActive = activeContentType === item.id;
                
                return (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleContentTypeClick(item.id)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {!isCollapsed && <span className="text-sm">{item.label}</span>}
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        <motion.button
          onClick={toggleDarkMode}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          {preferences.darkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
          {!isCollapsed && (
            <span className="font-medium">
              {preferences.darkMode ? 'Light Mode' : 'Dark Mode'}
            </span>
          )}
        </motion.button>

        <motion.button
          onClick={() => onSectionChange('settings')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <Settings className="w-5 h-5" />
          {!isCollapsed && <span className="font-medium">Settings</span>}
        </motion.button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;