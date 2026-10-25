import React, { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import NotFound from "../NotFound.jsx";
import Modal from "../../components/Modal.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useData } from "../../context/DataContext.jsx";
import { getAvailableTransitions } from "../../utils/statusTransitions.js";
import { formatFileSize } from "../../utils/validation.js";

export default function RecruiterApplicants() {
  const { jobId } = useParams();
  const { user } = useAuth();
  const { jobs, applications, setApplicationStatus } = useData();
  const [activeCandidate, setActiveCandidate] = useState(null);
  const [statusError, setStatusError] = useState("");

  const job = jobs.find((j) => j.id === jobId);
  if (!job || job.recruiterId !== user.id) return <NotFound />;

  const applicants = applications.filter((a) => a.jobId === job.id).sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));

  const handleStatusChange = (applicationId, nextStatus) => {
    const result = setApplicationStatus(applicationId, nextStatus);
    if (!result.ok) setStatusError(result.error);
    else setStatusError("");
  };

  return (
    <main className="page">
      <Link to="/recruiter/jobs" className="back">
        ← Back to my jobs
      </Link>

      <div className="page-title">
        <div className="eyebrow">{job.company}</div>
        <h1>Applicants · {job.title}</h1>
        <p>
          {applicants.length} {applicants.length === 1 ? "candidate has" : "candidates have"} applied to this role.
        </p>
      </div>

      {statusError && <div className="form-error">{statusError}</div>}

      {applicants.length ? (
        <section className="table-card">
          <div className="app-table">
            {applicants.map((a) => (
              <div className="candidate-row" key={a.id}>
                <div className="profile-avatar mini">{initials(a.name)}</div>
                <div className="candidate-info clickable" onClick={() => setActiveCandidate(a)}>
                  <b>{a.name}</b>
                  <span>
                    {a.email} · Applied {new Date(a.appliedDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </span>
                </div>
                <StatusBadge status={a.status} />
                <select
                  value={a.status}
                  onChange={(e) => handleStatusChange(a.id, e.target.value)}
                  disabled={getAvailableTransitions(a.status).length === 0}
                >
                  <option value={a.status}>{a.status} (current)</option>
                  {getAvailableTransitions(a.status).map((s) => (
                    <option key={s} value={s}>
                      Move to {s}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <EmptyState title="No applicants yet" text="Once applicants apply, they'll show up here." />
      )}

      {activeCandidate && (
        <Modal title={activeCandidate.name} onClose={() => setActiveCandidate(null)} wide>
          <div className="candidate-modal">
            <div className="mini-row">
              <span>Email</span>
              <b>{activeCandidate.email}</b>
            </div>
            <div className="mini-row">
              <span>Phone</span>
              <b>{activeCandidate.phone}</b>
            </div>
            <div className="mini-row">
              <span>Applied on</span>
              <b>{new Date(activeCandidate.appliedDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</b>
            </div>
            <div className="mini-row">
              <span>Resume</span>
              <b>
                {activeCandidate.resumeName} {activeCandidate.resumeSize ? `(${formatFileSize(activeCandidate.resumeSize)})` : ""}
              </b>
            </div>
            <div className="mini-row">
              <span>Status</span>
              <StatusBadge status={activeCandidate.status} />
            </div>
            {activeCandidate.coverMessage && (
              <div className="detail-block">
                <h2>Cover message</h2>
                <p>{activeCandidate.coverMessage}</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </main>
  );
}

function initials(name = "") {
  return name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join("");
}
