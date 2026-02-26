import { useDispatch } from "react-redux";
import { useState } from "react";
import {
  deleteWorkoutExercise,
  updateWorkoutExercise,
} from "../../../store/workouts/workoutsThunks";
import "./ExercisesSubtable.css";

export default function ExercisesSubtable({ workout }) {
  const dispatch = useDispatch();
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({ sets: "", reps: "", weight: "" });

  const rows = workout.exercises;

  function startEdit(row) {
    setEditingId(row.id);
    setDraft({
      sets: row.sets ?? "",
      reps: row.reps ?? "",
      weight: row.weight ?? "",
    });
  }

  function cancel() {
    setEditingId(null);
  }

  async function save(id) {
    const patch = {
      sets: Number(draft.sets),
      reps: Number(draft.reps),
      weight:
        draft.weight === "" || draft.weight === null
          ? null
          : Number(draft.weight),
    };

    await dispatch(updateWorkoutExercise({ id, patch }));
    cancel();
  }

  return (
    <div className="wesub">
      <table className="wesub-table">
        <thead className="wesub-thead">
          <tr>
            <th className="wesub-th">Exercise</th>
            <th className="wesub-th">Muscle</th>
            <th className="wesub-th">Sets</th>
            <th className="wesub-th">Reps</th>
            <th className="wesub-th">Weight</th>
            <th className="wesub-th">Actions</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((r) => {
            const isEditing = editingId === r.id;
            return (
              <tr key={r.id} className="wesub-tr">
                <td className="wesub-td" data-label="Exercise">
                  <strong>{r.exercise?.name}</strong>
                </td>

                <td className="wesub-td" data-label="Muscle">
                  {r.exercise?.muscle_group}
                </td>

                <td className="wesub-td" data-label="Sets">
                  {isEditing ? (
                    <input
                      className="wesub-input"
                      value={draft.sets}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, sets: e.target.value }))
                      }
                      type="number"
                      min={1}
                    />
                  ) : (
                    r.sets
                  )}
                </td>

                <td className="wesub-td" data-label="Reps">
                  {isEditing ? (
                    <input
                      className="wesub-input"
                      value={draft.reps}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, reps: e.target.value }))
                      }
                      type="number"
                      min={1}
                    />
                  ) : (
                    r.reps
                  )}
                </td>

                <td className="wesub-td" data-label="Weight">
                  {isEditing ? (
                    <input
                      className="wesub-input"
                      value={draft.weight}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, weight: e.target.value }))
                      }
                      type="number"
                      min={0}
                      step="0.5"
                    />
                  ) : (
                    (r.weight ?? "—")
                  )}
                </td>

                <td className="wesub-td wesub-td--actions" data-label="Actions">
                  {isEditing ? (
                    <div className="wesub-actions is-editing">
                      <button
                        className="ex-btn ex-btn--text"
                        onClick={() => save(r.id)}
                      >
                        Save
                      </button>
                      <button className="ex-btn ex-btn--text" onClick={cancel}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="wesub-actions">
                      <button
                        className="ex-btn ex-btn--text"
                        onClick={() => startEdit(r)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-danger ex-btn ex-btn--text"
                        onClick={() => dispatch(deleteWorkoutExercise(r.id))}
                      >
                        Delete
                      </button>

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        className="icon-theme wesub-icon"
                        onClick={() => startEdit(r)}
                      >
                        <path d="M18.4,4.4l1.2,1.2L6.2,19H5v-1.2L18.4,4.4 M18.4,2c-0.3,0-0.5,0.1-0.7,0.3L3,17v4h4L21.7,6.3c0.4-0.4,0.4-1,0-1.4l-2.6-2.6 C18.9,2.1,18.7,2,18.4,2L18.4,2z"></path>
                        <path
                          d="M15.8 4.3H17.8V9.2H15.8z"
                          transform="rotate(-45.001 16.75 6.75)"
                        ></path>
                      </svg>

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        onClick={() => dispatch(deleteWorkoutExercise(r.id))}
                        className="icon-theme wesub-icon"
                      >
                        <path d="M 10 2 L 9 3 L 4 3 L 4 5 L 5 5 L 5 20 C 5 20.522222 5.1913289 21.05461 5.5683594 21.431641 C 5.9453899 21.808671 6.4777778 22 7 22 L 17 22 C 17.522222 22 18.05461 21.808671 18.431641 21.431641 C 18.808671 21.05461 19 20.522222 19 20 L 19 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 7 5 L 17 5 L 17 20 L 7 20 L 7 5 z M 9 7 L 9 18 L 11 18 L 11 7 L 9 7 z M 13 7 L 13 18 L 15 18 L 15 7 L 13 7 z"></path>
                      </svg>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
