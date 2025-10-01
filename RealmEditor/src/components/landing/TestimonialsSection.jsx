// src/components/landing/TestimonialsSection.jsx
import React from 'react';
import { useInView } from 'react-intersection-observer';
import { Tilt } from 'react-tilt';
import '../../styles/TestimonialsSection.css';

const testimonials = [
  {
    quote: "Realm has transformed how our team collaborates. The real-time editing is flawless and has drastically cut down our development time.",
    author: "Jane Doe",
    title: "Lead Engineer, Tech Innovators",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d"
  },
  {
    quote: "The integrated version control is a game-changer. We've streamlined our entire workflow and can manage everything in one place.",
    author: "John Smith",
    title: "Frontend Developer, Creative Solutions",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026705d"
  },
  {
    quote: "As a project manager, the team management features are invaluable. Onboarding new developers has never been easier.",
    author: "Emily White",
    title: "Project Manager, Agile Systems",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026706d"
  }
];

export default function TestimonialsSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} id="testimonials" className="testimonials-section">
      <div className={`section-header ${inView ? 'is-visible' : ''}`}>
        <h2>Trusted by <span className="highlight">Developers</span> Worldwide</h2>
        <p className="section-subtitle">Don't just take our word for it. Here's what people are saying about Realm.</p>
      </div>
      <div className="testimonials-grid">
        {testimonials.map((testimonial, index) => (
          <Tilt key={index} options={{ max: 15, scale: 1.02, speed: 400 }}>
            <div
              className={`testimonial-card ${inView ? 'is-visible' : ''}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <p className="testimonial-quote">"{testimonial.quote}"</p>
              <div className="testimonial-author">
                <img src={testimonial.avatar} alt={testimonial.author} />
                <div>
                  <h4>{testimonial.author}</h4>
                  <span>{testimonial.title}</span>
                </div>
              </div>
            </div>
          </Tilt>
        ))}
      </div>
    </section>
  );
}