import { useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useBlogPosts, useBlogFilter } from '@/modules/blog';
import { BlogCard } from './BlogCard';
import { FeaturedBlogCard } from './FeaturedBlogCard';
import { BlogFilters } from './BlogFilters';
import { BlogPagination } from './BlogPagination';
import { BlogSeriesDiscovery } from './BlogSeriesDiscovery';
import Loading from '@/shared/components/feedback/Loading';
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

export const BlogList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const postsRef = useRef<HTMLDivElement>(null);
  const { posts, loading, error } = useBlogPosts();
  const {
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    categories,
    filteredPosts,
    featuredPosts,
    regularPosts,
  } = useBlogFilter({ posts });

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
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (page <= 1) next.delete('page');
        else next.set('page', String(page));
        return next;
      },
      { replace: true }
    );
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

  return (
    <section className="blog" id="blog">
      <div className="blog-container">
        <BlogFilters
          categories={categories}
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          onCategoryChange={(cat) => {
            setSelectedCategory(cat);
            resetToFirstPage();
          }}
          onSearchChange={(query) => {
            setSearchQuery(query);
            resetToFirstPage();
          }}
        />

        <BlogSeriesDiscovery />

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
                <FeaturedBlogCard post={featuredPost} />
                {extraFeaturedPosts.length > 0 && (
                  <div className="blog-featured-more">
                    <div className="blog-highlighted-grid">
                      {extraFeaturedPosts.map((post) => (
                        <BlogCard key={post.id} post={post} variant="highlighted" />
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
                    <BlogCard key={post.id} post={post} variant="highlighted" />
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
                    <BlogCard key={post.id} post={post} variant="regular" />
                  ))}
                </div>
              </div>
            )}

            <BlogPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalPosts={regularPosts.length}
              pageStart={pageStart}
              pageCount={pagePosts.length}
              onPageChange={goToPage}
            />

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

export default BlogList;
