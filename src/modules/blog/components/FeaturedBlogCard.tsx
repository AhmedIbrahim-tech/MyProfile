import { Link } from 'react-router-dom';
import type { BlogPost } from '@/modules/blog/types';
import { formatBlogDate, getBlogPlaceholderImage } from '@/modules/blog';
import FeaturedStarBadge from '@/shared/components/FeaturedStarBadge';
import userAvatar from '@/assets/user.jpg';

export interface FeaturedBlogCardProps {
  post: BlogPost;
}

export const FeaturedBlogCard = ({ post }: FeaturedBlogCardProps) => {
  return (
    <Link to={`/blog/${post.id}`} className="blog-featured-card">
      <div className="blog-featured-image-wrap">
        <img
          src={post.image}
          alt=""
          className="blog-featured-image"
          onError={(e) => {
            (e.target as HTMLImageElement).src = getBlogPlaceholderImage(post.title);
          }}
        />
        <img
          src={userAvatar}
          alt=""
          className="blog-featured-avatar"
          width={40}
          height={40}
        />
        <FeaturedStarBadge className="blog-featured-star" />
        <span className="blog-category-pill blog-category-pill--top-right">
          {post.category}
        </span>
      </div>
      <div className="blog-featured-body">
        <h2 className="blog-featured-title" dir="auto">
          {post.title}
        </h2>
        <p className="blog-featured-excerpt" dir="auto">
          {post.excerpt}
        </p>
        <div className="blog-featured-body-meta">
          <span>
            <i className="fas fa-clock" aria-hidden="true"></i>
            {post.readTime}
          </span>
          <span>
            <i className="fas fa-calendar-alt" aria-hidden="true"></i>
            {formatBlogDate(post.date)}
          </span>
        </div>
        <span className="blog-featured-cta">
          Read article <i className="fas fa-arrow-right" aria-hidden="true"></i>
        </span>
      </div>
    </Link>
  );
};
