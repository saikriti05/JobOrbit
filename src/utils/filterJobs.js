// Single centralized job-filtering + sorting function. Every page that needs
// to filter jobs (Jobs listing, recommendations, etc.) should call this
// instead of re-implementing filter logic.

const norm = (v) => (v || "").toString().trim().toLowerCase();

/**
 * @param {Array} jobs
 * @param {Object} filters - { q, role, location, experience, type, company, skill, minCtc, maxCtc, sort }
 */
export function filterJobs(jobs, filters = {}) {
  const { q, role, location, experience, type, company, skill, minCtc, maxCtc, sort, status } = filters;

  let result = jobs.filter((job) => {
    if (status && job.status !== status) return false;
    if (!status && job.status === "closed" && !filters.includeClosed) {
      // by default closed jobs are still shown in listings unless explicitly excluded
    }
    if (q) {
      const haystack = [job.title, job.company, job.location, ...(job.skills || [])].join(" ").toLowerCase();
      if (!haystack.includes(norm(q))) return false;
    }
    if (role && norm(job.title) !== norm(role) && !norm(job.title).includes(norm(role))) return false;
    if (location && norm(job.location) !== norm(location)) return false;
    if (experience && norm(job.experience) !== norm(experience)) return false;
    if (type && norm(job.type) !== norm(type)) return false;
    if (company && norm(job.company) !== norm(company)) return false;
    if (skill && !(job.skills || []).some((s) => norm(s) === norm(skill))) return false;
    if (minCtc && Number(job.ctcMax ?? job.ctc) < Number(minCtc)) return false;
    if (maxCtc && Number(job.ctcMin ?? job.ctc) > Number(maxCtc)) return false;
    return true;
  });

  switch (sort) {
    case "ctc-high":
      result = [...result].sort((a, b) => (b.ctcMax ?? b.ctc) - (a.ctcMax ?? a.ctc));
      break;
    case "ctc-low":
      result = [...result].sort((a, b) => (a.ctcMin ?? a.ctc) - (b.ctcMin ?? b.ctc));
      break;
    case "oldest":
      result = [...result].sort((a, b) => new Date(a.postedDate) - new Date(b.postedDate));
      break;
    case "newest":
    default:
      result = [...result].sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
      break;
  }

  return result;
}

/** Paginates an already-filtered array. Returns { items, totalPages }. */
export function paginate(list, page, pageSize) {
  const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return { items: list.slice(start, start + pageSize), totalPages, page: safePage };
}

/** Simple recommendation scoring: matches applicant skills/alert prefs against open jobs. */
export function recommendJobs(jobs, { skills = [], preferredRole = "", preferredLocation = "", preferredSkills = [] } = {}, excludeIds = []) {
  const allSkills = new Set([...skills, ...preferredSkills].map(norm));
  return jobs
    .filter((j) => j.status !== "closed" && !excludeIds.includes(j.id))
    .map((j) => {
      let score = 0;
      (j.skills || []).forEach((s) => {
        if (allSkills.has(norm(s))) score += 2;
      });
      if (preferredRole && norm(j.title).includes(norm(preferredRole))) score += 3;
      if (preferredLocation && norm(j.location) === norm(preferredLocation)) score += 2;
      return { job: j, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.job);
}
