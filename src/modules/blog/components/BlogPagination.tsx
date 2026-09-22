import { getVisiblePages } from '@/modules/blog/utils/pagination';

export interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  pageStart: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

export const BlogPagination = ({
  currentPage,
  totalPages,
  totalPosts,
  pageStart,
  pageCount,
  onPageChange,
}: BlogPaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <nav className="blog-pagination" aria-label="Blog posts pagination">
      <p className="blog-pagination-status">
        Showing {pageStart + 1}–{pageStart + pageCount} of {totalPosts} posts
      </p>
      <div className="blog-pagination-controls">
        <button
          type="button"
          className="blog-pagination-btn"
          onClick={() => onPageChange(currentPage - 1)}
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
              className={`blog-pagination-btn blog-pagination-page ${
                item === currentPage ? 'active' : ''
              }`}
              onClick={() => onPageChange(item)}
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
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <span>Next</span>
          <i className="fas fa-chevron-right" aria-hidden="true"></i>
        </button>
      </div>
    </nav>
  );
};
