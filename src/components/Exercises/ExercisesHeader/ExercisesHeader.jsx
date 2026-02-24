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
    <header
      style={{
        display: "flex",
        gap: 12,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <h1 style={{ marginRight: "auto" }}>Exercises</h1>
      <label>
        Muscle group:{" "}
        <select
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
      <input
        type="search"
        placeholder="Search by name…"
        value={searchInput}
        onChange={handleSearchChange}
        onKeyDown={handleSearchEnter}
        style={{ padding: 6, minWidth: 220 }}
        aria-label="Search exercises by name"
      />
      <button onClick={() => dispatch(toggleSort("name"))}>
        Sort by Name {sortBy === "name" ? (sortAsc ? "↑" : "↓") : ""}
      </button>
      <button onClick={() => dispatch(toggleSort("muscle_group"))}>
        Sort by Muscle Group{" "}
        {sortBy === "muscle_group" ? (sortAsc ? "↑" : "↓") : ""}
      </button>
      <label>
        Per page:
        <select
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
      {user && (
        <button onClick={() => dispatch(openAddModal())}>+ Add Exercise</button>
      )}
    </header>
  );
}
