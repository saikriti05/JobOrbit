import React from "react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <main>
      {/* ---------- Intro: who JobOrbit is ---------- */}
      <section className="page about-intro">
        <div className="about-visual">
          <img src="/images/about-team.jpg" alt="JobOrbit team collaborating in a meeting" className="about-photo" />
          <div className="float-card about-float-card">
            <b>2024</b>
            <small>Platform launched</small>
          </div>
        </div>

        <div>
          <div className="eyebrow">ABOUT JOBORBIT</div>
          <h2 className="about-heading">JobOrbit: Bridging Talent and Opportunities</h2>
          <p className="about-copy">
            JobOrbit is a placement portal dedicated to connecting talented applicants with rewarding career
            opportunities. With a clear view of the hiring process on both sides, JobOrbit bridges the gap
            between job seekers and recruiters, making successful placements simple for everyone involved.
          </p>
          <ul className="about-checklist">
            <li>
              <span className="check">✓</span>Find your dream job with JobOrbit
            </li>
            <li>
              <span className="check">✓</span>Connecting you to exciting job opportunities
            </li>
            <li>
              <span className="check">✓</span>Simple tools for recruiters to hire faster
            </li>
          </ul>
        </div>
      </section>

      {/* ---------- For recruiters: find candidates in 3 steps ---------- */}
      <section className="how about-recruit">
        <div>
          <div className="eyebrow">FOR RECRUITERS</div>
          <h2>
            Find candidates
            <br />
            with 3 easy steps
          </h2>
          <p className="about-copy">
            By following these three simple steps, you can efficiently discover candidates who perfectly
            suit your needs and requirements.
          </p>
          <div className="steps">
            <Step n="01" title="Register an account to start" />
            <Step n="02" title="Explore thousands of applicant profiles" />
            <Step n="03" title="Find the most suitable candidate" />
          </div>
        </div>

        <div className="about-collage">
          <div className="about-collage-badge">
            <span className="badge-count">10k+ Candidates</span>
            <div className="about-avatar-stack">
              <span className="avatar">JD</span>
              <span className="avatar">AK</span>
              <span className="avatar">MS</span>
              <span className="avatar">+</span>
            </div>
          </div>
          <div className="about-collage-panel">
            <span className="about-collage-icon">✉</span>
            <div>
              <b>Work inquiry</b>
              <small>Recruiters can reach candidates directly through JobOrbit.</small>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Get started CTA ---------- */}
      <section className="section about-cta">
        <div className="steps">
          <Link to="/register?role=applicant" className="primary full">
            Create an applicant account
          </Link>
          <Link to="/register?role=recruiter" className="primary full">
            Create a recruiter account
          </Link>
        </div>
      </section>
    </main>
  );
}

function Step({ n, title }) {
  return (
    <div className="step">
      <span>{n}</span>
      <div>
        <h3>{title}</h3>
      </div>
    </div>
  );
}
