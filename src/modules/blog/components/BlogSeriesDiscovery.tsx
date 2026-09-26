import { Link } from 'react-router-dom';
import { getAllSeries, getSeriesStats } from '@/modules/blog/services/blogSeriesService';
import '@/assets/styles/pages/BlogSeries.css';

export const BlogSeriesDiscovery = () => {
  const seriesList = getAllSeries();
  if (!seriesList.length) return null;

  // The primary spotlight series (System Design)
  const primarySeries = seriesList[0];
  const stats = getSeriesStats(primarySeries);

  const statusText =
    stats.publishedCount > 0
      ? `${stats.publishedCount} published · ${stats.comingSoonCount} coming soon`
      : 'In progress · Coming soon';

  return (
    <aside className="blog-series-discovery" aria-label="Learning series roadmap">
      <div className="blog-series-discovery-inner">
        <div className="blog-series-discovery-header">
          <span className="blog-series-discovery-kicker">
            <i className="fas fa-layer-group" aria-hidden="true" />
            Learning Series
          </span>
          <span className="blog-series-discovery-meta">
            {stats.totalTopics} topics · {statusText}
          </span>
        </div>

        <div className="blog-series-discovery-main">
          {primarySeries.image && (
            <Link
              to={`/blog/series/${primarySeries.slug}`}
              className="blog-series-discovery-media"
              tabIndex={-1}
              aria-hidden="true"
            >
              <img
                src={primarySeries.image}
                alt={primarySeries.title}
                className="blog-series-discovery-thumb"
                loading="lazy"
              />
            </Link>
          )}
          <div className="blog-series-discovery-info">
            <h3 className="blog-series-discovery-title">{primarySeries.title}</h3>
            <p className="blog-series-discovery-desc">{primarySeries.description}</p>
          </div>

          <div className="blog-series-discovery-actions">
            <Link
              to={`/blog/series/${primarySeries.slug}`}
              className="blog-series-discovery-cta"
            >
              <span>Explore series</span>
              <i className="fas fa-arrow-right" aria-hidden="true" />
            </Link>
            <Link to="/blog/series" className="blog-series-discovery-secondary">
              View all series
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default BlogSeriesDiscovery;
