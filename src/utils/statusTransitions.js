// Single source of truth for what application-status changes are allowed.
// Applied -> Shortlisted -> Interview -> Offer, with Rejected reachable as a
// terminal outcome from any non-final stage. Offer and Rejected are terminal.

export const APPLICATION_STAGES = ["Applied", "Shortlisted", "Interview", "Offer"];
export const TERMINAL_STATUS = "Rejected";
export const ALL_STATUSES = [...APPLICATION_STAGES, TERMINAL_STATUS];

export const STATUS_TRANSITIONS = {
  Applied: ["Shortlisted", "Rejected"],
  Shortlisted: ["Interview", "Rejected"],
  Interview: ["Offer", "Rejected"],
  Offer: [],
  Rejected: [],
};

/** Returns true if moving from `current` to `next` is a valid transition. */
export function canTransitionStatus(current, next) {
  if (current === next) return false;
  return (STATUS_TRANSITIONS[current] || []).includes(next);
}

/** All statuses an application can legally move to from its current status. */
export function getAvailableTransitions(current) {
  return STATUS_TRANSITIONS[current] || [];
}

export function isTerminal(status) {
  return (STATUS_TRANSITIONS[status] || []).length === 0;
}
