import "./PaginatedFooter.css";

export default function PaginatedFooter({
  page,
  pageCount,
  total,
  label = "item",
  onPageChange,
}) {
  const handlePrev = () => {
    const newPage = Math.max(1, page - 1);
    if (onPageChange) {
      onPageChange(newPage);
    }
  };

  const handleNext = () => {
    const newPage = Math.min(pageCount, page + 1);
    if (onPageChange) {
      onPageChange(newPage);
    }
  };

  return (
    <footer className="paginated-footer">
      <span className="paginated-footer__total">
        Total: {total} {label}
        {total === 1 ? "" : "s"}
      </span>

      <div
        className="paginated-footer__pager"
        role="navigation"
        aria-label="Pagination"
      >
        <button
          className="btn paginated-footer__btn"
          onClick={handlePrev}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          ◀
        </button>

        <span className="paginated-footer__pageInfo">
          Page <strong>{page}</strong> of <strong>{pageCount}</strong>
        </span>

        <button
          className="btn paginated-footer__btn"
          onClick={handleNext}
          disabled={page >= pageCount}
          aria-label="Next page"
        >
          ▶
        </button>
      </div>
    </footer>
  );
}
