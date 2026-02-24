import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteWorkout,
  updateWorkoutNotes,
} from "../../../store/workouts/workoutsThunks";
import { toggleExpand } from "../../../store/UI/workoutsUISlice";
import ExercisesSubtable from "../ExercisesSubtable/ExercisesSubtable";

export default function WorkoutRow({ w }) {
  const dispatch = useDispatch();
  const { expanded } = useSelector((s) => s.workoutsUi);
  const isOpen = expanded.includes(w.id);

  const [editingNotes, setEditingNotes] = useState(false);
  const [draft, setDraft] = useState(w.notes || "");

  async function saveNotes() {
    await dispatch(updateWorkoutNotes({ id: w.id, notes: draft }));
    setEditingNotes(false);
  }

  return (
    <>
      <tr>
        <td>
          <button onClick={() => dispatch(toggleExpand(w.id))}>
            {isOpen ? "▾" : "▸"}
          </button>{" "}
          {w.date}
        </td>

        <td>{w.duration ?? "—"} min</td>

        <td>
          {editingNotes ? (
            <div style={{ display: "flex", gap: 8 }}>
              <input value={draft} onChange={(e) => setDraft(e.target.value)} />
              <button onClick={saveNotes}>Save</button>
              <button onClick={() => setEditingNotes(false)}>Cancel</button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 8 }}>
              <span>{w.notes || <em>No notes</em>}</span>
              <button onClick={() => setEditingNotes(true)}>Edit</button>
            </div>
          )}
        </td>

        <td>{w.exercises.length} exercises</td>

        <td>
          <button
            onClick={() => dispatch(deleteWorkout(w.id))}
            style={{ color: "#b91c1c" }}
          >
            Delete
          </button>
        </td>
      </tr>

      {isOpen && (
        <tr>
          <td colSpan={5}>
            <ExercisesSubtable workout={w} />
          </td>
        </tr>
      )}
    </>
  );
}
