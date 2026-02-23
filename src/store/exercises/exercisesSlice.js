import { createSlice } from "@reduxjs/toolkit";
import {
  addExercise,
  deleteExercise,
  fetchExercises,
  updateExercise,
} from "./exercisesThunks";

const exercisesSlice = createSlice({
  name: "exercises",
  initialState: {
    items: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExercises.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchExercises.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchExercises.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error?.message || "Failed";
      })
      .addCase(addExercise.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateExercise.fulfilled, (state, action) => {
        const i = state.items.findIndex((x) => x.id === action.payload.id);
        if (i > -1) state.items[i] = action.payload;
      })
      .addCase(deleteExercise.fulfilled, (state, action) => {
        state.items = state.items.filter((x) => x.id !== action.payload);
      });
  },
});

export default exercisesSlice.reducer;
