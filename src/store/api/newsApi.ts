import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { NewsArticle } from '../../types';

const NEWS_API_KEY = '466c99f92864c01995c61c7829564ee5';
const NEWS_BASE_URL = 'https://gnews.io/api/v4';

export const newsApi = createApi({
  reducerPath: 'newsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: NEWS_BASE_URL,
  }),
  endpoints: (builder) => ({
    getTopHeadlines: builder.query<{
      totalArticles: number;
      articles: NewsArticle[];
    }, { category?: string; max?: number }>({
      query: ({ category = 'general', max = 10 }) => 
        `/top-headlines?category=${category}&lang=en&country=us&max=${max}&apikey=${NEWS_API_KEY}`,
    }),
    searchNews: builder.query<{
      totalArticles: number;
      articles: NewsArticle[];
    }, { query: string; max?: number }>({
      query: ({ query, max = 10 }) => 
        `/search?q=${encodeURIComponent(query)}&lang=en&country=us&max=${max}&apikey=${NEWS_API_KEY}`,
    }),
    getNewsByCategory: builder.query<{
      totalArticles: number;
      articles: NewsArticle[];
    }, { categories: string[]; max?: number; page?: number }>({
      query: ({ categories, max = 10, page = 1 }) => {
        const categoryQuery = categories.join(' OR ');
        return `/search?q=${encodeURIComponent(categoryQuery)}&lang=en&country=us&max=${max}&page=${page}&apikey=${NEWS_API_KEY}`;
      },
    }),
  }),
});

export const { 
  useGetTopHeadlinesQuery, 
  useSearchNewsQuery, 
  useGetNewsByCategoryQuery 
} = newsApi;