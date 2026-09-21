import { useParams, Link, useNavigate } from 'react-router-dom';
import { createElement, useCallback, useEffect, useMemo, useRef, useState, Fragment, type ReactNode } from 'react';
import { useBlogPost, useBlogPosts } from '@/hooks/useBlogPosts';
import Loading from '@/shared/Loading';
import FeaturedStarBadge from '@/components/FeaturedStarBadge';
import userAvatar from '@/assets/user.jpg';
import '@/assets/styles/pages/BlogDetailsPage.css';

function fallbackCopyText(text: string): boolean {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.top = '0';
  textarea.style.left = '0';
  textarea.style.width = '1px';
  textarea.style.height = '1px';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);
  const ok = document.execCommand('copy');
  document.body.removeChild(textarea);
  return ok;
}

async function copyTextToClipboard(text: string): Promise<boolean> {
  window.focus();
  if (navigator.clipboard?.writeText && document.hasFocus()) {
    try {
      await Promise.race([
        navigator.clipboard.writeText(text),
        new Promise<never>((_, reject) => {
          window.setTimeout(() => reject(new Error('clipboard timeout')), 400);
        }),
      ]);
      return true;
    } catch {
      // Fall through to execCommand fallback.
    }
  }
  try {
    return fallbackCopyText(text);
  } catch {
    return false;
  }
}

const containsArabic = (text: string): boolean => /[\u0600-\u06FF]/.test(text);

export interface TocEntry {
  id: string;
  text: string;
  level: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}-]/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'section';
}

