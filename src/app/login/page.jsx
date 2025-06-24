"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage("Logging in...");

    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      setStatusMessage("Login successful! Redirecting...");
      setTimeout(() => {
        router.push("/mail");
      }, 2000);
      
    } else {
      setStatusMessage("Invalid credentials");
      setTimeout(() => {
        setLoading(false);
        setStatusMessage("");
      }, 2000);
    }
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
          maxWidth: "400px",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
        }}
      >
        <h4 className="text-center mb-4 text-info">Login</h4>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-light">Username</label>
            <input
              type="password"
              className="form-control bg-dark text-white border-secondary"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-light">Password</label>
            <input
              type="password"
              className="form-control bg-dark text-white border-secondary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-info w-100 d-flex align-items-center justify-content-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <div
                  className="spinner-border spinner-border-sm text-light"
                  role="status"
                ></div>
                <span>{statusMessage}</span>
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
