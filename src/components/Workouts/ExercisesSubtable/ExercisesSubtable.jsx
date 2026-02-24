import { useDispatch } from "react-redux";

import { useState } from "react";
import {
  deleteWorkoutExercise,
  updateWorkoutExercise,
} from "../../../store/workouts/workoutsThunks";

export default function ExercisesSubtable({ workout }) {
  const dispatch = useDispatch();
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({ sets: "", reps: "", weight: "" });

  const rows = workout.exercises;

  function startEdit(row) {
    setEditingId(row.id);
    setDraft({
      sets: row.sets,
      reps: row.reps,
      weight: row.weight,
    });
  }

  function cancel() {
    setEditingId(null);
  }

  async function save(id) {
    const patch = {
      sets: Number(draft.sets),
      reps: Number(draft.reps),
      weight: Number(draft.weight),
    };

    await dispatch(updateWorkoutExercise({ id, patch }));
    cancel();
  }

  return (
    <div style={{ background: "#fafafa", padding: 12 }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Exercise</th>
            <th>Muscle</th>
            <th>Sets</th>
            <th>Reps</th>
            <th>Weight</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>
                <strong>{r.exercise?.name}</strong>
              </td>
              <td>{r.exercise?.muscle_group}</td>

              <td>
                {editingId === r.id ? (
                  <input
                    value={draft.sets}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, sets: e.target.value }))
                    }
                  />
                ) : (
                  r.sets
                )}
              </td>

              <td>
                {editingId === r.id ? (
                  <input
                    value={draft.reps}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, reps: e.target.value }))
                    }
                  />
                ) : (
                  r.reps
                )}
              </td>

              <td>
                {editingId === r.id ? (
                  <input
                    value={draft.weight}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, weight: e.target.value }))
                    }
                  />
                ) : (
                  r.weight
                )}
              </td>

              <td>
                {editingId === r.id ? (
                  <>
                    <button onClick={() => save(r.id)}>Save</button>
                    <button onClick={cancel}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(r)}>Edit</button>
                    <button
                      onClick={() => dispatch(deleteWorkoutExercise(r.id))}
                      style={{ color: "#b91c1c" }}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
