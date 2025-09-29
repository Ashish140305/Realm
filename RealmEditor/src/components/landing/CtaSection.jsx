// src/components/landing/CtaSection.jsx
import React from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import '../../styles/CtaSection.css';

export default function CtaSection() {
  const navigate = useNavigate();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section ref={ref} className={`cta-section ${inView ? 'is-visible' : ''}`}>
      <h2>Ready to Streamline Your Workflow?</h2>
      <p>Join Realm today and experience the future of collaborative coding.</p>
      <button className="cta-button" onClick={() => navigate('/signup')}>
        Create Your Account
      </button>
    </section>
  );
}