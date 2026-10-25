import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useData } from "../../context/DataContext.jsx";
import ProfileCompletion from "../../components/ProfileCompletion.jsx";
import { calculateRecruiterProfileCompletion, validateFields } from "../../utils/validation.js";

export default function RecruiterProfile() {
  const { user } = useAuth();
  const { recruiterProfile, updateRecruiterProfile } = useData();

  return (
    <main className="page">
      <div className="recruiter-profile-page">
        <div className="profile-head">
          <div className="profile-avatar">{initials(user.name)}</div>
          <div>
            <div className="eyebrow">RECRUITER PROFILE</div>
            <h1>{user.name}</h1>
            <p>{user.email}</p>
          </div>
        </div>

        {recruiterProfile && <ProfileCompletion percent={calculateRecruiterProfileCompletion(recruiterProfile)} />}

        <div className="profile-edit-grid single">
          <RecruiterProfileForm user={user} profile={recruiterProfile} onSave={updateRecruiterProfile} />
        </div>
      </div>
    </main>
  );
}

function initials(name = "") {
  return name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join("");
}

function RecruiterProfileForm({ user, profile, onSave }) {
  const [form, setForm] = useState(() => ({
    phone: profile?.phone || "",
    designation: profile?.designation || "",
    experience: profile?.experience || "",
    industry: profile?.industry || "",
    companyName: user?.companyName || "",
    companyWebsite: profile?.companyWebsite || "",
    companyLocation: profile?.companyLocation || "",
    companySize: profile?.companySize || "",
    linkedin: profile?.linkedin || "",
    about: profile?.about || "",
  }));
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    const { valid, errors: nextErrors } = validateFields(form, {
      phone: { phone: true, label: "Phone" },
      companyWebsite: { url: true, label: "Company website" },
      linkedin: { url: true, label: "LinkedIn profile" },
    });

    setErrors(nextErrors);
    if (!valid) return;

    onSave({
      phone: form.phone.trim(),
      designation: form.designation.trim(),
      experience: form.experience.trim(),
      industry: form.industry.trim(),
      companyWebsite: form.companyWebsite.trim(),
      companyLocation: form.companyLocation.trim(),
      companySize: form.companySize.trim(),
      linkedin: form.linkedin.trim(),
      about: form.about.trim(),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form className="auth-form profile-form" onSubmit={submit} noValidate>
      <h2>Recruiter &amp; company details</h2>
      {saved && <div className="success">Profile updated.</div>}

      <label>
        Phone
        <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="10-digit number" />
        {errors.phone && <small className="field-error">{errors.phone}</small>}
      </label>
      <label>
        Designation
        <input value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} placeholder="Talent Acquisition Lead" />
      </label>
      <div className="form-row">
        <label>
          Recruiting experience
          <select value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })}>
            <option value="">Select experience</option>
            <option>&lt;1 year</option>
            <option>1-3 years</option>
            <option>3-5 years</option>
            <option>5-10 years</option>
            <option>10+ years</option>
          </select>
        </label>
        <label>
          Industry
          <input value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} placeholder="IT Services, Fintech..." />
        </label>
      </div>
      <label>
        Company name
        <input value={form.companyName} disabled />
        <small className="field-hint">Set when you registered — contact support to change it.</small>
      </label>
      <div className="form-row">
        <label>
          Company website
          <input value={form.companyWebsite} onChange={(e) => setForm({ ...form, companyWebsite: e.target.value })} placeholder="https://example.com" />
          {errors.companyWebsite && <small className="field-error">{errors.companyWebsite}</small>}
        </label>
        <label>
          Company location
          <input value={form.companyLocation} onChange={(e) => setForm({ ...form, companyLocation: e.target.value })} placeholder="Bengaluru" />
        </label>
      </div>
      <div className="form-row">
        <label>
          Company size
          <select value={form.companySize} onChange={(e) => setForm({ ...form, companySize: e.target.value })}>
            <option value="">Select company size</option>
            <option>1-10 employees</option>
            <option>11-50 employees</option>
            <option>51-200 employees</option>
            <option>201-500 employees</option>
            <option>501-1000 employees</option>
            <option>1000+ employees</option>
          </select>
        </label>
        <label>
          LinkedIn profile
          <input value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} placeholder="https://linkedin.com/in/yourname" />
          {errors.linkedin && <small className="field-error">{errors.linkedin}</small>}
        </label>
      </div>
      <label>
        About the company
        <textarea
          rows={4}
          value={form.about}
          onChange={(e) => setForm({ ...form, about: e.target.value })}
          placeholder="A short description hiring candidates will see."
        />
      </label>

      <button className="primary full" type="submit">
        Save profile
      </button>
    </form>
  );
}
