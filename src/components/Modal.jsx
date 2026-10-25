import React, { useEffect } from "react";

export default function Modal({ title, onClose, children, wide }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className={"modal" + (wide ? " modal-wide" : "")} onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-x" onClick={onClose} aria-label="Close">
          ×
        </button>
        {title && <h2>{title}</h2>}
        {children}
      </div>
    </div>
  );
}
