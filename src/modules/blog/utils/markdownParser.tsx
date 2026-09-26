import { createElement, Fragment, type ReactNode } from 'react';
import type { TocEntry } from '@/modules/blog/types';
import { slugify } from './slugify';
import { CodeBlock } from '../components/CodeBlock';

interface RawListItem {
  indent: number;
  type: 'ul' | 'ol';
  lines: string[];
}

/**
 * Recursively renders hierarchical markdown lists (unordered and ordered) with proper nesting.
 */
function renderListHierarchy(items: RawListItem[], keyPrefix: string): ReactNode {
  if (items.length === 0) return null;

  const minIndent = Math.min(...items.map((it) => it.indent));
  const firstItem = items.find((it) => it.indent === minIndent);
  const listType = firstItem?.type ?? 'ul';

  const groups: { item: RawListItem; children: RawListItem[] }[] = [];

  for (const it of items) {
    if (it.indent <= minIndent || groups.length === 0) {
      groups.push({ item: it, children: [] });
    } else {
      groups[groups.length - 1].children.push(it);
    }
  }

  const Tag = listType === 'ol' ? 'ol' : 'ul';
  const className = `content-list content-list-${listType}`;

  return (
    <Tag key={keyPrefix} className={className}>
      {groups.map((group, idx) => {
        const itemKey = `${keyPrefix}-${idx}`;
        return (
          <li key={itemKey}>
            {group.item.lines.map((l, lineIdx) => (
              <Fragment key={lineIdx}>
                {lineIdx > 0 && ' '}
                {parseInlineCodeAndText(l)}
              </Fragment>
            ))}
            {group.children.length > 0 &&
              renderListHierarchy(group.children, `${itemKey}-sub`)}
          </li>
        );
      })}
    </Tag>
  );
}

/**
 * Parses inline code (`code`), markdown links ([text](url)), and strong emphasis (**text**)
 * within a text node. Supports both external URLs and internal/relative links.
 */
