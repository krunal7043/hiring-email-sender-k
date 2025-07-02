"use client";
import { useState, useEffect } from "react";
import { FiLogOut } from "react-icons/fi";
import { CgAdd } from "react-icons/cg";

import { useRouter } from "next/navigation";

export default function Log() {
  const [logs, setLogs] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [TotalLogs, setTotalLogs] = useState(0);
  const logsPerPage = 10;

  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = logs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(logs.length / logsPerPage);

  console.log("indexOfLastLog", indexOfLastLog);
  console.log("indexOfFirstLog", indexOfFirstLog);
  console.log("currentLogs", currentLogs);
  console.log("totalPages", totalPages);

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
        setTotalLogs(formattedLogs.length);
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

  const logout = async () => {
    await fetch("/api/logout");
    window.location.href = "/login";
  };
  const singleMail = async () => {
    router.push("/mail");
  };
  const multipleMail = async () => {
    router.push("/multipleMail");
  };

  return (
    <div className="min-vh-100 bg-dark text-white py-4 px-2 position-relative">
      <button
        onClick={logout}
        className="btn btn-outline-none text-white position-absolute"
        style={{ top: "-10px", right: "0px", zIndex: 10 }}
      >
        <FiLogOut className="me-1" />
      </button>

      <button
        onClick={singleMail}
        className="btn btn-outline-none text-white position-absolute d-flex align-items-center gap-1"
        style={{ bottom: "0px", right: "30px", zIndex: 10, fontSize: "12px " }}
      >
        1
      </button>
      <button
        onClick={multipleMail}
        className="btn btn-outline-none text-white position-absolute d-flex align-items-center gap-1"
        style={{ bottom: "0px", right: "0px", zIndex: 10, fontSize: "12px" }}
      >
        2
      </button>

      <div className="container-fluid">
        <div className="card bg-secondary shadow-lg">
          <div className="card-body p-3">
            <h5 className="card-title text-center text-info mb-3">
              📧 Logs {TotalLogs}
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
                        {currentLogs.map((log, index) => (
                          <tr key={index} className="align-middle">
                            <td>{indexOfFirstLog + index + 1}</td>
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
                  {currentLogs.map((log, index) => (
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
                      <div>
                        <strong>#{indexOfFirstLog + index + 1}</strong>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="d-flex justify-content-center align-items-center mt-3 gap-2 flex-wrap">
                    <button
                      className="btn btn-sm btn-outline-light"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((prev) => prev - 1)}
                    >
                      ⬅️ Prev
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        className={`btn btn-sm ${
                          currentPage === i + 1
                            ? "btn-info"
                            : "btn-outline-light"
                        }`}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      className="btn btn-sm btn-outline-light"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                    >
                      Next ➡️
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
