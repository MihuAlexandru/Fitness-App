import { useState } from "react";
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

    try {
      const existingMessages = JSON.parse(
        localStorage.getItem("messages") || "[]",
      );
      const newMessage = {
        id: Date.now(),
        name: form.name,
        email: form.email,
        message: form.message,
        timestamp: new Date().toISOString(),
      };
      existingMessages.push(newMessage);
      localStorage.setItem("messages", JSON.stringify(existingMessages));
      setLoading(false);
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Try again!");
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="page-container contact-page">
        <h2 className="page-title">Thank you for contacting us!</h2>
        <p>Someone will respond soon.</p>
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="page-container contact-page">
      <h1 className="page-title">Contact Us</h1>

      <form className="page-form" onSubmit={handleSubmit}>
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