export function parseInlineCodeAndText(node: ReactNode): ReactNode {
  if (typeof node !== 'string') return node;
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  // Match `inline-code`, [link text](url), and **strong text**
  const re = /(`[^`]+`)|(\[([^\]]+)\]\(([^)\s]+)\))|(\*\*([^*]+)\*\*)/g;
  let m: RegExpExecArray | null;

  while ((m = re.exec(node)) !== null) {
    if (m.index > lastIndex) {
      parts.push(node.slice(lastIndex, m.index));
    }
    if (m[1]) {
      parts.push(
        <code key={m.index} className="content-inline-code" dir="ltr">
          {m[1].slice(1, -1)}
        </code>
      );
    } else if (m[2]) {
      const linkText = m[3];
      const href = m[4];
      const isExternal = /^https?:\/\//i.test(href);

      if (isExternal) {
        parts.push(
          <a
            key={m.index}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="content-inline-link"
          >
            {linkText}
          </a>
        );
      } else {
        parts.push(
          <a key={m.index} href={href} className="content-inline-link">
            {linkText}
          </a>
        );
      }
    } else {
      parts.push(
        <strong key={m.index} className="content-inline-strong">
          {m[6]}
        </strong>
      );
    }
    lastIndex = m.index + m[0].length;
  }

  if (lastIndex < node.length) parts.push(node.slice(lastIndex));
  return parts.length <= 1 ? (parts[0] ?? node) : <>{parts}</>;
}

/**
 * Transforms raw markdown content into structured React elements matching profile blog styling.
 */
export function formatMarkdownContent(
  content: string,
  _tocEntries: TocEntry[] = [],
  isRtl = false
): ReactNode {
  const headingSeen = new Map<string, number>();
  const parts = content.split(/(```[\s\S]*?```)/g);

  return parts.map((part, partIndex) => {
    if (part.startsWith('```')) {
      const match = part.match(/```([^\n\r]*)\r?\n?([\s\S]*?)```/);
      if (match) {
        const language = (match[1] || '').trim();
        const code = match[2] ?? '';
        return (
          <CodeBlock
            key={`code-${partIndex}`}
            code={code}
            language={language}
            isRtl={isRtl}
          />
        );
      }
    }

    const lines = part.split('\n');
    const nodes: ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();
      const lineKey = `line-${partIndex}-${i}`;

      if (trimmed.startsWith('#')) {
        const level = trimmed.match(/^#+/)?.[0].length ?? 1;
        const text = trimmed.replace(/^#+\s*/, '').trim();
        // Ensure only ONE H1 exists on the page (article title). Demote markdown headings by 1 level (e.g. # -> h2, ## -> h3).
        const headerLevel = Math.min(level + 1, 6);
        const HeaderTag = `h${headerLevel}` as 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
        const baseId = slugify(text);
        const count = (headingSeen.get(baseId) ?? 0) + 1;
        headingSeen.set(baseId, count);
        const id = count === 1 ? baseId : `${baseId}-${count}`;

        nodes.push(
          createElement(
            HeaderTag,
            { key: lineKey, id, className: `content-header h${headerLevel}` },
            parseInlineCodeAndText(text)
          )
        );
        i++;
        continue;
      }

      if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
        nodes.push(<hr key={lineKey} className="content-hr" />);
        i++;
        continue;
      }

      const imgMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
      if (imgMatch) {
        nodes.push(
          <figure key={lineKey} className="content-image-wrapper">
            <img src={imgMatch[2]} alt={imgMatch[1]} className="content-image" loading="lazy" />
            {imgMatch[1] && <figcaption className="content-image-caption">{imgMatch[1]}</figcaption>}
          </figure>
        );
        i++;
        continue;
      }

      if (trimmed.startsWith('> ') || trimmed === '>') {
        const quoteLines: string[] = [];
        while (i < lines.length && (lines[i].trim().startsWith('> ') || lines[i].trim() === '>')) {
          const raw = lines[i].trim();
          quoteLines.push(raw === '>' ? '' : raw.slice(2));
          i++;
        }

        // Check if first non-empty line matches admonition callout: [!NOTE], [!TIP], [!WARNING], [!IMPORTANT]
        const firstNonEmpty = quoteLines.find((l) => l.trim().length > 0) || '';
        const calloutMatch = firstNonEmpty.trim().match(/^\[!(NOTE|TIP|WARNING|IMPORTANT)\]\s*(.*)$/i);

        if (calloutMatch) {
          const typeKey = calloutMatch[1].toUpperCase();
          const inlineRest = calloutMatch[2];

          const typeClassMap: Record<string, string> = {
            NOTE: 'info',
            TIP: 'highlight',
            WARNING: 'warning',
            IMPORTANT: 'warning',
          };
          const calloutClass = typeClassMap[typeKey] || 'info';

          const titleMap: Record<string, { en: string; ar: string; icon: string }> = {
            NOTE: { en: 'Note', ar: 'ملاحظة', icon: 'fa-circle-info' },
            TIP: { en: 'Tip', ar: 'نصيحة', icon: 'fa-lightbulb' },
            WARNING: { en: 'Warning', ar: 'تحذير', icon: 'fa-triangle-exclamation' },
            IMPORTANT: { en: 'Important', ar: 'هام', icon: 'fa-circle-exclamation' },
          };
          const meta = titleMap[typeKey] || { en: typeKey, ar: typeKey, icon: 'fa-circle-info' };
          const label = isRtl ? meta.ar : meta.en;

          const bodyLines: string[] = [];
          if (inlineRest.trim()) {
            bodyLines.push(inlineRest.trim());
          }
          let passedFirst = false;
          for (const ql of quoteLines) {
            if (!passedFirst && ql.trim() === firstNonEmpty.trim()) {
              passedFirst = true;
              continue;
            }
            if (passedFirst && ql.trim()) {
              bodyLines.push(ql.trim());
            }
          }

          nodes.push(
            <aside key={lineKey} className={`content-callout ${calloutClass}`} role="note">
              <div className="content-callout-header">
                <i className={`fa-solid ${meta.icon}`} aria-hidden="true" />
                <span className="content-callout-title">{label}</span>
              </div>
              <div className="content-callout-body">
                {bodyLines.map((bLine, bIdx) => (
                  <p key={bIdx} className="content-callout-p">
                    {parseInlineCodeAndText(bLine)}
                  </p>
                ))}
              </div>
            </aside>
          );
          continue;
        }

        // Standard blockquote
        nodes.push(
          <blockquote key={lineKey} className="content-blockquote">
            {quoteLines.map((t, j) => (
              <p key={j} className="content-blockquote-p">
                {parseInlineCodeAndText(t)}
              </p>
            ))}
          </blockquote>
        );
        continue;
      }

      // Check if line starts an unordered or ordered list
      const listMatch = line.match(/^(\s*)([-*]|\d+\.)\s+(.+)$/);
      if (listMatch) {
        const rawItems: RawListItem[] = [];

        while (i < lines.length) {
          const rawLine = lines[i];

          // Check for blank line inside list
          if (!rawLine.trim()) {
            let nextIdx = i + 1;
            while (nextIdx < lines.length && !lines[nextIdx].trim()) {
              nextIdx++;
            }
            if (nextIdx < lines.length && /^\s+[-*\d]/.test(lines[nextIdx])) {
              i++;
              continue;
            } else {
              break;
            }
          }

          const itemMatch = rawLine.match(/^(\s*)([-*]|\d+\.)\s+(.+)$/);
          if (itemMatch) {
            const indent = itemMatch[1].replace(/\t/g, '  ').length;
            const type = itemMatch[2] === '-' || itemMatch[2] === '*' ? 'ul' : 'ol';
            const text = itemMatch[3];
            rawItems.push({ indent, type, lines: [text] });
            i++;
          } else {
            // Continuation line for list item (indented at least 2 spaces or tab)
            const continuationMatch = rawLine.match(/^(\s{2,}|\t)(.+)$/);
            if (continuationMatch && rawItems.length > 0) {
              rawItems[rawItems.length - 1].lines.push(continuationMatch[2].trim());
              i++;
            } else {
              break;
            }
          }
        }

        nodes.push(renderListHierarchy(rawItems, lineKey));
        continue;
      }

      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        const nextLine = lines[i + 1]?.trim();
        if (
          nextLine &&
          nextLine.startsWith('|') &&
          nextLine.endsWith('|') &&
          /^\|[\s\-:|]+\|$/.test(nextLine) &&
          nextLine.includes('-')
        ) {
          const parseRow = (rowStr: string) =>
            rowStr
              .trim()
              .slice(1, -1)
              .split('|')
              .map((c) => c.trim());

          const headerCells = parseRow(trimmed);
          const separatorCells = parseRow(nextLine);

          const alignments = separatorCells.map((sep) => {
            const s = sep.trim();
            if (s.startsWith(':') && s.endsWith(':')) return 'center' as const;
            if (s.endsWith(':')) return 'right' as const;
            if (s.startsWith(':')) return 'left' as const;
            return undefined;
          });

          i += 2;
          const rows: string[][] = [];
          while (i < lines.length) {
            const rowTrimmed = lines[i].trim();
            if (!rowTrimmed.startsWith('|') || !rowTrimmed.endsWith('|')) break;
            rows.push(parseRow(rowTrimmed));
            i++;
          }

          nodes.push(
            <div key={lineKey} className="content-table-wrapper">
              <table className="content-table">
                <thead>
                  <tr>
                    {headerCells.map((cell, colIndex) => (
                      <th
                        key={colIndex}
                        style={alignments[colIndex] ? { textAlign: alignments[colIndex] } : undefined}
                      >
                        {parseInlineCodeAndText(cell)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, colIndex) => (
                        <td
                          key={colIndex}
                          style={alignments[colIndex] ? { textAlign: alignments[colIndex] } : undefined}
                        >
                          {parseInlineCodeAndText(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
          continue;
        }
      }

      const emojiPattern = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
      if (trimmed && emojiPattern.test(trimmed.charAt(0))) {
        nodes.push(<p key={lineKey} className="content-paragraph emoji-line">{line}</p>);
        i++;
        continue;
      }

      if (trimmed) {
        nodes.push(
          <p key={lineKey} className="content-paragraph">
            {parseInlineCodeAndText(line)}
          </p>
        );
      } else {
        nodes.push(<br key={lineKey} />);
      }
      i++;
    }

    return <Fragment key={partIndex}>{nodes}</Fragment>;
  });
}
