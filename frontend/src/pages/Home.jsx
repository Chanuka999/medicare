import React from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiPlay, FiVideo } from "react-icons/fi";
import Navbar from "../components/Navbar";
import AboutSection from "../components/AboutSection";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <Navbar />
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">❤</span>
            Your health, your choice
          </div>
          <h1>
            Secure Your Doctor Visit <br /> 
            <span>Anytime, Anywhere</span>
          </h1>
          <p>
            Easily schedule a medical consultation with your preferred doctor at a time that suits you best. Our platform offers a seamless experience for managing your health.
          </p>
          <div className="hero-actions">
            <button className="primary-btn" onClick={() => navigate("/login")}>
              Contact Us <FiArrowRight className="btn-icon" />
            </button>
            <button className="play-btn">
              <div className="play-icon-wrapper">
                <FiPlay fill="currentColor" />
              </div>
            </button>
          </div>
        </div>

        <div className="hero-image-container">
          <div className="doctor-image-bg">
            <img src="/images/hero-doctor.png" alt="Professional Doctor" className="hero-doctor-img" />
            {/* Stats Indicator Circle */}
            <div className="stats-indicator">
              <div className="circle-inner">
                <span className="stats-num">100k+</span>
                <span className="stats-label">Satisfied patients</span>
              </div>
              <div className="plus-icon">+</div>
            </div>
          </div>
        </div>

        {/* Floating Cards */}
        <div className="floating-cards">
          <div className="f-card doctors-card">
            <h3>Latest visited doctors</h3>
            <div className="doctor-avatars">
              <img src="https://ui-avatars.com/api/?name=John+Doe&background=random" alt="doc1" />
              <img src="https://ui-avatars.com/api/?name=Jane+Smith&background=random" alt="doc2" />
              <img src="https://ui-avatars.com/api/?name=Mike+Ross&background=random" alt="doc3" />
            </div>
            <p>More than 5k doctors at your services</p>
          </div>

          <div className="f-card video-card">
            <div className="video-ui">
               <div className="video-main">
                  <img src="https://images.unsplash.com/photo-1576091160550-217359f488d5?auto=format&fit=crop&q=80&w=300" alt="Consultation" />
                  <div className="video-controls">
                    <div className="v-icon"><FiVideo /></div>
                    <div className="v-icon call-end">📞</div>
                    <div className="v-icon">🎤</div>
                  </div>
               </div>
            </div>
          </div>

          <div className="f-card stats-card">
             <div className="stats-header">
                <span className="s-label">Statistical</span>
             </div>
             <div className="stats-chart-circle">
                <div className="chart-inner">
                   <span className="chart-val">96%</span>
                </div>
             </div>
             <p className="s-footer">Successful Diagnosis</p>
          </div>
        </div>
      </section>

      {/* About Section shown on same page */}
      <AboutSection />
      
      <footer className="home-footer" style={{ textAlign: "center", padding: "50px 0", color: "#64748b" }}>
        <p>© 2024 CarePoint Digital Health. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;

