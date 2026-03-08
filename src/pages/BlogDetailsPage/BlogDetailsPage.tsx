import { useParams, Link, useNavigate } from 'react-router-dom';
import { createElement, useMemo } from 'react';
import { useBlogPost } from '../../hooks/useBlogPosts';
import './BlogDetailsPage.css';

// Utility function to detect if text contains Arabic characters
const containsArabic = (text: string): boolean => {
  const arabicRegex = /[\u0600-\u06FF]/;
  return arabicRegex.test(text);
};

const BlogDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { post, loading, error } = useBlogPost(id ? parseInt(id) : undefined);

  // Detect if the post contains Arabic content
  const isArabic = useMemo(() => {
    if (!post) return false;
    return containsArabic(post.title) || containsArabic(post.content) || containsArabic(post.excerpt);
  }, [post]);

  if (loading) {
    return (
      <div className="blog-details-page">
        <div className="blog-details-container">
          <div className="not-found-content">
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
            <p>Loading blog post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="blog-details-page">
        <div className="blog-details-container">
          <div className="not-found-content">
            <h1>Post Not Found</h1>
            <p>{error || 'The blog post you\'re looking for doesn\'t exist.'}</p>
            <Link to="/blog" className="back-btn">
              <i className="fas fa-arrow-left"></i>
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatContent = (content: string) => {
    // Split content by code blocks
    const parts = content.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        // Extract language and code
        const match = part.match(/```(\w+)?\n?([\s\S]*?)```/);
        if (match) {
          const language = match[1] || '';
          const code = match[2];
          return (
            <pre key={index} className="code-block">
              <code className={language ? `language-${language}` : ''}>{code}</code>
            </pre>
          );
        }
      }
      // Split by line breaks and format
      return part.split('\n').map((line, lineIndex) => {
        // Check for headers (lines starting with #)
        if (line.trim().startsWith('#')) {
          const level = line.match(/^#+/)?.[0].length || 1;
          const text = line.replace(/^#+\s*/, '');
          const headerLevel = Math.min(level, 6);
          const HeaderTag = `h${headerLevel}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
          return createElement(
            HeaderTag,
            { key: lineIndex, className: `content-header h${level}` },
            text
          );
        }
        // Check for emoji patterns (lines starting with emoji)
        const trimmedLine = line.trim();
        const firstChar = trimmedLine.charAt(0);
        const emojiPattern = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
        if (firstChar && emojiPattern.test(firstChar)) {
          return <p key={lineIndex} className="content-paragraph emoji-line">{line}</p>;
        }
        // Regular paragraphs
        if (line.trim()) {
          return <p key={lineIndex} className="content-paragraph">{line}</p>;
        }
        return <br key={lineIndex} />;
      });
    });
  };

  return (
    <div className={`blog-details-page ${isArabic ? 'rtl' : ''}`}>
      <div className="blog-details-container">
        <button className={`back-button ${isArabic ? 'rtl' : ''}`} onClick={() => navigate('/blog')}>
          {isArabic ? (
            <>
              Back to Blog
              <i className="fas fa-arrow-right"></i>
            </>
          ) : (
            <>
              <i className="fas fa-arrow-left"></i>
              Back to Blog
            </>
          )}
        </button>

        <article className={`blog-details-article ${isArabic ? 'rtl' : ''}`}>
          <div className="blog-details-header">
            <div className="blog-details-image-container">
              <img
                src={post.image}
                alt={post.title}
                className="blog-details-image"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://via.placeholder.com/1200x600/7C3AED/ffffff?text=' +
                    encodeURIComponent(post.title);
                }}
              />
              <div className="blog-details-image-overlay"></div>
              <div className="blog-details-category-badge">{post.category}</div>
            </div>

            <div className="blog-details-header-content">
              <div className={`blog-details-meta ${isArabic ? 'rtl' : ''}`}>
                <span className="blog-details-date">
                  <i className="fas fa-calendar"></i>
                  {formatDate(post.date)}
                </span>
                <span className="blog-details-meta-divider"></span>
                <span className="blog-details-read-time">
                  <i className="fas fa-clock"></i>
                  {post.readTime}
                </span>
                <span className="blog-details-meta-divider"></span>
                <span className="blog-details-author">
                  <i className="fas fa-user"></i>
                  {post.author}
                </span>
              </div>

              <h1 className={`blog-details-title ${isArabic ? 'rtl' : ''}`}>{post.title}</h1>
              <p className={`blog-details-excerpt ${isArabic ? 'rtl' : ''}`}>{post.excerpt}</p>
            </div>
          </div>

          <div className={`blog-details-content ${isArabic ? 'rtl' : ''}`}>
            {formatContent(post.content)}
          </div>

          <div className="blog-details-footer">
            <Link to="/blog" className={`back-to-blog-btn ${isArabic ? 'rtl' : ''}`}>
              {isArabic ? (
                <>
                  Back to All Posts
                  <i className="fas fa-arrow-right"></i>
                </>
              ) : (
                <>
                  <i className="fas fa-arrow-left"></i>
                  Back to All Posts
                </>
              )}
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetailsPage;

