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

        <td className="wtd" data-label="Actions">
          <div className="w-actions">
            {/* MOBILE TEXT BUTTONS */}
            <button
              className="ex-btn w-btn--text"
              onClick={() => dispatch(openEditModal(w))}
            >
              Edit
            </button>

            <button
              className="ex-btn btn-danger w-btn--text"
              onClick={() => dispatch(deleteWorkout(w.id))}
            >
              Delete
            </button>

            {/* DESKTOP ICON BUTTONS */}
            <img
              className="w-icon"
              alt="edit"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAlElEQVR4nO3UMQoCMRBG4e9+VisIgrXgIYTd49jZeAiv4QW0lUV3RZyFsNiZWOVBSJji/ZMJhMqHPW5oFKDDGOuBdU75KcQ9Dsk5y02OIRywjdoUcs01liH2C3bR/Rhv8rO8xwbnWVibS95EbYVnKfkC91LyZTLzKlfl/5FLfsW3dC7vZGAKyN75PCBdrYwUlVd84wW1U2UuYfrsxgAAAABJRU5ErkJggg=="
              onClick={() => dispatch(openEditModal(w))}
            />

            <img
              className="w-icon"
              alt="delete"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAASUlEQVR4nGNgGCmggYGB4T8a7iDXsP8U4oG3gIFUxQykq6e/Bf9J5I9awDBqAcOoBSPQAkJg8FnwhIx64AkpFviRaMkTqJ5hCAD2EKaTKxxljwAAAABJRU5ErkJggg=="
              onClick={() => dispatch(deleteWorkout(w.id))}
            />
          </div>
        </td>
        <td className="wtd">
          {w.exercises.length !== 0 && (
            <img
              className="expand-icon"
              onClick={() => dispatch(toggleExpand(w.id))}
              src={
                isOpen
                  ? "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAZklEQVR4nO2PMQqAMAxFX8C7OqhFwYu4eVfFipBCB3Wo6SJ58JckvE/AcX6FALNGasgXIGpWyxLJ5Icm6kys5QFos5JPn9zJEyYl04M8EbKSsaSgBzZgeLm5djvQUUhjdOM4DhU5AbdoHo3f7GFBAAAAAElFTkSuQmCC"
                  : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAaklEQVR4nO2PQQqAMAwEpwff2otWwY/Ym48VFSFCkIBQAr1kIOSQZbaFIAi6MzhlTCbgkP2XGVsKFuACTqAY9yK3JzO3FCRgUyVakpV8lyxeJdlLrkuqKnnl1UNu/cTt5V8SsMq4y4OgIzfe6R6N01DwigAAAABJRU5ErkJggg=="
              }
              alt={isOpen ? "Collapse exercises" : "Expand exercises"}
            />
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
