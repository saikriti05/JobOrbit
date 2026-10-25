import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import StatusBadge from "../../components/StatusBadge.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useData } from "../../context/DataContext.jsx";
import { APPLICATION_STAGES, TERMINAL_STATUS } from "../../utils/statusTransitions.js";

/** Tracker view of every active job the recruiter has posted, with a live
 * breakdown of where its applicants sit in the hiring pipeline. */
export default function RecruiterApplications() {
  const { user } = useAuth();
  const { jobs, applications } = useData();

  const activeJobs = useMemo(
    () =>
      jobs
        .filter((j) => j.recruiterId === user.id && j.status !== "closed")
        .sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate)),
    [jobs, user.id]
  );

  const activeJobIds = activeJobs.map((j) => j.id);
  const activeApplications = useMemo(
    () => applications.filter((a) => activeJobIds.includes(a.jobId)),
    [applications, activeJobIds]
  );

  const overallCounts = useMemo(() => {
    const base = { Applied: 0, Shortlisted: 0, Interview: 0, Offer: 0, Rejected: 0 };
    activeApplications.forEach((a) => {
      base[a.status] = (base[a.status] || 0) + 1;
    });
    return base;
  }, [activeApplications]);

  const jobBreakdown = (jobId) => {
    const base = { Applied: 0, Shortlisted: 0, Interview: 0, Offer: 0, Rejected: 0 };
    applications
      .filter((a) => a.jobId === jobId)
      .forEach((a) => {
        base[a.status] = (base[a.status] || 0) + 1;
      });
    return base;
  };

  return (
    <main className="page">
      <div className="page-title">
        <div className="eyebrow">RECRUITER CONSOLE</div>
        <h1>Application tracker</h1>
        <p>Live pipeline status for every role you currently have open.</p>
      </div>

      <div className="pipeline">
        {[...APPLICATION_STAGES, TERMINAL_STATUS].map((s) => (
          <div key={s}>
            <b>{overallCounts[s]}</b>
            <span>{s}</span>
          </div>
        ))}
      </div>

      <section className="table-card">
        <div className="table-title">
          <h2>Active job postings</h2>
          <Link to="/recruiter/jobs" className="text-link">
            Manage all jobs →
          </Link>
        </div>

        {activeJobs.length ? (
          <div className="applications-list">
            {activeJobs.map((j) => {
              const counts = jobBreakdown(j.id);
              const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
              return (
                <div className="application-item" key={j.id}>
                  <div className="app-row">
                    <div className="company-logo">{j.company.slice(0, 2).toUpperCase()}</div>
                    <div>
                      <b>{j.title}</b>
                      <span>{j.location}</span>
                    </div>
                    <span>{total} applicants</span>
                    <StatusBadge status="Open" />
                  </div>

                  <div className="application-detail">
                    <div className="tracker">
                      {[...APPLICATION_STAGES, TERMINAL_STATUS].map((stage) => (
                        <div className="tracker-step upcoming" key={stage}>
                          <span className="tracker-dot">{counts[stage]}</span>
                          <span className="tracker-label">{stage}</span>
                        </div>
                      ))}
                    </div>
                    <div className="application-actions">
                      <Link className="secondary" to={`/recruiter/jobs/${j.id}/applicants`}>
                        View applicants
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState title="No active job postings" text="Post a job to start tracking applicants here." actionTo="/recruiter/jobs/new" actionLabel="Post a job" />
        )}
      </section>
    </main>
  );
}
