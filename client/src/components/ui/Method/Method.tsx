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
      color: '#FFD700'
    },
    {
      number: '02', 
      title: t('home.method.steps.material.title'),
      description: t('home.method.steps.material.description'),
      color: '#FFA500'
    },
    {
      number: '03',
      title: t('home.method.steps.work.title'),
      description: t('home.method.steps.work.description'),
      color: '#FF6B6B'
    }
  ];

  useEffect(() => {
    const section = sectionRef.current;
    const steps = stepsRef.current;
    const title = titleRef.current;

    if (!section || !steps || !title) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 70%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    });

    tl.fromTo('.title-wrapper',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );

    tl.fromTo('.method-description',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
      "-=0.4"
    );

    const stepElements = gsap.utils.toArray('.method-step');
    
    stepElements.forEach((step, index) => {
      const stepEl = step as HTMLElement;
      
      const stepTl = gsap.timeline({
        scrollTrigger: {
          trigger: stepEl,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      });

      stepTl.fromTo(stepEl,
        { rotationY: -45, opacity: 0, x: index % 2 === 0 ? -100 : 100, scale: 0.8 },
        { rotationY: 0, opacity: 1, x: 0, scale: 1, duration: 0.6, ease: "power3.out" }
      );

      stepTl.fromTo(stepEl.querySelector('.step-number'),
        { scale: 0, rotation: -180 },
        { scale: 1, rotation: 0, duration: 0.4, ease: "back.out(2)" },
        "-=0.4"
      );

      stepEl.addEventListener('mouseenter', () => {
        gsap.to(stepEl, { scale: 1.05, boxShadow: "0 20px 60px rgba(234, 195, 27, 0.3)", duration: 0.2 });
      });

      stepEl.addEventListener('mouseleave', () => {
        gsap.to(stepEl, { scale: 1, boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)", duration: 0.2 });
      });
    });

    gsap.to('.connector-line', {
      scaleY: 1,
      duration: 1.5,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: '.method-steps',
        start: "top 60%",
        end: "bottom 40%",
        scrub: 1
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section className="method-section" ref={sectionRef}>
      <div className="container">
        {/* Header */}
        <div className="method-header" ref={titleRef}>
          <div className="title-wrapper">
            <div className="arabic-background">
              <span>طريقة</span>
              <span>العصر</span>
              <span>الذهبي</span>
            </div>
            <h1 className="section-title">
              GOLDEN ERA METHOD
            </h1>
          </div>
          <p className="method-description">{t('home.method.description')}</p>
        </div>

        {/* Steps */}
        <div className="method-steps" ref={stepsRef}>
          <div className="connector-line"></div>
          
          {methodSteps.map((step, index) => (
            <div 
              key={step.number} 
              className={`method-step ${index % 2 === 0 ? 'step-left' : 'step-right'}`}
              style={{ '--step-color': step.color } as React.CSSProperties}
            >
              <div className="step-number">{step.number}</div>
              
              <div className="step-content">
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
