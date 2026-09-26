import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  getSeriesBySlug,
  getSeriesStats,
  getFirstPublishedSeriesArticle,
} from '@/modules/blog/services/blogSeriesService';
import { getBlogPostById } from '@/data/blogData';
import '@/assets/styles/pages/BlogSeries.css';

export const BlogSeriesDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const series = slug ? getSeriesBySlug(slug) : undefined;

  useEffect(() => {
    if (series) {
      document.title = `${series.title} Series — Curriculum & Learning Path`;
    } else {
      document.title = 'Series Not Found — Ahmed Ibrahim';
    }
  }, [series]);

  if (!series) {
    return (
      <div className="blog-series-page">
        <div className="blog-series-container">
          <div className="blog-series-not-found">
            <span className="blog-series-kicker">Not Found</span>
            <h1 className="blog-series-title">Series Not Found</h1>
            <p className="blog-series-subtitle">
              The learning series you are looking for does not exist or may have been moved.
            </p>
            <div className="blog-series-not-found-actions">
              <Link to="/blog/series" className="blog-series-btn primary">
                <i className="fas fa-layer-group" aria-hidden="true" />
                <span>View all series</span>
              </Link>
              <Link to="/blog" className="blog-series-btn ghost">
                <i className="fas fa-arrow-left" aria-hidden="true" />
                <span>Back to Blog</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stats = getSeriesStats(series);
  const firstPublished = getFirstPublishedSeriesArticle(series);

  return (
    <div className="blog-series-page">
      <div className="blog-series-container">
        {/* Navigation Breadcrumb */}
        <nav className="blog-series-breadcrumb" aria-label="Breadcrumb">
          <Link to="/blog" className="blog-series-back-link">
            <i className="fas fa-arrow-left" aria-hidden="true" />
            <span>Back to Blog</span>
          </Link>
          <span className="blog-series-breadcrumb-separator" aria-hidden="true">
            /
          </span>
          <Link to="/blog/series" className="blog-series-breadcrumb-link">
            All Series
          </Link>
        </nav>

        {/* Series Hero / Header */}
        <header className="blog-series-hero">
          {series.image && (
            <div className="blog-series-cover-wrapper">
              <div className="blog-series-cover-glow" aria-hidden="true" />
              <div className="blog-series-cover-frame">
                <img
                  src={series.image}
                  alt={`${series.title} Series`}
                  className="blog-series-cover-image"
                />
              </div>
            </div>
          )}

          <div className="blog-series-hero-content">
            <span className="blog-series-kicker">Learning Series</span>
            <h1 className="blog-series-title">{series.title}</h1>
            <p className="blog-series-desc">{series.description}</p>
            {series.intro && <p className="blog-series-intro">{series.intro}</p>}

            {/* Series Meta Stats */}
            <div className="blog-series-stats-bar" aria-label="Series progress and statistics">
              <div className="blog-series-stat-item">
                <span className="blog-series-stat-num">{stats.totalTopics}</span>
                <span className="blog-series-stat-label">Topics</span>
              </div>
              <div className="blog-series-stat-separator" aria-hidden="true" />
              <div className="blog-series-stat-item">
                <span className="blog-series-stat-num">{stats.publishedCount}</span>
                <span className="blog-series-stat-label">Published</span>
              </div>
              <div className="blog-series-stat-separator" aria-hidden="true" />
              <div className="blog-series-stat-item">
                <span className="blog-series-stat-num">{stats.comingSoonCount}</span>
                <span className="blog-series-stat-label">Coming Soon</span>
              </div>
            </div>

            {/* Start Series Action */}
            <div className="blog-series-start-area">
              {firstPublished && firstPublished.articleId ? (
                <Link
                  to={`/blog/${firstPublished.articleId}`}
                  className="blog-series-start-btn"
                >
                  <span>Start Series</span>
                  <i className="fas fa-arrow-right" aria-hidden="true" />
                </Link>
              ) : (
                <div className="blog-series-in-progress-note" role="status">
                  <i className="fas fa-clock" aria-hidden="true" />
                  <span>Series in progress — Articles currently being written</span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Curriculum Section */}
        <section className="blog-series-curriculum" aria-labelledby="curriculum-heading">
          <div className="blog-series-curriculum-header">
            <h2 id="curriculum-heading" className="blog-series-curriculum-title">
              Curriculum
            </h2>
            <span className="blog-series-curriculum-count">
              {stats.totalTopics} parts in curriculum order
            </span>
          </div>

          <ol className="curriculum-list" aria-label={`${series.title} curriculum`}>
            {series.items.map((item) => {
              const isPublished = item.status === 'published' && item.articleId !== undefined;
              const formattedOrder = String(item.order).padStart(2, '0');
              const linkedPost = isPublished && item.articleId ? getBlogPostById(item.articleId) : undefined;

              if (isPublished && item.articleId) {
                return (
                  <li key={item.order} className="curriculum-item published">
                    <Link
                      to={`/blog/${item.articleId}`}
                      className="curriculum-item-inner published-link"
                    >
                      <div className="curriculum-item-num" aria-hidden="true">
                        {formattedOrder}
                      </div>

                      <div className="curriculum-item-content">
                        <div className="curriculum-item-header">
                          <h3 className="curriculum-item-title">{item.title}</h3>
                          <span className="curriculum-status-badge published">
                            <i className="fas fa-check-circle" aria-hidden="true" />
                            Published
                          </span>
                        </div>

                        {item.description && (
                          <p className="curriculum-item-desc">{item.description}</p>
                        )}

                        <div className="curriculum-item-meta">
                          {linkedPost?.readTime && (
                            <span className="curriculum-item-read-time">
                              <i className="fas fa-clock" aria-hidden="true" />
                              {linkedPost.readTime}
                            </span>
                          )}
                          <span className="curriculum-item-cta">
                            Read article <i className="fas fa-arrow-right" aria-hidden="true" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              }

              // Coming Soon item: non-clickable, clearly readable, honest
              return (
                <li key={item.order} className="curriculum-item coming-soon">
                  <div className="curriculum-item-inner coming-soon-static">
                    <div className="curriculum-item-num" aria-hidden="true">
                      {formattedOrder}
                    </div>

                    <div className="curriculum-item-content">
                      <div className="curriculum-item-header">
                        <h3 className="curriculum-item-title">{item.title}</h3>
                        <span className="curriculum-status-badge coming-soon">
                          <i className="fas fa-hourglass-start" aria-hidden="true" />
                          Coming Soon
                        </span>
                      </div>

                      {item.description && (
                        <p className="curriculum-item-desc">{item.description}</p>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      </div>
    </div>
  );
};

export default BlogSeriesDetail;
