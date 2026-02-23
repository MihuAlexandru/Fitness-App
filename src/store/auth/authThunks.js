import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../lib/supabase";

export const signInWithEmail = createAsyncThunk(
  "auth/signInWithEmail",
  async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return { user: data.user, session: data.session };
  },
);

export const signUpWithEmail = createAsyncThunk(
  "auth/signUpWithEmail",
  async ({ email, password }) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return { user: data.user, session: data.session };
  },
);

export const signOutUser = createAsyncThunk("auth/signOut", async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
});

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return { user: session?.user ?? null, session: session ?? null };
  },
);
