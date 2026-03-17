// client/src/components/ui/Method/Method.tsx
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { images } from '../../../assets';
import './Method.scss';

gsap.registerPlugin(ScrollTrigger);

const Method: React.FC = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  const methodSteps = [
    {
      number: '01',
      title: t('home.method.steps.join.title'),
      description: t('home.method.steps.join.description'),
      image: images.pagos,
    },
    {
      number: '02',
      title: t('home.method.steps.material.title'),
      description: t('home.method.steps.material.description'),
      image: images.whyitworks2,
    },
    {
      number: '03',
      title: t('home.method.steps.work.title'),
      description: t('home.method.steps.work.description'),
      image: images.whyitworks3,
    }
  ];

  useEffect(() => {
    const section = sectionRef.current;
    const steps = stepsRef.current;
    const title = titleRef.current;

    if (!section || !steps || !title) return;

    // TITLE ANIMATION
    gsap.fromTo(title,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );

    // HORIZONTAL SCROLL
    const totalWidth = steps.scrollWidth;
    const viewportWidth = window.innerWidth;

    gsap.to(steps, {
      x: () => -(totalWidth - viewportWidth + 100),
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${totalWidth}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1
      }
    });

    // STEP ANIMATIONS
    const stepElements = gsap.utils.toArray('.method-step');

    stepElements.forEach((step: any) => {
      gsap.fromTo(step,
        {
          opacity: 0,
          y: 80,
          scale: 0.9
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: step,
            start: "left center"
          }
        }
      );

      // GOLD GLOW EFFECT
      ScrollTrigger.create({
        trigger: step,
        start: "left center",
        onEnter: () => {
          gsap.to(step, {
            borderColor: "#d4af37",
            boxShadow: "0 20px 60px rgba(212,175,55,0.25)",
            duration: 0.3
          });
        }
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };

  }, []);

  return (
    <section className="method-section" ref={sectionRef}>
      <div className="container">

        <div className="method-header" ref={titleRef}>
          <h1 className="section-title">GOLDEN ERA METHOD</h1>
          <p className="method-description">
            {t('home.method.description')}
          </p>
        </div>

        <div className="method-steps" ref={stepsRef}>
          {methodSteps.map((step) => (
            <div key={step.number} className="method-step">

              <div className="step-number">{step.number}</div>

              <div className="step-content">
                <div className="step-image">
                  <img src={step.image} alt={step.title} />
                </div>

                <div className="step-info">
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Method;
