import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addExercise,
  updateExercise,
} from "../../../store/exercises/exercisesThunks";
import { closeModal } from "../../../store/UI/exercisesUISlice";
import Card from "../../Card/Card";
import "./ExercisesModal.css";

export default function ExercisesModal() {
  const dispatch = useDispatch();

  const isOpen = useSelector((s) => s.exercisesUi.isModalOpen);
  const initial = useSelector((s) => s.exercisesUi.editing);

  const [name, setName] = useState(initial?.name ?? "");
  const [group, setGroup] = useState(initial?.muscle_group ?? "");
  const [desc, setDesc] = useState(initial?.description ?? "");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    setName(initial?.name ?? "");
    setGroup(initial?.muscle_group ?? "");
    setDesc(initial?.description ?? "");
    setErr(null);
    setSaving(false);
  }, [isOpen, initial]);

  if (!isOpen) return null;

  const isEdit = Boolean(initial);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setErr(null);

    try {
      const payload = {
        name: name.trim(),
        muscle_group: group.trim(),
        description: desc.trim() || null,
      };

      if (!payload.name) throw new Error("Name is required");
      if (!payload.muscle_group) throw new Error("Muscle group is required");

      if (isEdit) {
        await dispatch(
          updateExercise({ id: initial.id, changes: payload }),
        ).unwrap();
      } else {
        await dispatch(addExercise(payload)).unwrap();
      }

      dispatch(closeModal());
    } catch (e2) {
      setErr(e2.message || "Failed to save");
      setSaving(false);
      return;
    }
  }

  return (
    <div className="exm__backdrop">
      <Card className="exm__modal">
        <h3 className="exm__title">
          {isEdit ? "Edit Exercise" : "Add Exercise"}
        </h3>

        <form className="exm__form" onSubmit={handleSave}>
          <label className="exm__field">
            <div>Name</div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              placeholder="e.g., Push-Ups, Squats"
              className="exm__input"
            />
          </label>

          <label className="exm__field">
            <div>Muscle group</div>
            <input
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              required
              placeholder="e.g., Chest, Back, Legs"
              className="exm__input"
            />
          </label>

          <label className="exm__field">
            <div>Description</div>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={4}
              placeholder="Optional notes / instructions"
              className="exm__textarea"
            />
          </label>

          {err && <div className="exm__error">{err}</div>}

          <div className="exm__actions">
            <button
              type="button"
              className="btn exm__btn"
              onClick={() => dispatch(closeModal())}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary exm__btn"
              disabled={saving}
            >
              {saving ? "Saving…" : isEdit ? "Save changes" : "Add exercise"}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
