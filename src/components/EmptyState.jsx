import React from "react";
import { Link } from "react-router-dom";

export default function EmptyState({ icon = "⌕", title = "Nothing here yet", text = "", actionTo, actionLabel }) {
  return (
    <div className="empty">
      <div>{icon}</div>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
      {actionTo && (
        <Link to={actionTo} className="secondary">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
