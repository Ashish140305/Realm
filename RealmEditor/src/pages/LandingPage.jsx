// src/pages/LandingPage.jsx
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { SplitText } from 'gsap-trial/SplitText';
import { FiCheckCircle, FiGitMerge, FiUsers } from 'react-icons/fi';
import { FaJava, FaPython, FaReact } from 'react-icons/fa';
import '../styles/LandingPage.css';
import CodeAnimation from '../components/ui/CodeAnimation';
import BlobBackground from '../components/ui/BlobBackground';
import FeaturesSection from '../components/landing/FeaturesSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import FaqSection from '../components/landing/FaqSection';
import CtaSection from '../components/landing/CtaSection';
import Footer from '../components/landing/Footer';

gsap.registerPlugin(SplitText);

export default function LandingPage() {
  const navigate = useNavigate();
  const container = useRef();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useGSAP(() => {
    // Wait for custom fonts to be ready to prevent bugs
    document.fonts.ready.then(() => {
      const heroHeadline = container.current.querySelector('.hero-text h1');
      // FIX: Split by "words, chars" to preserve word wrapping
      const split = new SplitText(heroHeadline, { type: "words, chars" });
      const chars = split.chars;

      const tl = gsap.timeline();

      tl.from(chars, {
        duration: 0.8,
        autoAlpha: 0,
        y: 40,
        rotationX: -90,
        stagger: {
          each: 0.03,
          from: "random"
        },
        ease: 'power2.out',
      })
      .fromTo([".hero-text p", ".feature-snippets", ".hero-buttons", ".social-proof"], 
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.15 },
        "-=0.5"
      );

      gsap.from(".connecting-line", {
        strokeDashoffset: (i, target) => target.getTotalLength(),
        duration: 2,
        ease: 'power2.inOut',
        stagger: 0.3,
        delay: 1.2,
      });

      const heroSection = container.current.querySelector('.hero-section');
      const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const xPercent = (clientX / window.innerWidth - 0.5) * 2;
        const yPercent = (clientY / window.innerHeight - 0.5) * 2;
        
        gsap.to(".floating-element", {
          x: xPercent * -25,
          y: yPercent * -25,
          ease: "power2.out",
          duration: 1.5
        });
      };
      
      heroSection.addEventListener('mousemove', handleMouseMove);
      
      return () => {
        heroSection.removeEventListener('mousemove', handleMouseMove);
        if (split) {
          split.revert();
        }
      };
    });
  }, { scope: container });

  return (
    <div ref={container} className="landing-page-wrapper">
      <BlobBackground />
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
            <div className="feature-snippets">
              <span><FiCheckCircle /> Real-time Collaboration</span>
              <span><FiCheckCircle /> Built-in Version Control</span>
            </div>
            <div className="hero-buttons">
              <button className="login-btn" onClick={() => navigate('/login')}>
                Get Started
              </button>
              <a href="#features" className="create-team-link">
                Learn More
              </a>
            </div>
            <div className="social-proof">
              <div className="avatar-stack">
                <img src="https://i.pravatar.cc/40?u=a" alt="User 1" />
                <img src="https://i.pravatar.cc/40?u=b" alt="User 2" />
                <img src="https://i.pravatar.cc/40?u=c" alt="User 3" />
              </div>
              <p>Trusted by developers worldwide</p>
            </div>
          </div>
          <div className="hero-graphic">
            <div className="floating-elements-container">
              <svg className="connecting-lines-svg" viewBox="0 0 600 400">
                <path className="connecting-line" d="M 150 50 Q 250 100 280 180" />
                <path className="connecting-line" d="M 450 50 Q 350 100 320 180" />
                <path className="connecting-line" d="M 100 350 Q 200 280 280 220" />
                <path className="connecting-line" d="M 500 350 Q 400 280 320 220" />
              </svg>
              <div className="code-animation-wrapper floating-element">
                <CodeAnimation />
              </div>
              <div className="floating-card collab-card floating-element">
                <FiUsers /> <span>Live Cursors</span>
              </div>
              <div className="floating-card git-card floating-element">
                <FiGitMerge /> <span>Branch: main</span>
              </div>
              <div className="floating-icon icon-java floating-element"><FaJava /></div>
              <div className="floating-icon icon-python floating-element"><FaPython /></div>
              <div className="floating-icon icon-react floating-element"><FaReact /></div>
            </div>
          </div>
        </main>
      </section>

      <FeaturesSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
      <Footer />
    </div>
  );
}