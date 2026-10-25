import React, { useMemo } from "react";
import { useData } from "../context/DataContext.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function Companies() {
  const { companies, jobs } = useData();

  const openCountByCompany = useMemo(() => {
    const map = {};
    jobs.forEach((j) => {
      if (j.status !== "closed") map[j.companyId] = (map[j.companyId] || 0) + 1;
    });
    return map;
  }, [jobs]);

  return (
    <main className="page">
      <div className="page-title">
        <div className="eyebrow">HIRING PARTNERS</div>
        <h1>Companies on JobOrbit</h1>
        <p>Explore the companies actively hiring through the platform.</p>
      </div>

      {companies.length ? (
        <div className="company-grid">
          {companies.map((c) => (
            <div className="company-card" key={c.id}>
              <div className="company-logo big">{c.name.slice(0, 2).toUpperCase()}</div>
              <h3>{c.name}</h3>
              <p className="muted">{c.industry}</p>
              <p>{c.about}</p>
              <div className="chips">
                <span>{c.location}</span>
                <span>{openCountByCompany[c.id] || 0} open roles</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="No companies yet" text="Check back soon." />
      )}
    </main>
  );
}
