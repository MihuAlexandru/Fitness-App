import { createSelector } from "@reduxjs/toolkit";

export const selectWorkouts = (state) => state.workouts.items;
export const selectCatalog = (state) => state.workouts.catalog;
export const selectUi = (state) => state.workoutsUi;

export const selectFilteredSortedPagedWorkouts = createSelector(
  [selectWorkouts, selectUi],
  (workouts, ui) => {
    let rows = workouts;

    // date filter
    if (ui.dateFrom) rows = rows.filter((w) => w.date >= ui.dateFrom);
    if (ui.dateTo) rows = rows.filter((w) => w.date <= ui.dateTo);

    // search
    if (ui.search) {
      const s = ui.search.toLowerCase();
      rows = rows.filter((w) => (w.notes || "").toLowerCase().includes(s));
    }

    // sort
    rows = [...rows];
    rows.sort((a, b) => {
      let cmp = 0;
      if (ui.sortBy === "date") {
        cmp = a.date.localeCompare(b.date);
      } else {
        const ad = a.duration || 0;
        const bd = b.duration || 0;
        cmp = ad === bd ? 0 : ad < bd ? -1 : 1;
      }
      return ui.sortAsc ? cmp : -cmp;
    });

    // pagination
    const total = rows.length;
    const pageCount = Math.max(1, Math.ceil(total / ui.pageSize));
    const page = Math.min(ui.page, pageCount);

    const start = (page - 1) * ui.pageSize;
    const end = start + ui.pageSize;

    return {
      total,
      pageCount,
      page,
      paged: rows.slice(start, end),
    };
  },
);
