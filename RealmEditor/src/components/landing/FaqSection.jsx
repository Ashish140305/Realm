// src/components/landing/FaqSection.jsx
import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { FiPlus, FiMinus } from 'react-icons/fi';
import './FaqSection.css';

const faqs = [
  { question: "What is Realm?", answer: "Realm is a real-time collaborative code editor that allows development teams to work together seamlessly in a shared environment. It features built-in version control, team management, and multi-language support." },
  { question: "Is there a free plan available?", answer: "Yes! We offer a free tier for individual developers and small teams to get started. It includes all the core features for real-time collaboration. Paid plans are available for larger teams with advanced needs." },
  { question: "Which languages are supported?", answer: "Realm supports a wide variety of popular programming languages, including Java, JavaScript, Python, C++, HTML, and CSS, with syntax highlighting and basic IntelliSense for each." },
  { question: "How does the version control work?", answer: "Our version control is designed to be simple and intuitive, inspired by Git. You can create branches, commit changes, and merge code without leaving the editor, making your workflow faster and more efficient." }
];

export default function FaqSection() {
  const [openIndexes, setOpenIndexes] = useState([]);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const toggleFAQ = (index) => {
    if (openIndexes.includes(index)) {
      setOpenIndexes(openIndexes.filter((i) => i !== index));
    } else {
      setOpenIndexes([...openIndexes, index]);
    }
  };

  const expandAll = () => setOpenIndexes(faqs.map((_, index) => index));
  const collapseAll = () => setOpenIndexes([]);

  return (
    <section ref={ref} id="faq" className="faq-section">
      <div className={`section-header ${inView ? 'is-visible' : ''}`}>
        <h2>Frequently Asked <span className="highlight">Questions</span></h2>
        <p className="section-subtitle">Have questions? We've got answers. If you can't find what you're looking for, feel free to contact us.</p>
      </div>
      <div className={`faq-controls ${inView ? 'is-visible' : ''}`}>
        <button onClick={expandAll}>Expand All</button>
        <button onClick={collapseAll}>Collapse All</button>
      </div>
      <div className="faq-accordion">
        {faqs.map((faq, index) => {
          const isOpen = openIndexes.includes(index);
          return (
            <div 
              key={index}
              className={`faq-item ${inView ? 'is-visible' : ''}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="faq-question" onClick={() => toggleFAQ(index)}>
                <h3>{faq.question}</h3>
                <span className={`faq-icon ${isOpen ? 'is-open' : ''}`}>
                  {isOpen ? <FiMinus /> : <FiPlus />}
                </span>
              </div>
              <div className={`faq-answer ${isOpen ? 'is-open' : ''}`}>
                <div>
                  <p>{faq.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}