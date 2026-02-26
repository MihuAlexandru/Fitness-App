import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { computeYearStats, getCurrentYear } from "./statsUtils";
import Card from "../../components/Card/Card";

export default function Stats() {
  const {
    items: workouts,
    catalog,
    status,
    error,
  } = useSelector((s) => s.workouts);

  const year = getCurrentYear();

  const stats = useMemo(() => {
    return computeYearStats(workouts, catalog, { year });
  }, [workouts, catalog, year]);

  if (status === "loading")
    return (
      <div className="container">
        <p>Loading…</p>
      </div>
    );
  if (error)
    return (
      <div className="container">
        <p className="error">{error}</p>
      </div>
    );

  const hasData = (stats.totalWorkouts ?? 0) > 0;

  return (
    <div className="container" style={{ display: "grid", gap: 16 }}>
      <header style={{ marginTop: 8, marginBottom: 8 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Your Stats</h1>
        <p style={{ margin: 0 }}>Year {year}</p>
      </header>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 12,
        }}
      >
        <StatCard label="Workouts (this year)" value={stats.totalWorkouts} />
        <StatCard
          label="Total volume"
          value={formatNumber(stats.totalVolume)}
          tooltip="Σ (sets × reps × weight)"
        />
        <StatCard
          label="Avg duration"
          value={formatDuration(stats.avgDuration)}
        />
        <StatCard label="Total sets" value={formatNumber(stats.totalSets)} />
        <StatCard
          label="Most frequent exercise"
          value={
            stats.mostFrequentExercise ? stats.mostFrequentExercise.name : "—"
          }
          sub={
            stats.mostFrequentExercise
              ? `${stats.mostFrequentExercise.count} sessions`
              : ""
          }
        />
      </section>

      <Card
        style={{
          padding: 16,
        }}
      >
        <h2 style={{ marginTop: 0, fontSize: 18 }}>Workouts by Month</h2>
        {hasData ? (
          <MiniBarChart data={stats.byMonth} />
        ) : (
          <EmptyState text="No workouts for the current year yet." />
        )}
      </Card>

      <Card
        style={{
          padding: 16,
        }}
      >
        <h2 style={{ marginTop: 0, fontSize: 18 }}>
          Top Exercises (This Year)
        </h2>
        {hasData && stats.topExercises.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  <th style={{ padding: "8px 4px" }}>#</th>
                  <th style={{ padding: "8px 4px" }}>Exercise</th>
                  <th style={{ padding: "8px 4px" }}>Sessions</th>
                </tr>
              </thead>
              <tbody>
                {stats.topExercises.map((e, idx) => (
                  <tr key={e.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "8px 4px", color: "#6b7280" }}>
                      {idx + 1}
                    </td>
                    <td style={{ padding: "8px 4px" }}>{e.name}</td>
                    <td style={{ padding: "8px 4px" }}>{e.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState text="No exercise data available yet for this year." />
        )}
      </Card>
    </div>
  );
}

function StatCard({ label, value, sub, tooltip }) {
  return (
    <Card
      title={tooltip}
      style={{
        padding: 12,
        display: "grid",
        gap: 4,
      }}
    >
      <div style={{ fontSize: 12 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700 }}>
        {value != null ? value : "—"}
      </div>
      {sub ? <div style={{ fontSize: 12 }}>{sub}</div> : null}
    </Card>
  );
}

function EmptyState({ text }) {
  return (
    <div style={{ padding: 24, color: "#6b7280", textAlign: "center" }}>
      {text}
    </div>
  );
}

function formatNumber(n) {
  if (n == null) return "—";
  try {
    return new Intl.NumberFormat().format(n);
  } catch {
    return String(n);
  }
}

function formatDuration(mins) {
  if (mins == null || Number.isNaN(mins)) return "—";
  const m = Math.round(mins);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem ? `${h}h ${rem}m` : `${h}h`;
}

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function MiniBarChart({
  data = [],
  width = 680,
  height = 220,
  color = "#70e0b3",
}) {
  const max = Math.max(1, ...data);
  const padding = 24;
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;
  const barGap = 8;
  const barW = (innerW - barGap * (data.length - 1)) / data.length;

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Workouts per month"
      style={{ margin: "0 auto" }}
    >
      <line
        x1={padding}
        y1={height - padding}
        x2={width - padding}
        y2={height - padding}
        stroke="#e5e7eb"
      />
      <line
        x1={padding}
        y1={padding}
        x2={padding}
        y2={height - padding}
        stroke="#e5e7eb"
      />
      {data.map((v, i) => {
        const h = (v / max) * innerH;
        const x = padding + i * (barW + barGap);
        const y = height - padding - h;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={h} fill={color} rx="4" />

            <text
              x={x + barW / 2}
              y={height - padding + 14}
              textAnchor="middle"
              fontSize="10"
              fill="#6b7280"
            >
              {MONTH_LABELS[i]}
            </text>
            {v > 0 && (
              <text
                x={x + barW / 2}
                y={y - 4}
                textAnchor="middle"
                fontSize="10"
                fill="#374151"
              >
                {v}
              </text>
            )}
          </g>
        );
      })}
      <text
        x={padding - 8}
        y={padding + 4}
        textAnchor="end"
        fontSize="10"
        fill="#6b7280"
      >
        {max}
      </text>
    </svg>
  );
}
