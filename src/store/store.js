import {
  configureStore,
  createListenerMiddleware,
  isAnyOf,
} from "@reduxjs/toolkit";

import authReducer from "./auth/authSlice";
import exercisesReducer from "./exercises/exercisesSlice";
import exercisesUiReducer, {
  initialState as exercisesUiInitialState,
  PAGE_SIZE_OPTIONS as EX_PAGE_SIZE_OPTIONS,
  setPageSize as setExercisesPageSize,
} from "./UI/exercisesUISlice";

import workoutsUiReducer, {
  initialState as workoutsUiInitialState,
  PAGE_SIZE_OPTIONS as WO_PAGE_SIZE_OPTIONS,
  setPageSize as setWorkoutsPageSize,
} from "./UI/workoutsUISlice";

import workoutsReducer from "./workouts/workoutsSlice";

function loadPageSize(key, allowed) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return undefined;
    const num = parseInt(raw, 10);
    return allowed.includes(num) ? num : undefined;
  } catch {
    return undefined;
  }
}

const uiPrefsListener = createListenerMiddleware();

uiPrefsListener.startListening({
  matcher: isAnyOf(setExercisesPageSize, setWorkoutsPageSize),
  effect: async (action, api) => {
    const state = api.getState();
    try {
      const exPageSize = state.exercisesUi.pageSize;
      localStorage.setItem("exercises.pageSize", String(exPageSize));
    } catch {
      //
    }
    try {
      const woPageSize = state.workoutsUi.pageSize;
      localStorage.setItem("workouts.pageSize", String(woPageSize));
    } catch {
      //
    }
  },
});

export const store = configureStore({
  reducer: {
    auth: authReducer,
    exercises: exercisesReducer,
    exercisesUi: exercisesUiReducer,
    workouts: workoutsReducer,
    workoutsUi: workoutsUiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(uiPrefsListener.middleware),
  preloadedState: {
    exercisesUi: {
      ...exercisesUiInitialState,
      pageSize:
        loadPageSize("exercises.pageSize", EX_PAGE_SIZE_OPTIONS) ??
        EX_PAGE_SIZE_OPTIONS[0],
    },
    workoutsUi: {
      ...workoutsUiInitialState,
      pageSize:
        loadPageSize("workouts.pageSize", WO_PAGE_SIZE_OPTIONS) ??
        WO_PAGE_SIZE_OPTIONS[0],
    },
  },
});

export default store;
