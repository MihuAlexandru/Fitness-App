export function toDate(d) {
  if (!d) return null;
  const dt = new Date(d);
  return Number.isNaN(dt.getTime()) ? null : dt;
}

export function getCurrentYear() {
  return new Date().getFullYear();
}

function isInYear(date, year) {
  const d = toDate(date);
  return d && d.getFullYear() === year;
}

/**
 * Computes all the metrics needed for the Stats page.
 * @param {Array} workouts
 * @param {Array} catalog
 * @param {Object} opts
 * @param {number} opts.year
 * @returns {{
 *   year: number,
 *   byMonth: number[],
 *   totalWorkouts: number,
 *   totalVolume: number,
 *   avgDuration: number | null,
 *   totalSets: number,
 *   mostFrequentExercise: { id: string|number, name: string, count: number } | null,
 *   topExercises: Array<{ id: string|number, name: string, count: number }>
 * }}
 */

export function computeYearStats(
  workouts,
  catalog = [],
  { year = getCurrentYear() } = {},
) {
  const byMonth = new Array(12).fill(0);
  const nameById = new Map(
    catalog.map((e) => [
      e.id,
      e.name || e.title || e.display_name || `#${e.id}`,
    ]),
  );

  let totalWorkouts = 0;
  let totalVolume = 0;
  let totalSets = 0;

  let durSum = 0;
  let durCount = 0;

  const exerciseCount = new Map();

  for (const w of workouts || []) {
    if (!isInYear(w.date, year)) continue;

    totalWorkouts += 1;

    const d = toDate(w.date);
    if (d) {
      const m = d.getMonth();
      byMonth[m] += 1;
    }

    if (typeof w.duration === "number" && !Number.isNaN(w.duration)) {
      durSum += w.duration;
      durCount += 1;
    }

    const rows = Array.isArray(w.exercises) ? w.exercises : [];
    for (const r of rows) {
      const sets = Number(r.sets) || 0;
      const reps = Number(r.reps) || 0;
      const weight = Number(r.weight) || 0;

      totalSets += sets;
      if (sets > 0 && reps > 0 && weight > 0) {
        totalVolume += sets * reps * weight;
      }

      const exId = r.exercise_id ?? r.exercise?.id ?? null;
      if (exId != null) {
        exerciseCount.set(exId, (exerciseCount.get(exId) || 0) + 1);
      }
    }
  }

  const avgDuration = durCount > 0 ? durSum / durCount : null;

  let mostFrequentExercise = null;
  let maxCount = 0;
  for (const [id, count] of exerciseCount.entries()) {
    if (count > maxCount) {
      maxCount = count;
      mostFrequentExercise = {
        id,
        name: nameById.get(id) || `#${id}`,
        count,
      };
    }
  }

  const topExercises = Array.from(exerciseCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, count]) => ({
      id,
      name: nameById.get(id) || `#${id}`,
      count,
    }));

  return {
    year,
    byMonth,
    totalWorkouts,
    totalVolume,
    avgDuration,
    totalSets,
    mostFrequentExercise,
    topExercises,
  };
}
