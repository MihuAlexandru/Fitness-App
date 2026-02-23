import { createSelector } from "@reduxjs/toolkit";

export const selectExercisesItems = (s) => s.exercises.items;
export const selectExercisesStatus = (s) => s.exercises.status;
export const selectExercisesError = (s) => s.exercises.error;
export const selectUi = (s) => s.exercisesUi;

export const selectMuscleGroups = createSelector(
  selectExercisesItems,
  (items) => {
    const set = new Set(items.map((r) => r.muscle_group).filter(Boolean));
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  },
);

export const selectFiltered = createSelector(
  [selectExercisesItems, selectUi],
  (items, ui) => {
    const { muscleGroup, search } = ui;
    let rows = items;
    if (muscleGroup && muscleGroup !== "All") {
      rows = rows.filter((r) => r.muscle_group === muscleGroup);
    }
    if (search) {
      const s = search.toLowerCase();
      rows = rows.filter((r) => (r.name || "").toLowerCase().includes(s));
    }
    return rows;
  },
);

export const selectSorted = createSelector(
  [selectFiltered, selectUi],
  (rows, ui) => {
    const key = ui.sortBy === "muscle_group" ? "muscle_group" : "name";
    const asc = ui.sortAsc;
    return rows.slice().sort((a, b) => {
      const av = (a[key] ?? "").toString();
      const bv = (b[key] ?? "").toString();
      const cmp = av.localeCompare(bv, undefined, { sensitivity: "base" });
      return asc ? cmp : -cmp;
    });
  },
);

export const selectTotal = createSelector(selectSorted, (rows) => rows.length);

export const selectPageData = createSelector(
  [selectSorted, selectUi],
  (rows, ui) => {
    const { page, pageSize } = ui;
    const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
    const clamped = Math.min(Math.max(1, page), pageCount);
    const from = (clamped - 1) * pageSize;
    const to = from + pageSize;
    return { page: clamped, pageCount, pageRows: rows.slice(from, to) };
  },
);
