"use client";
import { useState, useEffect } from "react";
import { FiLogOut, FiArrowUpRight } from "react-icons/fi";
import { CgAdd } from "react-icons/cg";
import { useRouter } from "next/navigation";

export default function Contact() {
  const [form, setForm] = useState({ email: "", subject: "" });
  const [status, setStatus] = useState("");
  const router = useRouter();
  const [todayCount, setTodayCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

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
      window.location.reload();
    } else {
      setStatus("Failed to send message.");
    }

    setTimeout(() => setStatus(""), 3000);
  };

  const logout = async () => {
    await fetch("/api/logout");
    window.location.href = "/login";
  };

  const log = async () => {
    router.push("/log");
  };

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await fetch("/api/getLog");
        const data = await res.json();

        const today = new Date();
        const todayStr = today.toLocaleDateString("en-IN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });

        const formattedLogs = data.logs.map((log) => {
          const datetime = new Date(log.sentAt);
          return {
            dateOnly: datetime.toLocaleDateString("en-IN", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }),
          };
        });

        setTodayCount(
          formattedLogs.filter((log) => log.dateOnly === todayStr).length
        );
        setTotalCount(formattedLogs.length);
      } catch (err) {
        console.error("Failed to fetch counts", err);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100 position-relative"
      style={{ backgroundColor: "#000" }}
    >
      <button
        onClick={logout}
        className="btn btn-outline-none text-white position-absolute"
        style={{ top: "-10px", right: "0px", zIndex: 10 }}
      >
        <FiLogOut className="me-1" />
      </button>

      {/* Main Form Card */}
      <div
        className="p-4 rounded w-100 text-light"
        style={{
          backgroundColor: "#1e1e1e",
          maxWidth: "500px",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
        }}
      >
        <div className="text-left mb-3">
          <span className="text-success me-3">{todayCount}</span>
          <span className="text-primary">{totalCount}</span>
        </div>

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
      <button
        onClick={log}
        className="btn btn-outline-none text-white position-absolute d-flex align-items-center gap-1"
        style={{ bottom: "0px", right: "0px", zIndex: 10 }}
      >
        <CgAdd />
      </button>
    </div>
  );
}
