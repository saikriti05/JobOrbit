import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  ensureSeeded,
  getUsers,
  addUser,
  getCurrentUser,
  setCurrentUser,
  clearCurrentUser,
} from "../utils/storage.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  useEffect(() => {
    ensureSeeded();
  }, []);

  const [user, setUser] = useState(() => {
    ensureSeeded();
    return getCurrentUser();
  });

  const login = (email, password, role) => {
    const users = getUsers();
    const byEmail = users.find((u) => u.email.toLowerCase() === String(email).toLowerCase());

    // Same email can exist for only one role, but an applicant and a recruiter
    // account are otherwise independent — logging in from the wrong tab
    // (e.g. an applicant's email submitted on the Recruiter card) must fail
    // even if the password happens to match, and should say why.
    if (!byEmail || byEmail.password !== password) {
      return { ok: false, error: "Invalid email or password." };
    }
    if (role && byEmail.role !== role) {
      const otherRole = byEmail.role === "applicant" ? "Applicant" : "Recruiter";
      return {
        ok: false,
        error: `This email is registered as a ${otherRole} account. Switch to the ${otherRole} tab to log in.`,
      };
    }

    const { password: _pw, ...safeUser } = byEmail;
    setCurrentUser(safeUser);
    setUser(safeUser);
    return { ok: true, user: safeUser };
  };

  const registerApplicant = ({ name, email, password }) => {
    const users = getUsers();
    if (users.some((u) => u.email.toLowerCase() === String(email).toLowerCase())) {
      return { ok: false, error: "An account with this email already exists." };
    }
    const newUser = { id: "s" + Date.now(), role: "applicant", name, email, password };
    addUser(newUser);
    const { password: _pw, ...safeUser } = newUser;
    setCurrentUser(safeUser);
    setUser(safeUser);
    return { ok: true, user: safeUser };
  };

  const registerRecruiter = ({ name, email, password, companyName }) => {
    const users = getUsers();
    if (users.some((u) => u.email.toLowerCase() === String(email).toLowerCase())) {
      return { ok: false, error: "An account with this email already exists." };
    }
    // No companyId — this recruiter isn't linked to a seeded mock company.
    // Downstream screens (e.g. RecruiterJobForm) already fall back to
    // user.companyName when companyId is absent, so this just works.
    const newUser = { id: "r" + Date.now(), role: "recruiter", name, email, password, companyName, companyId: null };
    addUser(newUser);
    const { password: _pw, ...safeUser } = newUser;
    setCurrentUser(safeUser);
    setUser(safeUser);
    return { ok: true, user: safeUser };
  };

  const logout = () => {
    clearCurrentUser();
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, registerApplicant, registerRecruiter, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
