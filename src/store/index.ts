import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { createLogger } from 'redux-logger';
import dashboardReducer from './slices/dashboardSlice';
import { newsApi } from './api/newsApi';
import { moviesApi } from './api/moviesApi';
import { socialApi } from './api/socialApi';

// Redux logger for development
const logger = createLogger({
  predicate: () => process.env.NODE_ENV === 'development',
  collapsed: true,
  duration: true,
});

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    [newsApi.reducerPath]: newsApi.reducer,
    [moviesApi.reducerPath]: moviesApi.reducer,
    [socialApi.reducerPath]: socialApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST', 
          'persist/REHYDRATE',
          // RTK Query actions
          'newsApi/executeQuery/pending',
          'newsApi/executeQuery/fulfilled',
          'newsApi/executeQuery/rejected',
          'moviesApi/executeQuery/pending',
          'moviesApi/executeQuery/fulfilled',
          'moviesApi/executeQuery/rejected',
          'socialApi/executeQuery/pending',
          'socialApi/executeQuery/fulfilled',
          'socialApi/executeQuery/rejected',
        ],
      },
    })
      .concat(newsApi.middleware)
      .concat(moviesApi.middleware)
      .concat(socialApi.middleware)
      .concat(logger),
});

setupListeners(store.dispatch);

// Enhanced store types
export type RootState = ReturnType<typeof store.getState>;