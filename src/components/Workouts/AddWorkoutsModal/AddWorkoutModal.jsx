import { useDispatch, useSelector } from "react-redux";

import { useState } from "react";
import { addLocalWorkout } from "../../../store/workouts/workoutsSlice";
import { closeAddModal } from "../../../store/UI/workoutsUISlice";
import { supabase } from "../../../lib/supabase";

export default function AddWorkoutModal() {
  const dispatch = useDispatch();
  const catalog = useSelector((s) => s.workouts.catalog);
  const userId = useSelector((s) => s.auth.user.id);

  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [rows, setRows] = useState([
    { id: Math.random(), exercise_id: "", sets: "", reps: "", weight: "" },
  ]);

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  function updateRow(id, patch) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setErr(null);

    try {
      const { data: w, error: wErr } = await supabase
        .from("workouts")
        .insert([
          {
            date,
            duration: duration ? Number(duration) : null,
            notes: notes || null,
            created_by: userId,
          },
        ])
        .select("*")
        .single();

      if (wErr) throw wErr;

      const payload = rows
        .filter((r) => r.exercise_id)
        .map((r) => ({
          exercise_id: r.exercise_id,
          sets: Number(r.sets),
          reps: Number(r.reps),
          weight: Number(r.weight),
          workout_id: w.id,
        }));

      let inserted = [];
      if (payload.length) {
        const { data: weRows, error: weErr } = await supabase
          .from("workout_exercises")
          .insert(payload)
          .select("*");

        if (weErr) throw weErr;
        inserted = weRows;
      }

      const exById = new Map(catalog.map((e) => [e.id, e]));
      const exercises = inserted.map((r) => ({
        ...r,
        exercise: exById.get(r.exercise_id) || null,
      }));

      dispatch(addLocalWorkout({ ...w, exercises }));
      dispatch(closeAddModal());
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={backdrop}>
      <div style={modal}>
        <h3>Add Workout</h3>

        <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
          <label>
            Date:
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>

          <label>
            Duration:
            <input
              type="number"
              min={0}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </label>

          <label>
            Notes:
            <input value={notes} onChange={(e) => setNotes(e.target.value)} />
          </label>

          <h4>Exercises</h4>

          {rows.map((r) => (
            <div
              key={r.id}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr auto",
                gap: 8,
              }}
            >
              <select
                value={r.exercise_id}
                onChange={(e) =>
                  updateRow(r.id, { exercise_id: e.target.value })
                }
              >
                <option value="">Select exercise…</option>
                {catalog.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name} ({ex.muscle_group})
                  </option>
                ))}
              </select>

              <input
                type="number"
                min={1}
                placeholder="Sets"
                value={r.sets}
                onChange={(e) => updateRow(r.id, { sets: e.target.value })}
              />

              <input
                type="number"
                min={1}
                placeholder="Reps"
                value={r.reps}
                onChange={(e) => updateRow(r.id, { reps: e.target.value })}
              />

              <input
                type="number"
                min={0}
                step="0.5"
                placeholder="Weight"
                value={r.weight}
                onChange={(e) => updateRow(r.id, { weight: e.target.value })}
              />

              <button
                type="button"
                onClick={() =>
                  setRows((rows) => rows.filter((x) => x.id !== r.id))
                }
                style={{ color: "#b91c1c" }}
              >
                Remove
              </button>
            </div>
          ))}

          {err && <p style={{ color: "crimson" }}>{err}</p>}

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button type="button" onClick={() => dispatch(closeAddModal())}>
              Cancel
            </button>
            <button
              type="submit"
              style={{ background: "#16a34a", color: "#fff" }}
            >
              {saving ? "Saving…" : "Add Workout"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const backdrop = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "grid",
  placeItems: "center",
  zIndex: 1000,
};

const modal = {
  background: "#fff",
  padding: 16,
  borderRadius: 8,
  width: "min(700px, 96vw)",
  maxHeight: "90vh",
  overflow: "auto",
};
