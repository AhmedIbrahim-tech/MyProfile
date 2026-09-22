import { blogPosts, getBlogPostById } from '@/data/blogData';
import type { BlogPost } from '@/modules/blog/types';

export const blogService = {
  /**
   * Returns all blog posts sorted by date descending (and ID descending).
   */
  getAllPosts: async (): Promise<BlogPost[]> => {
    const sorted = [...blogPosts].sort((a, b) => {
      const byDate = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (byDate !== 0) return byDate;
      return b.id - a.id;
    });
    return sorted;
  },

  /**
   * Finds a specific blog post by ID.
   */
  getPostById: async (id: number): Promise<BlogPost | null> => {
    const post = getBlogPostById(id);
    return post ?? null;
  },
};
