import type { TocEntry } from '@/modules/blog/types';
import { slugify } from './slugify';

/**
 * Extracts selective header elements (H2 and H3 only) from markdown content into a structured Table of Contents.
 * Ignores code fences (e.g. bash comments) and excludes H4-H6 from navigation.
 */
export function extractHeadings(content: string): TocEntry[] {
  const seen = new Map<string, number>();
  const entries: TocEntry[] = [];

  // Split by code fences so lines inside code blocks (e.g. # comments) are never extracted
  const parts = content.split(/(```[\s\S]*?```)/g);

  for (const part of parts) {
    if (part.startsWith('```')) continue;

    const lines = part.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      const match = trimmed.match(/^(#{1,6})\s+(.+)$/);
      if (!match) continue;

      const rawLevel = match[1].length;
      const text = trimmed.replace(/^#+\s*/, '').trim();
      // Demote markdown headings by 1 level (e.g. # -> h2, ## -> h3) to match HTML render
      const headerLevel = Math.min(rawLevel + 1, 6);

      const baseId = slugify(text);
      const count = (seen.get(baseId) ?? 0) + 1;
      seen.set(baseId, count);
      const id = count === 1 ? baseId : `${baseId}-${count}`;

      // Selective TOC: H2 is primary section, H3 is secondary subsection. H4+ excluded.
      if (headerLevel === 2 || headerLevel === 3) {
        entries.push({
          id,
          text,
          level: headerLevel,
        });
      }
    }
  }

  return entries;
}
