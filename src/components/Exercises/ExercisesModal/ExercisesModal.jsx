import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addExercise,
  updateExercise,
} from "../../../store/exercises/exercisesThunks";
import { closeModal } from "../../../store/UI/exercisesUISlice";
import Card from "../../Card/Card";
import FormInput from "../../FormInput/FormInput";
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
    <div className="modal-backdrop exm__backdrop">
      <Card className="modal-content exm__modal">
        <h3 className="modal-title exm__title">
          {isEdit ? "Edit Exercise" : "Add Exercise"}
        </h3>

        <form className="modal-form exm__form" onSubmit={handleSave}>
          <FormInput
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Push-Ups, Squats"
            required
            autoFocus
            className="exm__input"
          />

          <FormInput
            label="Muscle group"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            placeholder="e.g., Chest, Back, Legs"
            required
            className="exm__input"
          />

          <FormInput
            label="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Optional notes / instructions"
            multiline
            rows={4}
            className="exm__textarea"
          />

          {err && <div className="error">{err}</div>}

          <div className="modal-actions exm__actions">
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
