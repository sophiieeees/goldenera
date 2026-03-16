// client/src/pages/JoinClub/JoinClub.tsx
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import Package from '../../components/ui/Package/Package';
import './JoinClub.scss';

gsap.registerPlugin(ScrollTrigger);

const JoinClub: React.FC = () => {
  const { t, i18n } = useTranslation();
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to top first, then to pricing plans
    window.scrollTo(0, 0);
    
    const scrollToPricing = () => {
      setTimeout(() => {
        if (pricingRef.current) {
          const offset = 100; // Ajusta este valor según necesites
          const elementPosition = pricingRef.current.offsetTop - offset;
          
          window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
          });
        }
      }, 300); // Aumenté el delay para asegurar que el DOM esté listo
    };

    // Initial scroll when component mounts
    scrollToPricing();

    // Listen for language changes
    const handleLanguageChange = () => {
      setTimeout(() => {
        scrollToPricing();
      }, 100);
    };

    i18n.on('languageChanged', handleLanguageChange);

    // Cleanup listener
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          { opacity: 0, y: 100, scale: 0.8 },
          { opacity: 1, y: 0, scale: 1, duration: 1.5, ease: "power3.out", delay: 0.2 }
        );
      }

      if (subtitleRef.current) {
        gsap.fromTo(subtitleRef.current,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 0.5 }
        );
      }

      // Background particles animation
      if (heroRef.current) {
        const particles = heroRef.current.querySelectorAll('.hero-particle');
        particles.forEach((particle, index) => {
          gsap.to(particle, {
            y: -30,
            x: Math.sin(index) * 20,
            rotation: 360,
            duration: 8 + Math.random() * 4,
            repeat: -1,
            ease: "none",
            delay: Math.random() * 2
          });
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="join-club-page">
      {/* Hero Section */}
      <section className="join-hero" ref={heroRef}>
        <div className="join-hero__background">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="hero-particle" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`
            }}></div>
          ))}
        </div>

        <div className="join-hero__container">
          <div className="join-hero__content">
            <h1 className="join-hero__title" ref={titleRef}>
              <span className="title-pre">{t('join.hero.titlePre')}</span>
              <span className="title-main">{t('join.hero.titleMain')}</span>
              <span className="title-post">{t('join.hero.titlePost')}</span>
            </h1>

            <p className="join-hero__subtitle" ref={subtitleRef}>
              {t('join.hero.subtitle')}
            </p>

            <div className="join-hero__stats">
              <div className="stat-item">
                <span className="stat-number">50</span>
                <span className="stat-label">{t('join.stats.spots')}</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">{t('join.stats.transformation')}</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">0%</span>
                <span className="stat-label">{t('join.stats.excuses')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="join-hero__scroll-indicator">
          <div className="scroll-arrow"></div>
          <span>{t('join.hero.scrollIndicator')}</span>
        </div>
      </section>

      {/* Pricing Plans Section */}
      <div ref={pricingRef}>
        <PricingPlans />
      </div>

      {/* Testimonial Section */}
      <section className="join-testimonial">
        <div className="join-testimonial__container">
          <div className="testimonial-content">
            <div className="testimonial-quote">
              <svg className="quote-icon" width="60" height="60" viewBox="0 0 24 24">
                <path fill="#EAC31B" d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
              </svg>
              <p>"{t('join.testimonial.quote')}"</p>
            </div>
            <div className="testimonial-author">
              <div className="author-info">
                <h4>{t('join.testimonial.authorName')}</h4>
                <span>{t('join.testimonial.authorTitle')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="join-final-cta">
        <div className="join-final-cta__container">
          <h2 className="final-cta-title">
            <span>{t('join.finalCta.title.part1')}</span>
            <span className="golden-text">{t('join.finalCta.title.part2')}</span>
          </h2>
          <p className="final-cta-text">
            {t('join.finalCta.text')}
          </p>
        </div>
      </section>
    </div>
  );
};

export default JoinClub;
