import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addExercise,
  updateExercise,
} from "../../../store/exercises/exercisesThunks";
import { closeModal } from "../../../store/UI/exercisesUISlice";

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

  if (!isOpen) return null;

  return (
    <div style={backdrop}>
      <div style={modal}>
        <h3 style={{ marginTop: 0 }}>
          {isEdit ? "Edit Exercise" : "Add Exercise"}
        </h3>

        <form onSubmit={handleSave} style={{ display: "grid", gap: 12 }}>
          <label>
            <div>Name</div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </label>

          <label>
            <div>Muscle group</div>
            <input
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              required
              placeholder="e.g., Chest, Back, Legs"
            />
          </label>

          <label>
            <div>Description</div>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={4}
              placeholder="Optional notes / instructions"
            />
          </label>

          {err && <div style={{ color: "crimson" }}>{err}</div>}

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={() => dispatch(closeModal())}
              disabled={saving}
            >
              Cancel
            </button>
            <button type="submit" disabled={saving}>
              {saving ? "Saving…" : isEdit ? "Save changes" : "Add exercise"}
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
  width: "min(640px, 92vw)",
  boxShadow:
    "0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -4px rgba(0, 0, 0, 0.1)",
};
