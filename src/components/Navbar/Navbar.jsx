import { NavLink } from "react-router-dom";
import "./Navbar.css";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { useDispatch, useSelector } from "react-redux";
import Card from "../Card/Card";
import { signOutUser } from "../../store/auth/authThunks";

export default function NavBar() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  const handleSignOut = async (e) => {
    e?.preventDefault?.();
    await dispatch(signOutUser());
    const toggler = document.getElementById("nav-toggle");
    if (toggler) toggler.checked = false;
  };

  return (
    <Card className="nav">
      <div className="nav__brand">Fitness App</div>

      <input
        type="checkbox"
        id="nav-toggle"
        className="nav__toggle"
        aria-label="Toggle navigation menu"
      />

      <label
        htmlFor="nav-toggle"
        className="nav__hamburger"
        aria-controls="nav-links"
        aria-expanded="false"
      >
        <span className="burger-line" />
        <span className="burger-line" />
        <span className="burger-line" />
      </label>
      <div
        id="nav-links"
        className="nav__links"
        onClick={(e) => {
          const target = e.target;
          if (target.closest("a")) {
            const toggler = document.getElementById("nav-toggle");
            if (toggler) toggler.checked = false;
          }
        }}
      >
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Home
        </NavLink>

        <NavLink
          to="/exercises"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Exercises
        </NavLink>

        {user && (
          <NavLink
            to="/workouts"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Workouts
          </NavLink>
        )}

        {user && (
          <NavLink
            to="/messages"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Messages
          </NavLink>
        )}

        <NavLink
          to="/contact"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Contact Us
        </NavLink>

        {user ? (
          // Styled like a link, still performs sign-out action
          <a href="/" onClick={handleSignOut} className="nav__action">
            Sign out
          </a>
        ) : (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Login
            </NavLink>
            <NavLink
              to="/signup"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Signup
            </NavLink>
          </>
        )}

        <ThemeToggle />
      </div>
    </Card>
  );
}
