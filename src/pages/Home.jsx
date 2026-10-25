import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import JobCard from "../components/JobCard.jsx";
import { useData } from "../context/DataContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Home() {
  const { jobs, isSaved, toggleSave } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const openJobs = useMemo(() => jobs.filter((j) => j.status !== "closed"), [jobs]);
  const companyCount = useMemo(() => new Set(jobs.map((j) => j.company)).size, [jobs]);

  const submit = (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/register");
      return;
    }
    navigate(search ? `/jobs?q=${encodeURIComponent(search)}` : "/jobs");
  };

  return (
    <main>
      <section className="hero">
        <div className="hero-bg">
          <img src="/images/hero-network.png" alt="Global network of connected professionals" />
        </div>
        <div className="hero-copy">
          <div className="eyebrow">JOBORBIT PLACEMENT PORTAL</div>
          <h1>
            Find the role that
            <br />
            moves your career forward.
          </h1>
          <p>Search open positions, track every application and manage your placement journey in one place.</p>
          <form className="searchbar hero-search" onSubmit={submit}>
            <span>⌕</span>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search role, skill or company" />
            <button type="submit">Search</button>
          </form>
          <div className="quick-tags">
            {["React", "Java", "Python", "Remote"].map((tag) => (
              <Link key={tag} to={`/jobs?q=${encodeURIComponent(tag)}`}>
                {tag}
              </Link>
            ))}
          </div>
          {!user && (
            <div className="hero-register-cta">
              <p className="tiny">New here? Create an account to get started:</p>
              <div className="hero-register-links">
                <Link to="/register?role=applicant" className="secondary">
                  🎓 Register as Applicant
                </Link>
                <Link to="/register?role=recruiter" className="secondary">
                  💼 Register as Recruiter
                </Link>
              </div>
            </div>
          )}
        </div>
        <div className="hero-art">
          <div className="float-card card-a">
            <b>{openJobs.length}+</b>
            <small>Active openings</small>
          </div>
          <div className="float-card card-b">
            <span>✓</span>
            <div>
              <b>Application</b>
              <small>Interview stage</small>
            </div>
          </div>
          <div className="float-card card-c">
            <b>{companyCount}+</b>
            <small>Hiring companies</small>
          </div>
        </div>
      </section>

      <section className="stats">
        <div>
          <b>{openJobs.length}+</b>
          <span>Open positions</span>
        </div>
        <div>
          <b>{companyCount}+</b>
          <span>Hiring companies</span>
        </div>
        <div>
          <b>8.7k</b>
          <span>Applicants placed</span>
        </div>
        <div>
          <b>96%</b>
          <span>Profile visibility</span>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <div className="eyebrow">EXPLORE</div>
            <h2>Opportunities worth your attention</h2>
          </div>
          <Link to={user ? "/jobs" : "/register"} className="text-link">
            View all jobs →
          </Link>
        </div>
        <div className="job-grid">
          {openJobs.slice(0, 3).map((j) => (
            <JobCard key={j.id} job={j} saved={isSaved(j.id)} onToggleSave={user?.role === "applicant" ? toggleSave : undefined} />
          ))}
        </div>
      </section>

      <section className="how">
        <div>
          <div className="eyebrow">HOW IT WORKS</div>
          <h2>
            Your next opportunity is
            <br />
            three steps away.
          </h2>
        </div>
        <div className="steps">
          <Step n="01" title="Build your profile" text="Showcase your skills, education and resume." />
          <Step n="02" title="Discover & apply" text="Filter the right roles and apply in one click." />
          <Step n="03" title="Track your journey" text="Follow every application from applied to offer." />
        </div>
      </section>
    </main>
  );
}

function Step({ n, title, text }) {
  return (
    <div className="step">
      <span>{n}</span>
      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </div>
  );
}
