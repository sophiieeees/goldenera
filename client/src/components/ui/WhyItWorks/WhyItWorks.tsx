import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from 'gsap/TextPlugin';
import './WhyItWorks.scss';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

const WhyItWorks: React.FC = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animación título
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Animación subtítulo
      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1,
          delay: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: subtitleRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="why-it-works">
      <div className="why-it-works__wrapper">
        <div className="why-it-works__container">
          {/* Texto decorativo en árabe */}
          <div className="why-it-works__arabic-text">
            لماذا يعمل
          </div>

          <h2 ref={titleRef} className="why-it-works__title">
            WHY IT WORKS
          </h2>

          <div ref={subtitleRef} className="why-it-works__subtitle">
            {t('home.whyItWorks.subtitle')}
          </div>

          {/* Bloque de tres secciones continuas */}
          <div className="why-it-works__features">
            <div className="why-it-works__feature">
              <h3 className="why-it-works__feature-title">
                {t('home.whyItWorks.cards.technique.title')}
              </h3>
              <p className="why-it-works__feature-description">
                {t('home.whyItWorks.cards.technique.backText')}
              </p>
            </div>

            <div className="why-it-works__feature">
              <h3 className="why-it-works__feature-title">
                {t('home.whyItWorks.cards.recipes.title')}
              </h3>
              <p className="why-it-works__feature-description">
                {t('home.whyItWorks.cards.recipes.backText')}
              </p>
            </div>

            <div className="why-it-works__feature">
              <h3 className="why-it-works__feature-title">
                {t('home.whyItWorks.cards.science.title')}
              </h3>
              <p className="why-it-works__feature-description">
                {t('home.whyItWorks.cards.science.backText')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="why-it-works__stats">
          <div className="why-it-works__stat">
            <span className="why-it-works__stat-number">87%</span>
            <span className="why-it-works__stat-text">
              {t('home.whyItWorks.stats.improvement')}
            </span>
          </div>
          <div className="why-it-works__stat">
            <span className="why-it-works__stat-number">3.2x</span>
            <span className="why-it-works__stat-text">
              {t('home.whyItWorks.stats.effectiveness')}
            </span>
          </div>
          <div className="why-it-works__stat">
            <span className="why-it-works__stat-number">95%</span>
            <span className="why-it-works__stat-text">
              {t('home.whyItWorks.stats.adherence')}
            </span>
          </div>
        </div>
        <div className="why-it-works__citations">
          <p>{t('home.whyItWorks.citations.study')}</p>
          <p>{t('home.whyItWorks.citations.comparison')}</p>
          <p>{t('home.whyItWorks.citations.retention')}</p>
        </div>
      </div>
      
    </section>
  );
};

export default WhyItWorks;
