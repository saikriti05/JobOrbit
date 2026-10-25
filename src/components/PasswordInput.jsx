import React, { useState } from "react";

/**
 * A password <input> with a built-in show/hide toggle (eye icon).
 * Drop-in replacement for <input type="password" ... /> — accepts the
 * same value/onChange/placeholder props and forwards anything else.
 */
export default function PasswordInput({ value, onChange, placeholder, ...rest }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="password-field">
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...rest}
      />
      <button
        type="button"
        className="password-toggle"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        tabIndex={0}
      >
        {visible ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path
        d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path
        d="M3 3l18 18M10.6 5.2C11 5.1 11.5 5 12 5c7 0 10.5 7 10.5 7-.6 1.2-1.6 2.7-3 4M6.2 6.6C3.4 8.4 1.5 12 1.5 12S5 19 12 19c1.4 0 2.6-.3 3.7-.7M9.5 9.6a3.2 3.2 0 0 0 4.4 4.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
