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
import ResourceHeader from "../../ResourceHeader/ResourceHeader";

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

  const sortOptions = [
    { key: "name", label: "Name" },
    { key: "muscle_group", label: "Muscle" },
  ];

  return (
    <ResourceHeader
      title="Exercises"
      canAdd={!!user}
      addLabel="+ Add Exercise"
      onAdd={() => dispatch(openAddModal())}
      searchValue={searchInput}
      onSearchChange={handleSearchChange}
      onSearchSubmit={handleSearchEnter}
      searchPlaceholder="Search by name…"
      searchId="exh-search"
      sortOptions={sortOptions}
      sortBy={sortBy}
      sortAsc={sortAsc}
      onSortChange={(field) => dispatch(toggleSort(field))}
    >
      <label className="resource-header__field">
        <span className="resource-header__label">Muscle group</span>
        <select
          className="resource-header__select"
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

      <label className="resource-header__field resource-header__field--tight">
        <span className="resource-header__label">Per page</span>
        <select
          className="resource-header__select"
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
    </ResourceHeader>
  );
}
