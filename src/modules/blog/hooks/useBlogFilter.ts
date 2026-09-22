import { useState, useMemo } from 'react';
import type { BlogPost } from '@/modules/blog/types';

export interface UseBlogFilterProps {
  posts: BlogPost[];
  initialCategory?: string;
}

export const useBlogFilter = ({ posts, initialCategory = 'all' }: UseBlogFilterProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = useMemo(() => {
    const cats = new Set<string>(['all']);
    posts.forEach((post) => {
      if (post.category) cats.add(post.category);
    });
    return Array.from(cats);
  }, [posts]);

  const filteredPosts = useMemo(() => {
    let list =
      selectedCategory === 'all'
        ? posts
        : posts.filter((post) => post.category === selectedCategory);

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (post) =>
          post.title.toLowerCase().includes(q) ||
          post.excerpt.toLowerCase().includes(q) ||
          (post.category && post.category.toLowerCase().includes(q))
      );
    }
    return list;
  }, [posts, selectedCategory, searchQuery]);

  const featuredPosts = useMemo(
    () => filteredPosts.filter((post) => post.featured === true),
    [filteredPosts]
  );

  const regularPosts = useMemo(
    () => filteredPosts.filter((post) => post.featured !== true),
    [filteredPosts]
  );

  return {
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    categories,
    filteredPosts,
    featuredPosts,
    regularPosts,
  };
};
