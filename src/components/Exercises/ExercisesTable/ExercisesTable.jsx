import { useSelector } from "react-redux";
import { selectPageData } from "../../../store/UI/exercisesSelectors";
import ExercisesTableRow from "../ExercisesTableRow/ExercisesTableRow";

const th = { padding: "10px 8px", fontWeight: 600 };
const td = { padding: "10px 8px", verticalAlign: "top" };

export default function ExercisesTable({ loading, err }) {
  const { pageRows } = useSelector(selectPageData);

  if (loading) return <p>Loading…</p>;
  if (err) return <p style={{ color: "crimson" }}>{err}</p>;
  if (!pageRows.length) return <p>No exercises found.</p>;

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #ddd" }}>
            <th style={th}>Name</th>
            <th style={th}>Muscle group</th>
            <th style={th}>Description</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pageRows.map((ex) => (
            <ExercisesTableRow key={ex.id} ex={ex} tdStyle={td} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
