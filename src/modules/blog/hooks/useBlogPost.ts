import { useState, useEffect } from 'react';
import { blogService } from '@/modules/blog/services/blogService';
import type { BlogPost } from '@/modules/blog/types';

export const useBlogPost = (id: number | undefined) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setPost(null);
      setLoading(false);
      return;
    }

    let isMounted = true;
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await blogService.getPostById(id);
        if (isMounted) {
          setPost(data);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to fetch blog post');
          console.error(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPost();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { post, loading, error };
};
