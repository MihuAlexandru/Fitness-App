import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { supabase } from "../../lib/supabase";

const PAGE_SIZE_OPTIONS = [5, 10, 25, 50, 100];

export default function Workouts() {
  const { user } = useSelector((s) => s.auth);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [workouts, setWorkouts] = useState([]);
  const [catalog, setCatalog] = useState([]);

  const [searchNotes, setSearchNotes] = useState("");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortBy, setSortBy] = useState("date"); // 'date' | 'duration'
  const [sortAsc, setSortAsc] = useState(false); // default newest first (date desc)
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);

  const [expanded, setExpanded] = useState(new Set()); // which workout rows are expanded
  const [addOpen, setAddOpen] = useState(false);

  // Debounce note search
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchNotes.trim()), 250);
    return () => clearTimeout(t);
  }, [searchNotes]);

  // Initial load: fetch workouts (owned by user), workout_exercises, and exercise catalog
  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      setErr(null);
      setWorkouts([]);
      return;
    }

    let active = true;

    (async () => {
      try {
        setLoading(true);
        setErr(null);

        // 1) fetch workouts for current user
        const { data: wData, error: wErr } = await supabase
          .from("workouts")
          .select("*")
          .eq("created_by", user.id);
        if (wErr) throw wErr;
        const workoutIds = (wData ?? []).map((w) => w.id);

        // 2) fetch workout_exercises for those workouts
        let weData = [];
        if (workoutIds.length) {
          const { data: weRows, error: weErr } = await supabase
            .from("workout_exercises")
            .select("*")
            .in("workout_id", workoutIds);
          if (weErr) throw weErr;
          weData = weRows ?? [];
        }

        // 3) fetch exercise catalog (for joins and for Add/Edit dropdown)
        const { data: exData, error: exErr } = await supabase
          .from("exercises")
          .select("*");
        if (exErr) throw exErr;

        if (!active) return;

        // Build lookup for exercises
        const exById = new Map(exData.map((e) => [e.id, e]));

        // Attach exercises to workouts
        const wById = new Map(
          wData.map((w) => [w.id, { ...w, exercises: [] }]),
        );
        for (const we of weData) {
          const parent = wById.get(we.workout_id);
          if (parent) {
            parent.exercises.push({
              ...we,
              exercise: exById.get(we.exercise_id) || null,
            });
          }
        }

        setCatalog(exData);
        setWorkouts(Array.from(wById.values()));
      } catch (e) {
        if (active) setErr(e.message || "Failed to load workouts");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [user?.id]);

  // Client-side filter (date range + notes contains)
  const filtered = useMemo(() => {
    let rows = workouts;

    if (dateFrom) {
      rows = rows.filter((w) => w.date >= dateFrom);
    }
    if (dateTo) {
      rows = rows.filter((w) => w.date <= dateTo);
    }
    if (search) {
      const s = search.toLowerCase();
      rows = rows.filter((w) => (w.notes || "").toLowerCase().includes(s));
    }
    return rows;
  }, [workouts, dateFrom, dateTo, search]);

  // Client-side sort
  const sorted = useMemo(() => {
    const rows = filtered.slice();
    rows.sort((a, b) => {
      let cmp = 0;
      if (sortBy === "date") {
        // Compare as ISO dates
        cmp = (a.date || "").localeCompare(b.date || "");
      } else {
        const aVal = a.duration || 0;
        const bVal = b.duration || 0;
        cmp = aVal === bVal ? 0 : aVal < bVal ? -1 : 1;
      }
      return sortAsc ? cmp : -cmp;
    });
    return rows;
  }, [filtered, sortBy, sortAsc]);

  // Pagination
  const total = sorted.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    setPage(1);
  }, [dateFrom, dateTo, search, pageSize]);

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  const paged = useMemo(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    return sorted.slice(from, to);
  }, [sorted, page, pageSize]);

  function toggleSort(key) {
    if (sortBy === key) {
      setSortAsc((s) => !s);
    } else {
      setSortBy(key);
      setSortAsc(true);
    }
  }

  function toggleExpand(workoutId) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(workoutId)) next.delete(workoutId);
      else next.add(workoutId);
      return next;
    });
  }

  // CRUD – Workouts
  async function onDeleteWorkout(workout) {
    if (
      !window.confirm(
        `Delete workout on ${workout.date}? This cannot be undone.`,
      )
    )
      return;
    const { error } = await supabase
      .from("workouts")
      .delete()
      .eq("id", workout.id);
    if (error) {
      alert(error.message);
      return;
    }
    setWorkouts((prev) => prev.filter((w) => w.id !== workout.id));
  }

  async function onUpdateNotes(workoutId, newNotes) {
    const { error } = await supabase
      .from("workouts")
      .update({ notes: newNotes })
      .eq("id", workoutId);
    if (error) {
      alert(error.message);
      return;
    }
    setWorkouts((prev) =>
      prev.map((w) => (w.id === workoutId ? { ...w, notes: newNotes } : w)),
    );
  }

  // CRUD – Workout exercises
  async function onDeleteExercise(weRow) {
    const { error } = await supabase
      .from("workout_exercises")
      .delete()
      .eq("id", weRow.id);
    if (error) {
      alert(error.message);
      return;
    }
    setWorkouts((prev) =>
      prev.map((w) =>
        w.id === weRow.workout_id
          ? { ...w, exercises: w.exercises.filter((x) => x.id !== weRow.id) }
          : w,
      ),
    );
  }

  async function onUpdateWe(weRowId, patch) {
    const { data, error } = await supabase
      .from("workout_exercises")
      .update(patch)
      .eq("id", weRowId)
      .select("*")
      .single();
    if (error) {
      alert(error.message);
      return;
    }
    // Merge locally
    setWorkouts((prev) =>
      prev.map((w) => {
        const idx = w.exercises.findIndex((x) => x.id === weRowId);
        if (idx === -1) return w;
        const updated = { ...w.exercises[idx], ...data };
        return {
          ...w,
          exercises: [
            ...w.exercises.slice(0, idx),
            updated,
            ...w.exercises.slice(idx + 1),
          ],
        };
      }),
    );
  }

  // Add workout (with inline exercise builder)
  function onAddDone(newWorkoutWithExercises) {
    setAddOpen(false);
    if (!newWorkoutWithExercises) return;
    setWorkouts((prev) => [newWorkoutWithExercises, ...prev]);
  }

  if (!user?.id) {
    return (
      <div style={{ padding: 24 }}>
        <h1>Workouts</h1>
        <p>Please sign in to view your workouts.</p>
      </div>
    );
  }

  return (
    <div
      style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}
    >
      <header
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <h1 style={{ marginRight: "auto" }}>My Workouts</h1>

        {/* Date range filter */}
        <label>
          From:{" "}
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </label>
        <label>
          To:{" "}
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </label>

        {/* Notes search */}
        <input
          type="search"
          placeholder="Search notes…"
          value={searchNotes}
          onChange={(e) => setSearchNotes(e.target.value)}
          style={{ padding: 6, minWidth: 220 }}
        />

        {/* Sorters */}
        <button onClick={() => toggleSort("date")}>
          Sort by Date {sortBy === "date" ? (sortAsc ? "↑" : "↓") : ""}
        </button>
        <button onClick={() => toggleSort("duration")}>
          Sort by Duration {sortBy === "duration" ? (sortAsc ? "↑" : "↓") : ""}
        </button>

        {/* Page size */}
        <label>
          Per page:{" "}
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {PAGE_SIZE_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>

        <button
          onClick={() => setAddOpen(true)}
          style={{
            background: "#16a34a",
            color: "#fff",
            padding: "8px 12px",
            borderRadius: 6,
          }}
        >
          + Add Workout
        </button>
      </header>

      <section>
        {loading && <p>Loading…</p>}
        {err && <p style={{ color: "crimson" }}>{err}</p>}
        {!loading && !err && (
          <WorkoutsTable
            rows={paged}
            expanded={expanded}
            onToggleExpand={toggleExpand}
            onDeleteWorkout={onDeleteWorkout}
            onDeleteExercise={onDeleteExercise}
            onUpdateWe={onUpdateWe}
            onUpdateNotes={onUpdateNotes}
          />
        )}
      </section>

      {/* Pager */}
      <footer
        style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}
      >
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          ◀
        </button>
        <span>
          Page <strong>{page}</strong> of <strong>{pageCount}</strong>
        </span>
        <button
          onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
          disabled={page >= pageCount}
          aria-label="Next page"
        >
          ▶
        </button>
        <span style={{ marginLeft: "auto", opacity: 0.7 }}>
          Total: {total} workout{total === 1 ? "" : "s"}
        </span>
      </footer>

      {addOpen && (
        <AddWorkoutModal
          onClose={onAddDone}
          catalog={catalog}
          userId={user.id}
        />
      )}
    </div>
  );
}

