import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { useAuth } from "./AuthContext.jsx";
import {
  ensureSeeded,
  getJobs,
  saveJobs,
  addJob as addJobToStorage,
  updateJob as updateJobInStorage,
  deleteJob as deleteJobFromStorage,
  getApplications,
  addApplication as addApplicationToStorage,
  updateApplication as updateApplicationInStorage,
  deleteApplication as deleteApplicationFromStorage,
  getSavedJobIds,
  toggleSavedJob,
  getProfile,
  saveProfile,
  getAlert,
  saveAlert,
  getCompanies,
  getRecruiterProfile,
  saveRecruiterProfile,
} from "../utils/storage.js";
import { canTransitionStatus } from "../utils/statusTransitions.js";

/**
 * Central place for all persisted app data (jobs, applications, saved jobs,
 * applicant profile & alerts). Every page reads from here instead of talking
 * to storage.js directly, so a mutation in one part of the app (e.g. a
 * recruiter changing an applicant's status) is instantly reflected anywhere
 * else that data is rendered.
 */
const DataContext = createContext(null);

export function DataProvider({ children }) {
  const { user } = useAuth();

  useEffect(() => {
    ensureSeeded();
  }, []);

  const [jobs, setJobs] = useState(() => {
    ensureSeeded();
    return getJobs();
  });
  const [applications, setApplications] = useState(() => getApplications());
  const [companies] = useState(() => getCompanies());

  const [savedJobIds, setSavedJobIds] = useState([]);
  const [profile, setProfile] = useState(null);
  const [alert, setAlert] = useState(null);
  const [recruiterProfile, setRecruiterProfile] = useState(null);

  // Reload per-applicant data whenever the logged in user changes.
  useEffect(() => {
    if (user && user.role === "applicant") {
      setSavedJobIds(getSavedJobIds(user.id));
      setProfile(getProfile(user.id));
      setAlert(getAlert(user.id));
    } else {
      setSavedJobIds([]);
      setProfile(null);
      setAlert(null);
    }
    if (user && user.role === "recruiter") {
      setRecruiterProfile(getRecruiterProfile(user.id));
    } else {
      setRecruiterProfile(null);
    }
  }, [user]);

  // ---- Jobs ----
  const createJob = useCallback((job) => {
    const created = addJobToStorage(job);
    setJobs(getJobs());
    return created;
  }, []);

  const editJob = useCallback((jobId, patch) => {
    const updated = updateJobInStorage(jobId, patch);
    setJobs(getJobs());
    return updated;
  }, []);

  const removeJob = useCallback((jobId) => {
    deleteJobFromStorage(jobId);
    setJobs(getJobs());
  }, []);

  const closeJob = useCallback((jobId) => editJob(jobId, { status: "closed" }), [editJob]);
  const reopenJob = useCallback((jobId) => editJob(jobId, { status: "open" }), [editJob]);

  // ---- Applications ----
  const hasApplied = useCallback(
    (jobId, applicantId) => applications.some((a) => a.jobId === jobId && a.applicantId === applicantId),
    [applications]
  );

  const createApplication = useCallback((application) => {
    const created = addApplicationToStorage(application);
    setApplications(getApplications());
    return created;
  }, []);

  const setApplicationStatus = useCallback((applicationId, nextStatus) => {
    const current = getApplications().find((a) => a.id === applicationId);
    if (!current) return { ok: false, error: "Application not found." };
    if (!canTransitionStatus(current.status, nextStatus)) {
      return { ok: false, error: `Cannot move an application from ${current.status} to ${nextStatus}.` };
    }
    const updated = updateApplicationInStorage(applicationId, { status: nextStatus });
    setApplications(getApplications());
    return { ok: true, application: updated };
  }, []);

  const withdrawApplication = useCallback((applicationId) => {
    deleteApplicationFromStorage(applicationId);
    setApplications(getApplications());
  }, []);

  // ---- Saved jobs (current applicant only) ----
  const isSaved = useCallback((jobId) => savedJobIds.includes(jobId), [savedJobIds]);

  const toggleSave = useCallback(
    (jobId) => {
      if (!user || user.role !== "applicant") return;
      toggleSavedJob(user.id, jobId);
      setSavedJobIds(getSavedJobIds(user.id));
    },
    [user]
  );

  // ---- Profile & alerts (current applicant only) ----
  const updateProfile = useCallback(
    (patch) => {
      if (!user) return;
      const next = { ...(profile || {}), ...patch };
      saveProfile(user.id, next);
      setProfile(next);
    },
    [user, profile]
  );

  const updateAlert = useCallback(
    (patch) => {
      if (!user) return;
      const next = { ...(alert || {}), ...patch };
      saveAlert(user.id, next);
      setAlert(next);
    },
    [user, alert]
  );

  // ---- Recruiter profile (current recruiter only) ----
  const updateRecruiterProfile = useCallback(
    (patch) => {
      if (!user) return;
      const next = { ...(recruiterProfile || {}), ...patch };
      saveRecruiterProfile(user.id, next);
      setRecruiterProfile(next);
    },
    [user, recruiterProfile]
  );

  const value = useMemo(
    () => ({
      jobs,
      applications,
      companies,
      savedJobIds,
      profile,
      alert,
      recruiterProfile,
      createJob,
      editJob,
      removeJob,
      closeJob,
      reopenJob,
      hasApplied,
      createApplication,
      setApplicationStatus,
      withdrawApplication,
      isSaved,
      toggleSave,
      updateProfile,
      updateAlert,
      updateRecruiterProfile,
    }),
    [
      jobs,
      applications,
      companies,
      savedJobIds,
      profile,
      alert,
      recruiterProfile,
      createJob,
      editJob,
      removeJob,
      closeJob,
      reopenJob,
      hasApplied,
      createApplication,
      setApplicationStatus,
      withdrawApplication,
      isSaved,
      toggleSave,
      updateProfile,
      updateAlert,
      updateRecruiterProfile,
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
