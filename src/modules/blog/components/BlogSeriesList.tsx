import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllSeries, getSeriesStats } from '@/modules/blog/services/blogSeriesService';
import '@/assets/styles/pages/BlogSeries.css';

export const BlogSeriesList = () => {
  const seriesList = getAllSeries();

  useEffect(() => {
    document.title = 'Blog Series & Learning Paths — Ahmed Ibrahim';
  }, []);

  return (
    <div className="blog-series-page">
      <div className="blog-series-container">
        <nav className="blog-series-breadcrumb" aria-label="Breadcrumb">
          <Link to="/blog" className="blog-series-back-link">
            <i className="fas fa-arrow-left" aria-hidden="true" />
            <span>Back to Blog</span>
          </Link>
        </nav>

        <header className="blog-series-header">
          <span className="blog-series-kicker">Curated Learning Paths</span>
          <h1 className="blog-series-title">Blog Series</h1>
          <p className="blog-series-subtitle">
            Structured, topic-by-topic learning roadmaps designed to take you from foundational
            concepts to production-ready architecture.
          </p>
        </header>

        <div className="blog-series-list">
          {seriesList.map((series) => {
            const stats = getSeriesStats(series);
            const statusSummary =
              stats.publishedCount > 0
                ? `${stats.publishedCount} published · ${stats.comingSoonCount} coming soon`
                : 'Series in progress · 11 planned topics';

            return (
              <article
                key={series.id}
                className={`blog-series-card ${series.image ? 'has-cover' : ''}`}
              >
                {series.image && (
                  <Link
                    to={`/blog/series/${series.slug}`}
                    className="blog-series-card-media"
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    <img
                      src={series.image}
                      alt={series.title}
                      className="blog-series-card-thumb"
                      loading="lazy"
                    />
                  </Link>
                )}
                <div className="blog-series-card-main">
                  <div className="blog-series-card-top">
                    <span className="blog-series-card-badge">
                      <i className="fas fa-layer-group" aria-hidden="true" />
                      Learning Path
                    </span>
                    <span className="blog-series-card-meta">
                      {stats.totalTopics} topics · {statusSummary}
                    </span>
                  </div>

                  <h2 className="blog-series-card-title">
                    <Link to={`/blog/series/${series.slug}`}>{series.title}</Link>
                  </h2>

                  <p className="blog-series-card-desc">{series.description}</p>
                </div>

                <div className="blog-series-card-action">
                  <Link
                    to={`/blog/series/${series.slug}`}
                    className="blog-series-card-cta"
                    aria-label={`Explore ${series.title} series`}
                  >
                    <span>Explore series</span>
                    <i className="fas fa-arrow-right" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BlogSeriesList;
