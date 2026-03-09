import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import Loading from '@/components/shared/Loading';
import '@/components/Blog/Blog.css';

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { posts, loading, error } = useBlogPosts();

  const categories = useMemo(() => {
    const cats = new Set<string>(['all']);
    posts.forEach(post => {
      if (post.category) cats.add(post.category);
    });
    return Array.from(cats);
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'all') return posts;
    return posts.filter(post => post.category === selectedCategory);
  }, [posts, selectedCategory]);

  const featuredPost = filteredPosts[0] ?? null;
  const gridPosts = featuredPost ? filteredPosts.slice(1) : filteredPosts;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const placeholderImage = (title: string) =>
    'https://via.placeholder.com/800x400/1e293b/94a3b8?text=' + encodeURIComponent(title.substring(0, 30));

  return (
    <section className="blog" id="blog">
      <div className="blog-container">
        <header className="blog-header">
          <h1 className="blog-page-title">Blog</h1>
          <p className="blog-intro">
            Insights, tutorials, and thoughts on web development, .NET, React, and software engineering.
          </p>
          <div className="blog-filters">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
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
            <p>No posts in this category.</p>
          </div>
        ) : (
          <>
            {featuredPost && (
              <div className="blog-featured">
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
                    <span className="blog-read-time-pill">{featuredPost.readTime}</span>
                    <span className="blog-category-pill">{featuredPost.category}</span>
                  </div>
                  <div className="blog-featured-body">
                    <div className="blog-meta-row">
                      <span className="blog-meta-item">
                        <i className="fas fa-calendar-alt" aria-hidden="true"></i>
                        {formatDate(featuredPost.date)}
                      </span>
                      <span className="blog-meta-item">
                        <i className="fas fa-clock" aria-hidden="true"></i>
                        {featuredPost.readTime}
                      </span>
                      {featuredPost.author && (
                        <span className="blog-meta-item">
                          <i className="fas fa-user" aria-hidden="true"></i>
                          {featuredPost.author}
                        </span>
                      )}
                    </div>
                    <h2 className="blog-featured-title">{featuredPost.title}</h2>
                    <p className="blog-featured-excerpt">{featuredPost.excerpt}</p>
                    <span className="blog-featured-cta">Read article <i className="fas fa-arrow-right" aria-hidden="true"></i></span>
                  </div>
                </Link>
              </div>
            )}

            {gridPosts.length > 0 && (
              <div className="blog-grid-section">
                <h2 className="blog-grid-heading">{featuredPost ? 'More posts' : 'Posts'}</h2>
                <div className="blog-grid">
                  {gridPosts.map((post) => (
                    <article key={post.id} className="blog-card">
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
                          <span className="blog-read-time-pill">{post.readTime}</span>
                          <span className="blog-category-pill">{post.category}</span>
                        </div>
                        <div className="blog-card-body">
                          <div className="blog-meta-row">
                            <span className="blog-meta-item">
                              <i className="fas fa-calendar-alt" aria-hidden="true"></i>
                              {formatDate(post.date)}
                            </span>
                            <span className="blog-meta-item">
                              <i className="fas fa-clock" aria-hidden="true"></i>
                              {post.readTime}
                            </span>
                          </div>
                          <h3 className="blog-card-title">{post.title}</h3>
                          <p className="blog-card-excerpt">{post.excerpt}</p>
                          {post.author && (
                            <span className="blog-card-author">
                              <i className="fas fa-user" aria-hidden="true"></i>
                              {post.author}
                            </span>
                          )}
                          <span className="blog-card-cta">Read more <i className="fas fa-arrow-right" aria-hidden="true"></i></span>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Blog;
