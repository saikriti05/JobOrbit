import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useData } from "../../context/DataContext.jsx";
import ProfileCompletion from "../../components/ProfileCompletion.jsx";
import { calculateProfileCompletion, validateFields, validateResumeFile, formatFileSize } from "../../utils/validation.js";

export default function ApplicantProfile() {
  const { user } = useAuth();
  const { profile, updateProfile, alert, updateAlert } = useData();

  return (
    <main className="page">
      <div className="profile-head">
        <div className="profile-avatar">{initials(user.name)}</div>
        <div>
          <div className="eyebrow">APPLICANT PROFILE</div>
          <h1>{user.name}</h1>
          <p>{user.email}</p>
        </div>
      </div>

      {profile && <ProfileCompletion percent={calculateProfileCompletion(profile)} />}

      <div className="profile-edit-grid">
        <ProfileForm profile={profile} onSave={updateProfile} />
        <JobAlertsForm alert={alert} onSave={updateAlert} />
      </div>
    </main>
  );
}

function initials(name = "") {
  return name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join("");
}

function ProfileForm({ profile, onSave }) {
  const [form, setForm] = useState(() => ({
    phone: profile?.phone || "",
    location: profile?.location || "",
    education: profile?.education || "",
    degree: profile?.degree || "",
    college: profile?.college || "",
    graduationYear: profile?.graduationYear || "",
    skills: (profile?.skills || []).join(", "),
    experience: profile?.experience || "",
    resumeName: profile?.resumeName || "",
    resumeSize: profile?.resumeSize || "",
  }));
  const [resumeFile, setResumeFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    const { valid, errors: nextErrors } = validateFields(form, {
      phone: { phone: true, label: "Phone" },
    });

    let resumeError = null;
    if (resumeFile) resumeError = validateResumeFile(resumeFile);
    if (resumeError) nextErrors.resume = resumeError;

    setErrors(nextErrors);
    if (!valid || resumeError) return;

    onSave({
      phone: form.phone.trim(),
      location: form.location.trim(),
      education: form.education.trim(),
      degree: form.degree.trim(),
      college: form.college.trim(),
      graduationYear: form.graduationYear.trim(),
      skills: form.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      experience: form.experience.trim(),
      resumeName: resumeFile ? resumeFile.name : form.resumeName,
      resumeSize: resumeFile ? resumeFile.size : form.resumeSize,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form className="auth-form profile-form" onSubmit={submit} noValidate>
      <h2>Profile details</h2>
      {saved && <div className="success">Profile updated.</div>}

      <label>
        Phone
        <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="10-digit number" />
        {errors.phone && <small className="field-error">{errors.phone}</small>}
      </label>
      <label>
        Location
        <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
      </label>
      <div className="form-row">
        <label>
          Degree
          <input value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} placeholder="B.Tech" />
        </label>
        <label>
          Graduation year
          <input value={form.graduationYear} onChange={(e) => setForm({ ...form, graduationYear: e.target.value })} placeholder="2026" />
        </label>
      </div>
      <label>
        Education
        <input value={form.education} onChange={(e) => setForm({ ...form, education: e.target.value })} placeholder="B.Tech Computer Science Engineering" />
      </label>
      <label>
        College
        <input value={form.college} onChange={(e) => setForm({ ...form, college: e.target.value })} />
      </label>
      <label>
        Experience
        <select value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })}>
          <option value="">Select experience</option>
          <option>Fresher</option>
          <option>0-1 years</option>
          <option>0-2 years</option>
          <option>1-3 years</option>
          <option>3-5 years</option>
        </select>
      </label>
      <label>
        Skills (comma separated)
        <input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="React, JavaScript, CSS" />
      </label>
      <label>
        Resume (.pdf, .doc, .docx — max 2MB)
        <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files?.[0] || null)} />
        {resumeFile ? (
          !errors.resume && (
            <small className="field-hint">
              {resumeFile.name} · {formatFileSize(resumeFile.size)}
            </small>
          )
        ) : form.resumeName ? (
          <small className="field-hint">Current: {form.resumeName}</small>
        ) : null}
        {errors.resume && <small className="field-error">{errors.resume}</small>}
      </label>

      <button className="primary full" type="submit">
        Save profile
      </button>
    </form>
  );
}

function JobAlertsForm({ alert, onSave }) {
  const [form, setForm] = useState(() => ({
    preferredRole: alert?.preferredRole || "",
    preferredLocation: alert?.preferredLocation || "",
    preferredSkills: (alert?.preferredSkills || []).join(", "),
  }));
  const [saved, setSaved] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    onSave({
      preferredRole: form.preferredRole.trim(),
      preferredLocation: form.preferredLocation.trim(),
      preferredSkills: form.preferredSkills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form className="auth-form profile-form" onSubmit={submit} noValidate>
      <h2>Job alerts &amp; preferences</h2>
      <p className="muted">Used to power your recommended jobs on the dashboard.</p>
      {saved && <div className="success">Preferences updated.</div>}

      <label>
        Preferred role
        <input value={form.preferredRole} onChange={(e) => setForm({ ...form, preferredRole: e.target.value })} placeholder="Frontend Developer" />
      </label>
      <label>
        Preferred location
        <input value={form.preferredLocation} onChange={(e) => setForm({ ...form, preferredLocation: e.target.value })} placeholder="Bengaluru" />
      </label>
      <label>
        Preferred skills (comma separated)
        <input value={form.preferredSkills} onChange={(e) => setForm({ ...form, preferredSkills: e.target.value })} placeholder="React, Node.js" />
      </label>

      <button className="primary full" type="submit">
        Save preferences
      </button>
    </form>
  );
}
