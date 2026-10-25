import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function NotFound() {
  const { user } = useAuth();
  return (
    <main className="page empty">
      <div>⌕</div>
      <h1>404</h1>
      <p>That page doesn't exist.</p>
      <Link to={user ? "/home" : "/"} className="primary">
        Go home
      </Link>
    </main>
  );
}
