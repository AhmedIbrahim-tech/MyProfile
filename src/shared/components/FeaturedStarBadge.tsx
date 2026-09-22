import '@/assets/styles/components/FeaturedStarBadge.css';

export type FeaturedStarBadgeProps = {
  compact?: boolean;
  className?: string;
};

export const FeaturedStarBadge = ({ compact = false, className = '' }: FeaturedStarBadgeProps) => (
  <span
    className={`featured-star-badge ${compact ? 'featured-star-badge--compact' : ''} ${className}`.trim()}
    title="Featured article"
    aria-label="Featured article"
  >
    <i className="fas fa-star" aria-hidden="true" />
    {!compact && <span>Featured</span>}
  </span>
);

export default FeaturedStarBadge;
