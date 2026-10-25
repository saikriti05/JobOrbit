import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  const handleLogout = () => {
    logout();
    close();
    navigate("/");
  };

  const publicLinks = [{ to: "/companies", label: "Companies" }];
  const guestOnlyLinks = [{ to: "/about", label: "About" }];

  const applicantLinks = [
    { to: "/jobs", label: "Find jobs" },
    { to: "/applicant/dashboard", label: "Dashboard" },
    { to: "/applicant/applications", label: "Applications" },
    { to: "/applicant/saved-jobs", label: "Saved jobs" },
    { to: "/applicant/profile", label: "Profile" },
  ];

  const recruiterLinks = [
    { to: "/recruiter/dashboard", label: "Dashboard" },
    { to: "/recruiter/jobs", label: "My jobs" },
    { to: "/recruiter/applications", label: "Applications" },
    { to: "/recruiter/profile", label: "Profile" },
  ];

  const roleLinks = user ? (user.role === "applicant" ? applicantLinks : recruiterLinks) : guestOnlyLinks;
  const topLinks = user && user.role === "recruiter" ? [] : publicLinks;

  return (
    <header className="topbar">
      <Link to={user ? "/home" : "/"} className="brand" onClick={close}>
        <span className="brand-mark">JO</span>
        JobOrbit
      </Link>

      <nav className={open ? "nav-open" : ""}>
        {topLinks.map((l) => (
          <NavLink key={l.to} to={l.to} onClick={close} className={({ isActive }) => (isActive ? "active" : "")}>
            {l.label}
          </NavLink>
        ))}
        {roleLinks.map((l) => (
          <NavLink key={l.to} to={l.to} onClick={close} className={({ isActive }) => (isActive ? "active" : "")}>
            {l.label}
          </NavLink>
        ))}

        <div className="nav-mobile-actions">
          {user ? (
            <>
              <span className="nav-user-chip">{user.name}</span>
              <button type="button" className="primary full" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="primary full" onClick={close}>
                Log in
              </Link>
              <Link to="/register" className="primary full" onClick={close}>
                Register
              </Link>
            </>
          )}
        </div>
      </nav>

      <div className="top-actions">
        {user ? (
          <div className="user-menu">
            <span className="profile-avatar mini">{initials(user.name)}</span>
            <span className="nav-user-name">{user.name}</span>
            <button type="button" className="primary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" className="primary">
              Log in
            </Link>
            <Link to="/register" className="primary">
              Register
            </Link>
          </>
        )}
      </div>

      <button
        type="button"
        className={"nav-toggle" + (open ? " is-open" : "")}
        aria-label="Toggle navigation menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </header>
  );
}

function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
}
