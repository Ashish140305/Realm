// src/components/landing/FeaturesSection.jsx
import React from 'react';
import { useInView } from 'react-intersection-observer';
import { FiCode, FiGitMerge, FiUsers } from 'react-icons/fi';
import '../../styles/FeaturesSection.css'; // This is the correct path

const features = [
  { icon: <FiCode />, title: 'Real-time Collaboration', description: 'Code together in the same file at the same time. See changes instantly and work seamlessly as a pair or a team.' },
  { icon: <FiGitMerge />, title: 'Built-in Version Control', description: 'Easily track changes, create branches, and merge code with our integrated, Git-compatible versioning system.' },
  { icon: <FiUsers />, title: 'Team Management', description: 'Organize your developers into teams, manage permissions, and streamline your workflow all in one place.' }
];

export default function FeaturesSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section ref={ref} className="features-section">
      <div className={`section-header ${inView ? 'is-visible' : ''}`}>
        <h2>Why Choose <span className="highlight">Realm?</span></h2>
        <p className="section-subtitle">Everything you need for a modern, collaborative development environment.</p>
      </div>
      <div className="features-grid">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className={`feature-card ${inView ? 'is-visible' : ''}`} 
            style={{ transitionDelay: `${index * 150}ms` }}
          >
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}