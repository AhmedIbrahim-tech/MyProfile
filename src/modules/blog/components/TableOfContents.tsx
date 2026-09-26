import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import type { TocEntry } from '@/modules/blog/types';

export interface TableOfContentsProps {
  entries: TocEntry[];
  isArabic?: boolean;
}

export interface TocSection {
  id: string;
  text: string;
  level: number;
  subsections: TocEntry[];
}

/**
 * Groups raw H2 and H3 TOC entries into hierarchical sections.
 * Excludes H4+ and counts only primary H2 sections.
 */
function groupTocSections(entries: TocEntry[]): TocSection[] {
  const sections: TocSection[] = [];
  let currentH2: TocSection | null = null;

  for (const entry of entries) {
    if (entry.level === 2) {
      currentH2 = {
        id: entry.id,
        text: entry.text,
        level: 2,
        subsections: [],
      };
      sections.push(currentH2);
    } else if (entry.level === 3 && currentH2) {
      currentH2.subsections.push(entry);
    }
  }

  return sections;
}

export const TableOfContents = ({ entries, isArabic = false }: TableOfContentsProps) => {
  const sections = useMemo(() => groupTocSections(entries), [entries]);

  // Hide TOC completely if fewer than 4 primary H2 sections exist
  const shouldRender = sections.length >= 4;

  const [activeH2Id, setActiveH2Id] = useState<string>(sections[0]?.id ?? '');
  const [activeH3Id, setActiveH3Id] = useState<string | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [manuallyExpandedH2, setManuallyExpandedH2] = useState<string | null>(null);

  const desktopNavRef = useRef<HTMLElement>(null);
  const overlayListRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Active H2 for expansion (either current intersection or manually expanded)
  const expandedH2Id = manuallyExpandedH2 ?? activeH2Id;

  // Track active section using IntersectionObserver on H2 and H3 headings
  useEffect(() => {
    if (!shouldRender) return;

    const headingElements = Array.from(
      document.querySelectorAll<HTMLElement>('.content-header.h2, .content-header.h3')
    );

    if (headingElements.length === 0) return;

    // Build mapping from heading ID to its parent H2 section
    const headingToH2Map = new Map<string, string>();
    for (const sec of sections) {
      headingToH2Map.set(sec.id, sec.id);
      for (const sub of sec.subsections) {
        headingToH2Map.set(sub.id, sec.id);
      }
    }

    const observer = new IntersectionObserver(
      (observerEntries) => {
        // Find visible headings above or near the top
        const visibleHeadings = observerEntries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visibleHeadings.length > 0) {
          const topVisible = visibleHeadings[0].target as HTMLElement;
          const id = topVisible.id;
          const parentH2 = headingToH2Map.get(id);

          if (parentH2) {
            setActiveH2Id(parentH2);
            if (topVisible.classList.contains('h3')) {
              setActiveH3Id(id);
            } else {
              setActiveH3Id(null);
            }
          }
        }
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: 0,
      }
    );

    headingElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [sections, shouldRender]);

  // Auto-scroll active item into view inside the desktop TOC scroll area
  useEffect(() => {
    if (!desktopNavRef.current) return;
    const activeEl = desktopNavRef.current.querySelector<HTMLElement>('.is-active');
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [activeH2Id, activeH3Id]);

  // Lock body scroll when mobile/tablet overlay is open
  useEffect(() => {
    if (isOverlayOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOverlayOpen]);

  // Close overlay on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOverlayOpen) {
        setIsOverlayOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOverlayOpen]);

  const handleHeadingNavigate = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.preventDefault();
      const target = document.getElementById(id);
      if (target) {
        const prefersReducedMotion = window.matchMedia(
          '(prefers-reduced-motion: reduce)'
        ).matches;
        target.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start',
        });
        window.history.pushState(null, '', `#${id}`);
        target.focus({ preventScroll: true });
      }
      setIsOverlayOpen(false);
    },
    []
  );

  if (!shouldRender) {
    return null;
  }

  const titleText = isArabic ? 'المحتويات' : 'Contents';
  const sectionsCountText = isArabic
    ? `${sections.length} أقسام`
    : `${sections.length} sections`;

  return (
    <>
      {/* 1. Mobile & Tablet Trigger Bar (Hidden on Desktop) */}
      <div className="blog-details-toc-mobile-bar" aria-label="Mobile table of contents">
        <button
          ref={triggerRef}
          type="button"
          className="blog-details-toc-trigger"
          onClick={() => setIsOverlayOpen(true)}
          aria-expanded={isOverlayOpen}
          aria-haspopup="dialog"
          aria-label={isArabic ? 'فتح قائمة المحتويات' : 'Open table of contents'}
        >
          <span className="blog-details-toc-trigger-icon" aria-hidden="true">
            <i className="fas fa-list-ul" />
          </span>
          <span className="blog-details-toc-trigger-label">{titleText}</span>
          <span className="blog-details-toc-trigger-sep" aria-hidden="true">
            ·
          </span>
          <span className="blog-details-toc-trigger-count">{sectionsCountText}</span>
          <i
            className="fas fa-chevron-right blog-details-toc-trigger-chevron"
            aria-hidden="true"
          />
        </button>
      </div>

      {/* 2. Desktop Sticky Sidebar (Hidden on Tablet & Mobile) */}
      <nav
        ref={desktopNavRef}
        className="blog-details-toc-desktop"
        aria-label="Table of contents"
      >
        <div className="blog-details-toc-sidebar-header">
          <span className="blog-details-toc-sidebar-title">{titleText}</span>
          <span className="blog-details-toc-sidebar-count">{sectionsCountText}</span>
        </div>

        <ul className="blog-details-toc-tree">
          {sections.map((section) => {
            const isH2Active = activeH2Id === section.id;
            const hasSubsections = section.subsections.length > 0;
            const isExpanded = isH2Active;

            return (
              <li key={section.id} className="blog-details-toc-tree-item">
                <a
                  href={`#${section.id}`}
                  onClick={(e) => handleHeadingNavigate(section.id, e)}
                  className={`blog-details-toc-tree-link h2 ${isH2Active ? 'is-active' : ''}`}
                >
                  <span className="blog-details-toc-indicator" aria-hidden="true" />
                  <span className="blog-details-toc-tree-text">{section.text}</span>
                </a>

                {/* Subsections: Only shown for the currently active H2 */}
                {hasSubsections && isExpanded && (
                  <ul className="blog-details-toc-sublist" aria-label={section.text}>
                    {section.subsections.map((sub) => {
                      const isH3Active = activeH3Id === sub.id;
                      return (
                        <li key={sub.id} className="blog-details-toc-subitem">
                          <a
                            href={`#${sub.id}`}
                            onClick={(e) => handleHeadingNavigate(sub.id, e)}
                            className={`blog-details-toc-tree-link h3 ${isH3Active ? 'is-active' : ''}`}
                          >
                            <span className="blog-details-toc-sub-bullet" aria-hidden="true">
                              –
                            </span>
                            <span className="blog-details-toc-tree-text">{sub.text}</span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* 3. Mobile / Tablet Overlay Navigation (Bottom Sheet / Drawer) */}
      {isOverlayOpen && (
        <div
          className="blog-details-toc-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={titleText}
        >
          {/* Backdrop */}
          <div
            className="blog-details-toc-backdrop"
            onClick={() => setIsOverlayOpen(false)}
            aria-hidden="true"
          />

          {/* Sheet / Drawer Container */}
          <div className="blog-details-toc-sheet">
            <div className="blog-details-toc-sheet-handle" aria-hidden="true" />

            <div className="blog-details-toc-sheet-header">
              <div className="blog-details-toc-sheet-heading">
                <h2 className="blog-details-toc-sheet-title">{titleText}</h2>
                <span className="blog-details-toc-sheet-meta">{sectionsCountText}</span>
              </div>
              <button
                type="button"
                className="blog-details-toc-sheet-close"
                onClick={() => setIsOverlayOpen(false)}
                aria-label={isArabic ? 'إغلاق قائمة المحتويات' : 'Close table of contents'}
              >
                <i className="fas fa-times" aria-hidden="true" />
              </button>
            </div>

            <div ref={overlayListRef} className="blog-details-toc-sheet-body">
              <ul className="blog-details-toc-sheet-list">
                {sections.map((section) => {
                  const isH2Active = activeH2Id === section.id;
                  const hasSubsections = section.subsections.length > 0;
                  const isExpanded = expandedH2Id === section.id;

                  return (
                    <li key={section.id} className="blog-details-toc-sheet-item">
                      <div className="blog-details-toc-sheet-row">
                        <a
                          href={`#${section.id}`}
                          onClick={(e) => handleHeadingNavigate(section.id, e)}
                          className={`blog-details-toc-sheet-link h2 ${isH2Active ? 'is-active' : ''}`}
                        >
                          <span className="blog-details-toc-sheet-indicator" aria-hidden="true" />
                          <span className="blog-details-toc-sheet-text">{section.text}</span>
                        </a>

                        {hasSubsections && (
                          <button
                            type="button"
                            className="blog-details-toc-sheet-toggle"
                            onClick={() =>
                              setManuallyExpandedH2(isExpanded ? null : section.id)
                            }
                            aria-expanded={isExpanded}
                            aria-label={
                              isExpanded
                                ? isArabic
                                  ? 'طي الأقسام الفرعية'
                                  : 'Collapse subsections'
                                : isArabic
                                  ? 'عرض الأقسام الفرعية'
                                  : 'Expand subsections'
                            }
                          >
                            <i
                              className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}
                              aria-hidden="true"
                            />
                          </button>
                        )}
                      </div>

                      {hasSubsections && isExpanded && (
                        <ul className="blog-details-toc-sheet-sublist">
                          {section.subsections.map((sub) => {
                            const isH3Active = activeH3Id === sub.id;
                            return (
                              <li key={sub.id} className="blog-details-toc-sheet-subitem">
                                <a
                                  href={`#${sub.id}`}
                                  onClick={(e) => handleHeadingNavigate(sub.id, e)}
                                  className={`blog-details-toc-sheet-link h3 ${isH3Active ? 'is-active' : ''}`}
                                >
                                  <span
                                    className="blog-details-toc-sub-bullet"
                                    aria-hidden="true"
                                  >
                                    –
                                  </span>
                                  <span className="blog-details-toc-sheet-text">{sub.text}</span>
                                </a>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
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
