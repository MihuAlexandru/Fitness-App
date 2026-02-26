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
            {/* Mobile text buttons */}
            <button
              className="ex-btn ex-btn--text"
              onClick={() => dispatch(openEditModal(ex))}
            >
              Edit
            </button>
            <button
              className="ex-btn ex-btn--text btn-danger"
              onClick={onDelete}
            >
              Delete
            </button>

            {/* Desktop icon buttons */}
            <img
              className="ex-icon ex-icon--edit"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAlElEQVR4nO3UMQoCMRBG4e9+VisIgrXgIYTd49jZeAiv4QW0lUV3RZyFsNiZWOVBSJji/ZMJhMqHPW5oFKDDGOuBdU75KcQ9Dsk5y02OIRywjdoUcs01liH2C3bR/Rhv8rO8xwbnWVibS95EbYVnKfkC91LyZTLzKlfl/5FLfsW3dC7vZGAKyN75PCBdrYwUlVd84wW1U2UuYfrsxgAAAABJRU5ErkJggg=="
              alt="edit"
              onClick={() => dispatch(openEditModal(ex))}
            />

            <img
              className="ex-icon ex-icon--delete"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAASUlEQVR4nGNgGCmggYGB4T8a7iDXsP8U4oG3gIFUxQykq6e/Bf9J5I9awDBqAcOoBSPQAkJg8FnwhIx64AkpFviRaMkTqJ5hCAD2EKaTKxxljwAAAABJRU5ErkJggg=="
              alt="delete"
              onClick={onDelete}
            />
          </div>
        ) : (
          <span className="muted-dash">—</span>
        )}
      </td>
    </tr>
  );
}
