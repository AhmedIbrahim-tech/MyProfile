import { useState, useEffect, useCallback } from 'react';
import { blogService } from '@/modules/blog/services/blogService';
import type { BlogPost } from '@/modules/blog/types';

export const useBlogPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await blogService.getAllPosts();
      setPosts(data);
    } catch (err) {
      setError('Failed to fetch blog posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { posts, loading, error, refetch: fetchPosts };
};