function WorkoutsTable({
  rows,
  expanded,
  onToggleExpand,
  onDeleteWorkout,
  onDeleteExercise,
  onUpdateWe,
  onUpdateNotes,
}) {
  if (!rows.length) return <p>No workouts found.</p>;

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
            <th style={th}>Date</th>
            <th style={th}>Duration</th>
            <th style={th}>Notes</th>
            <th style={th}>Exercises</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((w) => (
            <WorkoutRow
              key={w.id}
              w={w}
              expanded={expanded.has(w.id)}
              onToggleExpand={() => onToggleExpand(w.id)}
              onDeleteWorkout={() => onDeleteWorkout(w)}
              onDeleteExercise={onDeleteExercise}
              onUpdateWe={onUpdateWe}
              onUpdateNotes={onUpdateNotes}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function WorkoutRow({
  w,
  expanded,
  onToggleExpand,
  onDeleteWorkout,
  onDeleteExercise,
  onUpdateWe,
  onUpdateNotes,
}) {
  const [editingNotes, setEditingNotes] = useState(false);
  const [draftNotes, setDraftNotes] = useState(w.notes || "");

  function startEditNotes() {
    setDraftNotes(w.notes || "");
    setEditingNotes(true);
  }

  return (
    <>
      <tr style={{ borderBottom: expanded ? "none" : "1px solid #f0f0f0" }}>
        <td style={td}>
          <button
            onClick={onToggleExpand}
            aria-label="Expand workout"
            title="Toggle exercises"
          >
            {expanded ? "▾" : "▸"}
          </button>{" "}
          {w.date}
        </td>
        <td style={td}>{w.duration ?? "—"} min</td>
        <td style={td}>
          {editingNotes ? (
            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={draftNotes}
                onChange={(e) => setDraftNotes(e.target.value)}
                style={{ width: 280 }}
              />
              <button
                onClick={async () => {
                  await onUpdateNotes(w.id, draftNotes);
                  setEditingNotes(false);
                }}
              >
                Save
              </button>
              <button
                onClick={() => {
                  setDraftNotes(w.notes || "");
                  setEditingNotes(false);
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span>
                {w.notes || <em style={{ opacity: 0.6 }}>No notes</em>}
              </span>
              <button onClick={startEditNotes}>Edit</button>
            </div>
          )}
        </td>
        <td style={td}>
          {w.exercises?.length || 0} exercise
          {(w.exercises?.length || 0) === 1 ? "" : "s"}
        </td>
        <td style={{ ...td, whiteSpace: "nowrap" }}>
          <button onClick={onDeleteWorkout} style={{ color: "#b91c1c" }}>
            Delete workout
          </button>
        </td>
      </tr>

      {expanded && (
        <tr>
          <td
            colSpan={5}
            style={{ padding: 0, borderBottom: "1px solid #f0f0f0" }}
          >
            <ExercisesSubtable
              workout={w}
              onDeleteExercise={onDeleteExercise}
              onUpdateWe={onUpdateWe}
            />
          </td>
        </tr>
      )}
    </>
  );
}

function ExercisesSubtable({ workout, onDeleteExercise, onUpdateWe }) {
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({ sets: "", reps: "", weight: "" });

  function startEdit(row) {
    setEditingId(row.id);
    setDraft({
      sets: row.sets ?? "",
      reps: row.reps ?? "",
      weight: row.weight ?? "",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft({ sets: "", reps: "", weight: "" });
  }

  async function saveEdit(rowId) {
    const patch = {
      sets: Number(draft.sets),
      reps: Number(draft.reps),
      weight: Number(draft.weight),
    };
    if (!(patch.sets > 0) || !(patch.reps > 0) || patch.weight < 0) {
      alert("Please enter valid positive numbers (weight can be 0+).");
      return;
    }
    await onUpdateWe(rowId, patch);
    cancelEdit();
  }

  return (
    <div style={{ background: "#fafafa", padding: 12 }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>
            <th style={th}>Exercise</th>
            <th style={th}>Muscle group</th>
            <th style={th}>Sets</th>
            <th style={th}>Reps</th>
            <th style={th}>Weight</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {(workout.exercises || []).map((r) => {
            const ex = r.exercise || {};
            const isEditing = editingId === r.id;
            return (
              <tr key={r.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={td}>
                  <strong>{ex.name || "Unknown"}</strong>
                </td>
                <td style={td}>
                  <em>{ex.muscle_group || "—"}</em>
                </td>

                <td style={td}>
                  {isEditing ? (
                    <input
                      type="number"
                      min={1}
                      value={draft.sets}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, sets: e.target.value }))
                      }
                      style={{ width: 80 }}
                    />
                  ) : (
                    r.sets
                  )}
                </td>

                <td style={td}>
                  {isEditing ? (
                    <input
                      type="number"
                      min={1}
                      value={draft.reps}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, reps: e.target.value }))
                      }
                      style={{ width: 80 }}
                    />
                  ) : (
                    r.reps
                  )}
                </td>

                <td style={td}>
                  {isEditing ? (
                    <input
                      type="number"
                      step="0.5"
                      min={0}
                      value={draft.weight}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, weight: e.target.value }))
                      }
                      style={{ width: 100 }}
                    />
                  ) : (
                    r.weight
                  )}
                </td>

                <td style={{ ...td, whiteSpace: "nowrap" }}>
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => saveEdit(r.id)}
                        style={{ marginRight: 8 }}
                      >
                        Save
                      </button>
                      <button onClick={cancelEdit}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(r)}
                        style={{ marginRight: 8 }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDeleteExercise(r)}
                        style={{ color: "#b91c1c" }}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function AddWorkoutModal({ onClose, catalog, userId }) {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [rows, setRows] = useState([
    { id: Math.random(), exercise_id: "", sets: "", reps: "", weight: "" },
  ]);

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  function addRow() {
    setRows((prev) => [
      ...prev,
      { id: Math.random(), exercise_id: "", sets: "", reps: "", weight: "" },
    ]);
  }

  function removeRow(localId) {
    setRows((prev) => prev.filter((r) => r.id !== localId));
  }

  function updateRow(localId, patch) {
    setRows((prev) =>
      prev.map((r) => (r.id === localId ? { ...r, ...patch } : r)),
    );
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    try {
      // Validate
      if (!date) throw new Error("Date is required");
      if (duration && Number(duration) < 0)
        throw new Error("Duration must be 0 or more");

      const wePayload = [];
      for (const r of rows) {
        if (!r.exercise_id) continue; // allow empty rows to be ignored
        const sets = Number(r.sets);
        const reps = Number(r.reps);
        const weight = Number(r.weight);
        if (!(sets > 0) || !(reps > 0) || weight < 0) {
          throw new Error(
            "Each added exercise must have valid sets (>0), reps (>0), and weight (>=0).",
          );
        }
        wePayload.push({ exercise_id: r.exercise_id, sets, reps, weight });
      }

      // 1) Insert workout
      const { data: w, error: wErr } = await supabase
        .from("workouts")
        .insert([
          {
            date,
            duration: duration ? Number(duration) : null,
            notes: notes || null,
            created_by: userId,
          },
        ])
        .select("*")
        .single();
      if (wErr) throw wErr;

      // 2) Insert workout_exercises (bulk)
      let insertedWe = [];
      if (wePayload.length) {
        const { data: weRows, error: weErr } = await supabase
          .from("workout_exercises")
          .insert(wePayload.map((x) => ({ ...x, workout_id: w.id })))
          .select("*");
        if (weErr) throw weErr;
        insertedWe = weRows ?? [];
      }

      // 3) Bring the exercises catalog to merge names/groups
      const exById = new Map(catalog.map((e) => [e.id, e]));
      const merged = insertedWe.map((row) => ({
        ...row,
        exercise: exById.get(row.exercise_id) || null,
      }));

      onClose({
        ...w,
        exercises: merged,
      });
    } catch (e2) {
      setErr(e2.message || "Failed to save workout");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={backdrop}>
      <div style={modal}>
        <h3 style={{ marginTop: 0 }}>Add Workout</h3>
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <label>
              <div>Date</div>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </label>
            <label>
              <div>Duration (min)</div>
              <input
                type="number"
                min={0}
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </label>
            <label style={{ flex: 1 }}>
              <div>Notes</div>
              <input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional"
              />
            </label>
          </div>

          <div style={{ marginTop: 8 }}>
            <h4 style={{ margin: "8px 0" }}>Exercises to perform</h4>
            <div style={{ display: "grid", gap: 8 }}>
              {rows.map((r) => (
                <div
                  key={r.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.6fr 1fr 1fr 1fr auto",
                    gap: 8,
                    alignItems: "center",
                  }}
                >
                  <select
                    value={r.exercise_id}
                    onChange={(e) =>
                      updateRow(r.id, { exercise_id: e.target.value })
                    }
                    required
                  >
                    <option value="">Select exercise…</option>
                    {catalog.map((ex) => (
                      <option key={ex.id} value={ex.id}>
                        {ex.name} ({ex.muscle_group})
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min={1}
                    placeholder="Sets"
                    value={r.sets}
                    onChange={(e) => updateRow(r.id, { sets: e.target.value })}
                    required
                  />
                  <input
                    type="number"
                    min={1}
                    placeholder="Reps"
                    value={r.reps}
                    onChange={(e) => updateRow(r.id, { reps: e.target.value })}
                    required
                  />
                  <input
                    type="number"
                    step="0.5"
                    min={0}
                    placeholder="Weight"
                    value={r.weight}
                    onChange={(e) =>
                      updateRow(r.id, { weight: e.target.value })
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeRow(r.id)}
                    style={{ color: "#b91c1c" }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 8 }}>
              <button type="button" onClick={addRow}>
                + Add exercise
              </button>
            </div>
          </div>

          {err && <div style={{ color: "crimson" }}>{err}</div>}

          <div
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "flex-end",
              marginTop: 8,
            }}
          >
            <button
              type="button"
              onClick={() => onClose(null)}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{
                background: "#16a34a",
                color: "#fff",
                padding: "8px 12px",
                borderRadius: 6,
              }}
            >
              {saving ? "Saving…" : "Create workout"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const th = { padding: "10px 8px", fontWeight: 600 };
const td = { padding: "10px 8px", verticalAlign: "top" };
const backdrop = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "grid",
  placeItems: "center",
  zIndex: 1000,
};
const modal = {
  background: "#fff",
  padding: 16,
  borderRadius: 8,
  width: "min(780px, 96vw)",
  maxHeight: "92vh",
  overflow: "auto",
  boxShadow:
    "0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -4px rgba(0, 0, 0, 0.1)",
};
