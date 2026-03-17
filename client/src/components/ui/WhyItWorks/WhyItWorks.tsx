import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './WiseWorks.scss';

gsap.registerPlugin(ScrollTrigger);

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode; // puedes usar SVG o componente de icono
}

const features: Feature[] = [
  {
    id: 'personalized',
    title: 'Personalized Approach',
    description: 'Tailored programs to maximize your results and fit your lifestyle.',
    icon: (
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#EAC31B" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
  },
  {
    id: 'tracking',
    title: 'Advanced Tracking',
    description: 'Monitor your progress with precise analytics and smart metrics.',
    icon: (
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#EAC31B" strokeWidth="2">
        <path d="M12 2v20M2 12h20" />
      </svg>
    ),
  },
  {
    id: 'support',
    title: 'Premium Support',
    description: 'Access to expert guidance whenever you need it.',
    icon: (
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#EAC31B" strokeWidth="2">
        <path d="M4 4h16v16H4z" />
      </svg>
    ),
  },
];

const WiseWorks: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const featureRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (sectionRef.current) {
      featureRefs.current.forEach((feature, i) => {
        gsap.fromTo(
          feature,
          { opacity: 0, y: 50, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            delay: i * 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: feature,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }
  }, []);

  return (
    <section ref={sectionRef} className="wise-works">
      <div className="wise-works__container">
        <h2 className="wise-works__title">WHY WISE WORKS</h2>
        <p className="wise-works__subtitle">
          Discover our unique approach that combines performance, tracking, and premium support.
        </p>

        <div className="wise-works__features">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className="wise-works__feature"
              ref={(el) => {
                if (el) featureRefs.current[index] = el;
              }}
            >
              <div className="wise-works__feature-icon">{feature.icon}</div>
              <h3 className="wise-works__feature-title">{feature.title}</h3>
              <p className="wise-works__feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WiseWorks;
