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
            <th className="ex-th ex-col-name">Name</th>
            <th className="ex-th ex-col-muscle">Muscle group</th>
            <th className="ex-th ex-col-desc">Description</th>
            <th className="ex-th ex-col-actions">Actions</th>
          </tr>
        </thead>

        <tbody className="desktop-body">
          {pageRows.map((ex) => (
            <ExercisesTableRow key={ex.id} ex={ex} mode="desktop" />
          ))}
        </tbody>

        <tbody className="mobile-body">
          {pageRows.map((ex) => (
            <ExercisesTableRow key={ex.id} ex={ex} mode="mobile" />
          ))}
        </tbody>
      </table>
    </div>
  );
}
