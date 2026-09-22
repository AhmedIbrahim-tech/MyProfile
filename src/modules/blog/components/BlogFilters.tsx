export interface BlogFiltersProps {
  categories: string[];
  selectedCategory: string;
  searchQuery: string;
  onCategoryChange: (category: string) => void;
  onSearchChange: (query: string) => void;
}

export const BlogFilters = ({
  categories,
  selectedCategory,
  searchQuery,
  onCategoryChange,
  onSearchChange,
}: BlogFiltersProps) => {
  return (
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
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search blog posts"
          />
        </div>
        <div className="blog-filters" role="group" aria-label="Filter by category">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => onCategoryChange(category)}
              aria-pressed={selectedCategory === category}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
