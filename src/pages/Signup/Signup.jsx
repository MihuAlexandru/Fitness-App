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
    <div
      style={{
        padding: "2rem",
        maxWidth: 600,
        margin: "40px auto",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 24 }}>Sign up</h1>

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
          {status === "loading" ? "Creating..." : "Create account"}
        </button>
      </form>

      {error && (
        <p style={{ color: "crimson", marginTop: 10, textAlign: "center" }}>
          {error}
        </p>
      )}

      <p style={{ marginTop: 20, textAlign: "center" }}>
        Already have an account?{" "}
        <Link to="/login" style={{ color: "#3b82f6", fontWeight: 600 }}>
          Log in
        </Link>
      </p>
    </div>
  );
}
