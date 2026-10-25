import React from "react";

/**
 * Controlled filter sidebar. All state lives in the URL (owned by the Jobs
 * page via useSearchParams) — this component just renders inputs and calls
 * back up through `onChange(key, value)`.
 */
export default function Filters({ jobs, values, onChange, onClear }) {
  const uniq = (fn) => [...new Set(jobs.map(fn).filter(Boolean))].sort();
  const locations = uniq((j) => j.location);
  const types = uniq((j) => j.type);
  const experiences = uniq((j) => j.experience);
  const companies = uniq((j) => j.company);
  const skills = uniq((j) => j.skills || []).flat ? [] : [...new Set(jobs.flatMap((j) => j.skills || []))].sort();

  return (
    <aside className="filters">
      <div className="filter-head">
        <b>Filters</b>
        <button type="button" onClick={onClear}>
          Reset
        </button>
      </div>

      <label>
        Role
        <input
          type="text"
          value={values.role || ""}
          onChange={(e) => onChange("role", e.target.value)}
          placeholder="e.g. Frontend, Data Analyst"
        />
      </label>

      <label>
        Location
        <select value={values.location} onChange={(e) => onChange("location", e.target.value)}>
          <option value="">All locations</option>
          {locations.map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>
      </label>

      <label>
        Experience
        <select value={values.experience} onChange={(e) => onChange("experience", e.target.value)}>
          <option value="">Any experience</option>
          {experiences.map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>
      </label>

      <label>
        Job type
        <select value={values.type} onChange={(e) => onChange("type", e.target.value)}>
          <option value="">All types</option>
          {types.map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>
      </label>

      <label>
        Company
        <select value={values.company} onChange={(e) => onChange("company", e.target.value)}>
          <option value="">All companies</option>
          {companies.map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>
      </label>

      <label>
        Skill
        <select value={values.skill} onChange={(e) => onChange("skill", e.target.value)}>
          <option value="">Any skill</option>
          {skills.map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>
      </label>

      <label>
        Minimum CTC
        <select value={values.minCtc} onChange={(e) => onChange("minCtc", e.target.value)}>
          <option value="">Any CTC</option>
          <option value="5">₹5 LPA+</option>
          <option value="10">₹10 LPA+</option>
          <option value="15">₹15 LPA+</option>
          <option value="20">₹20 LPA+</option>
        </select>
      </label>
    </aside>
  );
}
