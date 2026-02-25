import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  closeAddModal,
  closeEditModal,
} from "../../../store/UI/workoutsUISlice";
import Card from "../../Card/Card";
import ExerciseRow from "./ExerciseRow";
import FormInput from "../../FormInput/FormInput";
import {
  uid,
  toInputStr,
  addRow,
  removeRow,
  handleWorkoutSubmit,
} from "./addWorkoutHelpers";
import "./AddWorkoutsModal.css";

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

  const handleAddRow = () => setRows(addRow(rows));

  const handleRemoveRow = (id) => setRows(removeRow(rows, id));

  const handleSubmit = (e) =>
    handleWorkoutSubmit({
      e,
      edit,
      workout,
      date,
      duration,
      notes,
      rows,
      catalog,
      userId,
      dispatch,
      setErr,
      setSaving,
    });

  if (edit && !workout) return null;

  return (
    <div className="modal-backdrop awm__backdrop">
      <Card className="modal-content awm__modal">
        <h3 className="modal-title awm__title">
          {edit ? "Edit Workout" : "Add Workout"}
        </h3>

        <form className="modal-form awm__form" onSubmit={handleSubmit}>
          <FormInput
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="awm__input"
          />

          <FormInput
            label="Duration"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            min={0}
            className="awm__input"
          />

          <FormInput
            label="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional"
            className="awm__input"
          />

          <h4 className="modal-subtitle awm__subtitle">Exercises</h4>

          {rows.map((r) => (
            <ExerciseRow
              key={r.id}
              row={r}
              catalog={catalog}
              onUpdateRow={updateRow}
              onRemoveRow={handleRemoveRow}
            />
          ))}
          <div className="awm__addRowWrap">
            <button
              type="button"
              className="btn awm__addRow"
              onClick={handleAddRow}
            >
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
