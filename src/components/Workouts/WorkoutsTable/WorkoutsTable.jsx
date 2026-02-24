import { useSelector } from "react-redux";
import { selectFilteredSortedPagedWorkouts } from "../../../store/UI/workoutsSelectors";
import WorkoutRow from "../WorkoutsRow/WorkoutsRow";

export default function WorkoutsTable() {
  const { paged } = useSelector(selectFilteredSortedPagedWorkouts);

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
    </>
  );
}
