import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { validateFields } from "../utils/validation.js";
import PasswordInput from "../components/PasswordInput.jsx";

const ROLES = [
  {
    id: "applicant",
    title: "Applicant",
    blurb: "Browse jobs, apply and track your placement journey.",
    icon: "🎓",
  },
  {
    id: "recruiter",
    title: "Recruiter",
    blurb: "Post openings and manage applicants for your company.",
    icon: "💼",
  },
];

export default function Register() {
  const { user, registerApplicant, registerRecruiter } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialRole = searchParams.get("role") === "recruiter" ? "recruiter" : "applicant";
  const [role, setRole] = useState(initialRole);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", companyName: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  if (user) {
    navigate("/home", { replace: true });
    return null;
  }

  const selectRole = (id) => {
    if (id === role) return;
    setRole(id);
    setFormError("");
    setErrors({});
  };

  const submit = (e) => {
    e.preventDefault();
    const rules = {
      name: { required: true, label: "Full name" },
      email: { required: true, email: true, label: "Email" },
      password: { required: true, label: "Password" },
      confirmPassword: {
        required: true,
        label: "Confirm password",
        custom: (v) => (v !== form.password ? "Passwords do not match." : null),
      },
    };
    if (role === "recruiter") {
      rules.companyName = { required: true, label: "Company name" };
    }

    const { valid, errors: nextErrors } = validateFields(form, rules);
    setErrors(nextErrors);
    setFormError("");
    if (!valid) return;

    if (form.password.length < 6) {
      setErrors((e) => ({ ...e, password: "Password must be at least 6 characters." }));
      return;
    }

    const result =
      role === "recruiter"
        ? registerRecruiter({
            name: form.name.trim(),
            email: form.email.trim(),
            password: form.password,
            companyName: form.companyName.trim(),
          })
        : registerApplicant({ name: form.name.trim(), email: form.email.trim(), password: form.password });

    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    navigate("/home", { replace: true });
  };

  return (
    <main className="page auth-page auth-bg">
      <div className="auth-card auth-card-wide auth-card-glass">
        <div className="eyebrow">GET STARTED</div>
        <h1>Create your JobOrbit account</h1>
        <p className="muted">Choose your account type to get started.</p>

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
            Full name
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
            {errors.name && <small className="field-error">{errors.name}</small>}
          </label>

          {role === "recruiter" && (
            <label>
              Company name
              <input
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                placeholder="Your company"
              />
              {errors.companyName && <small className="field-error">{errors.companyName}</small>}
            </label>
          )}

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
              placeholder="At least 6 characters"
            />
            {errors.password && <small className="field-error">{errors.password}</small>}
          </label>

          <label>
            Confirm password
            <PasswordInput
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              placeholder="Re-enter password"
            />
            {errors.confirmPassword && <small className="field-error">{errors.confirmPassword}</small>}
          </label>

          <button className="primary full" type="submit">
            Create {role === "recruiter" ? "recruiter" : "applicant"} account
          </button>
        </form>

        <p className="tiny center">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </main>
  );
}
