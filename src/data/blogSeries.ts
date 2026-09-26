import type { BlogSeries } from '@/modules/blog/types';
import systemDesignSeriesCover from '@/assets/blog/system-design/system-design-series.jpg';

export const blogSeries: BlogSeries[] = [
  {
    id: 'system-design',
    slug: 'system-design',
    title: 'System Design',
    shortTitle: 'System Design',
    description:
      'A structured journey through the foundations of designing scalable, reliable, distributed systems.',
    intro:
      'A comprehensive roadmap covering core architectural principles, data replication models, consistency trade-offs, and critical distributed building blocks.',
    image: systemDesignSeriesCover,
    items: [
      {
        order: 1,
        title: 'System Design Fundamentals',
        description:
          'Core architectural principles, latency vs. throughput trade-offs, and fundamental system evaluation criteria.',
        articleId: 27,
        status: 'published',
      },
      {
        order: 2,
        title: 'Scalability',
        description:
          'Vertical versus horizontal scaling, stateless services, load balancing, and handling growing system traffic.',
        articleId: 28,
        status: 'published',
      },
      {
        order: 3,
        title: 'CAP Theorem',
        description:
          'Understanding consistency, availability, and partition tolerance trade-offs in distributed data systems.',
        articleId: 29,
        status: 'published',
      },
      {
        order: 4,
        title: 'Intro to Database Replication',
        description:
          'Fundamental concepts of copying data across nodes, fault tolerance, and synchronization basics.',
        articleId: 30,
        status: 'published',
      },
      {
        order: 5,
        title: 'Replication Strategies',
        description:
          'Synchronous vs. asynchronous replication modes and their direct impact on durability and latency.',
        articleId: 31,
        status: 'published',
      },
      {
        order: 6,
        title: 'Single-Leader',
        description:
          'Primary-replica architecture, write flow handling, read distribution, and leader failover mechanisms.',
        status: 'coming-soon',
      },
      {
        order: 7,
        title: 'Multi-Leader',
        description:
          'Replication across multiple active datacenters, handling concurrent writes, and conflict resolution.',
        status: 'coming-soon',
      },
      {
        order: 8,
        title: 'Leaderless',
        description:
          'Quorum consensus architectures, read repair, sloppy quorums, and anti-entropy with Merkle trees.',
        status: 'coming-soon',
      },
      {
        order: 9,
        title: 'Tackling Stale Reads',
        description:
          'Read-after-write consistency, monotonic reads, and practical solutions for replication lag.',
        status: 'coming-soon',
      },
      {
        order: 10,
        title: 'Caching Strategies',
        description:
          'Cache-aside, read-through, write-through, write-behind, and cache invalidation patterns.',
        status: 'coming-soon',
      },
      {
        order: 11,
        title: 'Message Queue',
        description:
          'Decoupling distributed components, asynchronous processing, message brokers, and delivery guarantees.',
        status: 'coming-soon',
      },
    ],
  },
];
