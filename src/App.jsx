import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import RoleRoute from "./components/RoleRoute.jsx";

import Home from "./pages/Home.jsx";
import Jobs from "./pages/Jobs.jsx";
import JobDetails from "./pages/JobDetails.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Companies from "./pages/Companies.jsx";
import About from "./pages/About.jsx";
import NotFound from "./pages/NotFound.jsx";

import ApplicantDashboard from "./pages/applicant/ApplicantDashboard.jsx";
import ApplicantApplications from "./pages/applicant/ApplicantApplications.jsx";
import SavedJobs from "./pages/applicant/SavedJobs.jsx";
import ApplicantProfile from "./pages/applicant/ApplicantProfile.jsx";

import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard.jsx";
import RecruiterJobs from "./pages/recruiter/RecruiterJobs.jsx";
import RecruiterJobForm from "./pages/recruiter/RecruiterJobForm.jsx";
import RecruiterApplicants from "./pages/recruiter/RecruiterApplicants.jsx";
import RecruiterApplications from "./pages/recruiter/RecruiterApplications.jsx";
import RecruiterProfile from "./pages/recruiter/RecruiterProfile.jsx";

// Full-screen pages with no navbar (or footer) above/below them — the
// dedicated login and register pages, which use their own full-page
// background instead.
const NO_CHROME_ROUTES = ["/login", "/register"];

export default function App() {
  const location = useLocation();
  const hideChrome = NO_CHROME_ROUTES.includes(location.pathname);

  return (
    <div className="app-shell">
      {!hideChrome && <Navbar />}
      <div className="app-main">
      <Routes>
        {/* Entry point: visiting the site lands straight on the landing page */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:jobId" element={<JobDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/about" element={<About />} />

        <Route
          path="/applicant/dashboard"
          element={
            <ProtectedRoute>
              <RoleRoute role="applicant">
                <ApplicantDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/applicant/applications"
          element={
            <ProtectedRoute>
              <RoleRoute role="applicant">
                <ApplicantApplications />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/applicant/saved-jobs"
          element={
            <ProtectedRoute>
              <RoleRoute role="applicant">
                <SavedJobs />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/applicant/profile"
          element={
            <ProtectedRoute>
              <RoleRoute role="applicant">
                <ApplicantProfile />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/dashboard"
          element={
            <ProtectedRoute>
              <RoleRoute role="recruiter">
                <RecruiterDashboard />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/jobs"
          element={
            <ProtectedRoute>
              <RoleRoute role="recruiter">
                <RecruiterJobs />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/jobs/new"
          element={
            <ProtectedRoute>
              <RoleRoute role="recruiter">
                <RecruiterJobForm />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/jobs/:jobId/edit"
          element={
            <ProtectedRoute>
              <RoleRoute role="recruiter">
                <RecruiterJobForm />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/jobs/:jobId/applicants"
          element={
            <ProtectedRoute>
              <RoleRoute role="recruiter">
                <RecruiterApplicants />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/applications"
          element={
            <ProtectedRoute>
              <RoleRoute role="recruiter">
                <RecruiterApplications />
              </RoleRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/profile"
          element={
            <ProtectedRoute>
              <RoleRoute role="recruiter">
                <RecruiterProfile />
              </RoleRoute>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
      </div>
      {!hideChrome && <Footer />}
    </div>
  );
}
