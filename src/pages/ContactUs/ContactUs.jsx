import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";
import "./ContactUs.css";

export default function ContactUs() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("contact_messages").insert([
      {
        name: form.name,
        email: form.email,
        message: form.message,
      },
    ]);

    setLoading(false);

    if (!error) {
      setSubmitted(true);
    } else {
      alert("Something went wrong. Try again!");
      console.error(error);
    }
  }

  if (submitted) {
    return (
      <div className="contact-container">
        <h2 className="contact-title">Thank you for contacting us!</h2>
        <p className="contact-subtitle">Someone will respond soon.</p>
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="contact-container">
      <h1 className="contact-title">Contact Us</h1>

      <form className="contact-form" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="name">
          Your name
        </label>
        <input
          id="name"
          type="text"
          name="name"
          placeholder="Your name"
          value={form.name}
          onChange={handleChange}
          required
          className="input"
          autoComplete="name"
        />

        <label className="sr-only" htmlFor="email">
          Your email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="Your email"
          value={form.email}
          onChange={handleChange}
          required
          className="input"
          autoComplete="email"
        />

        <label className="sr-only" htmlFor="message">
          Your message
        </label>
        <textarea
          id="message"
          name="message"
          placeholder="Your message"
          value={form.message}
          onChange={handleChange}
          required
          rows={5}
          className="textarea"
        />

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}
