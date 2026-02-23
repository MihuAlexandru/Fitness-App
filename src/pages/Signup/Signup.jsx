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
      // If email confirmation is enabled, user may need to verify email first
      navigate("/dashboard");
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 420 }}>
      <h2>Sign up</h2>
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <label>Password</label>
        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button disabled={status === "loading"} type="submit">
          {status === "loading" ? "Creating..." : "Create account"}
        </button>
      </form>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
