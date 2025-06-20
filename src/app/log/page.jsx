"use client";
import { useState, useEffect } from "react";

export default function Log() {
  const [logs, setLogs] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);

  useEffect(() => {
    fetch("/api/getLog")
      .then((res) => res.json())
      .then((data) => {
        const formattedLogs = data.logs.map((log) => ({
          subject: log.subject,
          email: log.email,
          datetime: new Date(log.sentAt).toLocaleString("en-IN", {
            dateStyle: "short",
            timeStyle: "short",
          }),
        }));
        setLogs(formattedLogs);
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
              <>
                {/* Desktop Table View */}
                <div className="d-none d-md-block">
                  <div className="table-responsive">
                    <table className="table table-dark table-bordered table-striped small mb-0">
                      <thead className="thead-light">
                        <tr>
                          <th style={{ width: "5%" }}>#</th>
                          <th style={{ width: "10%" }}>Subject</th>
                          <th style={{ width: "45%" }}>Email</th>
                          <th style={{ width: "40%" }}>Date & Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {logs.map((log, index) => (
                          <tr key={index} className="align-middle">
                            <td>{index + 1}</td>
                            <td>{log.subject}</td>
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
                                  {copiedIndex === index
                                    ? "Copied ✅"
                                    : "Copy 📋"}
                                </button>
                              </div>
                            </td>
                            <td className="text-break">{log.datetime}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile Card View */}
                <div
                  className="d-block d-md-none"
                  style={{ fontSize: "0.80rem" }}
                >
                  {logs.map((log, index) => (
                    <div
                      key={index}
                      className="card bg-dark text-white mb-2 p-2 position-relative"
                    >
                      <button
                        className={`btn btn-sm py-0 px-2 position-absolute top-0 end-0 m-2 ${
                          copiedIndex === index
                            ? "btn-outline-success"
                            : "btn-outline-info"
                        }`}
                        onClick={() => handleCopy(log.email, index)}
                        style={{ fontSize: "0.75rem", zIndex: 1 }}
                      >
                        {copiedIndex === index ? "Copied ✅" : "Copy 📋"}
                      </button>

                      <div>
                        <strong>#{index + 1}</strong>
                      </div>
                      <div>
                        <strong>Subject:</strong> {log.subject}
                      </div>
                      <div className="text-break mt-1">
                        <strong>Email:</strong> {log.email}
                      </div>
                      <div className="mt-1">
                        <strong>Date:</strong> {log.datetime}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
