import React from "react";
import { Link } from "react-router-dom";

/** Reusable job card used across Jobs listing, Saved Jobs, Recommendations, Home. */
export default function JobCard({ job, saved, onToggleSave }) {
  const ctcLabel =
    job.ctcMin != null && job.ctcMax != null
      ? job.ctcMin === job.ctcMax
        ? `₹${job.ctcMin} LPA`
        : `₹${job.ctcMin}–${job.ctcMax} LPA`
      : job.ctc
      ? `₹${job.ctc} LPA`
      : "";

  return (
    <article className="job-card">
      <div className="company-logo">{job.company.slice(0, 2).toUpperCase()}</div>
      <div className="job-main">
        <div className="job-top">
          <div>
            <Link to={"/jobs/" + job.id}>
              <h3>{job.title}</h3>
            </Link>
            <p>
              {job.company} · {job.location}
            </p>
          </div>
          {onToggleSave && (
            <button
              type="button"
              className={"save " + (saved ? "saved" : "")}
              onClick={() => onToggleSave(job.id)}
              aria-label={saved ? "Unsave job" : "Save job"}
              title={saved ? "Unsave job" : "Save job"}
            >
              {saved ? "★" : "☆"}
            </button>
          )}
        </div>
        <div className="chips">
          <span>{job.type}</span>
          {ctcLabel && <span>{ctcLabel}</span>}
          <span>{job.experience}</span>
          {(job.skills || []).slice(0, 3).map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
        <div className="job-card-foot">
          <small className="muted">{new Date(job.postedDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</small>
          {job.status === "closed" && <span className="status closed">Closed</span>}
        </div>
      </div>
    </article>
  );
}
