import { useDispatch, useSelector } from "react-redux";
import { openEditModal } from "../../../store/UI/exercisesUISlice";
import { deleteExercise } from "../../../store/exercises/exercisesThunks";

export default function ExercisesTableRow({ ex, tdStyle }) {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const canEdit = !!user;

  return (
    <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
      <td style={tdStyle}>
        <strong>{ex.name}</strong>
      </td>
      <td style={tdStyle}>
        <em>{ex.muscle_group}</em>
      </td>
      <td style={tdStyle}>{ex.description}</td>
      <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
        {canEdit ? (
          <>
            <button
              onClick={() => dispatch(openEditModal(ex))}
              style={{ marginRight: 8 }}
            >
              Edit
            </button>
            <button
              onClick={() => {
                if (!window.confirm(`Delete "${ex.name}"?`)) return;
                dispatch(deleteExercise(ex.id));
              }}
              style={{ color: "#b91c1c" }}
            >
              Delete
            </button>
          </>
        ) : (
          <span style={{ opacity: 0.6 }}>—</span>
        )}
      </td>
    </tr>
  );
}
