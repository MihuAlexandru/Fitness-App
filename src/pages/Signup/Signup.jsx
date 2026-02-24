import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signUpWithEmail } from "../../store/auth/authThunks";
import { useNavigate, Link } from "react-router-dom";
import "./Signup.css";

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(signUpWithEmail(form));
    if (res.meta.requestStatus === "fulfilled") {
      navigate("/dashboard");
    }
  };

  return (
    <div className="signup-container">
      <h1 className="signup-title">Sign up</h1>

      <form className="signup-form" onSubmit={handleSubmit}>
        <label htmlFor="email" className="signup-label">
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

        <label htmlFor="password" className="signup-label">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          className="input"
          autoComplete="new-password"
          placeholder="Create a password"
        />

        <button
          disabled={status === "loading"}
          type="submit"
          className="btn"
          aria-busy={status === "loading"}
        >
          {status === "loading" ? "Creating..." : "Create account"}
        </button>
      </form>

      {error && <p className="signup-error">{error}</p>}

      <p className="signup-footer">
        Already have an account?{" "}
        <Link to="/login" className="link">
          Log in
        </Link>
      </p>
    </div>
  );
}
