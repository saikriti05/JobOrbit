import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import StatusBadge from "../../components/StatusBadge.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useData } from "../../context/DataContext.jsx";

export default function RecruiterJobs() {
  const { user } = useAuth();
  const { jobs, applications, closeJob, reopenJob, removeJob } = useData();
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const myJobs = useMemo(
    () => jobs.filter((j) => j.recruiterId === user.id).sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate)),
    [jobs, user.id]
  );

  const applicantCount = (jobId) => applications.filter((a) => a.jobId === jobId).length;

  return (
    <main className="page">
      <div className="dashboard-head">
        <div>
          <div className="eyebrow">RECRUITER CONSOLE</div>
          <h1>My job postings</h1>
          <p>Manage every role you've posted on JobOrbit.</p>
        </div>
        <Link to="/recruiter/jobs/new" className="primary">
          + Post a job
        </Link>
      </div>

      {myJobs.length ? (
        <section className="table-card">
          <div className="app-table recruiter-job-table">
            {myJobs.map((j) => (
              <div className="app-row recruiter-job-row" key={j.id}>
                <div className="company-logo">{j.company.slice(0, 2).toUpperCase()}</div>
                <div>
                  <Link to={`/jobs/${j.id}`}>
                    <b>{j.title}</b>
                  </Link>
                  <span>
                    {j.location} · {j.type}
                  </span>
                </div>
                <span>{applicantCount(j.id)} applicants</span>
                <StatusBadge status={j.status === "closed" ? "Closed" : "Open"} />
                <div className="row-actions">
                  <Link className="text-link" to={`/recruiter/jobs/${j.id}/applicants`}>
                    Applicants
                  </Link>
                  <Link className="text-link" to={`/recruiter/jobs/${j.id}/edit`}>
                    Edit
                  </Link>
                  {j.status === "closed" ? (
                    <button type="button" className="text-link" onClick={() => reopenJob(j.id)}>
                      Reopen
                    </button>
                  ) : (
                    <button type="button" className="text-link" onClick={() => closeJob(j.id)}>
                      Close
                    </button>
                  )}
                  {confirmDeleteId === j.id ? (
                    <>
                      <button type="button" className="text-link danger" onClick={() => removeJob(j.id)}>
                        Confirm delete
                      </button>
                      <button type="button" className="text-link" onClick={() => setConfirmDeleteId(null)}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button type="button" className="text-link danger" onClick={() => setConfirmDeleteId(j.id)}>
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <EmptyState title="No jobs posted yet" text="Post your first opening to start receiving applicants." actionTo="/recruiter/jobs/new" actionLabel="Post a job" />
      )}
    </main>
  );
}
