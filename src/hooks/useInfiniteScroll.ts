import { useEffect, useCallback, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

interface UseInfiniteScrollOptions {
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

interface UseInfiniteScrollReturn {
  ref: (node?: Element | null) => void;
  inView: boolean;
  loadMore: () => void;
}

export const useInfiniteScroll = ({
  hasMore,
  loading,
  onLoadMore,
  threshold = 0.1,
  rootMargin = '100px',
  enabled = true
}: UseInfiniteScrollOptions): UseInfiniteScrollReturn => {
  const { ref, inView } = useInView({
    threshold,
    rootMargin,
    triggerOnce: false,
  });

  const loadingRef = useRef(loading);
  const hasMoreRef = useRef(hasMore);

  // Update refs to avoid stale closures
  useEffect(() => {
    loadingRef.current = loading;
    hasMoreRef.current = hasMore;
  }, [loading, hasMore]);

  const loadMore = useCallback(() => {
    if (hasMoreRef.current && !loadingRef.current && enabled) {
      onLoadMore();
    }
  }, [onLoadMore, enabled]);

  // Trigger load more when in view
  useEffect(() => {
    if (inView && hasMore && !loading && enabled) {
      loadMore();
    }
  }, [inView, hasMore, loading, enabled, loadMore]);

  return {
    ref,
    inView,
    loadMore
  };
};