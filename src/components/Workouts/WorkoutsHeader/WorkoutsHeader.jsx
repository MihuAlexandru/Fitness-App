import { useDispatch, useSelector } from "react-redux";

import { useEffect } from "react";
import {
  openAddModal,
  setDateFrom,
  setDateTo,
  setSearch,
  setSearchNotes,
  toggleSort,
} from "../../../store/UI/workoutsUISlice";
import {
  PAGE_SIZE_OPTIONS,
  setPageSize,
} from "../../../store/UI/exercisesUISlice";

export default function WorkoutsHeader() {
  const dispatch = useDispatch();
  const ui = useSelector((s) => s.workoutsUi);
  const { dateFrom, dateTo, sortBy, sortAsc, pageSize, searchNotes } = ui;

  useEffect(() => {
    const t = setTimeout(() => {
      dispatch(setSearch(searchNotes.trim()));
    }, 250);
    return () => clearTimeout(t);
  }, [searchNotes, dispatch]);

  return (
    <header
      style={{
        display: "flex",
        gap: 12,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <h1 style={{ marginRight: "auto" }}>My Workouts</h1>

      <label>
        From:
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => dispatch(setDateFrom(e.target.value))}
        />
      </label>

      <label>
        To:
        <input
          type="date"
          value={dateTo}
          onChange={(e) => dispatch(setDateTo(e.target.value))}
        />
      </label>

      <input
        type="search"
        placeholder="Search notes…"
        value={searchNotes}
        onChange={(e) => dispatch(setSearchNotes(e.target.value))}
        style={{ minWidth: 200 }}
      />

      <button onClick={() => dispatch(toggleSort("date"))}>
        Sort by Date {sortBy === "date" ? (sortAsc ? "↑" : "↓") : ""}
      </button>

      <button onClick={() => dispatch(toggleSort("duration"))}>
        Sort by Duration {sortBy === "duration" ? (sortAsc ? "↑" : "↓") : ""}
      </button>

      <label>
        Per page:
        <select
          value={pageSize}
          onChange={(e) => dispatch(setPageSize(Number(e.target.value)))}
        >
          {PAGE_SIZE_OPTIONS.map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>
      </label>

      <button onClick={() => dispatch(openAddModal())}>+ Add Workout</button>
    </header>
  );
}
