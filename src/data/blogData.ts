import type { BlogPost } from '@/types/blog';
import { post as post7 } from '@/data/blog/post-7';
import { post as post8 } from '@/data/blog/post-8-paradigms';
import { post as post9 } from '@/data/blog/post-9-react-vs-nextjs';
import { post as post10 } from '@/data/blog/post-10-frontend-architecture';
import { post as post11 } from '@/data/blog/post-11-csrf';
import { post as post12 } from '@/data/blog/post-12-process-vs-thread';
import { post as post13 } from '@/data/blog/post-13-backend-architectures';
import { post as post14 } from '@/data/blog/post-14-database-performance';
import { post as post15 } from '@/data/blog/post-15-task-vs-thread';
import { post as post16 } from '@/data/blog/post-16-react-folder-structure';
import { post as post17 } from '@/data/blog/post-17-angular-architecture';
import { post as post18 } from '@/data/blog/post-18-notification-idempotency';
import { post as post19 } from '@/data/blog/post-19-health-check';
import { post as post20 } from '@/data/blog/post-20-sqlserver-vs-postgresql';
import { post as post21 } from '@/data/blog/post-21-domain-events';
import { post as post22 } from '@/data/blog/post-22-ef-core-timestamps';
import { post as post23 } from '@/data/blog/post-23-ddd';
import { post as post24 } from '@/data/blog/post-24-ddd-tactical';
import { post as post25 } from '@/data/blog/post-25-ddd-aspnet';
import { post as post26 } from '@/data/blog/post-26-recursion';

export type { BlogPost };

const blogPosts: BlogPost[] = [
  post7,
  post8,
  post9,
  post10,
  post11,
  post12,
  post13,
  post14,
  post15,
  post16,
  post17,
  post18,
  post19,
  post20,
  post21,
  post22,
  post23,
  post24,
  post25,
  post26,
];

export { blogPosts };

export const getBlogPostById = (id: number): BlogPost | undefined => {
  return blogPosts.find((post) => post.id === id);
};
