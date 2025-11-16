import { useState } from 'react';
import './Blog.css';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  image: string;
}

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: 'Getting Started with React and TypeScript',
      excerpt: 'Learn how to set up a modern React application with TypeScript for better type safety and developer experience.',
      content: 'Full content here...',
      author: 'Ahmed Ibrahim',
      date: '2024-01-15',
      category: 'Frontend',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop'
    },
    {
      id: 2,
      title: 'Building RESTful APIs with ASP.NET Core',
      excerpt: 'A comprehensive guide to creating robust and scalable REST APIs using ASP.NET Core and best practices.',
      content: 'Full content here...',
      author: 'Ahmed Ibrahim',
      date: '2024-01-10',
      category: 'Backend',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop'
    },
    {
      id: 3,
      title: 'Modern CSS Techniques for Better UI',
      excerpt: 'Explore advanced CSS features like Grid, Flexbox, and custom properties to create stunning user interfaces.',
      content: 'Full content here...',
      author: 'Ahmed Ibrahim',
      date: '2024-01-05',
      category: 'Frontend',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop'
    },
    {
      id: 4,
      title: 'Database Design Best Practices',
      excerpt: 'Learn essential database design principles and patterns for building efficient and maintainable database schemas.',
      content: 'Full content here...',
      author: 'Ahmed Ibrahim',
      date: '2023-12-28',
      category: 'Backend',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=400&fit=crop'
    },
    {
      id: 5,
      title: 'Full-Stack Development Workflow',
      excerpt: 'Discover how to efficiently manage a full-stack development workflow from design to deployment.',
      content: 'Full content here...',
      author: 'Ahmed Ibrahim',
      date: '2023-12-20',
      category: 'Full Stack',
      readTime: '10 min read',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop'
    },
    {
      id: 6,
      title: 'Git Workflow and Collaboration',
      excerpt: 'Master Git workflows, branching strategies, and collaboration techniques for team development.',
      content: 'Full content here...',
      author: 'Ahmed Ibrahim',
      date: '2023-12-15',
      category: 'DevOps',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop'
    }
  ];

  const categories = ['all', 'Full Stack', 'Backend', 'Database', 'Frontend', 'DevOps'];

  const filteredPosts = selectedCategory === 'all'
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory);

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

        {filteredPosts.length === 0 ? (
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
                  <button className="blog-read-more" disabled title="Coming Soon">
                    Read More
                    <i className="fas fa-arrow-right"></i>
                  </button>
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

