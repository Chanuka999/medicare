import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "4rem", marginBottom: "1rem" }}>404</h1>
      <h2>Page Not Found</h2>
      <p style={{ marginTop: "1rem", marginBottom: "2rem" }}>
        The page you are looking for does not exist.
      </p>
      <Link
        to="/"
        style={{
          padding: "0.75rem 1.5rem",
          backgroundColor: "#007bff",
          color: "white",
          borderRadius: "4px",
          textDecoration: "none",
        }}
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
