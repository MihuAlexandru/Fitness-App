import { useDispatch, useSelector } from "react-redux";
import {
  selectPageData,
  selectTotal,
} from "../../../store/UI/exercisesSelectors";
import { setPage } from "../../../store/UI/exercisesUISlice";
import "./ExercisesFooter.css";

export default function ExercisesFooter() {
  const dispatch = useDispatch();
  const { page, pageCount } = useSelector(selectPageData);
  const total = useSelector(selectTotal);

  return (
    <footer className="exf">
      <span className="exf__total">
        Total: {total} exercise{total === 1 ? "" : "s"}
      </span>

      <div className="exf__pager" role="navigation" aria-label="Pagination">
        <button
          className="btn exf__btn"
          onClick={() => dispatch(setPage(Math.max(1, page - 1)))}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          ◀
        </button>

        <span className="exf__pageInfo">
          Page <strong>{page}</strong> of <strong>{pageCount}</strong>
        </span>

        <button
          className="btn exf__btn"
          onClick={() => dispatch(setPage(Math.min(pageCount, page + 1)))}
          disabled={page >= pageCount}
          aria-label="Next page"
        >
          ▶
        </button>
      </div>
    </footer>
  );
}
