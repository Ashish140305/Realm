// src/components/landing/Footer.jsx
import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';
import '../../styles/Footer.css';
import RealmLogo from '../../assets/RealmLogo';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: footerRef.current,
        start: 'top 85%', // Start the animation when the footer is 85% from the top of the viewport
      }
    });

    tl.fromTo('.footer-brand, .footer-links > div, .footer-bottom > *', {
      autoAlpha: 0,
      y: 40,
    }, {
      autoAlpha: 1,
      y: 0,
      duration: 1,
      stagger: 0.15,
      ease: 'power3.out',
    });

  }, { scope: footerRef });

  return (
    <footer ref={footerRef} className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <RealmLogo />
          <h3>Realm</h3>
          <p>Collaborative Coding, Redefined.</p>
        </div>
        <div className="footer-links">
          <div>
            <h4>Product</h4>
            <a href="#">Features</a>
            <a href="#">Pricing</a>
            <a href="#">Updates</a>
          </div>
          <div>
            <h4>Company</h4>
            <a href="#">About</a>
            <a href="#">Careers</a>
            <a href="#">Contact</a>
          </div>
          <div>
            <h4>Resources</h4>
            <a href="#">Documentation</a>
            <a href="#">Help Center</a>
            <a href="#">API Status</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Realm. All rights reserved.</p>
        <div className="social-icons">
          <a href="#"><FaTwitter /></a>
          <a href="#"><FaGithub /></a>
          <a href="#"><FaLinkedin /></a>
        </div>
      </div>
    </footer>
  );
}