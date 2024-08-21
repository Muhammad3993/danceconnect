import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useRef, useState } from 'react';
import { DCAmity } from '../';

export function useGetAmityUserPosts(userId: string) {
  const [posts, setPosts] = useState<Amity.Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isloadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const getNextPage = useRef<() => void | null>();

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = DCAmity.queryUserPosts({
        userId,
        onGetPosts: ({ data, onNextPage, hasNextPage, loading, error }) => {
          if (error) {
            setError(error.message);
            setIsLoadingMore(false);
            setIsLoading(false);
            setPosts([]);
            return;
          }

          if (!loading) {
            setPosts(data ?? []);
            setIsLoading(false);
            setIsLoadingMore(false);
          } else {
            setIsLoadingMore(true);
          }

          if (hasNextPage && onNextPage) {
            getNextPage.current = onNextPage;
          }
        },
      });

      return () => {
        unsubscribe();
      };
    }, [userId]),
  );

  return {
    posts,
    isLoading,
    isloadingMore: isLoading ? false : isloadingMore,
    error,
    getNextPage: getNextPage.current,
  };
}
