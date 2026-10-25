import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import StatusBadge from "../../components/StatusBadge.jsx";
import ApplicationTracker from "../../components/ApplicationTracker.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useData } from "../../context/DataContext.jsx";

const WITHDRAWABLE_STATUSES = ["Applied", "Shortlisted"];

export default function ApplicantApplications() {
  const { user } = useAuth();
  const { applications, jobs, withdrawApplication } = useData();
  const [expandedId, setExpandedId] = useState(null);
  const [confirmWithdrawId, setConfirmWithdrawId] = useState(null);

  const myApplications = useMemo(
    () => applications.filter((a) => a.applicantId === user.id).sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate)),
    [applications, user.id]
  );

  const counts = useMemo(() => {
    const base = { Applied: 0, Shortlisted: 0, Interview: 0, Offer: 0, Rejected: 0 };
    myApplications.forEach((a) => {
      base[a.status] = (base[a.status] || 0) + 1;
    });
    return base;
  }, [myApplications]);

  return (
    <main className="page">
      <div className="page-title">
        <div className="eyebrow">APPLICANT DASHBOARD</div>
        <h1>Application tracker</h1>
        <p>Track every opportunity across your placement journey.</p>
      </div>

      <div className="pipeline">
        {["Applied", "Shortlisted", "Interview", "Offer"].map((s) => (
          <div key={s}>
            <b>{counts[s]}</b>
            <span>{s}</span>
          </div>
        ))}
        <div>
          <b>{counts.Rejected}</b>
          <span>Rejected</span>
        </div>
      </div>

      <section className="table-card">
        <div className="table-title">
          <h2>Your applications</h2>
          <Link to="/jobs" className="primary">
            Find more jobs
          </Link>
        </div>

        {myApplications.length ? (
          <div className="applications-list">
            {myApplications.map((a) => {
              const job = jobs.find((j) => j.id === a.jobId);
              const isOpen = expandedId === a.id;
              const canWithdraw = WITHDRAWABLE_STATUSES.includes(a.status);
              return (
                <div className="application-item" key={a.id}>
                  <div className="app-row clickable" onClick={() => setExpandedId(isOpen ? null : a.id)}>
                    <div className="company-logo">{(job?.company || "?").slice(0, 2).toUpperCase()}</div>
                    <div>
                      <b>{job?.title || "Job removed"}</b>
                      <span>{job?.company}</span>
                    </div>
                    <span>{new Date(a.appliedDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
                    <StatusBadge status={a.status} />
                  </div>

                  {isOpen && (
                    <div className="application-detail">
                      <ApplicationTracker status={a.status} />
                      <div className="mini-row">
                        <span>Resume</span>
                        <b>{a.resumeName}</b>
                      </div>
                      {a.coverMessage && (
                        <div className="detail-block">
                          <h2>Cover message</h2>
                          <p>{a.coverMessage}</p>
                        </div>
                      )}
                      <div className="application-actions">
                        {job && (
                          <Link className="secondary" to={`/jobs/${job.id}`}>
                            View job
                          </Link>
                        )}
                        {canWithdraw &&
                          (confirmWithdrawId === a.id ? (
                            <>
                              <span className="tiny">Withdraw this application?</span>
                              <button
                                type="button"
                                className="primary"
                                onClick={() => {
                                  withdrawApplication(a.id);
                                  setConfirmWithdrawId(null);
                                }}
                              >
                                Confirm withdraw
                              </button>
                              <button type="button" className="secondary" onClick={() => setConfirmWithdrawId(null)}>
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button type="button" className="secondary" onClick={() => setConfirmWithdrawId(a.id)}>
                              Withdraw application
                            </button>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState title="No applications yet" text="Start applying to see your progress here." actionTo="/jobs" actionLabel="Browse jobs" />
        )}
      </section>
    </main>
  );
}
