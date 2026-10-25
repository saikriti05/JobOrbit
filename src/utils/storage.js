// Centralized localStorage utility. Every read/write to persisted app data
// goes through here so business logic never talks to window.localStorage
// directly. Data is seeded from mockData.js ONLY the first time a key is
// missing — after that, whatever is in localStorage wins, so refreshing the
// browser never overwrites a user's changes with the original mock data.

import { companies, users, jobs, applications, profiles, alerts } from "../data/mockData.js";

const KEYS = {
  users: "cb_users",
  currentUser: "cb_currentUser",
  jobs: "cb_jobs",
  applications: "cb_applications",
  savedJobs: "cb_savedJobs", // { [applicantId]: string[] of jobIds }
  profiles: "cb_profiles", // { [applicantId]: profileObject }
  alerts: "cb_alerts", // { [applicantId]: alertObject }
  recruiterProfiles: "cb_recruiterProfiles", // { [recruiterId]: recruiterProfileObject }
  companies: "cb_companies",
  seeded: "cb_seeded_v1",
};

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage may be unavailable (private mode, quota, etc.) — fail silently
  }
}

/** Seed localStorage with mock data, but only the very first time. */
export function ensureSeeded() {
  if (localStorage.getItem(KEYS.seeded)) return;
  write(KEYS.users, users);
  write(KEYS.jobs, jobs);
  write(KEYS.applications, applications);
  write(KEYS.companies, companies);
  write(KEYS.savedJobs, {});
  write(KEYS.profiles, profiles);
  write(KEYS.alerts, alerts);
  localStorage.setItem(KEYS.seeded, "true");
}

// ---- Users & auth ----
export const getUsers = () => read(KEYS.users, []);
export const saveUsers = (list) => write(KEYS.users, list);
export const addUser = (user) => {
  const list = getUsers();
  list.push(user);
  saveUsers(list);
  return user;
};
export const getCurrentUser = () => read(KEYS.currentUser, null);
export const setCurrentUser = (user) => write(KEYS.currentUser, user);
export const clearCurrentUser = () => localStorage.removeItem(KEYS.currentUser);

// ---- Companies ----
export const getCompanies = () => read(KEYS.companies, []);

// ---- Jobs ----
export const getJobs = () => read(KEYS.jobs, []);
export const saveJobs = (list) => write(KEYS.jobs, list);
export const addJob = (job) => {
  const list = getJobs();
  list.unshift(job);
  saveJobs(list);
  return job;
};
export const updateJob = (jobId, patch) => {
  const list = getJobs().map((j) => (j.id === jobId ? { ...j, ...patch } : j));
  saveJobs(list);
  return list.find((j) => j.id === jobId);
};
export const deleteJob = (jobId) => {
  saveJobs(getJobs().filter((j) => j.id !== jobId));
};

// ---- Applications ----
export const getApplications = () => read(KEYS.applications, []);
export const saveApplications = (list) => write(KEYS.applications, list);
export const addApplication = (application) => {
  const list = getApplications();
  list.unshift(application);
  saveApplications(list);
  return application;
};
export const updateApplication = (id, patch) => {
  const list = getApplications().map((a) => (a.id === id ? { ...a, ...patch } : a));
  saveApplications(list);
  return list.find((a) => a.id === id);
};
export const deleteApplication = (id) => {
  saveApplications(getApplications().filter((a) => a.id !== id));
};

// ---- Saved jobs ----
export const getSavedJobsMap = () => read(KEYS.savedJobs, {});
export const getSavedJobIds = (applicantId) => getSavedJobsMap()[applicantId] || [];
export const toggleSavedJob = (applicantId, jobId) => {
  const map = getSavedJobsMap();
  const current = map[applicantId] || [];
  const exists = current.includes(jobId);
  map[applicantId] = exists ? current.filter((id) => id !== jobId) : [...current, jobId];
  write(KEYS.savedJobs, map);
  return !exists;
};

// ---- Profiles ----
export const getProfilesMap = () => read(KEYS.profiles, {});
export const getProfile = (applicantId) =>
  getProfilesMap()[applicantId] || {
    phone: "",
    location: "",
    education: "",
    degree: "",
    college: "",
    graduationYear: "",
    skills: [],
    experience: "",
    resumeName: "",
  };
export const saveProfile = (applicantId, profile) => {
  const map = getProfilesMap();
  map[applicantId] = profile;
  write(KEYS.profiles, map);
};

// ---- Job alerts / preferences ----
export const getAlertsMap = () => read(KEYS.alerts, {});
export const getAlert = (applicantId) =>
  getAlertsMap()[applicantId] || { preferredRole: "", preferredLocation: "", preferredSkills: [] };
export const saveAlert = (applicantId, alert) => {
  const map = getAlertsMap();
  map[applicantId] = alert;
  write(KEYS.alerts, map);
};

// ---- Recruiter profiles ----
export const getRecruiterProfilesMap = () => read(KEYS.recruiterProfiles, {});
export const getRecruiterProfile = (recruiterId) =>
  getRecruiterProfilesMap()[recruiterId] || {
    phone: "",
    designation: "",
    experience: "",
    industry: "",
    companyWebsite: "",
    companyLocation: "",
    companySize: "",
    linkedin: "",
    about: "",
  };
export const saveRecruiterProfile = (recruiterId, profile) => {
  const map = getRecruiterProfilesMap();
  map[recruiterId] = profile;
  write(KEYS.recruiterProfiles, map);
};

export const STORAGE_KEYS = KEYS;
