import type { BlogPost } from '@/types/blog';
import { post as post7 } from '@/data/blog/post-7';
import { post as post8 } from '@/data/blog/post-8-paradigms';
import { post as post9 } from '@/data/blog/post-9-react-vs-nextjs';
import { post as post10 } from '@/data/blog/post-10-frontend-architecture';

export type { BlogPost };

const blogPosts: BlogPost[] = [post7, post8, post9, post10];

export { blogPosts };

export const getBlogPostById = (id: number): BlogPost | undefined => {
  return blogPosts.find((post) => post.id === id);
};
