"use client";
import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ email: "", subject: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    const res = await fetch("/api/sendMail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setStatus("Message sent successfully!");
      setForm({ email: "", subject: "" });
    } else {
      setStatus("Failed to send message.");
    }

    setTimeout(() => setStatus(""), 3000);
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{ backgroundColor: "#000" }}
    >
      <div
        className="p-4 rounded w-100 text-light"
        style={{
          backgroundColor: "#1e1e1e",
          maxWidth: "500px",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
        }}
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="subject" className="form-label text-light">
              Subject
            </label>
            <input
              type="text"
              className="form-control bg-dark text-white border-secondary"
              id="subject"
              name="subject"
              placeholder="Enter email subject"
              value={form.subject}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label text-light">
              Email address
            </label>
            <input
              type="email"
              className="form-control bg-dark text-white border-secondary"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-info w-100">
            Send Message
          </button>

          {status && (
            <p
              className={`mt-3 text-center fw-medium ${
                status.includes("success") ? "text-success" : "text-danger"
              }`}
            >
              {status}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
