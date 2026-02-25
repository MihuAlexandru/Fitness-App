import { useSelector } from "react-redux";
import { selectFilteredSortedPagedWorkouts } from "../../../store/UI/workoutsSelectors";
import WorkoutsRow from "../WorkoutsRow/WorkoutsRow";
import "./WorkoutsTable.css";

export default function WorkoutsTable() {
  const { paged } = useSelector(selectFilteredSortedPagedWorkouts);

  if (!paged?.length) return <p className="w-empty">No workouts found.</p>;

  return (
    <div className="wtable-wrapper">
      <table className="wtable" role="table">
        <thead className="wthead">
          <tr>
            <th className="wth">Date</th>
            <th className="wth">Duration</th>
            <th className="wth">Notes</th>
            <th className="wth">Exercises</th>
            <th className="wth">Actions</th>
          </tr>
        </thead>

        <tbody>
          {paged.map((w) => (
            <WorkoutsRow key={w.id} w={w} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
