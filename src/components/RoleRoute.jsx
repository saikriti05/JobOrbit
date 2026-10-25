import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

/**
 * Blocks users of the wrong role from a route (e.g. an applicant hitting a
 * recruiter-only URL directly). Requires the user to already be logged in —
 * wrap with ProtectedRoute (or nest inside one) for unauthenticated users.
 */
export default function RoleRoute({ role, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) {
    const home = user.role === "recruiter" ? "/recruiter/dashboard" : "/applicant/dashboard";
    return <Navigate to={home} replace />;
  }
  return children;
}
