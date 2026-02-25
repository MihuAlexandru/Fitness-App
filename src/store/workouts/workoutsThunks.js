import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../lib/supabase";

export const fetchWorkouts = createAsyncThunk(
  "workouts/fetchWorkouts",
  async (userId) => {
    if (!userId) return [];

    const { data: workouts, error: wErr } = await supabase
      .from("workouts")
      .select("*")
      .eq("created_by", userId);

    if (wErr) throw wErr;

    const workoutIds = workouts.map((w) => w.id);

    const { data: weRows, error: weErr } = await supabase
      .from("workout_exercises")
      .select("*")
      .in("workout_id", workoutIds);

    if (weErr) throw weErr;

    const { data: catalog, error: cErr } = await supabase
      .from("exercises")
      .select("*");

    if (cErr) throw cErr;

    const exById = new Map(catalog.map((e) => [e.id, e]));

    const wById = new Map(workouts.map((w) => [w.id, { ...w, exercises: [] }]));

    for (const r of weRows ?? []) {
      wById.get(r.workout_id)?.exercises.push({
        ...r,
        exercise: exById.get(r.exercise_id) || null,
      });
    }

    return {
      workouts: Array.from(wById.values()),
      catalog,
    };
  },
);

export const deleteWorkout = createAsyncThunk(
  "workouts/deleteWorkout",
  async (id) => {
    const { error } = await supabase.from("workouts").delete().eq("id", id);
    if (error) throw error;
    return id;
  },
);

export const updateWorkoutNotes = createAsyncThunk(
  "workouts/updateNotes",
  async ({ id, notes }) => {
    const { data, error } = await supabase
      .from("workouts")
      .update({ notes })
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return data;
  },
);

export const updateWorkoutExercise = createAsyncThunk(
  "workouts/updateExercise",
  async ({ id, patch }) => {
    const { data, error } = await supabase
      .from("workout_exercises")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return data;
  },
);

export const deleteWorkoutExercise = createAsyncThunk(
  "workouts/deleteExercise",
  async (id) => {
    const { error } = await supabase
      .from("workout_exercises")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return id;
  },
);

export const updateWorkoutFull = createAsyncThunk(
  "workouts/updateWorkoutFull",
  async ({ workout, updates }) => {
    const { id } = workout;

    const { data: updatedWorkout, error: wErr } = await supabase
      .from("workouts")
      .update({
        date: updates.date,
        duration: updates.duration ? Number(updates.duration) : null,
        notes: updates.notes || null,
      })
      .eq("id", id)
      .select("*")
      .single();

    if (wErr) throw wErr;

    await supabase.from("workout_exercises").delete().eq("workout_id", id);

    const payload = updates.rows.map((r) => ({
      workout_id: id,
      exercise_id: r.exercise_id,
      sets: Number(r.sets),
      reps: Number(r.reps),
      weight: r.weight ? Number(r.weight) : null,
    }));

    const { data: inserted, error: weErr } = await supabase
      .from("workout_exercises")
      .insert(payload)
      .select("*");

    if (weErr) throw weErr;

    return {
      ...updatedWorkout,
      exercises: inserted,
    };
  },
);
