import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addLocalWorkout } from "../../../store/workouts/workoutsSlice";
import {
  closeAddModal,
  closeEditModal,
} from "../../../store/UI/workoutsUISlice";
import { supabase } from "../../../lib/supabase";
import Card from "../../Card/Card";
import "./AddWorkoutsModal.css";
import { updateWorkoutFull } from "../../../store/workouts/workoutsThunks";

const uid = () =>
  crypto?.randomUUID ? crypto.randomUUID() : String(Math.random());

const toInputStr = (v) => (v === null || v === undefined ? "" : String(v));

export default function AddWorkoutModal({
  edit = false,
  workout = null,
  onClose,
}) {
  const dispatch = useDispatch();
  const catalog = useSelector((s) => s.workouts.catalog);
  const userId = useSelector((s) => s.auth.user.id);

  const [date, setDate] = useState(() =>
    edit
      ? (workout?.date ?? new Date().toISOString().slice(0, 10))
      : new Date().toISOString().slice(0, 10),
  );

  const [duration, setDuration] = useState(() =>
    edit ? toInputStr(workout?.duration) : "",
  );

  const [notes, setNotes] = useState(() =>
    edit ? toInputStr(workout?.notes) : "",
  );

  const [rows, setRows] = useState(() =>
    edit
      ? (workout?.exercises ?? []).map((r) => ({
          id: r.id,
          exercise_id: toInputStr(r.exercise_id),
          sets: toInputStr(r.sets),
          reps: toInputStr(r.reps),
          weight: toInputStr(r.weight),
        }))
      : [{ id: uid(), exercise_id: "", sets: "", reps: "", weight: "" }],
  );

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  function updateRow(id, patch) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function addRow() {
    setRows((prev) => [
      ...prev,
      { id: uid(), exercise_id: "", sets: "", reps: "", weight: "" },
    ]);
  }

  function removeRow(id) {
    setRows((prev) => {
      const next = prev.filter((x) => x.id !== id);
      if (next.length === 0) {
        return [{ id: uid(), exercise_id: "", sets: "", reps: "", weight: "" }];
      }
      return next;
    });
  }

  const toNumOrNull = (v) =>
    v === "" || v === null || v === undefined ? null : Number(v);

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setErr(null);

    try {
      const selectedRows = rows.filter((r) => r.exercise_id);
      if (!selectedRows.length) {
        throw new Error("Add at least one exercise to your workout.");
      }

      if (edit) {
        await dispatch(
          updateWorkoutFull({
            workout,
            updates: {
              date,
              duration,
              notes,
              rows: selectedRows,
            },
          }),
        );

        dispatch(closeEditModal());
        return;
      }

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
        sets: Number(r.sets),
        reps: Number(r.reps),
        weight: toNumOrNull(r.weight),
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

  if (edit && !workout) return null;

  return (
    <div className="modal-backdrop awm__backdrop">
      <Card className="modal-content awm__modal">
        <h3 className="modal-title awm__title">
          {edit ? "Edit Workout" : "Add Workout"}
        </h3>

        <form className="modal-form awm__form" onSubmit={submit}>
          <label className="modal-field awm__field">
            <span className="modal-label awm__label">Date</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="awm__input"
            />
          </label>

          <label className="modal-field awm__field">
            <span className="modal-label awm__label">Duration</span>
            <input
              type="number"
              min={0}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="awm__input"
            />
          </label>

          <label className="modal-field awm__field">
            <span className="modal-label awm__label">Notes</span>
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="awm__input"
              placeholder="Optional"
            />
          </label>

          <h4 className="modal-subtitle awm__subtitle">Exercises</h4>

          {rows.map((r) => (
            <div className="awm__row" key={r.id}>
              <select
                className="awm__select"
                value={r.exercise_id ?? ""}
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
                value={r.sets ?? ""} // always string
                onChange={(e) => updateRow(r.id, { sets: e.target.value })}
              />

              <input
                className="awm__input"
                type="number"
                min={1}
                placeholder="Reps"
                value={r.reps ?? ""}
                onChange={(e) => updateRow(r.id, { reps: e.target.value })}
              />

              <input
                className="awm__input"
                type="number"
                min={0}
                step="0.5"
                placeholder="Weight"
                value={r.weight ?? ""}
                onChange={(e) => updateRow(r.id, { weight: e.target.value })}
              />

              <button
                type="button"
                className="btn btn-danger awm__remove"
                onClick={() => removeRow(r.id)}
              >
                Remove Exercise
              </button>
            </div>
          ))}
          <div className="awm__addRowWrap">
            <button type="button" className="btn awm__addRow" onClick={addRow}>
              + Add exercise
            </button>
          </div>

          {err && <p className="error">{err}</p>}

          <div className="modal-actions awm__actions">
            <button
              type="button"
              className="btn"
              onClick={() => {
                if (typeof onClose === "function") return onClose();
                return dispatch(edit ? closeEditModal() : closeAddModal());
              }}
              disabled={saving}
            >
              Cancel
            </button>
            <button className="btn btn-primary">
              {saving ? "Saving…" : edit ? "Save Changes" : "Add Workout"}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
