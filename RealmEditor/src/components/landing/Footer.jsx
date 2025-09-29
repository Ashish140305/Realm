// src/components/landing/Footer.jsx
import React from 'react';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';
import '../../styles/Footer.css';
import RealmLogo from '../../assets/RealmLogo';

export default function Footer() {
  return (
    <footer className="footer">
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