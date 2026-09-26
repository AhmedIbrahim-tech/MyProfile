// Public API of Blog Module

// Presentation Components
export { BlogList, BlogList as default } from './components/BlogList';
export { BlogCard, type BlogCardProps } from './components/BlogCard';
export { FeaturedBlogCard, type FeaturedBlogCardProps } from './components/FeaturedBlogCard';
export { BlogFilters, type BlogFiltersProps } from './components/BlogFilters';
export { BlogPagination, type BlogPaginationProps } from './components/BlogPagination';
export { ArticleReader, type ArticleReaderProps } from './components/ArticleReader';
export { ArticleHeader, type ArticleHeaderProps } from './components/ArticleHeader';
export { BlogSeriesDiscovery } from './components/BlogSeriesDiscovery';
export { BlogSeriesList } from './components/BlogSeriesList';
export { BlogSeriesDetail } from './components/BlogSeriesDetail';
export {
  TableOfContents,
  ArticleSummary,
  type TableOfContentsProps,
  type ArticleSummaryProps,
} from './components/TableOfContents';

// Services
export { blogService } from './services/blogService';
export {
  blogSeriesService,
  getAllSeries,
  getSeriesBySlug,
  getSeriesStats,
  getPublishedSeriesItems,
  getFirstPublishedSeriesArticle,
  getSeriesForArticle,
  getPreviousSeriesArticle,
  getNextSeriesArticle,
} from './services/blogSeriesService';

// Hooks
export { useBlogPosts } from './hooks/useBlogPosts';
export { useBlogPost } from './hooks/useBlogPost';
export { useBlogFilter, type UseBlogFilterProps } from './hooks/useBlogFilter';

// Utils
export { extractHeadings } from './utils/tocExtractor';
export { slugify } from './utils/slugify';
export { calculateReadingTime } from './utils/readingTime';
export {
  formatBlogDate,
  getBlogPlaceholderImage,
  containsArabic,
} from './utils/blogFormatters';
export { getVisiblePages } from './utils/pagination';
export {
  formatMarkdownContent,
  parseInlineCodeAndText,
} from './utils/markdownParser';

// Types
export type * from './types';
