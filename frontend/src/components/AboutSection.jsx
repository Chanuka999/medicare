import React from "react";
import { FiArrowRight, FiActivity, FiGlobe, FiDatabase, FiSmartphone } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./AboutSection.css";

const AboutSection = () => {
  const navigate = useNavigate();

  return (
    <div id="about-section" className="about-section-wrapper">
      {/* Hero Content Part of About as a Section */}
      <section className="about-hero-sec">
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
      <section className="about-bio-sec">
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
    </div>
  );
};

export default AboutSection;
