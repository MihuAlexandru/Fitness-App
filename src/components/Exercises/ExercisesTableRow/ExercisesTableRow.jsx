import { useDispatch, useSelector } from "react-redux";
import { openEditModal } from "../../../store/UI/exercisesUISlice";
import { deleteExercise } from "../../../store/exercises/exercisesThunks";
import { useState } from "react";
import "./ExercisesTableRow.css";

export default function ExercisesTableRow({ ex, mode }) {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const canEdit = !!user;

  const [expanded, setExpanded] = useState(false);

  const onDelete = () => {
    if (!window.confirm(`Delete "${ex.name}"?`)) return;
    dispatch(deleteExercise(ex.id));
  };

  return (
    <>
      {mode === "desktop" && (
        <tr className="ex-tr desktop-row">
          <td className="ex-td ex-td--name">
            <strong>{ex.name}</strong>
          </td>

          <td className="ex-td ex-td--muscle">
            <em>{ex.muscle_group}</em>
          </td>

          <td className="ex-td ex-td--desc">{ex.description}</td>

          <td className="ex-td ex-td--actions">
            {canEdit ? (
              <div className="ex-actions">
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
      )}

      {mode === "mobile" && (
        <tr className="mobile-card">
          <td colSpan="4">
            <div className="card">
              <div className="card-header">
                <span className="card-name">{ex.name}</span>
                <span className="card-muscle">{ex.muscle_group}</span>
              </div>
              <div className="expand-btn">
                <img
                  onClick={() => setExpanded(!expanded)}
                  src={
                    expanded
                      ? "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAZklEQVR4nO2PMQqAMAxFX8C7OqhFwYu4eVfFipBCB3Wo6SJ58JckvE/AcX6FALNGasgXIGpWyxLJ5Icm6kys5QFos5JPn9zJEyYl04M8EbKSsaSgBzZgeLm5djvQUUhjdOM4DhU5AbdoHo3f7GFBAAAAAElFTkSuQmCC"
                      : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAaklEQVR4nO2PQQqAMAwEpwff2otWwY/Ym48VFSFCkIBQAr1kIOSQZbaFIAi6MzhlTCbgkP2XGVsKFuACTqAY9yK3JzO3FCRgUyVakpV8lyxeJdlLrkuqKnnl1UNu/cTt5V8SsMq4y4OgIzfe6R6N01DwigAAAABJRU5ErkJggg=="
                  }
                  alt={expanded ? "Collapse exercises" : "Expand exercises"}
                />
              </div>

              {expanded && (
                <div className="card-body">
                  <p className="card-desc">{ex.description}</p>

                  {canEdit ? (
                    <div className="card-actions">
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
                    </div>
                  ) : (
                    <span className="muted-dash">—</span>
                  )}
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
