import type { BlogPost } from '@/modules/blog/types';
import { post as post1 } from '@/data/blog/post-1-process-vs-thread';
import { post as post2 } from '@/data/blog/post-2-csrf';
import { post as post3 } from '@/data/blog/post-3-backend-architectures';
import { post as post4 } from '@/data/blog/post-4-task-vs-thread';
import { post as post5 } from '@/data/blog/post-5-database-performance';
import { post as post6 } from '@/data/blog/post-6-react-folder-structure';
import { post as post7 } from '@/data/blog/post-7-frontend-architecture';
import { post as post8 } from '@/data/blog/post-8-angular-architecture';
import { post as post9 } from '@/data/blog/post-9-notification-idempotency';
import { post as post10 } from '@/data/blog/post-10-health-check';
import { post as post11 } from '@/data/blog/post-11-sqlserver-vs-postgresql';
import { post as post12 } from '@/data/blog/post-12-domain-events';
import { post as post13 } from '@/data/blog/post-13-ef-core-timestamps';
import { post as post14 } from '@/data/blog/post-14-ddd';
import { post as post15 } from '@/data/blog/post-15-ddd-tactical';
import { post as post16 } from '@/data/blog/post-16-ddd-aspnet';
import { post as post17 } from '@/data/blog/post-17-reflection';
import { post as post18 } from '@/data/blog/post-18-recursion';
import { post as post19 } from '@/data/blog/post-19-paradigms';
import { post as post20 } from '@/data/blog/post-20-react-vs-nextjs';
import { post as post21 } from '@/data/blog/post-21-cicd-github-actions';
import { post as post22 } from '@/data/blog/post-22-exception-handling-aspnetcore';
import { post as post23 } from '@/data/blog/post-23-command-vs-query-cqrs-mediatr';
import { post as post24 } from '@/data/blog/post-24-auth-cookies-jwt-oauth-oidc';
import { post as post25 } from '@/data/blog/post-25-retries-timeouts-circuit-breaker-polly';
import { post as post26 } from '@/data/blog/post-26-types-of-classes-csharp';
import { post as post27 } from '@/data/blog/system-design/post-27-system-design-fundamentals';
import { post as post28 } from '@/data/blog/system-design/post-28-scalability';
import { post as post29 } from '@/data/blog/system-design/post-29-cap-theorem';
import { post as post30 } from '@/data/blog/system-design/post-30-database-replication';
import { post as post31 } from '@/data/blog/system-design/post-31-replication-strategies';

export type { BlogPost };

const blogPosts: BlogPost[] = [
  post1,
  post2,
  post3,
  post4,
  post5,
  post6,
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
  post27,
  post28,
  post29,
  post30,
  post31,
];

export { blogPosts };

export const getBlogPostById = (id: number): BlogPost | undefined => {
  return blogPosts.find((post) => post.id === id);
};
