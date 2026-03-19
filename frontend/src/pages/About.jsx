import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiActivity, FiGlobe, FiDatabase, FiSmartphone } from "react-icons/fi";
import Navbar from "../components/Navbar";
import "./About.css";

const About = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-container">
      <Navbar />
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>We help people to <br /> <span>get appointment online</span></h1>
          <p>
            At CarePoint, we believe healthcare should be accessible, efficient, and patient-centric. Our digital platform is designed to make medical consultations seamless for both doctors and patients.
          </p>
          <div className="about-stats-row">
            <div className="about-stat">
              <span className="stat-num">10k+</span>
              <span className="stat-label">Trusted Doctors</span>
            </div>
            <div className="about-stat">
              <span className="stat-num">50k+</span>
              <span className="stat-label">Satisfied Patients</span>
            </div>
            <div className="about-stat">
              <span className="stat-num">98%</span>
              <span className="stat-label">Response Rate</span>
            </div>
          </div>
        </div>
        <div className="about-hero-image">
           <div className="illustration-wrapper">
             {/* 3D themed illustration */}
             <img src="https://images.unsplash.com/photo-1586772002130-b0f3daa6288b?auto=format&fit=crop&q=80&w=600" alt="Consultation 3D" className="floating-img" />
             <div className="glass-card g-1">
                <FiActivity className="g-icon" />
                <span>Real-time Tracking</span>
             </div>
             <div className="glass-card g-2">
                <FiDatabase className="g-icon" />
                <span>Secure Data</span>
             </div>
           </div>
        </div>
      </section>

      {/* Biography Section */}
      <section className="about-bio-section">
         <div className="bio-image-side">
            <div className="dots-bg"></div>
            <div className="bio-image-container">
               <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=600" alt="Team Work" />
               <div className="chat-bubble-3d">
                  <div className="avatar-group">
                     <img src="https://ui-avatars.com/api/?name=JS&background=random" alt="1" />
                     <img src="https://ui-avatars.com/api/?name=AM&background=random" alt="2" />
                  </div>
                  <div className="msg-preview">
                     <span>Dr. Smith: "Your appointment is confirmed!"</span>
                  </div>
               </div>
            </div>
         </div>
         <div className="bio-content-side">
            <span className="tagline">Biography</span>
            <h2>Who We Are</h2>
            <p>
              Founded in 2020, CarePoint has quickly become a leader in digital healthcare innovation. Every day, we bring together thousands of medical professionals and patients, ensuring that high-quality care is never out of reach. 
              Our platform offers comprehensive features from real-time appointment scheduling to digital lab reports and expert medical advice.
            </p>
            <p>
              We are more than just a software system—we are your dedicated partner in health, providing a platform where security, efficiency, and compassionate care come first.
              In 2024, our goal is to expand our reach to over 500+ clinics and medical centers worldwide. 
            </p>
            <div className="bio-features">
               <div className="b-feat">
                  <FiGlobe className="bf-icon" />
                  <span>Global Availability</span>
               </div>
               <div className="b-feat">
                  <FiSmartphone className="bf-icon" />
                  <span>Mobile Friendly</span>
               </div>
            </div>
            <button className="primary-btn-about" onClick={() => navigate("/register")}>
               Get Started for Free <FiArrowRight />
            </button>
         </div>
      </section>

      <footer className="simple-footer">
        <p>© 2024 CarePoint Digital Health. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default About;
