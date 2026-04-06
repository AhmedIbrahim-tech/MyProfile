import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import Loading from '@/shared/Loading';
import userAvatar from '@/assets/user.jpg';
import '@/assets/styles/components/Blog.css';

/** Topic labels for "Browse by topic" – show categories that have posts, plus optional extras */
const TOPIC_LABELS: Record<string, string> = {
  Frontend: 'Frontend',
  Backend: 'Backend',
  '.NET': '.NET',
  Architecture: 'Architecture',
  Performance: 'Performance',
  'Clean Code': 'Clean Code',
};

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { posts, loading, error } = useBlogPosts();

  const categories = useMemo(() => {
    const cats = new Set<string>(['all']);
    posts.forEach((post) => {
      if (post.category) cats.add(post.category);
    });
    return Array.from(cats);
  }, [posts]);

  const filteredPosts = useMemo(() => {
    let list = selectedCategory === 'all' ? posts : posts.filter((post) => post.category === selectedCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (post) =>
          post.title.toLowerCase().includes(q) ||
          post.excerpt.toLowerCase().includes(q) ||
          (post.category && post.category.toLowerCase().includes(q))
      );
    }
    return list;
  }, [posts, selectedCategory, searchQuery]);

  const featuredPost = filteredPosts[0] ?? null;
  const highlightedPosts = featuredPost ? filteredPosts.slice(1, 3) : filteredPosts.slice(0, 2);
  const gridPosts = featuredPost ? filteredPosts.slice(3, 9) : filteredPosts.slice(2, 8);

  const topicsWithPosts = useMemo(() => {
    const fromPosts = new Set<string>();
    posts.forEach((p) => p.category && fromPosts.add(p.category));
    return Array.from(fromPosts);
  }, [posts]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const placeholderImage = (title: string) =>
    'https://via.placeholder.com/800x400/1e293b/94a3b8?text=' + encodeURIComponent(title.substring(0, 30));

  return (
    <section className="blog" id="blog">
      <div className="blog-container">
        {/* ----- Hero ----- */}
        <header className="blog-hero">
          <h1 className="blog-page-title">Blog</h1>
          <p className="blog-intro">
            Insights, tutorials, and thoughts on web development, .NET, React, and software engineering.
          </p>
          <div className="blog-hero-actions">
            <div className="blog-search-wrap">
              <i className="fas fa-search blog-search-icon" aria-hidden="true"></i>
              <input
                type="search"
                className="blog-search-input"
                placeholder="Search posts…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search blog posts"
              />
            </div>
            <div className="blog-filters" role="group" aria-label="Filter by category">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                  aria-pressed={selectedCategory === category}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </header>

        {loading ? (
          <div className="blog-state blog-state-loading">
            <Loading message="Loading posts…" size="md" />
          </div>
        ) : error ? (
          <div className="blog-state blog-state-error">
            <i className="fas fa-exclamation-triangle" aria-hidden="true"></i>
            <p>{error}</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="blog-state blog-state-empty">
            <i className="fas fa-inbox" aria-hidden="true"></i>
            <p>
              {searchQuery.trim()
                ? 'No posts match your search. Try another term or clear the filter.'
                : 'No posts in this category.'}
            </p>
            {searchQuery.trim() && (
              <button
                type="button"
                className="blog-empty-reset"
                onClick={() => setSearchQuery('')}
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            {/* ----- Featured article ----- */}
            {featuredPost && (
              <div className="blog-featured-section">
                <span className="blog-featured-label" aria-hidden="true">
                  Featured article
                </span>
                <Link to={`/blog/${featuredPost.id}`} className="blog-featured-card">
                  <div className="blog-featured-image-wrap">
                    <img
                      src={featuredPost.image}
                      alt=""
                      className="blog-featured-image"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = placeholderImage(featuredPost.title);
                      }}
                    />
                    <div className="blog-featured-image-overlay" aria-hidden="true" />
                    <img
                      src={userAvatar}
                      alt=""
                      className="blog-featured-avatar"
                      width={40}
                      height={40}
                    />
                    <span className="blog-category-pill blog-category-pill--top-right">
                      {featuredPost.category}
                    </span>
                    <div className="blog-featured-image-meta">
                      <span className="blog-featured-meta-left">
                        <i className="fas fa-clock" aria-hidden="true"></i>
                        {featuredPost.readTime}
                      </span>
                      <span className="blog-featured-meta-right">
                        <i className="fas fa-calendar-alt" aria-hidden="true"></i>
                        {formatDate(featuredPost.date)}
                      </span>
                    </div>
                    <h2 className="blog-featured-title-overlay">{featuredPost.title}</h2>
                  </div>
                  <div className="blog-featured-body">
                    <p className="blog-featured-excerpt">{featuredPost.excerpt}</p>
                    <span className="blog-featured-cta">
                      Read article <i className="fas fa-arrow-right" aria-hidden="true"></i>
                    </span>
                  </div>
                </Link>
              </div>
            )}

            {/* ----- Latest / More posts grid ----- */}
            {highlightedPosts.length > 0 && (
              <div className="blog-highlighted-section">
                <h2 className="blog-section-heading">{featuredPost ? 'More to read' : 'Featured'}</h2>
                <div className="blog-highlighted-grid">
                  {highlightedPosts.map((post) => (
                    <article key={post.id} className="blog-card blog-card--highlighted">
                      <Link to={`/blog/${post.id}`} className="blog-card-link">
                        <div className="blog-card-image-wrap">
                          <img
                            src={post.image}
                            alt=""
                            className="blog-card-image"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = placeholderImage(post.title);
                            }}
                          />
                          <div className="blog-card-image-overlay" aria-hidden="true" />
                          <img
                            src={userAvatar}
                            alt=""
                            className="blog-card-avatar blog-card-avatar--top-left"
                            width={36}
                            height={36}
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
                              {formatDate(post.date)}
                            </span>
                          </div>
                          <h3 className="blog-card-title">{post.title}</h3>
                          <p className="blog-card-excerpt">{post.excerpt}</p>
                          <span className="blog-card-cta">
                            Read more <i className="fas fa-arrow-right" aria-hidden="true"></i>
                          </span>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
              </div>
            )}
            {gridPosts.length > 0 && (
              <div className="blog-grid-section">
                <h2 className="blog-section-heading">Latest posts</h2>
                <div className="blog-grid blog-grid--latest">
                  {gridPosts.map((post) => (
                    <article key={post.id} className="blog-card blog-card--regular">
                      <Link to={`/blog/${post.id}`} className="blog-card-link">
                        <div className="blog-card-image-wrap">
                          <img
                            src={post.image}
                            alt=""
                            className="blog-card-image"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = placeholderImage(post.title);
                            }}
                          />
                          <img
                            src={userAvatar}
                            alt=""
                            className="blog-card-avatar blog-card-avatar--bottom-left"
                            width={32}
                            height={32}
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
                              {formatDate(post.date)}
                            </span>
                          </div>
                          <h3 className="blog-card-title">{post.title}</h3>
                          <p className="blog-card-excerpt">{post.excerpt}</p>
                          <span className="blog-card-cta">
                            Read more <i className="fas fa-arrow-right" aria-hidden="true"></i>
                          </span>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* ----- Browse by topic ----- */}
            {topicsWithPosts.length > 0 && (
              <div className="blog-topics-section">
                <h2 className="blog-topics-heading">Browse by topic</h2>
                <div className="blog-topics">
                  {topicsWithPosts.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`blog-topic-chip ${selectedCategory === cat ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setSearchQuery('');
                      }}
                    >
                      {TOPIC_LABELS[cat] ?? cat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ----- Bottom CTA ----- */}
            <div className="blog-bottom-cta">
              <p className="blog-bottom-cta-text">
                More articles on architecture, .NET, and frontend — written for clarity and depth.
              </p>
              <Link to="/blog" className="blog-bottom-cta-link">
                Explore all posts <i className="fas fa-arrow-right" aria-hidden="true"></i>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Blog;
