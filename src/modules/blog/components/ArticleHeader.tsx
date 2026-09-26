import { Link } from 'react-router-dom';
import type { BlogPost } from '@/modules/blog/types';
import { formatBlogDate, getBlogPlaceholderImage } from '@/modules/blog';
import { getSeriesForArticle } from '@/modules/blog/services/blogSeriesService';
import '@/assets/styles/pages/BlogSeries.css';

export interface ArticleHeaderProps {
  post: BlogPost;
  isArabic: boolean;
  copied: boolean;
  onCopy: () => void;
  onBack: () => void;
}

export const ArticleHeader = ({
  post,
  isArabic,
  copied,
  onCopy,
  onBack,
}: ArticleHeaderProps) => {
  const seriesContext = getSeriesForArticle(post.id);

  return (
    <>
      <button
        type="button"
        className={`back-button ${isArabic ? 'rtl' : ''}`}
        onClick={onBack}
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

      <header className="blog-details-header">
        <div className="blog-details-image-container">
          <img
            src={post.image}
            alt={post.title}
            className="blog-details-image"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                getBlogPlaceholderImage(post.title);
            }}
          />
          <span className="blog-details-category-badge" dir="ltr">
            {post.category}
          </span>
        </div>
        <div className="blog-details-header-content">
          {seriesContext && (
            <aside className="article-series-context-banner" aria-label="Series context">
              <div className="article-series-context-left">
                <span className="article-series-context-kicker">
                  <i className="fas fa-layer-group" aria-hidden="true" />
                  {seriesContext.series.title.toUpperCase()} SERIES
                </span>
                <span className="article-series-context-order">
                  Article {seriesContext.position} of {seriesContext.total}
                </span>
              </div>
              <Link
                to={`/blog/series/${seriesContext.series.slug}`}
                className="article-series-context-action"
              >
                <span>View full series</span>
                <i className="fas fa-arrow-right" aria-hidden="true" />
              </Link>
            </aside>
          )}

          <div className="blog-details-title-row">
            <h1 className={`blog-details-title ${isArabic ? 'rtl' : ''}`}>
              {post.title}
            </h1>
            <button
              type="button"
              className={`blog-details-copy-btn ${copied ? 'copied' : ''}`}
              onClick={onCopy}
              aria-label={isArabic ? 'نسخ محتوى المقالة' : 'Copy article content'}
              title={isArabic ? 'نسخ المحتوى' : 'Copy content'}
            >
              <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`} aria-hidden="true"></i>
              <span>
                {copied
                  ? isArabic
                    ? 'تم نسخ المحتوى'
                    : 'Content copied'
                  : isArabic
                    ? 'نسخ المحتوى'
                    : 'Copy content'}
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
              {formatBlogDate(post.date, 'long')}
            </span>
          </div>
          <p className={`blog-details-excerpt blog-details-intro ${isArabic ? 'rtl' : ''}`}>
            {post.excerpt}
          </p>
        </div>
      </header>
    </>
  );
};
