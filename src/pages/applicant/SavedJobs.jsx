import React, { useMemo } from "react";
import JobCard from "../../components/JobCard.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import { useData } from "../../context/DataContext.jsx";

export default function SavedJobs() {
  const { jobs, savedJobIds, toggleSave } = useData();

  const saved = useMemo(() => jobs.filter((j) => savedJobIds.includes(j.id)), [jobs, savedJobIds]);

  return (
    <main className="page">
      <div className="page-title">
        <div className="eyebrow">YOUR SHORTLIST</div>
        <h1>Saved jobs</h1>
        <p>Keep interesting roles here while you compare them.</p>
      </div>
      {saved.length ? (
        <div className="job-list">
          {saved.map((j) => (
            <JobCard key={j.id} job={j} saved onToggleSave={toggleSave} />
          ))}
        </div>
      ) : (
        <EmptyState title="No saved jobs yet" text="Save jobs from the job board and they will appear here." actionTo="/jobs" actionLabel="Browse jobs" />
      )}
    </main>
  );
}
