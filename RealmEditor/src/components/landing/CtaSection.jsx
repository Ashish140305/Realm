// src/components/landing/CtaSection.jsx
import React, { useRef, useState, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiCheck, FiMail } from 'react-icons/fi';
import Tilt from 'react-parallax-tilt'; // UPDATED: Import from the new library
import '../../styles/CtaSection.css';

gsap.registerPlugin(ScrollTrigger);

const plans = [
  { name: "Starter", price: { monthly: 0, yearly: 0 }, period: "/ forever", description: "Perfect for individuals and hobby projects.", features: ["Real-time Collaboration", "Basic Version Control", "1 Private Project"], isFeatured: false },
  { name: "Pro", price: { monthly: 15, yearly: 12 }, period: "/ user / month", description: "For professional teams who need more power.", features: ["All Starter Features", "Advanced Version Control", "Unlimited Private Projects", "Team Management"], isFeatured: true },
  { name: "Enterprise", isContact: true, description: "Have a large team or custom requirements? Let's build a plan that's tailored to your organization's needs.", features: ["Dedicated Support & SLA", "On-Premise Deployment", "Custom Integrations"], buttonText: "Contact Sales" },
];

export default function CtaSection() {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const container = useRef(null);
  const priceRefs = useRef([]);

  useGSAP(() => {
    // Scroll-triggered animations for the section
    gsap.fromTo('.cta-header h2, .cta-header p, .billing-toggle-wrapper', 
      { autoAlpha: 0, y: 30 },
      { autoAlpha: 1, y: 0, stagger: 0.2, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: container.current, start: 'top 75%' }}
    );
    gsap.utils.toArray('.pricing-card').forEach((card) => {
      gsap.fromTo(card, 
        { autoAlpha: 0, y: 50 },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: card, start: 'top 85%' }}
      );
    });
  }, { scope: container });

  // GSAP animations for state changes (toggle and price)
  useEffect(() => {
    // Animate prices
    priceRefs.current.forEach((ref, index) => {
      const plan = plans[index];
      if (plan.isContact || !ref) return;

      const newPrice = billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly;
      const priceObject = { value: parseFloat(ref.textContent.replace('$', '')) || 0 };
      
      gsap.to(priceObject, {
        duration: 0.6,
        value: newPrice,
        ease: 'power2.out',
        onUpdate: () => {
          ref.textContent = `$${Math.round(priceObject.value)}`;
        }
      });
    });

    // Animate discount badge visibility
    gsap.to('.discount-badge', {
      autoAlpha: billingCycle === 'yearly' ? 1 : 0,
      y: billingCycle === 'yearly' ? 0 : -10,
      duration: 0.4,
      ease: 'power2.out'
    });
  }, [billingCycle]);

  const handleToggle = (cycle) => {
    if (cycle === billingCycle) return;
    setBillingCycle(cycle);
    const toggleBg = container.current.querySelector('.toggle-background');
    gsap.to(toggleBg, {
      xPercent: cycle === 'monthly' ? 0 : 100,
      duration: 0.4,
      ease: 'power3.inOut'
    });
  };

  return (
    <section ref={container} className="cta-section">
      <div className="cta-header">
        <h2>Choose Your Plan</h2>
        <p>Start for free, and scale up as your team grows. No credit card required.</p>
      </div>

      <div className="billing-toggle-wrapper">
        <div className="billing-toggle">
          <div className="toggle-background"></div>
          <button onClick={() => handleToggle('monthly')} className={billingCycle === 'monthly' ? 'active' : ''}>Monthly</button>
          <button onClick={() => handleToggle('yearly')} className={billingCycle === 'yearly' ? 'active' : ''}>Yearly</button>
        </div>
        <div className="discount-badge">Save 20%</div>
      </div>

      <div className="pricing-grid">
        {plans.map((plan, index) => (
          <Tilt 
            key={index}
            glareEnable={true} 
            glareMaxOpacity={0.1} 
            tiltMaxAngleX={10} 
            tiltMaxAngleY={10}
            transitionSpeed={1000}
          >
            <div className={`pricing-card ${plan.isFeatured ? 'featured' : ''} ${plan.isContact ? 'contact-card' : ''}`}>
              {plan.isFeatured && <div className="featured-badge">Most Popular</div>}
              
              {plan.isContact ? (
                <div className="contact-card-content">
                  <div className="contact-icon"><FiMail /></div>
                  <h3>{plan.name}</h3>
                  <p className="card-description">{plan.description}</p>
                  <ul className="features-list">
                    {plan.features.map((feature, i) => <li key={i}><FiCheck /> {feature}</li>)}
                  </ul>
                </div>
              ) : (
                <div className="card-header">
                  <h3>{plan.name}</h3>
                  <p className="card-price">
                    <span ref={el => priceRefs.current[index] = el}>
                      ${plan.price.monthly}
                    </span>
                    {plan.period && <span className="price-period">{plan.period}</span>}
                  </p>
                  <p className="card-description">{plan.description}</p>
                </div>
              )}
              
              {!plan.isContact && (
                <ul className="features-list">
                  {plan.features.map((feature, i) => <li key={i}><FiCheck /> {feature}</li>)}
                </ul>
              )}
              <button className="cta-button">
                {plan.buttonText || 'Get Started'}
              </button>
            </div>
          </Tilt>
        ))}
      </div>
    </section>
  );
}