import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import DashboardSection from './components/Sections/DashboardSection';
import TrendingSection from './components/Sections/TrendingSection';
import FavoritesSection from './components/Sections/FavoritesSection';
import SearchSection from './components/Sections/SearchSection';
import SettingsSection from './components/Sections/SettingsSection';

function AppContent() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Apply dark mode on mount
  useEffect(() => {
    const preferences = localStorage.getItem('dashboard-preferences');
    if (preferences) {
      const { darkMode } = JSON.parse(preferences);
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleSearchFocus = () => {
    setActiveSection('search');
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardSection />;
      case 'trending':
        return <TrendingSection />;
      case 'favorites':
        return <FavoritesSection />;
      case 'search':
        return <SearchSection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return <DashboardSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <Header
            onToggleSidebar={handleToggleSidebar}
            onSearchFocus={handleSearchFocus}
          />

          {/* Content Area */}
          <main className="flex-1 overflow-auto p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                {renderSection()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;