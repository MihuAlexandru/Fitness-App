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
import ResourceHeader from "../../ResourceHeader/ResourceHeader";

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

  const sortOptions = [
    { key: "date", label: "Date" },
    { key: "duration", label: "Duration" },
  ];

  return (
    <ResourceHeader
      title="My Workouts"
      canAdd={true}
      addLabel="+ Add Workout"
      onAdd={() => dispatch(openAddModal())}
      searchValue={searchNotes}
      onSearchChange={(e) => dispatch(setSearchNotes(e.target.value))}
      searchPlaceholder="Search notes…"
      searchId="wh-search"
      sortOptions={sortOptions}
      sortBy={sortBy}
      sortAsc={sortAsc}
      onSortChange={(field) => dispatch(toggleSort(field))}
    >
      <label className="resource-header__field">
        <span className="resource-header__label">From</span>
        <input
          type="date"
          className="resource-header__input"
          value={dateFrom}
          onChange={(e) => dispatch(setDateFrom(e.target.value))}
        />
      </label>

      <label className="resource-header__field">
        <span className="resource-header__label">To</span>
        <input
          type="date"
          className="resource-header__input"
          value={dateTo}
          onChange={(e) => dispatch(setDateTo(e.target.value))}
        />
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
