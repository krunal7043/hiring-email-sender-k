"use client";
import { useState, useEffect } from "react";

export default function Log() {
  const [logs, setLogs] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);

  useEffect(() => {
    fetch("/api/getLog")
      .then((res) => res.text())
      .then((data) => {
        const lines = data
          .split("\n")
          .filter(Boolean)
          .map((line) => {
            const emailMatch = line.match(/Email sent to:\s(.+?)\sat/i);
            const timeMatch = line.match(/at\s(.+)$/i);
            if (emailMatch && timeMatch) {
              return {
                email: emailMatch[1],
                datetime: timeMatch[1],
              };
            }
            return null;
          })
          .filter(Boolean);
        setLogs(lines);
      })
      .catch((err) => console.error("Error fetching logs:", err));
  }, []);

  const handleCopy = (email, index) => {
    navigator.clipboard.writeText(email);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  return (
    <div className="min-vh-100 bg-dark text-white py-4 px-2">
      <div className="container-fluid">
        <div className="card bg-secondary shadow-lg">
          <div className="card-body p-3">
            <h5 className="card-title text-center text-info mb-3">
              📧 Sent Email Logs
            </h5>

            {logs.length === 0 ? (
              <p className="text-center text-light small">No logs available.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-dark table-bordered table-striped small">
                  <thead className="thead-light">
                    <tr>
                      <th style={{ width: "5%" }}>#</th>
                      <th style={{ width: "55%" }}>Email</th>
                      <th style={{ width: "40%" }}>Date & Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log, index) => (
                      <tr key={index} className="align-middle">
                        <td>{index + 1}</td>
                        <td>
                          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2">
                            <span className="text-break">{log.email}</span>
                            <button
                              className={`btn btn-sm py-0 px-2 ${
                                copiedIndex === index
                                  ? "btn-outline-success"
                                  : "btn-outline-info"
                              }`}
                              style={{ fontSize: "0.75rem" }}
                              onClick={() => handleCopy(log.email, index)}
                            >
                              {copiedIndex === index ? "Copied ✅" : "Copy 📋"}
                            </button>
                          </div>
                        </td>
                        <td className="text-break">{log.datetime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
