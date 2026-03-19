import React from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleAboutClick = (e) => {
    if (location.pathname === "/") {
      e.preventDefault();
      const aboutSec = document.getElementById("about-section");
      if (aboutSec) {
        aboutSec.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
        <div className="logo-icon">C</div>
        <span>CarePoint</span>
      </div>
      <div className="nav-links">
        <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>Home</Link>
        <Link 
          to="/about" 
          className={`nav-link ${isActive("/about") ? "active" : ""}`}
          onClick={handleAboutClick}
        >
          About us
        </Link>
        <Link to="/services" className={`nav-link ${isActive("/services") ? "active" : ""}`}>Services</Link>
        <Link to="/blog" className={`nav-link ${isActive("/blog") ? "active" : ""}`}>Blog</Link>
      </div>
      <div className="nav-auth">
        <button className="signin-btn" onClick={() => navigate("/login")}>
          Sign In
        </button>
        <button className="register-btn-nav" onClick={() => navigate("/register")}>
          Register
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
