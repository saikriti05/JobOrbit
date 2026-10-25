import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NotFound from "../NotFound.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useData } from "../../context/DataContext.jsx";
import { validateFields, isRequired } from "../../utils/validation.js";

const JOB_TYPES = ["Full-time", "Part-time", "Internship", "Contract"];
const EXPERIENCE_LEVELS = ["Fresher", "0-1 years", "0-2 years", "1-3 years", "3-5 years", "5+ years"];

function toDateInputValue(iso) {
  if (!iso) return "";
  return new Date(iso).toISOString().slice(0, 10);
}

function emptyForm(user) {
  return {
    title: "",
    company: user.companyName || "",
    location: "",
    type: "Full-time",
    experience: "Fresher",
    minSalary: "",
    maxSalary: "",
    skills: "",
    description: "",
    responsibilities: "",
    requirements: "",
    eligibility: "",
    deadline: "",
  };
}

export default function RecruiterJobForm() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { jobs, companies, createJob, editJob } = useData();

  const isEdit = Boolean(jobId);
  const existingJob = isEdit ? jobs.find((j) => j.id === jobId) : null;

  if (isEdit && !existingJob) return <NotFound />;
  if (isEdit && existingJob.recruiterId !== user.id) return <NotFound />;

  const company = useMemo(() => companies.find((c) => c.id === user.companyId), [companies, user.companyId]);

  const [form, setForm] = useState(() =>
    existingJob
      ? {
          title: existingJob.title,
          company: existingJob.company,
          location: existingJob.location,
          type: existingJob.type,
          experience: existingJob.experience,
          minSalary: String(existingJob.ctcMin ?? ""),
          maxSalary: String(existingJob.ctcMax ?? ""),
          skills: (existingJob.skills || []).join(", "),
          description: existingJob.description || "",
          responsibilities: (existingJob.responsibilities || []).join("\n"),
          requirements: (existingJob.requirements || []).join("\n"),
          eligibility: existingJob.eligibility || "",
          deadline: toDateInputValue(existingJob.deadline),
        }
      : { ...emptyForm(user), company: company?.name || user.name + "'s company" }
  );
  const [errors, setErrors] = useState({});

  const submit = (e) => {
    e.preventDefault();

    const { valid, errors: nextErrors } = validateFields(form, {
      title: { required: true, label: "Job title" },
      company: { required: true, label: "Company" },
      location: { required: true, label: "Location" },
      description: { required: true, label: "Description" },
      eligibility: { required: true, label: "Eligibility" },
      deadline: { required: true, label: "Application deadline" },
      minSalary: {
        required: true,
        label: "Minimum salary",
        custom: (v) => (isNaN(Number(v)) ? "Enter a valid number." : null),
      },
      maxSalary: {
        required: true,
        label: "Maximum salary",
        custom: (v) => (isNaN(Number(v)) ? "Enter a valid number." : null),
      },
      skills: { required: true, label: "Skills" },
    });

    if (isRequired(form.minSalary) && isRequired(form.maxSalary) && !isNaN(Number(form.minSalary)) && !isNaN(Number(form.maxSalary))) {
      if (Number(form.minSalary) > Number(form.maxSalary)) {
        nextErrors.maxSalary = "Maximum salary cannot be less than minimum salary.";
      }
    }

    setErrors(nextErrors);
    if (!valid || Object.keys(nextErrors).length) return;

    const payload = {
      title: form.title.trim(),
      company: form.company.trim(),
      location: form.location.trim(),
      type: form.type,
      experience: form.experience,
      ctcMin: Number(form.minSalary),
      ctcMax: Number(form.maxSalary),
      skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      description: form.description.trim(),
      responsibilities: form.responsibilities.split("\n").map((s) => s.trim()).filter(Boolean),
      requirements: form.requirements.split("\n").map((s) => s.trim()).filter(Boolean),
      eligibility: form.eligibility.trim(),
      deadline: new Date(form.deadline).toISOString(),
    };

    if (isEdit) {
      editJob(jobId, payload);
      navigate("/recruiter/jobs");
    } else {
      const created = createJob({
        id: "j" + Date.now(),
        recruiterId: user.id,
        companyId: user.companyId || null,
        postedDate: new Date().toISOString(),
        status: "open",
        ...payload,
      });
      navigate(`/jobs/${created.id}`);
    }
  };

  return (
    <main className="page">
      <div className="page-title">
        <div className="eyebrow">RECRUITER CONSOLE</div>
        <h1>{isEdit ? "Edit job" : "Post a job"}</h1>
        <p>{isEdit ? "Update the details candidates will see." : "Fill in the details for your new opening."}</p>
      </div>

      <form className="auth-form job-form" onSubmit={submit} noValidate>
        <div className="form-row">
          <label>
            Job title
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Frontend Developer" />
            {errors.title && <small className="field-error">{errors.title}</small>}
          </label>
          <label>
            Company
            <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            {errors.company && <small className="field-error">{errors.company}</small>}
          </label>
        </div>

        <div className="form-row">
          <label>
            Location
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Bengaluru / Remote" />
            {errors.location && <small className="field-error">{errors.location}</small>}
          </label>
          <label>
            Job type
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {JOB_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="form-row">
          <label>
            Experience
            <select value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })}>
              {EXPERIENCE_LEVELS.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label>
            Application deadline
            <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
            {errors.deadline && <small className="field-error">{errors.deadline}</small>}
          </label>
        </div>

        <div className="form-row">
          <label>
            Minimum salary (LPA)
            <input value={form.minSalary} onChange={(e) => setForm({ ...form, minSalary: e.target.value })} placeholder="6" />
            {errors.minSalary && <small className="field-error">{errors.minSalary}</small>}
          </label>
          <label>
            Maximum salary (LPA)
            <input value={form.maxSalary} onChange={(e) => setForm({ ...form, maxSalary: e.target.value })} placeholder="10" />
            {errors.maxSalary && <small className="field-error">{errors.maxSalary}</small>}
          </label>
        </div>

        <label>
          Skills (comma separated)
          <input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder="React, JavaScript, CSS" />
          {errors.skills && <small className="field-error">{errors.skills}</small>}
        </label>

        <label>
          Description
          <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          {errors.description && <small className="field-error">{errors.description}</small>}
        </label>

        <label>
          Responsibilities (one per line)
          <textarea rows={4} value={form.responsibilities} onChange={(e) => setForm({ ...form, responsibilities: e.target.value })} />
        </label>

        <label>
          Requirements (one per line)
          <textarea rows={4} value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} />
        </label>

        <label>
          Eligibility
          <textarea rows={2} value={form.eligibility} onChange={(e) => setForm({ ...form, eligibility: e.target.value })} />
          {errors.eligibility && <small className="field-error">{errors.eligibility}</small>}
        </label>

        <button className="primary full" type="submit">
          {isEdit ? "Save changes" : "Publish job"}
        </button>
      </form>
    </main>
  );
}
