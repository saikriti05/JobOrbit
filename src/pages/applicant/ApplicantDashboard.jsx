import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import StatCard from "../../components/StatCard.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import ProfileCompletion from "../../components/ProfileCompletion.jsx";
import JobCard from "../../components/JobCard.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useData } from "../../context/DataContext.jsx";
import { calculateProfileCompletion } from "../../utils/validation.js";
import { recommendJobs } from "../../utils/filterJobs.js";

export default function ApplicantDashboard() {
  const { user } = useAuth();
  const { applications, jobs, profile, alert, isSaved, toggleSave } = useData();

  const myApplications = useMemo(
    () => applications.filter((a) => a.applicantId === user.id).sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate)),
    [applications, user.id]
  );

  const counts = useMemo(
    () => ({
      total: myApplications.length,
      shortlisted: myApplications.filter((a) => a.status === "Shortlisted").length,
      interview: myApplications.filter((a) => a.status === "Interview").length,
      offer: myApplications.filter((a) => a.status === "Offer").length,
    }),
    [myApplications]
  );

  const completion = profile ? calculateProfileCompletion(profile) : 0;

  const appliedJobIds = myApplications.map((a) => a.jobId);
  const recommended = useMemo(
    () =>
      recommendJobs(
        jobs,
        { skills: profile?.skills || [], preferredRole: alert?.preferredRole, preferredLocation: alert?.preferredLocation, preferredSkills: alert?.preferredSkills || [] },
        appliedJobIds
      ).slice(0, 3),
    [jobs, profile, alert, appliedJobIds]
  );

  return (
    <main className="page">
      <div className="dashboard-head">
        <div>
          <div className="eyebrow">APPLICANT DASHBOARD</div>
          <h1>Welcome back, {user.name.split(" ")[0]}.</h1>
          <p>Here's where your placement journey stands today.</p>
        </div>
        <Link to="/jobs" className="primary">
          + Find jobs
        </Link>
      </div>

      <div className="stat-grid">
        <StatCard label="Total applications" value={counts.total} />
        <StatCard label="Shortlisted" value={counts.shortlisted} accent="blue" />
        <StatCard label="Interviews" value={counts.interview} accent="amber" />
        <StatCard label="Offers" value={counts.offer} accent="green" />
      </div>

      <div className="dashboard-grid">
        <section className="table-card">
          <div className="table-title">
            <h2>Recent applications</h2>
            <Link to="/applicant/applications" className="text-link">
              View all →
            </Link>
          </div>
          {myApplications.length ? (
            <div className="app-table">
              {myApplications.slice(0, 5).map((a) => {
                const job = jobs.find((j) => j.id === a.jobId);
                return (
                  <div className="app-row" key={a.id}>
                    <div className="company-logo">{(job?.company || a.company || "?").slice(0, 2).toUpperCase()}</div>
                    <div>
                      <b>{job?.title || "Job removed"}</b>
                      <span>{job?.company}</span>
                    </div>
                    <span>{new Date(a.appliedDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
                    <StatusBadge status={a.status} />
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState title="No applications yet" text="Start applying to see your progress here." actionTo="/jobs" actionLabel="Browse jobs" />
          )}
        </section>

        <aside className="dashboard-side">
          {profile && <ProfileCompletion percent={completion} />}
          <div className="info-card static">
            <small>JOB ALERTS</small>
            <b>{alert?.preferredRole || "No preferred role set"}</b>
            <p className="muted">
              {alert?.preferredLocation ? `${alert.preferredLocation} · ` : ""}
              {(alert?.preferredSkills || []).join(", ") || "Set your preferences to get better matches."}
            </p>
            <Link className="text-link" to="/applicant/profile">
              Update alerts →
            </Link>
          </div>
        </aside>
      </div>

      <section className="section-head" style={{ marginTop: 40 }}>
        <div>
          <div className="eyebrow">FOR YOU</div>
          <h2>Recommended jobs</h2>
        </div>
        <Link to="/jobs" className="text-link">
          View all jobs →
        </Link>
      </section>
      {recommended.length ? (
        <div className="job-grid">
          {recommended.map((j) => (
            <JobCard key={j.id} job={j} saved={isSaved(j.id)} onToggleSave={toggleSave} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No recommendations yet"
          text="Add skills to your profile or set job alert preferences to get matched with relevant roles."
          actionTo="/applicant/profile"
          actionLabel="Update profile"
        />
      )}
    </main>
  );
}
