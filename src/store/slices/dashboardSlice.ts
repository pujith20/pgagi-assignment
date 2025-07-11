import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DashboardState, ContentItem, UserPreferences, ContentType } from '../../types';

// Redux action types for better debugging
export const DASHBOARD_ACTION_TYPES = {
  SET_CONTENT: 'dashboard/setContent',
  APPEND_CONTENT: 'dashboard/appendContent',
  SET_TRENDING: 'dashboard/setTrending',
  SET_SEARCH_RESULTS: 'dashboard/setSearchResults',
  SET_LOADING: 'dashboard/setLoading',
  SET_ERROR: 'dashboard/setError',
  SET_SEARCH_QUERY: 'dashboard/setSearchQuery',
  TOGGLE_FAVORITE: 'dashboard/toggleFavorite',
  UPDATE_PREFERENCES: 'dashboard/updatePreferences',
  REORDER_CONTENT: 'dashboard/reorderContent',
  SET_CURRENT_PAGE: 'dashboard/setCurrentPage',
  SET_HAS_MORE: 'dashboard/setHasMore',
  SET_ACTIVE_CONTENT_TYPE: 'dashboard/setActiveContentType',
  RESET_DASHBOARD: 'dashboard/resetDashboard',
  BULK_UPDATE_FAVORITES: 'dashboard/bulkUpdateFavorites',
} as const;

const loadPreferences = (): UserPreferences => {
  try {
    const saved = localStorage.getItem('dashboard-preferences');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load preferences:', error);
  }
  
  return {
    categories: ['technology', 'sports', 'finance', 'entertainment'],
    darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
    language: 'en',
  };
};

const savePreferences = (preferences: UserPreferences) => {
  try {
    localStorage.setItem('dashboard-preferences', JSON.stringify(preferences));
  } catch (error) {
    console.error('Failed to save preferences:', error);
  }
};

const loadFavorites = (): ContentItem[] => {
  try {
    const saved = localStorage.getItem('dashboard-favorites');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Failed to load favorites:', error);
    return [];
  }
};

const saveFavorites = (favorites: ContentItem[]) => {
  try {
    localStorage.setItem('dashboard-favorites', JSON.stringify(favorites));
  } catch (error) {
    console.error('Failed to save favorites:', error);
  }
};

const initialState: DashboardState = {
  content: [],
  favorites: loadFavorites(),
  trending: [],
  searchResults: [],
  loading: false,
  error: null,
  searchQuery: '',
  preferences: loadPreferences(),
  currentPage: 1,
  hasMore: true,
  activeContentType: null,
  newsPage: 1,
  moviesPage: 1,
  socialPage: 1,
  itemsPerPage: 12,
  totalItems: 0,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setContent: (state, action: PayloadAction<ContentItem[]>) => {
      state.content = action.payload;
      state.totalItems = action.payload.length;
      state.loading = false;
      state.error = null;
    },
    appendContent: (state, action: PayloadAction<ContentItem[]>) => {
      state.content.push(...action.payload);
      state.totalItems = state.content.length;
      state.loading = false;
      state.error = null;
    },
    setTrending: (state, action: PayloadAction<ContentItem[]>) => {
      state.trending = action.payload;
    },
    setSearchResults: (state, action: PayloadAction<ContentItem[]>) => {
      state.searchResults = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      const contentItem = state.content.find(item => item.id === itemId);
      const searchItem = state.searchResults.find(item => item.id === itemId);
      const trendingItem = state.trending.find(item => item.id === itemId);
      
      [contentItem, searchItem, trendingItem].forEach(item => {
        if (item) {
          item.isFavorite = !item.isFavorite;
          
          if (item.isFavorite) {
            const existingFavorite = state.favorites.find(fav => fav.id === item.id);
            if (!existingFavorite) {
              state.favorites.push({ ...item });
            }
          } else {
            state.favorites = state.favorites.filter(fav => fav.id !== item.id);
          }
        }
      });
      
      saveFavorites(state.favorites);
    },
    updatePreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
      savePreferences(state.preferences);
    },
    reorderContent: (state, action: PayloadAction<{ startIndex: number; endIndex: number }>) => {
      const { startIndex, endIndex } = action.payload;
      const result = [...state.content];
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      state.content = result;
      
      // Save reordered content to localStorage for persistence
      try {
        localStorage.setItem('dashboard-content-order', JSON.stringify(result.map(item => item.id)));
      } catch (error) {
        console.error('Failed to save content order:', error);
      }
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload;
    },
    setActiveContentType: (state, action: PayloadAction<ContentType | null>) => {
      state.activeContentType = action.payload;
    },
    resetDashboard: (state) => {
      state.content = [];
      state.searchResults = [];
      state.trending = [];
      state.loading = false;
      state.error = null;
      state.searchQuery = '';
      state.currentPage = 1;
      state.hasMore = true;
      state.activeContentType = null;
    },
    bulkUpdateFavorites: (state, action: PayloadAction<string[]>) => {
      const favoriteIds = action.payload;
      
      // Update all content arrays
      [state.content, state.searchResults, state.trending].forEach(contentArray => {
        contentArray.forEach(item => {
          item.isFavorite = favoriteIds.includes(item.id);
        });
      });
      
      // Update favorites array
      state.favorites = state.favorites.filter(fav => favoriteIds.includes(fav.id));
      saveFavorites(state.favorites);
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchQuery = '';
    },
    incrementPage: (state) => {
      state.currentPage += 1;
    },
    incrementNewsPage: (state) => {
      state.newsPage += 1;
    },
    incrementMoviesPage: (state) => {
      state.moviesPage += 1;
    },
    incrementSocialPage: (state) => {
      state.socialPage += 1;
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload;
    },
    setTotalItems: (state, action: PayloadAction<number>) => {
      state.totalItems = action.payload;
    },
  },
});

