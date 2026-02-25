import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signUpWithEmail } from "../../store/auth/authThunks";
import { useNavigate, Link } from "react-router-dom";

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
    <div className="page-container">
      <h1 className="page-title">Sign up</h1>

      <form className="page-form" onSubmit={handleSubmit}>
        <label htmlFor="email" className="form-label">
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

        <label htmlFor="password" className="form-label">
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
          aria-busy={status === "loading"}
        >
          {status === "loading" ? "Creating..." : "Create account"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <p className="page-footer">
        Already have an account?{" "}
        <Link to="/login" className="link">
          Log in
        </Link>
      </p>
    </div>
  );
}
