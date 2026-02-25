import { useDispatch, useSelector } from "react-redux";
import { openEditModal } from "../../../store/UI/exercisesUISlice";
import { deleteExercise } from "../../../store/exercises/exercisesThunks";
import "./ExercisesTableRow.css";

export default function ExercisesTableRow({ ex }) {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const canEdit = !!user;

  const onDelete = () => {
    if (!window.confirm(`Delete "${ex.name}"?`)) return;
    dispatch(deleteExercise(ex.id));
  };

  return (
    <tr className="ex-tr">
      <td className="ex-td ex-td--name" data-label="Name">
        <strong>{ex.name}</strong>
      </td>

      <td className="ex-td ex-td--muscle" data-label="Muscle group">
        <em>{ex.muscle_group}</em>
      </td>

      <td className="ex-td ex-td--desc" data-label="Description">
        {ex.description}
      </td>

      <td className="ex-td ex-td--actions" data-label="Actions">
        {canEdit ? (
          <div className="ex-actions">
            <button
              className="ex-btn"
              onClick={() => dispatch(openEditModal(ex))}
            >
              Edit
            </button>
            <button className="ex-btn ex-btn--danger" onClick={onDelete}>
              Delete
            </button>
          </div>
        ) : (
          <span className="muted-dash">—</span>
        )}
      </td>
    </tr>
  );
}
