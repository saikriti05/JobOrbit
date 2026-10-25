// Plain JavaScript validation helpers — no form library.

export const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());

export const isPhone = (value) => /^[0-9]{10}$/.test(String(value || "").replace(/\D/g, "").slice(-10)) && String(value || "").replace(/\D/g, "").length >= 10;

export const isUrl = (value) => /^https?:\/\/[^\s]+\.[^\s]+$/i.test(String(value || "").trim());

export const isRequired = (value) => {
  if (Array.isArray(value)) return value.length > 0;
  return value !== undefined && value !== null && String(value).trim() !== "";
};

const ALLOWED_RESUME_TYPES = [".pdf", ".doc", ".docx"];
const MAX_RESUME_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

/** Validates a File object selected for a resume upload. Returns an error string or null. */
export function validateResumeFile(file) {
  if (!file) return "Please select a resume file.";
  const name = file.name || "";
  const ext = name.slice(name.lastIndexOf(".")).toLowerCase();
  if (!ALLOWED_RESUME_TYPES.includes(ext)) {
    return `Unsupported file type. Please upload a ${ALLOWED_RESUME_TYPES.join(", ")} file.`;
  }
  if (file.size > MAX_RESUME_SIZE_BYTES) {
    return "File is too large. Maximum size is 2MB.";
  }
  return null;
}

export function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Validates a generic set of { field: value } against a rules map:
 * { field: { required: true, custom: (v) => error|null, label: "Name" } }
 * Returns { valid: boolean, errors: { field: message } }
 */
export function validateFields(values, rules) {
  const errors = {};
  Object.entries(rules).forEach(([field, rule]) => {
    const value = values[field];
    const label = rule.label || field;
    if (rule.required && !isRequired(value)) {
      errors[field] = `${label} is required.`;
      return;
    }
    if (rule.email && value && !isEmail(value)) {
      errors[field] = `Enter a valid email address.`;
      return;
    }
    if (rule.phone && value && !isPhone(value)) {
      errors[field] = `Enter a valid 10-digit phone number.`;
      return;
    }
    if (rule.url && value && !isUrl(value)) {
      errors[field] = `Enter a valid URL (starting with http:// or https://).`;
      return;
    }
    if (rule.custom) {
      const err = rule.custom(value, values);
      if (err) errors[field] = err;
    }
  });
  return { valid: Object.keys(errors).length === 0, errors };
}

export function calculateProfileCompletion(profile) {
  const fields = ["phone", "location", "education", "degree", "college", "graduationYear", "experience", "resumeName"];
  let filled = fields.filter((f) => isRequired(profile[f])).length;
  const total = fields.length + 1; // +1 for skills
  if (isRequired(profile.skills)) filled += 1;
  return Math.round((filled / total) * 100);
}

export function calculateRecruiterProfileCompletion(profile) {
  const fields = [
    "phone",
    "designation",
    "experience",
    "industry",
    "companyWebsite",
    "companyLocation",
    "companySize",
    "linkedin",
    "about",
  ];
  const filled = fields.filter((f) => isRequired(profile[f])).length;
  return Math.round((filled / fields.length) * 100);
}
