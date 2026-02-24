import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  openAddModal,
  PAGE_SIZE_OPTIONS,
  setDateFrom,
  setDateTo,
  setPageSize,
  setSearch,
  setSearchNotes,
  toggleSort,
} from "../../../store/UI/workoutsUISlice";
import "./WorkoutsHeader.css";

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
    <header className="wh">
      <div className="wh__top">
        <h1 className="wh__title">My Workouts</h1>
        <button onClick={() => dispatch(openAddModal())}>+ Add Workout</button>
      </div>

      <div className="wh__searchRow">
        <label htmlFor="wh-search" className="sr-only">
          Search workout notes
        </label>
        <input
          id="wh-search"
          type="search"
          className="wh__search"
          placeholder="Search notes…"
          value={searchNotes}
          onChange={(e) => dispatch(setSearchNotes(e.target.value))}
          aria-label="Search notes"
        />
      </div>

      <div className="wh__controls">
        <div className="wh__sortGroup">
          <button
            onClick={() => dispatch(toggleSort("date"))}
            aria-pressed={sortBy === "date"}
          >
            Sort: Date {sortBy === "date" ? (sortAsc ? "↑" : "↓") : ""}
          </button>

          <button
            onClick={() => dispatch(toggleSort("duration"))}
            aria-pressed={sortBy === "duration"}
          >
            Sort: Duration {sortBy === "duration" ? (sortAsc ? "↑" : "↓") : ""}
          </button>
        </div>
        <label className="wh__field">
          <span className="wh__label">From</span>
          <input
            type="date"
            className="wh__input"
            value={dateFrom}
            onChange={(e) => dispatch(setDateFrom(e.target.value))}
          />
        </label>

        <label className="wh__field">
          <span className="wh__label">To</span>
          <input
            type="date"
            className="wh__input"
            value={dateTo}
            onChange={(e) => dispatch(setDateTo(e.target.value))}
          />
        </label>

        <label className="wh__field wh__field--tight">
          <span className="wh__label">Per page</span>
          <select
            className="wh__select"
            value={pageSize}
            onChange={(e) => dispatch(setPageSize(Number(e.target.value)))}
          >
            {PAGE_SIZE_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      </div>
    </header>
  );
}
