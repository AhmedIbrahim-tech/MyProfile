import type { BlogPost } from '../types/blog';
import { post as post7 } from './blog/post-7';

export type { BlogPost };

const blogPosts: BlogPost[] = [post7];

export { blogPosts };

export const getBlogPostById = (id: number): BlogPost | undefined => {
  return blogPosts.find((post) => post.id === id);
};
