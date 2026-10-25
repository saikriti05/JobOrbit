import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <Link to="/" className="brand footer-logo">
            <span className="brand-mark">JO</span>
            JobOrbit
          </Link>
          <p className="footer-tagline">Connecting applicants with the right opportunities, one application at a time.</p>
        </div>

        <div className="footer-col">
          <h4>Explore</h4>
          <Link to="/">Home</Link>
          <Link to="/companies">Companies</Link>
          <Link to="/about">About</Link>
        </div>

        <div className="footer-col">
          <h4>For applicants</h4>
          <Link to="/register">Create an account</Link>
          <Link to="/applicant/saved-jobs">Saved jobs</Link>
          <Link to="/login">Log in</Link>
        </div>

        <div className="footer-col">
          <h4>For recruiters</h4>
          <Link to="/register">Post a job</Link>
          <Link to="/recruiter/dashboard">Recruiter dashboard</Link>
          <Link to="/recruiter/jobs">Manage listings</Link>
          <Link to="/login">Log in</Link>
        </div>

        <div className="footer-col">
          <h4>Get in touch</h4>
          <a href="mailto:support@joborbit.example">support@joborbit.example</a>
          <span className="footer-static">+91 172 400 1234</span>
          <span className="footer-static">Chandigarh, India</span>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {year} JobOrbit. All rights reserved.</span>
        <span className="footer-note">A placement portal built with React.</span>
      </div>
    </footer>
  );
}
