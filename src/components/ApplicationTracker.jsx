import React from "react";
import { APPLICATION_STAGES, TERMINAL_STATUS } from "../utils/statusTransitions.js";

/** Visual Applied -> Shortlisted -> Interview -> Offer tracker with the current stage highlighted. */
export default function ApplicationTracker({ status }) {
  if (status === TERMINAL_STATUS) {
    return (
      <div className="tracker tracker-rejected">
        <span className="tracker-rejected-dot" />
        <span>Application not moving forward (Rejected)</span>
      </div>
    );
  }

  const currentIndex = APPLICATION_STAGES.indexOf(status);

  return (
    <div className="tracker">
      {APPLICATION_STAGES.map((stage, i) => {
        const state = i < currentIndex ? "done" : i === currentIndex ? "current" : "upcoming";
        return (
          <React.Fragment key={stage}>
            <div className={"tracker-step " + state}>
              <span className="tracker-dot">{state === "done" ? "✓" : i + 1}</span>
              <span className="tracker-label">{stage}</span>
            </div>
            {i < APPLICATION_STAGES.length - 1 && <span className={"tracker-line " + (i < currentIndex ? "done" : "")} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}
