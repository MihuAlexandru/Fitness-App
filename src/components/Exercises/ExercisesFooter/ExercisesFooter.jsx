import { useDispatch, useSelector } from "react-redux";
import {
  selectPageData,
  selectTotal,
} from "../../../store/UI/exercisesSelectors";
import { setPage } from "../../../store/UI/exercisesUISlice";

export default function ExercisesFooter() {
  const dispatch = useDispatch();
  const { page, pageCount } = useSelector(selectPageData);
  const total = useSelector(selectTotal);

  return (
    <footer
      style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}
    >
      <button
        onClick={() => dispatch(setPage(Math.max(1, page - 1)))}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        ◀
      </button>
      <span>
        Page <strong>{page}</strong> of <strong>{pageCount}</strong>
      </span>
      <button
        onClick={() => dispatch(setPage(Math.min(pageCount, page + 1)))}
        disabled={page >= pageCount}
        aria-label="Next page"
      >
        ▶
      </button>
      <span style={{ marginLeft: "auto", opacity: 0.7 }}>
        Total: {total} exercise{total === 1 ? "" : "s"}
      </span>
    </footer>
  );
}
