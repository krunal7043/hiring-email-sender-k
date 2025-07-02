"use client";

import { useState, useEffect } from "react";
import { FiLogOut } from "react-icons/fi";
import { CgAdd } from "react-icons/cg";
import { useRouter } from "next/navigation";

export default function Contact() {
  const [emailText, setEmailText] = useState("");
  const [status, setStatus] = useState("");
  const [todayCount, setTodayCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    const res = await fetch("/api/multiple", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emailText }),
    });

    const data = await res.json();

    if (res.ok) {
      setStatus("Emails sent successfully!");
      setEmailText("");
    } else {
      setStatus("Failed to send emails.");
    }

    setTimeout(() => setStatus(""), 4000);
  };

  const logout = async () => {
    await fetch("/api/logout");
    window.location.href = "/login";
  };

  const log = () => {
    router.push("/log");
  };
  const singlemail = () => {
    router.push("/mail");
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
      {/* Logout Button */}
      <button
        onClick={logout}
        className="btn btn-outline-none text-white position-absolute"
        style={{ top: "-10px", right: "0px", zIndex: 10 }}
      >
        <FiLogOut className="me-1" />
      </button>

      {/* Main Card */}
      <div
        className="p-4 rounded w-100 text-light"
        style={{
          backgroundColor: "#1e1e1e",
          maxWidth: "500px",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
        }}
      >
        {/* Count Display */}
        <div className="text-left mb-3">
          <span className="text-success me-3"> {todayCount}</span>
          <span className="text-primary"> {totalCount}</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label text-light">
              Email List
            </label>
            <textarea
              id="email"
              name="email"
              className="form-control bg-dark text-white border-secondary"
              placeholder="Enter emails separated by space or newlines"
              rows={6}
              value={emailText}
              onChange={(e) => setEmailText(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-info w-100">
            Send Emails
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

      {/* Log View Button */}
      <button
        onClick={log}
        className="btn btn-outline-none text-white position-absolute d-flex align-items-center gap-1"
        style={{ bottom: "0px", right: "0px", zIndex: 10 }}
      >
        +
      </button>
      <button
        onClick={singlemail}
        className="btn btn-outline-none text-white position-absolute d-flex align-items-center gap-1"
        style={{ bottom: "0px", right: "30px", zIndex: 10 }}
      >
        -
      </button>

    </div>
  );
}
