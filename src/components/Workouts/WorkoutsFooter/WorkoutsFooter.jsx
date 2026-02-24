import { useDispatch, useSelector } from "react-redux";
import { selectFilteredSortedPagedWorkouts } from "../../../store/UI/workoutsSelectors";
import { setPage } from "../../../store/UI/workoutsUISlice";
import "./WorkoutsFooter.css";

export default function WorkoutFooter() {
  const dispatch = useDispatch();
  const { total, pageCount, page } = useSelector(
    selectFilteredSortedPagedWorkouts,
  );

  const prev = () => dispatch(setPage(Math.max(1, page - 1)));
  const next = () => dispatch(setPage(Math.min(pageCount, page + 1)));

  return (
    <footer className="wf">
      <span className="wf__total">Total: {total}</span>

      <div className="wf__pager" role="navigation" aria-label="Pagination">
        <button
          className="btn wf__btn"
          onClick={prev}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          ◀
        </button>

        <span className="wf__pageInfo">
          Page <strong>{page}</strong> of <strong>{pageCount}</strong>
        </span>

        <button
          className="btn wf__btn"
          onClick={next}
          disabled={page >= pageCount}
          aria-label="Next page"
        >
          ▶
        </button>
      </div>
    </footer>
  );
}
