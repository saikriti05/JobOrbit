import React from "react";

export default function ProfileCompletion({ percent }) {
  return (
    <div className="completion">
      <div>
        <b>Profile completion</b>
        <strong>{percent}%</strong>
      </div>
      <div className="progress">
        <span style={{ width: percent + "%" }}></span>
      </div>
      <small>
        {percent >= 90
          ? "Great job! Your profile is fully ready for recruiters."
          : "Complete your profile to improve recruiter visibility."}
      </small>
    </div>
  );
}