export const {
  setContent,
  appendContent,
  setTrending,
  setSearchResults,
  setLoading,
  setError,
  setSearchQuery,
  toggleFavorite,
  updatePreferences,
  reorderContent,
  setCurrentPage,
  setHasMore,
  setActiveContentType,
  resetDashboard,
  bulkUpdateFavorites,
  clearSearchResults,
  incrementPage,
  setItemsPerPage,
  setTotalItems,
  incrementNewsPage,
  incrementMoviesPage,
  incrementSocialPage,
} = dashboardSlice.actions;

// Redux selectors for better performance and reusability
export const selectDashboardState = (state: { dashboard: DashboardState }) => state.dashboard;
export const selectContent = (state: { dashboard: DashboardState }) => state.dashboard.content;
export const selectFavorites = (state: { dashboard: DashboardState }) => state.dashboard.favorites;
export const selectTrending = (state: { dashboard: DashboardState }) => state.dashboard.trending;
export const selectSearchResults = (state: { dashboard: DashboardState }) => state.dashboard.searchResults;
export const selectPreferences = (state: { dashboard: DashboardState }) => state.dashboard.preferences;
export const selectActiveContentType = (state: { dashboard: DashboardState }) => state.dashboard.activeContentType;
export const selectIsLoading = (state: { dashboard: DashboardState }) => state.dashboard.loading;
export const selectSearchQuery = (state: { dashboard: DashboardState }) => state.dashboard.searchQuery;
export const selectCurrentPage = (state: { dashboard: DashboardState }) => state.dashboard.currentPage;
export const selectHasMore = (state: { dashboard: DashboardState }) => state.dashboard.hasMore;
export const selectItemsPerPage = (state: { dashboard: DashboardState }) => state.dashboard.itemsPerPage;
export const selectTotalItems = (state: { dashboard: DashboardState }) => state.dashboard.totalItems;

// Computed selectors
export const selectFilteredContent = (state: { dashboard: DashboardState }) => {
  const { content, activeContentType } = state.dashboard;
  return activeContentType 
    ? content.filter(item => item.type === activeContentType)
    : content;
};

export const selectContentByType = (contentType: ContentType) => 
  (state: { dashboard: DashboardState }) => 
    state.dashboard.content.filter(item => item.type === contentType);

export const selectFavoritesByType = (contentType: ContentType) => 
  (state: { dashboard: DashboardState }) => 
    state.dashboard.favorites.filter(item => item.type === contentType);

export const selectPaginationInfo = (state: { dashboard: DashboardState }) => ({
  currentPage: state.dashboard.currentPage,
  itemsPerPage: state.dashboard.itemsPerPage,
  totalItems: state.dashboard.totalItems,
  hasMore: state.dashboard.hasMore,
  loading: state.dashboard.loading
});

export default dashboardSlice.reducer;