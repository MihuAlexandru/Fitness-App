import { useSelector } from "react-redux";
import { selectPageData } from "../../../store/UI/exercisesSelectors";
import ExercisesTableRow from "../ExercisesTableRow/ExercisesTableRow";
import "./ExercisesTable.css";

export default function ExercisesTable({ loading, err }) {
  const { pageRows } = useSelector(selectPageData);

  if (loading) return <p>Loading…</p>;
  if (err) return <p className="error-text">{err}</p>;
  if (!pageRows?.length) return <p>No exercises found.</p>;

  return (
    <div className="table-wrapper">
      <table className="ex-table">
        <thead className="ex-thead">
          <tr>
            <th className="ex-th">Name</th>
            <th className="ex-th">Muscle group</th>
            <th className="ex-th">Description</th>
            <th className="ex-th">Actions</th>
          </tr>
        </thead>

        <tbody>
          {pageRows.map((ex) => (
            <ExercisesTableRow key={ex.id} ex={ex} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
