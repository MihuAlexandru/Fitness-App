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
                    <div className="wesub-actions">
                      <button className="ex-btn" onClick={() => save(r.id)}>
                        Save
                      </button>
                      <button className="ex-btn" onClick={cancel}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="wesub-actions">
                      <button className="ex-btn" onClick={() => startEdit(r)}>
                        Edit
                      </button>
                      <button
                        className="btn-danger ex-btn"
                        onClick={() => dispatch(deleteWorkoutExercise(r.id))}
                      >
                        Delete
                      </button>
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
