import { blogSeries } from '@/data/blogSeries';
import type { BlogSeries, BlogSeriesItem, BlogSeriesStats } from '@/modules/blog/types';

export const getAllSeries = (): BlogSeries[] => {
  return blogSeries;
};

export const getSeriesBySlug = (slug: string): BlogSeries | undefined => {
  if (!slug) return undefined;
  return blogSeries.find(
    (series) => series.slug.toLowerCase() === slug.toLowerCase() || series.id === slug
  );
};

export const getSeriesStats = (series: BlogSeries): BlogSeriesStats => {
  const totalTopics = series.items.length;
  const publishedCount = series.items.filter((item) => item.status === 'published' && item.articleId !== undefined).length;
  const comingSoonCount = totalTopics - publishedCount;

  return {
    totalTopics,
    publishedCount,
    comingSoonCount,
  };
};

export const getPublishedSeriesItems = (series: BlogSeries): BlogSeriesItem[] => {
  return series.items
    .filter((item) => item.status === 'published' && item.articleId !== undefined)
    .sort((a, b) => a.order - b.order);
};

export const getFirstPublishedSeriesArticle = (series: BlogSeries): BlogSeriesItem | null => {
  const published = getPublishedSeriesItems(series);
  return published[0] ?? null;
};

export interface SeriesArticleContext {
  series: BlogSeries;
  item: BlogSeriesItem;
  position: number;
  total: number;
}

export const getSeriesForArticle = (articleId: number): SeriesArticleContext | null => {
  if (!articleId) return null;

  for (const series of blogSeries) {
    const item = series.items.find(
      (it) => it.status === 'published' && it.articleId === articleId
    );
    if (item) {
      return {
        series,
        item,
        position: item.order,
        total: series.items.length,
      };
    }
  }

  return null;
};

export const getPreviousSeriesArticle = (
  articleId: number,
  seriesParam?: BlogSeries
): BlogSeriesItem | null => {
  const context = seriesParam ? null : getSeriesForArticle(articleId);
  const series = seriesParam ?? context?.series;
  if (!series) return null;

  const currentItem = series.items.find((it) => it.articleId === articleId);
  if (!currentItem) return null;

  const candidatePrevItems = series.items
    .filter(
      (it) =>
        it.status === 'published' &&
        it.articleId !== undefined &&
        it.order < currentItem.order
    )
    .sort((a, b) => b.order - a.order);

  return candidatePrevItems[0] ?? null;
};

export const getNextSeriesArticle = (
  articleId: number,
  seriesParam?: BlogSeries
): BlogSeriesItem | null => {
  const context = seriesParam ? null : getSeriesForArticle(articleId);
  const series = seriesParam ?? context?.series;
  if (!series) return null;

  const currentItem = series.items.find((it) => it.articleId === articleId);
  if (!currentItem) return null;

  const candidateNextItems = series.items
    .filter(
      (it) =>
        it.status === 'published' &&
        it.articleId !== undefined &&
        it.order > currentItem.order
    )
    .sort((a, b) => a.order - b.order);

  return candidateNextItems[0] ?? null;
};

export const blogSeriesService = {
  getAllSeries,
  getSeriesBySlug,
  getSeriesStats,
  getPublishedSeriesItems,
  getFirstPublishedSeriesArticle,
  getSeriesForArticle,
  getPreviousSeriesArticle,
  getNextSeriesArticle,
};
