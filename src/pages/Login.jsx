import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { isEmail, isRequired } from "../utils/validation.js";
import PasswordInput from "../components/PasswordInput.jsx";

const ROLES = [
  {
    id: "applicant",
    title: "Applicant",
    blurb: "Browse jobs, track applications and manage your profile.",
    icon: "🎓",
    demoEmail: "applicant@example.com",
    demoPassword: "applicant123",
    home: "/applicant/dashboard",
  },
  {
    id: "recruiter",
    title: "Recruiter",
    blurb: "Post openings, review applicants and manage your listings.",
    icon: "💼",
    demoEmail: "recruiter@example.com",
    demoPassword: "recruiter123",
    home: "/recruiter/dashboard",
  },
];

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [role, setRole] = useState("applicant");
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  if (user) {
    navigate("/home", { replace: true });
    return null;
  }

  const activeRole = ROLES.find((r) => r.id === role);

  const selectRole = (id) => {
    if (id === role) return;
    setRole(id);
    setFormError("");
    setErrors({});
  };

  const submit = (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!isRequired(form.email) || !isEmail(form.email)) nextErrors.email = "Enter a valid email address.";
    if (!isRequired(form.password)) nextErrors.password = "Password is required.";
    setErrors(nextErrors);
    setFormError("");
    if (Object.keys(nextErrors).length) return;

    const result = login(form.email.trim(), form.password, role);
    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    // After logging in, land on the site's landing page — not straight into
    // a dashboard — unless the person was bounced here from a protected page.
    const from = location.state?.from;
    navigate(from || "/home", { replace: true });
  };

  const fillDemo = () => {
    setForm({ email: activeRole.demoEmail, password: activeRole.demoPassword });
    setFormError("");
    setErrors({});
  };

  return (
    <main className="page auth-page auth-bg">
      <div className="auth-card auth-card-wide auth-card-glass">
        <div className="eyebrow">WELCOME BACK</div>
        <h1>Log in to JobOrbit</h1>
        <p className="muted">Choose your account type, then continue your placement journey.</p>

        <div className="role-select" role="tablist" aria-label="Choose account type">
          {ROLES.map((r) => (
            <button
              key={r.id}
              type="button"
              role="tab"
              aria-selected={role === r.id}
              className={"role-card" + (role === r.id ? " active" : "")}
              onClick={() => selectRole(r.id)}
            >
              <span className="role-card-icon" aria-hidden="true">{r.icon}</span>
              <span className="role-card-title">{r.title}</span>
              <span className="role-card-blurb">{r.blurb}</span>
            </button>
          ))}
        </div>

        {formError && <div className="form-error">{formError}</div>}

        <form className="auth-form" onSubmit={submit} noValidate>
          <label>
            Email address
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
            />
            {errors.email && <small className="field-error">{errors.email}</small>}
          </label>
          <label>
            Password
            <PasswordInput
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
            />
            {errors.password && <small className="field-error">{errors.password}</small>}
          </label>
          <button className="primary full" type="submit">
            Log in as {activeRole.title}
          </button>
        </form>

        <div className="demo-accounts">
          <small>Demo account</small>
          <div className="demo-buttons">
            <button type="button" onClick={fillDemo}>
              Fill {activeRole.title.toLowerCase()} demo credentials
            </button>
          </div>
        </div>

        <p className="tiny center">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </main>
  );
}
