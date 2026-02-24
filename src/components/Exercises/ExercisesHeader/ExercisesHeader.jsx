import { useDispatch, useSelector } from "react-redux";
import { useRef, useState } from "react";
import { selectMuscleGroups } from "../../../store/UI/exercisesSelectors";
import {
  openAddModal,
  PAGE_SIZE_OPTIONS,
  setMuscleGroup,
  setPageSize,
  setSearch,
  toggleSort,
} from "../../../store/UI/exercisesUISlice";
import "./ExercisesHeader.css";

export default function ExercisesHeader() {
  const dispatch = useDispatch();

  const user = useSelector((s) => s.auth.user);
  const muscleGroup = useSelector((s) => s.exercisesUi.muscleGroup);
  const sortBy = useSelector((s) => s.exercisesUi.sortBy);
  const sortAsc = useSelector((s) => s.exercisesUi.sortAsc);
  const pageSize = useSelector((s) => s.exercisesUi.pageSize);
  const searchValue = useSelector((s) => s.exercisesUi.search);
  const muscleGroups = useSelector(selectMuscleGroups);

  const [searchInput, setSearchInput] = useState(searchValue);
  const debounceRef = useRef(null);

  function handleSearchChange(e) {
    const next = e.target.value;
    setSearchInput(next);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const trimmed = next.trim();
      if (trimmed !== searchValue) {
        dispatch(setSearch(trimmed));
      }
    }, 300);
  }

  function handleSearchEnter(e) {
    if (e.key === "Enter") {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      dispatch(setSearch(e.currentTarget.value.trim()));
    }
  }

  return (
    <header className="exh">
      <div className="exh__top">
        <h1 className="exh__title">Exercises</h1>
        {user && (
          <button
            className="btn btn-green"
            onClick={() => dispatch(openAddModal())}
          >
            + Add Exercise
          </button>
        )}
      </div>

      <div className="exh__searchRow">
        <label htmlFor="exh-search" className="sr-only">
          Search exercises by name
        </label>
        <input
          id="exh-search"
          type="search"
          className="exh__search"
          placeholder="Search by name…"
          value={searchInput}
          onChange={handleSearchChange}
          onKeyDown={handleSearchEnter}
          aria-label="Search exercises by name"
        />
      </div>

      <div className="exh__controls">
        <div className="exh__sortGroup">
          <button
            className={`btn ${sortBy === "name" ? "btn-active" : ""}`}
            onClick={() => dispatch(toggleSort("name"))}
            aria-pressed={sortBy === "name"}
          >
            Sort: Name {sortBy === "name" ? (sortAsc ? "↑" : "↓") : ""}
          </button>
          <button
            className={`btn ${sortBy === "muscle_group" ? "btn-active" : ""}`}
            onClick={() => dispatch(toggleSort("muscle_group"))}
            aria-pressed={sortBy === "muscle_group"}
          >
            Sort: Muscle{" "}
            {sortBy === "muscle_group" ? (sortAsc ? "↑" : "↓") : ""}
          </button>
        </div>
        <label className="exh__field">
          <span className="exh__label">Muscle group</span>
          <select
            className="exh__select"
            value={muscleGroup}
            onChange={(e) => dispatch(setMuscleGroup(e.target.value))}
          >
            {muscleGroups.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </label>

        <label className="exh__field exh__field--tight">
          <span className="exh__label">Per page</span>
          <select
            className="exh__select"
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
