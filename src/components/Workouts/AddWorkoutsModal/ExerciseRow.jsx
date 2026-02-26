export default function ExerciseRow({
  row,
  catalog,
  onUpdateRow,
  onRemoveRow,
}) {
  return (
    <div className="awm__row">
      <select
        className="awm__select"
        value={row.exercise_id ?? ""}
        onChange={(e) => onUpdateRow(row.id, { exercise_id: e.target.value })}
      >
        <option value="">Select exercise…</option>
        {catalog.map((ex) => (
          <option key={ex.id} value={ex.id}>
            {ex.name} ({ex.muscle_group})
          </option>
        ))}
      </select>

      <input
        className="awm__input"
        type="number"
        min={1}
        placeholder="Sets"
        value={row.sets ?? ""}
        onChange={(e) => onUpdateRow(row.id, { sets: e.target.value })}
      />

      <input
        className="awm__input"
        type="number"
        min={1}
        placeholder="Reps"
        value={row.reps ?? ""}
        onChange={(e) => onUpdateRow(row.id, { reps: e.target.value })}
      />

      <input
        className="awm__input"
        type="number"
        min={0}
        step="0.5"
        placeholder="Weight"
        value={row.weight ?? ""}
        onChange={(e) => onUpdateRow(row.id, { weight: e.target.value })}
      />

      <button
        type="button"
        className="btn btn-danger awm__removeText"
        onClick={() => onRemoveRow(row.id)}
      >
        Remove Exercise
      </button>

      <img
        className="awm__removeIcon"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAASUlEQVR4nGNgGCmggYGB4T8a7iDXsP8U4oG3gIFUxQykq6e/Bf9J5I9awDBqAcOoBSPQAkJg8FnwhIx64AkpFviRaMkTqJ5hCAD2EKaTKxxljwAAAABJRU5ErkJggg=="
        alt="trash"
        onClick={() => onRemoveRow(row.id)}
      />
    </div>
  );
}
