import { supabase } from "../../../lib/supabase";
import { addLocalWorkout } from "../../../store/workouts/workoutsSlice";
import {
  closeAddModal,
  closeEditModal,
} from "../../../store/UI/workoutsUISlice";
import { updateWorkoutFull } from "../../../store/workouts/workoutsThunks";

export const uid = () =>
  crypto?.randomUUID ? crypto.randomUUID() : String(Math.random());

export const toInputStr = (v) =>
  v === null || v === undefined ? "" : String(v);

export const toNumOrNull = (v) =>
  v === "" || v === null || v === undefined ? null : Number(v);

export const updateRow = (rows, id, patch) =>
  rows.map((r) => (r.id === id ? { ...r, ...patch } : r));

export const addRow = (rows) => [
  ...rows,
  { id: uid(), exercise_id: "", sets: "", reps: "", weight: "" },
];

export const removeRow = (rows, id) => {
  const next = rows.filter((x) => x.id !== id);
  if (next.length === 0) {
    return [{ id: uid(), exercise_id: "", sets: "", reps: "", weight: "" }];
  }
  return next;
};

export const handleWorkoutSubmit = async ({
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
}) => {
  e.preventDefault();
  setSaving(true);
  setErr(null);

  try {
    const selectedRows = rows.filter((r) => r.exercise_id);
    if (!selectedRows.length) {
      throw new Error("Add at least one exercise to your workout.");
    }

    if (!duration || Number(duration) <= 0) {
      throw new Error("Duration is required and must be greater than 0.");
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
    setSaving(false);
  }
};
