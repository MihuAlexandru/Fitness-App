import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../lib/supabase";

// Fetch all workouts + exercises + catalog
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

// Delete workout
export const deleteWorkout = createAsyncThunk(
  "workouts/deleteWorkout",
  async (id) => {
    const { error } = await supabase.from("workouts").delete().eq("id", id);
    if (error) throw error;
    return id;
  },
);

// Update workout notes
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

// Update exercise row
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

// Delete exercise row
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
