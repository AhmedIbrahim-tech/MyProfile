import { blogPosts, getBlogPostById, type BlogPost } from '@/data/blogData';

export type { BlogPost };

export const blogService = {
  getAllPosts: async (): Promise<BlogPost[]> => {
    const sorted = [...blogPosts].sort((a, b) => {
      const byDate = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (byDate !== 0) return byDate;
      return b.id - a.id;
    });
    return sorted;
  },

  getPostById: async (id: number): Promise<BlogPost | null> => {
    const post = getBlogPostById(id);
    return post ?? null;
  },
};
