import type { TocEntry } from '@/modules/blog/types';
import { slugify } from './slugify';

/**
 * Extracts header elements (h1-h6) from markdown content into a structured Table of Contents.
 */
export function extractHeadings(content: string): TocEntry[] {
  const seen = new Map<string, number>();
  const entries: TocEntry[] = [];
  const lines = content.split('\n');
  for (const line of lines) {
    const match = line.trim().match(/^(#{1,6})\s+(.+)$/);
    if (!match) continue;
    const level = match[1].length;
    const text = match[2].trim();
    const baseId = slugify(text);
    const count = (seen.get(baseId) ?? 0) + 1;
    seen.set(baseId, count);
    entries.push({
      id: count === 1 ? baseId : `${baseId}-${count}`,
      text,
      level,
    });
  }
  return entries;
}
