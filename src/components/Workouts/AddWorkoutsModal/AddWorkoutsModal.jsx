import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addLocalWorkout } from "../../../store/workouts/workoutsSlice";
import { closeAddModal } from "../../../store/UI/workoutsUISlice";
import { supabase } from "../../../lib/supabase";
import Card from "../../Card/Card";
import "./AddWorkoutsModal.css";

// simple UUID helper (works in modern browsers; falls back to Math.random)
const uid = () =>
  crypto?.randomUUID ? crypto.randomUUID() : String(Math.random());

export default function AddWorkoutModal() {
  const dispatch = useDispatch();
  const catalog = useSelector((s) => s.workouts.catalog);
  const userId = useSelector((s) => s.auth.user.id);

  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [rows, setRows] = useState([
    { id: uid(), exercise_id: "", sets: "", reps: "", weight: "" },
  ]);

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  function updateRow(id, patch) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  // NEW: add another empty exercise row
  function addRow() {
    setRows((prev) => [
      ...prev,
      { id: uid(), exercise_id: "", sets: "", reps: "", weight: "" },
    ]);
  }

  // NEW: remove row, but ensure we keep at least one empty row
  function removeRow(id) {
    setRows((prev) => {
      const next = prev.filter((x) => x.id !== id);
      if (next.length === 0) {
        return [{ id: uid(), exercise_id: "", sets: "", reps: "", weight: "" }];
      }
      return next;
    });
  }

  // Optional helpers to convert fields
  const toNumOrNull = (v) =>
    v === "" || v === null || v === undefined ? null : Number(v);

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setErr(null);

    try {
      // Basic validation: at least one selected exercise
      const selectedRows = rows.filter((r) => r.exercise_id);
      if (!selectedRows.length) {
        throw new Error("Add at least one exercise to your workout.");
      }

      // Optional validation: require sets & reps if exercise chosen
      const invalid = selectedRows.find(
        (r) => !r.sets || Number(r.sets) <= 0 || !r.reps || Number(r.reps) <= 0,
      );
      if (invalid) {
        throw new Error(
          "Please provide valid Sets and Reps for each selected exercise.",
        );
      }

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

      const payload = selectedRows.map((r) => ({
        exercise_id: r.exercise_id,
        sets: Number(r.sets), // required from validation
        reps: Number(r.reps), // required from validation
        weight: toNumOrNull(r.weight), // optional
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
    <div className="awm__backdrop">
      <Card className="awm__modal">
        <h3 className="awm__title">Add Workout</h3>

        <form className="awm__form" onSubmit={submit}>
          <label className="awm__field">
            <span className="awm__label">Date</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="awm__input"
            />
          </label>

          <label className="awm__field">
            <span className="awm__label">Duration</span>
            <input
              type="number"
              min={0}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="awm__input"
            />
          </label>

          <label className="awm__field">
            <span className="awm__label">Notes</span>
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="awm__input"
              placeholder="Optional"
            />
          </label>

          <h4 className="awm__subtitle">Exercises</h4>

          {rows.map((r) => (
            <div className="awm__row" key={r.id}>
              <select
                className="awm__select"
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
                className="awm__input"
                type="number"
                min={1}
                placeholder="Sets"
                value={r.sets}
                onChange={(e) => updateRow(r.id, { sets: e.target.value })}
              />

              <input
                className="awm__input"
                type="number"
                min={1}
                placeholder="Reps"
                value={r.reps}
                onChange={(e) => updateRow(r.id, { reps: e.target.value })}
              />

              <input
                className="awm__input"
                type="number"
                min={0}
                step="0.5"
                placeholder="Weight"
                value={r.weight}
                onChange={(e) => updateRow(r.id, { weight: e.target.value })}
              />

              <button
                type="button"
                className="btn btn-danger awm__remove"
                onClick={() => removeRow(r.id)}
              >
                Remove
              </button>
            </div>
          ))}

          {/* NEW: Add another exercise row */}
          <div className="awm__addRowWrap">
            <button
              type="button"
              className="btn btn-outline awm__addRow"
              onClick={addRow}
            >
              + Add exercise row
            </button>
          </div>

          {err && <p className="awm__error">{err}</p>}

          <div className="awm__actions">
            <button
              type="button"
              className="btn"
              onClick={() => dispatch(closeAddModal())}
              disabled={saving}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving…" : "Add Workout"}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
