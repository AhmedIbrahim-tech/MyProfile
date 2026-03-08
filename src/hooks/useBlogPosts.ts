import { useState, useEffect } from 'react';
import { blogService, type BlogPost } from '../services/blogService';

export const useBlogPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
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
    };

    fetchPosts();
  }, []);

  const refetch = async () => {
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
  };

  return { posts, loading, error, refetch };
};

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

    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await blogService.getPostById(id);
        setPost(data);
      } catch (err) {
        setError('Failed to fetch blog post');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  return { post, loading, error };
};

