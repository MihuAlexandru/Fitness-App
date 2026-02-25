import { createSlice } from "@reduxjs/toolkit";
import {
  fetchWorkouts,
  deleteWorkout,
  updateWorkoutNotes,
  updateWorkoutExercise,
  deleteWorkoutExercise,
  updateWorkoutFull,
} from "./workoutsThunks";

const workoutsSlice = createSlice({
  name: "workouts",
  initialState: {
    items: [],
    catalog: [],
    status: "idle",
    error: null,
  },
  reducers: {
    addLocalWorkout(state, action) {
      state.items.unshift(action.payload);
    },
    updateLocalWorkoutFull(state, action) {
      const updated = action.payload;
      const idx = state.items.findIndex((w) => w.id === updated.id);
      if (idx >= 0) {
        state.items[idx] = updated;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkouts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchWorkouts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.workouts;
        state.catalog = action.payload.catalog;
      })
      .addCase(fetchWorkouts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(deleteWorkout.fulfilled, (state, action) => {
        state.items = state.items.filter((w) => w.id !== action.payload);
      })

      .addCase(updateWorkoutNotes.fulfilled, (state, action) => {
        const idx = state.items.findIndex((w) => w.id === action.payload.id);
        if (idx >= 0) state.items[idx].notes = action.payload.notes;
      })

      .addCase(updateWorkoutExercise.fulfilled, (state, action) => {
        const updated = action.payload;
        state.items.forEach((w) => {
          const i = w.exercises.findIndex((x) => x.id === updated.id);
          if (i !== -1) {
            w.exercises[i] = { ...w.exercises[i], ...updated };
          }
        });
      })

      .addCase(updateWorkoutFull.fulfilled, (state, action) => {
        const w = action.payload;
        const idx = state.items.findIndex((x) => x.id === w.id);
        if (idx !== -1) {
          state.items[idx] = w;
        }
      })

      .addCase(deleteWorkoutExercise.fulfilled, (state, action) => {
        const id = action.payload;
        state.items.forEach((w) => {
          w.exercises = w.exercises.filter((x) => x.id !== id);
        });
      });
  },
});

export const { addLocalWorkout, updateLocalWorkoutFull } =
  workoutsSlice.actions;
export default workoutsSlice.reducer;
