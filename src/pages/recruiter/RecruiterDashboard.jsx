import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import StatCard from "../../components/StatCard.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useData } from "../../context/DataContext.jsx";

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const { jobs, applications } = useData();

  const myJobs = useMemo(() => jobs.filter((j) => j.recruiterId === user.id), [jobs, user.id]);
  const myJobIds = myJobs.map((j) => j.id);
  const myApplications = useMemo(() => applications.filter((a) => myJobIds.includes(a.jobId)), [applications, myJobIds]);

  const stats = {
    activeJobs: myJobs.filter((j) => j.status !== "closed").length,
    totalApplicants: myApplications.length,
    shortlisted: myApplications.filter((a) => a.status === "Shortlisted").length,
    interviews: myApplications.filter((a) => a.status === "Interview").length,
  };

  const recentJobs = [...myJobs].sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate)).slice(0, 5);
  const recentActivity = [...myApplications].sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate)).slice(0, 6);

  return (
    <main className="page">
      <div className="dashboard-head">
        <div>
          <div className="eyebrow">RECRUITER CONSOLE</div>
          <h1>Hiring dashboard</h1>
          <p>Post roles and move candidates through your hiring pipeline.</p>
        </div>
        <Link to="/recruiter/jobs/new" className="primary">
          + Post a job
        </Link>
      </div>

      <div className="stat-grid">
        <StatCard label="Active jobs" value={stats.activeJobs} />
        <StatCard label="Total applicants" value={stats.totalApplicants} accent="blue" />
        <StatCard label="Shortlisted" value={stats.shortlisted} accent="amber" />
        <StatCard label="Interviews" value={stats.interviews} accent="green" />
      </div>

      <div className="dashboard-grid">
        <section className="table-card">
          <div className="table-title">
            <h2>Recent jobs</h2>
            <Link to="/recruiter/jobs" className="text-link">
              View all →
            </Link>
          </div>
          {recentJobs.length ? (
            <div className="app-table">
              {recentJobs.map((j) => (
                <div className="app-row" key={j.id}>
                  <div className="company-logo">{j.company.slice(0, 2).toUpperCase()}</div>
                  <div>
                    <b>{j.title}</b>
                    <span>{j.location}</span>
                  </div>
                  <span>{new Date(j.postedDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
                  <StatusBadge status={j.status === "closed" ? "Closed" : "Open"} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No jobs posted yet" text="Post your first opening to start receiving applicants." actionTo="/recruiter/jobs/new" actionLabel="Post a job" />
          )}
        </section>

        <aside className="dashboard-side">
          <div className="info-card static">
            <small>APPLICANT ACTIVITY</small>
            <b>Latest applicants</b>
            {recentActivity.length ? (
              <ul className="activity-list">
                {recentActivity.map((a) => {
                  const job = myJobs.find((j) => j.id === a.jobId);
                  return (
                    <li key={a.id}>
                      <span>
                        {a.name} applied to <b>{job?.title}</b>
                      </span>
                      <StatusBadge status={a.status} />
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="muted">No applicant activity yet.</p>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
