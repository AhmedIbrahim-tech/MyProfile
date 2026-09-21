import { useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import Loading from '@/shared/Loading';
import FeaturedStarBadge from '@/components/FeaturedStarBadge';
import userAvatar from '@/assets/user.jpg';
import '@/assets/styles/components/Blog.css';

const POSTS_PER_PAGE = 8;

/** Topic labels for "Browse by topic" – show categories that have posts, plus optional extras */
const TOPIC_LABELS: Record<string, string> = {
  Frontend: 'Frontend',
  Backend: 'Backend',
  '.NET': '.NET',
  Architecture: 'Architecture',
  Performance: 'Performance',
  'Clean Code': 'Clean Code',
};

function getVisiblePages(current: number, total: number): Array<number | 'gap'> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = new Set<number>([1, total]);
  for (let i = current - 1; i <= current + 1; i++) {
    if (i >= 1 && i <= total) pages.add(i);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const result: Array<number | 'gap'> = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push('gap');
    result.push(sorted[i]);
  }
  return result;
}

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const postsRef = useRef<HTMLDivElement>(null);
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

  const featuredPosts = useMemo(
    () => filteredPosts.filter((post) => post.featured === true),
    [filteredPosts]
  );
  const regularPosts = useMemo(
    () => filteredPosts.filter((post) => post.featured !== true),
    [filteredPosts]
  );

  const featuredPost = featuredPosts[0] ?? null;
  const extraFeaturedPosts = featuredPosts.slice(1);
  const totalPages = Math.max(1, Math.ceil(regularPosts.length / POSTS_PER_PAGE));
  const requestedPage = Number.parseInt(searchParams.get('page') ?? '1', 10);
  const currentPage = Math.min(
    Math.max(Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1, 1),
    totalPages
  );
  const pageStart = (currentPage - 1) * POSTS_PER_PAGE;
  const pagePosts = regularPosts.slice(pageStart, pageStart + POSTS_PER_PAGE);
  const highlightedPosts = currentPage === 1 ? pagePosts.slice(0, 2) : [];
  const gridPosts = currentPage === 1 ? pagePosts.slice(2) : pagePosts;

  const setPage = (page: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (page <= 1) next.delete('page');
      else next.set('page', String(page));
      return next;
    }, { replace: true });
  };

  const goToPage = (page: number) => {
    if (page === currentPage || page < 1 || page > totalPages) return;
    setPage(page);
    postsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const resetToFirstPage = () => {
    if (currentPage !== 1) setPage(1);
  };

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
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  resetToFirstPage();
                }}
                aria-label="Search blog posts"
              />
            </div>
            <div className="blog-filters" role="group" aria-label="Filter by category">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedCategory(category);
                    resetToFirstPage();
                  }}
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
                onClick={() => {
                  setSearchQuery('');
                  resetToFirstPage();
                }}
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div ref={postsRef} className="blog-listing">
            {currentPage === 1 && featuredPost && (
              <div className="blog-featured-section">
                <span className="blog-featured-label">
                  <i className="fas fa-star" aria-hidden="true"></i>
                  Featured
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
                    <img
                      src={userAvatar}
                      alt=""
                      className="blog-featured-avatar"
                      width={40}
                      height={40}
                    />
                    <FeaturedStarBadge className="blog-featured-star" />
                    <span className="blog-category-pill blog-category-pill--top-right">
                      {featuredPost.category}
                    </span>
                  </div>
                  <div className="blog-featured-body">
                    <h2 className="blog-featured-title" dir="auto">{featuredPost.title}</h2>
                    <p className="blog-featured-excerpt" dir="auto">{featuredPost.excerpt}</p>
                    <div className="blog-featured-body-meta">
                      <span>
                        <i className="fas fa-clock" aria-hidden="true"></i>
                        {featuredPost.readTime}
                      </span>
                      <span>
                        <i className="fas fa-calendar-alt" aria-hidden="true"></i>
                        {formatDate(featuredPost.date)}
                      </span>
                    </div>
                    <span className="blog-featured-cta">
                      Read article <i className="fas fa-arrow-right" aria-hidden="true"></i>
                    </span>
                  </div>
                </Link>
                {extraFeaturedPosts.length > 0 && (
                  <div className="blog-featured-more">
                    <div className="blog-highlighted-grid">
                      {extraFeaturedPosts.map((post) => (
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
                              <FeaturedStarBadge compact className="blog-card-star" />
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
                              <h3 className="blog-card-title">
                                <i className="fas fa-star blog-card-title-star" aria-hidden="true"></i>
                                {post.title}
                              </h3>
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
              </div>
            )}

            {highlightedPosts.length > 0 && (
              <div className="blog-highlighted-section">
                <h2 className="blog-section-heading">
                  {featuredPost ? 'More to read' : 'Latest'}
                </h2>
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
                <h2 className="blog-section-heading">
                  {currentPage === 1 ? 'Latest posts' : 'Older posts'}
                </h2>
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

            {totalPages > 1 && (
              <nav className="blog-pagination" aria-label="Blog posts pagination">
                <p className="blog-pagination-status">
                  Showing {pageStart + 1}–{pageStart + pagePosts.length} of {regularPosts.length} posts
                </p>
                <div className="blog-pagination-controls">
                  <button
                    type="button"
                    className="blog-pagination-btn"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                  >
                    <i className="fas fa-chevron-left" aria-hidden="true"></i>
                    <span>Prev</span>
                  </button>
                  {getVisiblePages(currentPage, totalPages).map((item, index) =>
                    item === 'gap' ? (
                      <span key={`gap-${index}`} className="blog-pagination-gap" aria-hidden="true">
                        …
                      </span>
                    ) : (
                      <button
                        key={item}
                        type="button"
                        className={`blog-pagination-btn blog-pagination-page ${item === currentPage ? 'active' : ''}`}
                        onClick={() => goToPage(item)}
                        aria-label={`Page ${item}`}
                        aria-current={item === currentPage ? 'page' : undefined}
                      >
                        {item}
                      </button>
                    )
                  )}
                  <button
                    type="button"
                    className="blog-pagination-btn"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                  >
                    <span>Next</span>
                    <i className="fas fa-chevron-right" aria-hidden="true"></i>
                  </button>
                </div>
              </nav>
            )}

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
                        resetToFirstPage();
                      }}
                    >
                      {TOPIC_LABELS[cat] ?? cat}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Blog;
