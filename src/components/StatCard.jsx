import React from "react";

export default function StatCard({ label, value, accent }) {
  return (
    <div className={"stat-card" + (accent ? " accent-" + accent : "")}>
      <b>{value}</b>
      <span>{label}</span>
    </div>
  );
}
