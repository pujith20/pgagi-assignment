import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Movie } from '../../types';

const TMDB_API_KEY = '5904cc083b82f492073efaf994ea6283';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export const moviesApi = createApi({
  reducerPath: 'moviesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: TMDB_BASE_URL,
  }),
  endpoints: (builder) => ({
    getTrendingMovies: builder.query<{
      results: Movie[];
      total_pages: number;
      total_results: number;
    }, { page?: number }>({
      query: ({ page = 1 }) => `/trending/all/day?api_key=${TMDB_API_KEY}&page=${page}`,
      transformResponse: (response: any) => {
        // Filter only movies from the trending results
        const movieResults = response.results.filter((item: any) => item.media_type === 'movie');
        return {
          ...response,
          results: movieResults
        };
      }
    }),
    searchMovies: builder.query<{
      results: Movie[];
      total_pages: number;
      total_results: number;
    }, { query: string; page?: number }>({
      query: ({ query, page = 1 }) => 
        `/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`,
    }),
    getPopularMovies: builder.query<{
      results: Movie[];
      total_pages: number;
      total_results: number;
    }, { page?: number }>({
      query: ({ page = 1 }) => `/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`,
    }),
    getMoviesByGenre: builder.query<{
      results: Movie[];
      total_pages: number;
      total_results: number;
    }, { genreId: number; page?: number }>({
      query: ({ genreId, page = 1 }) => 
        `/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&page=${page}`,
    }),
    getMovieDetails: builder.query<Movie & {
      genres: Array<{ id: number; name: string }>;
      runtime: number;
      budget: number;
      revenue: number;
    }, { movieId: number }>({
      query: ({ movieId }) => `/movie/${movieId}?api_key=${TMDB_API_KEY}`,
    }),
  }),
});

export const { 
  useGetTrendingMoviesQuery, 
  useSearchMoviesQuery, 
  useGetPopularMoviesQuery,
  useGetMoviesByGenreQuery,
  useGetMovieDetailsQuery
} = moviesApi;