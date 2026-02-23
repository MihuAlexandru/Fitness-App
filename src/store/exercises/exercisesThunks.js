import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../lib/supabase";

export const fetchExercises = createAsyncThunk(
  "exercises/fetchAll",
  async (_, { rejectWithValue }) => {
    const { data, error } = await supabase.from("exercises").select("*");
    if (error) return rejectWithValue(error.message);
    return data || [];
  },
);

export const addExercise = createAsyncThunk(
  "exercises/add",
  async (payload, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from("exercises")
      .insert([payload])
      .select("*")
      .single();
    if (error) return rejectWithValue(error.message);
    return data;
  },
);

export const updateExercise = createAsyncThunk(
  "exercises/update",
  async ({ id, changes }, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from("exercises")
      .update(changes)
      .eq("id", id)
      .select("*")
      .single();
    if (error) return rejectWithValue(error.message);
    return data;
  },
);

export const deleteExercise = createAsyncThunk(
  "exercises/delete",
  async (id, { rejectWithValue }) => {
    const { error } = await supabase.from("exercises").delete().eq("id", id);
    if (error) return rejectWithValue(error.message);
    return id;
  },
);
