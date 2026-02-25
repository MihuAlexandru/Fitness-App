import "./ResourceHeader.css";

export default function ResourceHeader({
  title,
  onAdd,
  canAdd = false,
  addLabel = "+ Add",
  searchValue,
  onSearchChange,
  onSearchSubmit,
  searchPlaceholder = "Search…",
  searchId = "search",
  sortOptions = [],
  sortBy,
  sortAsc,
  onSortChange,
  children,
  className = "",
}) {
  return (
    <header className={`resource-header ${className}`}>
      <div className="resource-header__top">
        <h1 className="resource-header__title">{title}</h1>
        {canAdd && (
          <button className="btn btn-green" onClick={onAdd}>
            {addLabel}
          </button>
        )}
      </div>

      <div className="resource-header__searchRow">
        <label htmlFor={searchId} className="sr-only">
          {searchPlaceholder}
        </label>
        <input
          id={searchId}
          type="search"
          className="resource-header__search"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={onSearchChange}
          onKeyDown={onSearchSubmit}
          aria-label={searchPlaceholder}
        />
      </div>

      <div className="resource-header__controls">
        {sortOptions.length > 0 && (
          <div className="resource-header__sortGroup">
            {sortOptions.map((option) => (
              <button
                key={option.key}
                className={`btn ${sortBy === option.key ? "btn-active" : ""}`}
                onClick={() => onSortChange(option.key)}
                aria-pressed={sortBy === option.key}
              >
                Sort: {option.label}{" "}
                {sortBy === option.key ? (sortAsc ? "↑" : "↓") : ""}
              </button>
            ))}
          </div>
        )}
        {children}
      </div>
    </header>
  );
}
