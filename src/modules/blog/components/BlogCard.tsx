import { Link } from 'react-router-dom';
import type { BlogPost } from '@/modules/blog/types';
import { formatBlogDate, getBlogPlaceholderImage } from '@/modules/blog';
import FeaturedStarBadge from '@/shared/components/FeaturedStarBadge';
import userAvatar from '@/assets/user.jpg';

export interface BlogCardProps {
  post: BlogPost;
  variant?: 'highlighted' | 'regular';
}

export const BlogCard = ({ post, variant = 'regular' }: BlogCardProps) => {
  const isHighlighted = variant === 'highlighted';

  return (
    <article className={`blog-card blog-card--${variant}`}>
      <Link to={`/blog/${post.id}`} className="blog-card-link">
        <div className="blog-card-image-wrap">
          <img
            src={post.image}
            alt=""
            className="blog-card-image"
            onError={(e) => {
              (e.target as HTMLImageElement).src = getBlogPlaceholderImage(post.title);
            }}
          />
          {isHighlighted && <div className="blog-card-image-overlay" aria-hidden="true" />}
          {isHighlighted && post.featured && <FeaturedStarBadge compact className="blog-card-star" />}
          <img
            src={userAvatar}
            alt=""
            className={`blog-card-avatar ${
              isHighlighted ? 'blog-card-avatar--top-left' : 'blog-card-avatar--bottom-left'
            }`}
            width={isHighlighted ? 36 : 32}
            height={isHighlighted ? 36 : 32}
          />
          <span className="blog-card-pill blog-card-pill--read-time">
            {post.readTime}
          </span>
          <span className="blog-card-pill blog-card-pill--category">
            {post.category}
          </span>
        </div>
        <div className="blog-card-body">
          <div className="blog-card-meta">
            <span className="blog-card-meta-left">
              <i className="fas fa-clock" aria-hidden="true"></i>
              {post.readTime}
            </span>
            <span className="blog-card-meta-right">
              <i className="fas fa-calendar-alt" aria-hidden="true"></i>
              {formatBlogDate(post.date)}
            </span>
          </div>
          <h3 className="blog-card-title">
            {post.featured && isHighlighted && (
              <i className="fas fa-star blog-card-title-star" aria-hidden="true"></i>
            )}
            {post.title}
          </h3>
          <p className="blog-card-excerpt">{post.excerpt}</p>
          <span className="blog-card-cta">
            Read more <i className="fas fa-arrow-right" aria-hidden="true"></i>
          </span>
        </div>
      </Link>
    </article>
  );
};
