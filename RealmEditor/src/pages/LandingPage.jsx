// src/pages/LandingPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css';
import CodeAnimation from '../components/ui/CodeAnimation';
import FeaturesSection from '../components/landing/FeaturesSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import FaqSection from '../components/landing/FaqSection';
import CtaSection from '../components/landing/CtaSection';
import Footer from '../components/landing/Footer';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page-wrapper">
      <section className="hero-section">
        <nav className="landing-nav">
          <a href="#features">Features</a>
          <a href="#testimonials">Testimonials</a>
          <a href="#faq">FAQ</a>
        </nav>
        
        <main className="landing-main">
          <div className="hero-text">
            <h1>Realm, Work Efficient And Effective</h1>
            <p>A real-time collaborative code editor designed for modern development teams.</p>
            <div className="hero-buttons">
              <button className="login-btn" onClick={() => navigate('/login')}>
                Get Started
              </button>
              <a href="#features" className="create-team-link">Learn More</a>
            </div>
          </div>
          <div className="hero-graphic">
            <CodeAnimation />
          </div>
        </main>
      </section>

      {/* All sections are now included */}
      <FeaturesSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
      <Footer />

    </div>
  );
}