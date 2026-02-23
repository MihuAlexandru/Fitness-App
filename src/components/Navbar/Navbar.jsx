import { NavLink } from "react-router-dom";
import "./Navbar.css";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { useDispatch, useSelector } from "react-redux";
import Card from "../Card/Card";
import { signOutUser } from "../../store/auth/authThunks";

export default function NavBar() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  const handleSignOut = async () => {
    await dispatch(signOutUser());
  };

  return (
    <Card className="nav">
      <div className="nav__brand">Fitness App</div>
      <div className="nav__links">
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
        {user ? (
          <>
            <NavLink
              to="/workouts"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Workouts
            </NavLink>
            <button onClick={handleSignOut}>Sign out</button>
          </>
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
