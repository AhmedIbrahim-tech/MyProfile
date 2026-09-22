import type { TocEntry } from '@/modules/blog/types';

export interface TableOfContentsProps {
  entries: TocEntry[];
}

export const TableOfContents = ({ entries }: TableOfContentsProps) => {
  if (!entries || entries.length === 0) return null;

  return (
    <nav className="blog-details-toc" aria-label="Table of contents">
      <h2 className="blog-details-toc-title">On this page</h2>
      <ul className="blog-details-toc-list">
        {entries.map((entry) => (
          <li key={entry.id} className={`blog-details-toc-item h${entry.level}`}>
            <a href={`#${entry.id}`} className="blog-details-toc-link">
              {entry.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export interface ArticleSummaryProps {
  entries: TocEntry[];
}

export const ArticleSummary = ({ entries }: ArticleSummaryProps) => {
  if (!entries || entries.length === 0) return null;

  const topLevel = entries.filter((e) => e.level <= 2).slice(0, 5);
  if (topLevel.length === 0) return null;

  return (
    <div className="blog-details-summary">
      <h2 className="blog-details-summary-title">What this article covers</h2>
      <ul className="blog-details-summary-list">
        {topLevel.map((e) => (
          <li key={e.id}>
            <a href={`#${e.id}`}>{e.text}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};
