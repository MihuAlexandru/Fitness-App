import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import exercisesReducer from "./exercises/exercisesSlice";
import exercisesUiReducer from "./UI/exercisesUISlice";
import workoutsUiReducer from "./UI/workoutsUISlice";
import workoutsReducer from "./workouts/workoutsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    exercises: exercisesReducer,
    exercisesUi: exercisesUiReducer,
    workouts: workoutsReducer,
    workoutsUi: workoutsUiReducer,
  },
});

export default store;
