import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { signInWithEmail } from "../../store/auth/authThunks";

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
    <div
      style={{
        padding: "2rem",
        maxWidth: 600,
        margin: "40px auto",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 24 }}>Login</h1>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
        <label style={{ fontWeight: 600 }}>Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          style={{
            padding: "10px 12px",
            borderRadius: 6,
            border: "1px solid #ccc",
            fontSize: 14,
          }}
        />

        <label style={{ fontWeight: 600 }}>Password</label>
        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          style={{
            padding: "10px 12px",
            borderRadius: 6,
            border: "1px solid #ccc",
            fontSize: 14,
          }}
        />

        <button
          disabled={status === "loading"}
          type="submit"
          style={{
            marginTop: 10,
            padding: "10px 14px",

            cursor: "pointer",
            fontSize: 15,
            fontWeight: 600,
            transition: "0.2s",
            opacity: status === "loading" ? 0.7 : 1,
          }}
        >
          {status === "loading" ? "Signing in..." : "Sign in"}
        </button>
      </form>

      {error && (
        <p style={{ color: "crimson", marginTop: 10, textAlign: "center" }}>
          {error}
        </p>
      )}

      <p style={{ marginTop: 20, textAlign: "center" }}>
        Don’t have an account?{" "}
        <Link to="/signup" style={{ color: "#3b82f6", fontWeight: 600 }}>
          Sign up
        </Link>
      </p>
    </div>
  );
}
