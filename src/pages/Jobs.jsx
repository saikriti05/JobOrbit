import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import JobCard from "../components/JobCard.jsx";
import Filters from "../components/Filters.jsx";
import Pagination from "../components/Pagination.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { useData } from "../context/DataContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { filterJobs, paginate } from "../utils/filterJobs.js";

const PAGE_SIZE = 6;
const FILTER_KEYS = ["q", "role", "location", "experience", "type", "company", "skill", "minCtc", "maxCtc", "sort"];

/**
 * The URL query string is the single source of truth for job-filter state.
 * Every filter, the sort order, and the page number live in useSearchParams
 * so refreshing, sharing, or navigating back/forward all restore the exact
 * same view.
 */
export default function Jobs() {
  const { jobs, isSaved, toggleSave } = useData();
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();

  const filters = useMemo(() => {
    const f = {};
    FILTER_KEYS.forEach((k) => {
      const v = params.get(k);
      if (v) f[k] = v;
    });
    return f;
  }, [params]);

  const page = Number(params.get("page") || 1);
  const [searchInput, setSearchInput] = useState(filters.q || "");

  useEffect(() => {
    setSearchInput(filters.q || "");
  }, [filters.q]);

  const filtered = useMemo(() => filterJobs(jobs, filters), [jobs, filters]);
  const { items, totalPages, page: safePage } = useMemo(() => paginate(filtered, page, PAGE_SIZE), [filtered, page]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page"); // any filter change resets pagination
    setParams(next);
  };

  const setPage = (nextPage) => {
    const next = new URLSearchParams(params);
    if (nextPage > 1) next.set("page", String(nextPage));
    else next.delete("page");
    setParams(next);
  };

  const submitSearch = (e) => {
    e.preventDefault();
    updateParam("q", searchInput.trim());
  };

  const clearFilters = () => setParams({});

  const activeFilterCount = FILTER_KEYS.filter((k) => k !== "sort" && filters[k]).length;

  return (
    <main className="page">
      <div className="page-title">
        <div className="eyebrow">JOB BOARD</div>
        <h1>Find your next role.</h1>
        <p>Search and filter opportunities. Your filters live in the URL, so you can refresh, share or bookmark this exact search.</p>
      </div>

      <form className="searchbar wide" onSubmit={submitSearch}>
        <span>⌕</span>
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search role, skill or company"
        />
        <button type="submit">Search</button>
      </form>

      <div className="job-layout">
        <Filters jobs={jobs} values={filters} onChange={updateParam} onClear={clearFilters} />

        <section className="results">
          <div className="results-head">
            <span>
              <b>{filtered.length}</b> {filtered.length === 1 ? "opportunity" : "opportunities"}
              {activeFilterCount > 0 && (
                <button type="button" className="text-link clear-inline" onClick={clearFilters}>
                  Clear filters
                </button>
              )}
            </span>
            <select value={filters.sort || "newest"} onChange={(e) => updateParam("sort", e.target.value)}>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="ctc-high">Highest CTC</option>
              <option value="ctc-low">Lowest CTC</option>
            </select>
          </div>

          {items.length ? (
            <>
              <div className="job-list">
                {items.map((j) => (
                  <JobCard key={j.id} job={j} saved={isSaved(j.id)} onToggleSave={user?.role === "applicant" ? toggleSave : undefined} />
                ))}
              </div>
              <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
            </>
          ) : (
            <EmptyState
              title="No matching jobs"
              text="Try removing a filter or changing your search."
              actionLabel="Clear filters"
              actionTo="/jobs"
            />
          )}
        </section>
      </div>
    </main>
  );
}
