import React, { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Modal from "../components/Modal.jsx";
import NotFound from "./NotFound.jsx";
import { useData } from "../context/DataContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { validateFields, validateResumeFile, formatFileSize } from "../utils/validation.js";

function ctcLabel(job) {
  if (job.ctcMin != null && job.ctcMax != null) {
    return job.ctcMin === job.ctcMax ? `₹${job.ctcMin} LPA` : `₹${job.ctcMin}–${job.ctcMax} LPA`;
  }
  return job.ctc ? `₹${job.ctc} LPA` : "Not disclosed";
}

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function JobDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { jobs, companies, applications, isSaved, toggleSave, hasApplied, createApplication } = useData();
  const { user } = useAuth();

  const job = jobs.find((j) => j.id === jobId);
  const company = useMemo(() => companies.find((c) => c.id === job?.companyId), [companies, job]);

  const [showApply, setShowApply] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  if (!job) return <NotFound />;

  const isClosed = job.status === "closed";
  const alreadyApplied = user?.role === "applicant" && hasApplied(job.id, user.id);
  const existingApplication = applications.find((a) => a.jobId === job.id && a.applicantId === user?.id);
  const saved = user?.role === "applicant" ? isSaved(job.id) : false;

  const handleApplyClick = () => {
    if (!user) {
      navigate("/login", { state: { from: `/jobs/${job.id}` } });
      return;
    }
    if (user.role !== "applicant") return;
    setShowApply(true);
  };

  return (
    <main className="page">
      <Link to="/jobs" className="back">
        ← Back to jobs
      </Link>

      <div className="detail">
        <div className="detail-main">
          <div className="detail-company">
            <div className="company-logo big">{job.company.slice(0, 2).toUpperCase()}</div>
            <div>
              <div className="eyebrow">{job.company}</div>
              <h1>{job.title}</h1>
              <p>
                {job.location} · {job.type} {isClosed && <span className="status closed inline">Closed</span>}
              </p>
            </div>
          </div>

          <div className="detail-block">
            <h2>About the role</h2>
            <p>{job.description}</p>
          </div>

          {job.responsibilities?.length > 0 && (
            <div className="detail-block">
              <h2>Responsibilities</h2>
              <ul className="detail-list">
                {job.responsibilities.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}

          {job.requirements?.length > 0 && (
            <div className="detail-block">
              <h2>Requirements</h2>
              <ul className="detail-list">
                {job.requirements.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="detail-block">
            <h2>Eligibility</h2>
            <p>{job.eligibility}</p>
          </div>

          <div className="detail-block">
            <h2>Skills</h2>
            <div className="chips">
              {(job.skills || []).map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
          </div>

          {company && (
            <div className="detail-block">
              <h2>About {company.name}</h2>
              <p>{company.about}</p>
              <div className="chips">
                <span>{company.industry}</span>
                <span>{company.location}</span>
              </div>
            </div>
          )}
        </div>

        <aside className="apply-card">
          <div>
            <small>COMPENSATION</small>
            <h2>{ctcLabel(job)}</h2>
          </div>
          <div className="mini-row">
            <span>Experience</span>
            <b>{job.experience}</b>
          </div>
          <div className="mini-row">
            <span>Job type</span>
            <b>{job.type}</b>
          </div>
          <div className="mini-row">
            <span>Posted</span>
            <b>{formatDate(job.postedDate)}</b>
          </div>
          <div className="mini-row">
            <span>Apply by</span>
            <b>{formatDate(job.deadline)}</b>
          </div>

          {isClosed ? (
            <button className="secondary full" disabled>
              Applications closed
            </button>
          ) : alreadyApplied ? (
            <button className="primary full" disabled>
              ✓ Applied · {existingApplication?.status}
            </button>
          ) : (
            <button className="primary full" onClick={handleApplyClick}>
              Apply now
            </button>
          )}

          {user?.role !== "recruiter" && (
            <button
              className="secondary full"
              onClick={() => {
                if (!user) {
                  navigate("/login", { state: { from: `/jobs/${job.id}` } });
                  return;
                }
                toggleSave(job.id);
              }}
            >
              {saved ? "★ Saved" : "☆ Save job"}
            </button>
          )}

          {successMsg && <div className="success">{successMsg}</div>}
          <p className="tiny">Your resume and profile will be shared with the recruiter.</p>
        </aside>
      </div>

      {showApply && (
        <ApplyModal
          job={job}
          user={user}
          onClose={() => setShowApply(false)}
          onSubmitted={() => {
            setShowApply(false);
            setSuccessMsg("Application submitted successfully!");
          }}
          createApplication={createApplication}
        />
      )}
    </main>
  );
}

function ApplyModal({ job, user, onClose, onSubmitted, createApplication }) {
  const [form, setForm] = useState({ name: user.name || "", email: user.email || "", phone: "", coverMessage: "" });
  const [resumeFile, setResumeFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const { valid, errors: nextErrors } = validateFields(form, {
      name: { required: true, label: "Name" },
      email: { required: true, email: true, label: "Email" },
      phone: { required: true, phone: true, label: "Phone" },
      coverMessage: { required: true, label: "Cover message" },
    });

    const resumeError = validateResumeFile(resumeFile);
    if (resumeError) nextErrors.resume = resumeError;

    setErrors(nextErrors);
    if (!valid || resumeError) return;

    createApplication({
      id: "a" + Date.now(),
      jobId: job.id,
      applicantId: user.id,
      recruiterId: job.recruiterId,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      appliedDate: new Date().toISOString(),
      status: "Applied",
      resumeName: resumeFile.name,
      resumeSize: resumeFile.size,
      coverMessage: form.coverMessage.trim(),
    });
    onSubmitted();
  };

  return (
    <Modal title={`Apply · ${job.title}`} onClose={onClose}>
      {formError && <div className="form-error">{formError}</div>}
      <form className="auth-form" onSubmit={submit} noValidate>
        <label>
          Full name
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          {errors.name && <small className="field-error">{errors.name}</small>}
        </label>
        <label>
          Email
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          {errors.email && <small className="field-error">{errors.email}</small>}
        </label>
        <label>
          Phone
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="10-digit number" />
          {errors.phone && <small className="field-error">{errors.phone}</small>}
        </label>
        <label>
          Resume (.pdf, .doc, .docx — max 2MB)
          <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files?.[0] || null)} />
          {resumeFile && !errors.resume && (
            <small className="field-hint">
              {resumeFile.name} · {formatFileSize(resumeFile.size)}
            </small>
          )}
          {errors.resume && <small className="field-error">{errors.resume}</small>}
        </label>
        <label>
          Cover message
          <textarea
            rows={4}
            value={form.coverMessage}
            onChange={(e) => setForm({ ...form, coverMessage: e.target.value })}
            placeholder="Tell the recruiter why you're a great fit."
          />
          {errors.coverMessage && <small className="field-error">{errors.coverMessage}</small>}
        </label>
        <button className="primary full" type="submit">
          Submit application
        </button>
      </form>
    </Modal>
  );
}
