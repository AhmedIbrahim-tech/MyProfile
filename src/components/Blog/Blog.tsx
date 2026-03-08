import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useBlogPosts } from '../../hooks/useBlogPosts';
import './Blog.css';

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { posts, loading, error } = useBlogPosts();

  // Extract unique categories from posts
  const categories = useMemo(() => {
    const cats = new Set<string>(['all']);
    posts.forEach(post => {
      if (post.category) {
        cats.add(post.category);
      }
    });
    return Array.from(cats);
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'all') {
      return posts;
    }
    return posts.filter(post => post.category === selectedCategory);
  }, [posts, selectedCategory]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section className="blog" id="blog">
      <div className="blog-container">
        <h2 className="section-title">
          <i className="fas fa-blog"></i>
          <span>
            My <strong>Blog</strong>
          </span>
        </h2>

        <p className="blog-intro">
          Welcome to my blog! Here I share insights, tutorials, and thoughts about web development,
          software engineering, and technology.
        </p>

        <div className="blog-filters">
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="no-posts">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading blog posts...</p>
          </div>
        ) : error ? (
          <div className="no-posts">
            <i className="fas fa-exclamation-triangle"></i>
            <p>{error}</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="no-posts">
            <i className="fas fa-inbox"></i>
            <p>No posts found in this category.</p>
          </div>
        ) : (
          <div className="blog-grid">
            {filteredPosts.map((post) => (
              <article key={post.id} className="blog-card">
                <div className="blog-image-container">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="blog-image"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://via.placeholder.com/400x200/7C3AED/ffffff?text=' +
                        encodeURIComponent(post.title);
                    }}
                  />
                  <div className="blog-category-badge">{post.category}</div>
                </div>
                <div className="blog-content">
                  <div className="blog-meta">
                    <span className="blog-date">
                      <i className="fas fa-calendar"></i>
                      {formatDate(post.date)}
                    </span>
                    <span className="blog-read-time">
                      <i className="fas fa-clock"></i>
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="blog-title">{post.title}</h3>
                  <p className="blog-excerpt">{post.excerpt}</p>
                  <div className="blog-author">
                    <i className="fas fa-user"></i>
                    <span>{post.author}</span>
                  </div>
                  <Link to={`/blog/${post.id}`} className="blog-read-more">
                    Read More
                    <i className="fas fa-arrow-right"></i>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Blog;

