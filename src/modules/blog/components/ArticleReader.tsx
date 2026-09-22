import { Link, useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  useBlogPost,
  useBlogPosts,
  extractHeadings,
  containsArabic,
  formatMarkdownContent,
} from '@/modules/blog';
import { ArticleHeader } from './ArticleHeader';
import { TableOfContents, ArticleSummary } from './TableOfContents';
import Loading from '@/shared/components/feedback/Loading';
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

export interface ArticleReaderProps {
  postId: number | undefined;
}

export const ArticleReader = ({ postId }: ArticleReaderProps) => {
  const navigate = useNavigate();
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

  const formattedContent = useMemo(
    () => (post ? formatMarkdownContent(post.content, tocEntries) : null),
    [post, tocEntries]
  );

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
            <h1 className="not-found-title">Post Not Found</h1>
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

  return (
    <div className={`blog-details-page ${isArabic ? 'rtl' : ''}`}>
      <div className="blog-details-container">
        <ArticleHeader
          post={post}
          isArabic={isArabic}
          copied={copied}
          onCopy={handleCopyArticle}
          onBack={() => navigate('/blog')}
        />

        <article className={`blog-details-article ${isArabic ? 'rtl' : ''}`}>
          <div className="blog-details-body-wrap">
            <TableOfContents entries={tocEntries} />
            <div className={`blog-details-content ${isArabic ? 'rtl' : ''}`}>
              <ArticleSummary entries={tocEntries} />
              {formattedContent}
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

export default ArticleReader;
