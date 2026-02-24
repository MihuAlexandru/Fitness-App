import { useDispatch, useSelector } from "react-redux";
import { selectFilteredSortedPagedWorkouts } from "../../../store/UI/workoutsSelectors";
import WorkoutRow from "../WorkoutsRow/WorkoutsRow";
import { setPage } from "../../../store/UI/workoutsUISlice";

export default function WorkoutsTable() {
  const dispatch = useDispatch();
  const { paged, total, pageCount, page } = useSelector(
    selectFilteredSortedPagedWorkouts,
  );

  if (!paged.length) return <p>No workouts found.</p>;

  return (
    <>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #ddd" }}>
              <th>Date</th>
              <th>Duration</th>
              <th>Notes</th>
              <th>Exercises</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((w) => (
              <WorkoutRow key={w.id} w={w} />
            ))}
          </tbody>
        </table>
      </div>

      <footer style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <button
          onClick={() => dispatch(setPage(page - 1))}
          disabled={page <= 1}
        >
          ◀
        </button>

        <span>
          Page <strong>{page}</strong> of <strong>{pageCount}</strong>
        </span>

        <button
          onClick={() => dispatch(setPage(page + 1))}
          disabled={page >= pageCount}
        >
          ▶
        </button>

        <span style={{ marginLeft: "auto", opacity: 0.7 }}>Total: {total}</span>
      </footer>
    </>
  );
}
