import { createElement, Fragment, type ReactNode } from 'react';
import type { TocEntry } from '@/modules/blog/types';
import { slugify } from './slugify';

/**
 * Parses inline code (`code`), external links ([text](url)), and strong emphasis (**text**)
 * within a text node.
 */
export function parseInlineCodeAndText(node: ReactNode): ReactNode {
  if (typeof node !== 'string') return node;
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  const re = /(`[^`]+`)|(\[([^\]]+)\]\((https?:\/\/[^\s)]+)\))|(\*\*([^*]+)\*\*)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(node)) !== null) {
    if (m.index > lastIndex) {
      parts.push(node.slice(lastIndex, m.index));
    }
    if (m[1]) {
      parts.push(
        <code key={m.index} className="content-inline-code">
          {m[1].slice(1, -1)}
        </code>
      );
    } else if (m[2]) {
      parts.push(
        <a
          key={m.index}
          href={m[4]}
          target="_blank"
          rel="noopener noreferrer"
          className="content-inline-link"
        >
          {m[3]}
        </a>
      );
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
  tocEntries: TocEntry[] = []
): ReactNode {
  let tocIndex = 0;
  const parts = content.split(/(```[\s\S]*?```)/g);
  return parts.map((part, partIndex) => {
    if (part.startsWith('```')) {
      const match = part.match(/```(\w+)?\n?([\s\S]*?)```/);
      if (match) {
        const language = match[1] || '';
        const code = match[2];
        return (
          <Fragment key={partIndex}>
            <pre className="code-block">
              <code className={language ? `language-${language}` : ''}>{code}</code>
            </pre>
          </Fragment>
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
        const text = trimmed.replace(/^#+\s*/, '');
        const headerLevel = Math.min(level, 6);
        const HeaderTag = `h${headerLevel}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
        const entry = tocEntries[tocIndex++];
        const id = entry?.id ?? slugify(text);
        nodes.push(
          createElement(
            HeaderTag,
            { key: lineKey, id, className: `content-header h${level}` },
            text
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

      if (trimmed.startsWith('> ')) {
        const blockquoteLines: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith('> ')) {
          blockquoteLines.push(lines[i].trim().slice(2));
          i++;
        }
        nodes.push(
          <blockquote key={lineKey} className="content-blockquote">
            {blockquoteLines.map((t, j) => (
              <p key={j} className="content-blockquote-p">
                {parseInlineCodeAndText(t)}
              </p>
            ))}
          </blockquote>
        );
        continue;
      }

      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const items: string[] = [];
        while (i < lines.length && (lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('* '))) {
          items.push(lines[i].trim().slice(2));
          i++;
        }
        nodes.push(
          <ul key={lineKey} className="content-list content-list-ul">
            {items.map((item, j) => (
              <li key={j}>{parseInlineCodeAndText(item)}</li>
            ))}
          </ul>
        );
        continue;
      }

      const orderedMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
      if (orderedMatch) {
        const items: string[] = [];
        while (i < lines.length) {
          const m = lines[i].trim().match(/^\d+\.\s+(.+)$/);
          if (!m) break;
          items.push(m[1]);
          i++;
        }
        nodes.push(
          <ol key={lineKey} className="content-list content-list-ol">
            {items.map((item, j) => (
              <li key={j}>{parseInlineCodeAndText(item)}</li>
            ))}
          </ol>
        );
        continue;
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
