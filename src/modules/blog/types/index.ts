export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  image: string;
  /** Only set when the article is explicitly marked as featured. Omitted or false = not featured. */
  featured?: boolean;
}

export interface TocEntry {
  id: string;
  text: string;
  level: number;
}

export type BlogCategory = string;

export type BlogSeriesItemStatus = 'published' | 'coming-soon';

export interface BlogSeriesItem {
  order: number;
  title: string;
  description?: string;
  articleId?: number;
  status: BlogSeriesItemStatus;
}

export interface BlogSeries {
  id: string;
  slug: string;
  title: string;
  shortTitle?: string;
  description: string;
  intro?: string;
  image?: string;
  items: BlogSeriesItem[];
}

export interface BlogSeriesStats {
  totalTopics: number;
  publishedCount: number;
  comingSoonCount: number;
}
