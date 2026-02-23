import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import exercisesReducer from "./exercises/exercisesSlice"; // NEW
import exercisesUiReducer from "./UI/exercisesUISlice"; // NEW

export const store = configureStore({
  reducer: {
    auth: authReducer,
    exercises: exercisesReducer,
    exercisesUi: exercisesUiReducer,
  },
});

export default store;
