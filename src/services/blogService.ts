import { blogPosts, getBlogPostById, type BlogPost } from '../data/blogData';

export type { BlogPost };

export const blogService = {
  getAllPosts: async (): Promise<BlogPost[]> => {
    const sorted = [...blogPosts].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return sorted;
  },

  getPostById: async (id: number): Promise<BlogPost | null> => {
    const post = getBlogPostById(id);
    return post ?? null;
  },
};
