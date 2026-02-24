import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { signInWithEmail } from "../../store/auth/authThunks";
import "./Login.css";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, error } = useSelector((s) => s.auth);

  const [form, setForm] = useState({ email: "", password: "" });

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(signInWithEmail(form));
    if (res.meta.requestStatus === "fulfilled") {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Login</h1>

      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="email" className="login-label">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          className="input"
          autoComplete="email"
          placeholder="you@example.com"
        />

        <label htmlFor="password" className="login-label">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          className="input"
          autoComplete="current-password"
          placeholder="Your password"
        />

        <button disabled={status === "loading"} type="submit" className="btn">
          {status === "loading" ? "Signing in..." : "Sign in"}
        </button>
      </form>

      {error && <p className="login-error">{error}</p>}

      <p className="login-footer">
        Don’t have an account?{" "}
        <Link to="/signup" className="link">
          Sign up
        </Link>
      </p>
    </div>
  );
}
