import { useDispatch, useSelector } from "react-redux";
import { deleteWorkout } from "../../../store/workouts/workoutsThunks";
import { toggleExpand, openEditModal } from "../../../store/UI/workoutsUISlice";
import ExercisesSubtable from "../ExercisesSubtable/ExercisesSubtable";
import "./WorkoutsRow.css";

export default function WorkoutsRow({ w }) {
  const dispatch = useDispatch();
  const { expanded } = useSelector((s) => s.workoutsUi);
  const isOpen = expanded.includes(w.id);

  return (
    <>
      <tr className="wtr">
        <td className="wtd" data-label="Date">
          {w.date}
        </td>

        <td className="wtd" data-label="Duration">
          {w.duration ?? "—"} min
        </td>

        <td className="wtd" data-label="Notes">
          {w.notes || <em>No notes</em>}
        </td>

        <td className="wtd" data-label="Exercises">
          {w.exercises.length}{" "}
          {w.exercises.length === 1 ? "exercise" : "exercises"}
        </td>

        <td className="wtd wtd--actions" data-label="Actions">
          <div className="w-actions">
            <button
              className="ex-btn"
              onClick={() => dispatch(openEditModal(w))}
              aria-label="Edit workout"
            >
              Edit
            </button>

            <button
              className="ex-btn btn-danger"
              onClick={() => dispatch(deleteWorkout(w.id))}
              aria-label="Delete workout"
            >
              Delete
            </button>
          </div>
        </td>
        <td className="wtd">
          {w.exercises.length !== 0 && (
            <button
              className="ex-btn expand-btn"
              onClick={() => dispatch(toggleExpand(w.id))}
              aria-expanded={isOpen}
              aria-label={isOpen ? "Collapse exercises" : "Expand exercises"}
              title={isOpen ? "Collapse" : "Expand"}
            >
              {!isOpen ? "▼" : "▲"}
            </button>
          )}
        </td>
      </tr>

      {isOpen && (
        <tr className="wtr wtr--sub">
          <td className="wtd wtd--sub" colSpan={6}>
            <ExercisesSubtable workout={w} />
          </td>
        </tr>
      )}
    </>
  );
}
