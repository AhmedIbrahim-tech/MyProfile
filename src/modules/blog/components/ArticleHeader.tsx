import type { BlogPost } from '@/modules/blog/types';
import { formatBlogDate, getBlogPlaceholderImage } from '@/modules/blog';
import FeaturedStarBadge from '@/shared/components/FeaturedStarBadge';
import userAvatar from '@/assets/user.jpg';

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
            alt=""
            className="blog-details-image"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                getBlogPlaceholderImage(post.title);
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
          <span className="blog-details-read-time-pill" dir="ltr">
            {post.readTime}
          </span>
          {post.featured && <FeaturedStarBadge className="blog-details-featured-badge" />}
          <span className="blog-details-category-badge" dir="ltr">
            {post.category}
          </span>
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
              onClick={onCopy}
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
