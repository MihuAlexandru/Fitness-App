import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Home.css";

export default function Home() {
  const user = useSelector((s) => s.auth.user);

  return (
    <main className="home-container">
      <header className="home-header">
        <h1>Welcome</h1>
        <p className="home-subtitle">
          Your lightweight fitness companion — discover exercises, personalize
          your library, and track workouts effortlessly.
        </p>
      </header>

      <section className="home-section">
        <h2>What you can do here</h2>
        <ul className="home-list">
          <li>
            <strong>Browse Exercises (no account required):</strong> Search and
            filter a growing catalog of exercises by name and muscle group. Sort
            results and adjust page size for a quick scan.
          </li>
          <li>
            <strong>Create an account to personalize:</strong> Add your own
            custom exercises with descriptions and categories tailored to your
            training.
          </li>
          <li>
            <strong>Log your workouts:</strong> Keep a record of sessions,
            filter by date, search your notes, and sort by date or duration to
            spot progress over time.
          </li>
        </ul>
      </section>

      <section aria-label="Quick actions" className="home-actions">
        <NavLink to="/exercises" className="btn">
          Browse Exercises
        </NavLink>

        {!user ? (
          <NavLink to="/login" className="btn">
            Log in
          </NavLink>
        ) : (
          <>
            <NavLink to="/workouts" className="btn">
              Log Workout
            </NavLink>
            <NavLink to="/stats" className="btn">
              View Stats
            </NavLink>
          </>
        )}
      </section>
    </main>
  );
}
