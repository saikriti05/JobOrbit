import React from "react";

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) pages.push(i);
    else if (pages[pages.length - 1] !== "...") pages.push("...");
  }

  return (
    <nav className="pagination" aria-label="Pagination">
      <button disabled={page <= 1} onClick={() => onChange(page - 1)}>
        ‹ Prev
      </button>
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={"dots" + i} className="pagination-dots">
            …
          </span>
        ) : (
          <button key={p} className={p === page ? "active" : ""} onClick={() => onChange(p)}>
            {p}
          </button>
        )
      )}
      <button disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        Next ›
      </button>
    </nav>
  );
}
