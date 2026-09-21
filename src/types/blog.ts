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