function extractHeadings(content: string): TocEntry[] {
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

function parseInlineCodeAndText(node: ReactNode): ReactNode {
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

const BlogDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const postId = id ? parseInt(id) : undefined;
  const { post, loading, error } = useBlogPost(postId);
  const { posts } = useBlogPosts();
  const [copied, setCopied] = useState(false);
  const copiedTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setCopied(false);
    if (copiedTimeoutRef.current !== null) {
      window.clearTimeout(copiedTimeoutRef.current);
      copiedTimeoutRef.current = null;
    }
  }, [postId]);

  useEffect(() => {
    return () => {
      if (copiedTimeoutRef.current !== null) {
        window.clearTimeout(copiedTimeoutRef.current);
      }
    };
  }, []);

  const handleCopyArticle = useCallback(async () => {
    if (!post) return;
    const text = [post.title, post.excerpt, post.content.trim()].filter(Boolean).join('\n\n');
    const ok = await copyTextToClipboard(text);
    if (!ok) return;
    setCopied(true);
    if (copiedTimeoutRef.current !== null) {
      window.clearTimeout(copiedTimeoutRef.current);
    }
    copiedTimeoutRef.current = window.setTimeout(() => {
      setCopied(false);
      copiedTimeoutRef.current = null;
    }, 2000);
  }, [post]);

  const relatedPosts = useMemo(() => {
    if (!post || !posts.length) return [];
    const sameCategory = posts.filter((p) => p.category === post.category && p.id !== post.id);
    const rest = posts.filter((p) => p.id !== post.id);
    return (sameCategory.length ? sameCategory : rest).slice(0, 3);
  }, [post, posts]);

  const postIndex = useMemo(() => posts.findIndex((p) => p.id === post?.id), [posts, post]);
  const prevPost = postIndex > 0 ? posts[postIndex - 1] : null;
  const nextPost = postIndex >= 0 && postIndex < posts.length - 1 ? posts[postIndex + 1] : null;

  const isArabic = useMemo(() => {
    if (!post) return false;
    return containsArabic(post.title) || containsArabic(post.content) || containsArabic(post.excerpt);
  }, [post]);

  const tocEntries = useMemo(() => (post ? extractHeadings(post.content) : []), [post]);

  if (loading) {
    return (
      <div className="blog-details-page">
        <div className="blog-details-container">
          <div className="not-found-content">
            <Loading message="Loading blog post..." size="lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="blog-details-page">
        <div className="blog-details-container">
          <div className="not-found-content">
            <h1>Post Not Found</h1>
            <p>{error || "The blog post you're looking for doesn't exist."}</p>
            <Link to="/blog" className="back-to-blog-btn">
              <i className="fas fa-arrow-left"></i>
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  let tocIndex = 0;
  const formatContent = (content: string) => {
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
  };

  return (
    <div className={`blog-details-page ${isArabic ? 'rtl' : ''}`}>
      <div className="blog-details-container">
        <button
          type="button"
          className={`back-button ${isArabic ? 'rtl' : ''}`}
          onClick={() => navigate('/blog')}
        >
          {isArabic ? (
            <>
              Back to Blog
              <i className="fas fa-arrow-right"></i>
            </>
          ) : (
            <>
              <i className="fas fa-arrow-left"></i>
              Back to Blog
            </>
          )}
        </button>

        <article className={`blog-details-article ${isArabic ? 'rtl' : ''}`}>
          <header className="blog-details-header">
            <div className="blog-details-image-container">
              <img
                src={post.image}
                alt=""
                className="blog-details-image"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://via.placeholder.com/1200x600/1e293b/94a3b8?text=' +
                    encodeURIComponent(post.title.substring(0, 40));
                }}
              />
              <div className="blog-details-image-overlay" />
              <img
                src={userAvatar}
                alt=""
                className="blog-details-header-avatar"
                width={44}
                height={44}
              />
              <span className="blog-details-read-time-pill" dir="ltr">{post.readTime}</span>
              {post.featured && <FeaturedStarBadge className="blog-details-featured-badge" />}
              <span className="blog-details-category-badge" dir="ltr">{post.category}</span>
            </div>
            <div className="blog-details-header-content">
              <div className="blog-details-title-row">
                <h1 className={`blog-details-title ${isArabic ? 'rtl' : ''}`}>
                  {post.featured && (
                    <i className="fas fa-star blog-details-title-star" aria-hidden="true"></i>
                  )}
                  {post.title}
                </h1>
                <button
                  type="button"
                  className={`blog-details-copy-btn ${copied ? 'copied' : ''}`}
                  onClick={handleCopyArticle}
                  aria-label={isArabic ? 'نسخ المقالة' : 'Copy article'}
                  title={isArabic ? 'نسخ المقالة' : 'Copy article'}
                >
                  <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`} aria-hidden="true"></i>
                  <span>
                    {copied
                      ? isArabic
                        ? 'تم النسخ'
                        : 'Copied'
                      : isArabic
                        ? 'نسخ المقالة'
                        : 'Copy article'}
                  </span>
                </button>
              </div>
              <div className={`blog-details-meta blog-details-meta--split ${isArabic ? 'rtl' : ''}`}>
                <span className="blog-details-meta-left">
                  <span className="blog-details-read-time">
                    <i className="fas fa-clock" aria-hidden="true"></i>
                    {post.readTime}
                  </span>
                  <span className="blog-details-meta-divider" aria-hidden="true"></span>
                  <span className="blog-details-author">
                    <i className="fas fa-user" aria-hidden="true"></i>
                    {post.author}
                  </span>
                </span>
                <span className="blog-details-date">
                  <i className="fas fa-calendar" aria-hidden="true"></i>
                  {formatDate(post.date)}
                </span>
              </div>
              <p className={`blog-details-excerpt blog-details-intro ${isArabic ? 'rtl' : ''}`}>
                {post.excerpt}
              </p>
            </div>
          </header>

          <div className="blog-details-body-wrap">
            {tocEntries.length > 0 && (
              <nav className="blog-details-toc" aria-label="Table of contents">
                <h2 className="blog-details-toc-title">On this page</h2>
                <ul className="blog-details-toc-list">
                  {tocEntries.map((entry) => (
                    <li key={entry.id} className={`blog-details-toc-item h${entry.level}`}>
                      <a href={`#${entry.id}`} className="blog-details-toc-link">
                        {entry.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
            <div className={`blog-details-content ${isArabic ? 'rtl' : ''}`}>
              {tocEntries.length > 0 && (
                <div className="blog-details-summary">
                  <h2 className="blog-details-summary-title">What this article covers</h2>
                  <ul className="blog-details-summary-list">
                    {tocEntries.filter((e) => e.level <= 2).slice(0, 5).map((e) => (
                      <li key={e.id}>
                        <a href={`#${e.id}`}>{e.text}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {formatContent(post.content)}
            </div>
          </div>

          {relatedPosts.length > 0 && (
            <section className="blog-details-related" aria-labelledby="related-heading">
              <h2 id="related-heading" className="blog-details-related-heading">
                Related articles
              </h2>
              <ul className="blog-details-related-list" aria-label="Related articles">
                {relatedPosts.map((p) => (
                  <li key={p.id}>
                    <Link to={`/blog/${p.id}`} className="blog-details-related-card">
                      <div className="blog-details-related-card-image">
                        <img
                          src={p.image}
                          alt=""
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://via.placeholder.com/400x200/1e293b/94a3b8?text=' +
                              encodeURIComponent(p.title.substring(0, 25));
                          }}
                        />
                        <span className="blog-details-related-card-meta" dir="ltr">
                          {p.featured && <i className="fas fa-star" aria-hidden="true"></i>}
                          {p.category} · {p.readTime}
                        </span>
                      </div>
                      <div className="blog-details-related-card-body">
                        <h3 className="blog-details-related-card-title">
                          {p.featured && (
                            <i className="fas fa-star blog-details-title-star" aria-hidden="true"></i>
                          )}
                          {p.title}
                        </h3>
                        <span className="blog-details-related-card-cta">
                          Read article
                          <i className="fas fa-arrow-right" aria-hidden="true"></i>
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <footer className="blog-details-footer">
            <nav className="blog-details-nav" aria-label="Blog post navigation">
              <div className="blog-details-nav-group blog-details-nav-prev">
                {prevPost ? (
                  <Link
                    to={`/blog/${prevPost.id}`}
                    className="blog-details-nav-link prev"
                    rel="prev"
                  >
                    <i className="fas fa-arrow-left" aria-hidden="true"></i>
                    <span className="blog-details-nav-link-label">Previous post</span>
                    <span className="blog-details-nav-link-title">{prevPost.title}</span>
                  </Link>
                ) : (
                  <span className="blog-details-nav-placeholder" aria-hidden="true" />
                )}
              </div>
              <Link to="/blog" className="blog-details-nav-all">
                <i className="fas fa-arrow-left" aria-hidden="true"></i>
                All posts
              </Link>
              <div className="blog-details-nav-group blog-details-nav-next">
                {nextPost ? (
                  <Link
                    to={`/blog/${nextPost.id}`}
                    className="blog-details-nav-link next"
                    rel="next"
                  >
                    <span className="blog-details-nav-link-label">Next post</span>
                    <span className="blog-details-nav-link-title">{nextPost.title}</span>
                    <i className="fas fa-arrow-right" aria-hidden="true"></i>
                  </Link>
                ) : (
                  <span className="blog-details-nav-placeholder" aria-hidden="true" />
                )}
              </div>
            </nav>
          </footer>
        </article>
      </div>
    </div>
  );
};

export default BlogDetailsPage;
