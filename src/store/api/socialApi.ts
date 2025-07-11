import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { SocialPost } from '../../types';

// Mock social media API - in production, you'd use real social media APIs
const generateMockSocialPosts = (hashtags: string[] = []): SocialPost[] => {
  const mockPosts: SocialPost[] = [
    {
      id: '1',
      content: 'Exciting developments in AI technology! The future is here 🚀 #AI #Technology #Innovation',
      author: 'TechExplorer',
      avatar: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      likes: 245,
      shares: 89,
      hashtags: ['AI', 'Technology', 'Innovation'],
      image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop'
    },
    {
      id: '2',
      content: 'Just finished an amazing workout session! 💪 Consistency is key to achieving your fitness goals. #Fitness #Health #Motivation',
      author: 'FitLifeCoach',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      likes: 156,
      shares: 34,
      hashtags: ['Fitness', 'Health', 'Motivation']
    },
    {
      id: '3',
      content: 'Market analysis shows interesting trends in renewable energy stocks 📈 #Finance #GreenEnergy #Investing',
      author: 'FinanceGuru',
      avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      likes: 89,
      shares: 67,
      hashtags: ['Finance', 'GreenEnergy', 'Investing'],
      image: 'https://images.pexels.com/photos/590041/pexels-photo-590041.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop'
    },
    {
      id: '4',
      content: 'Amazing concert last night! The energy was incredible 🎵 #Music #Concert #Entertainment',
      author: 'MusicLover',
      avatar: 'https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      likes: 203,
      shares: 45,
      hashtags: ['Music', 'Concert', 'Entertainment'],
      image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop'
    }
  ];

  if (hashtags.length > 0) {
    return mockPosts.filter(post => 
      post.hashtags.some(tag => 
        hashtags.some(searchTag => 
          tag.toLowerCase().includes(searchTag.toLowerCase())
        )
      )
    );
  }

  return mockPosts;
};

export const socialApi = createApi({
  reducerPath: 'socialApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/social', // Mock endpoint
  }),
  endpoints: (builder) => ({
    getSocialPosts: builder.query<SocialPost[], { hashtags?: string[] }>({
      queryFn: ({ hashtags = [] }) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({ data: generateMockSocialPosts(hashtags) });
          }, 500);
        });
      },
    }),
    searchSocialPosts: builder.query<SocialPost[], { query: string }>({
      queryFn: ({ query }) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            const allPosts = generateMockSocialPosts();
            const filteredPosts = allPosts.filter(post =>
              post.content.toLowerCase().includes(query.toLowerCase()) ||
              post.hashtags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
            );
            resolve({ data: filteredPosts });
          }, 500);
        });
      },
    }),
  }),
});

export const { useGetSocialPostsQuery, useSearchSocialPostsQuery } = socialApi;