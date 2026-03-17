import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import './WhyItWorks.scss';

gsap.registerPlugin(ScrollTrigger);

interface Feature {
  id: string;
  titleKey: string;
  descriptionKey: string;
}

const features: Feature[] = [
  { id: 'technique', titleKey: 'home.whyItWorks.cards.technique.title', descriptionKey: 'home.whyItWorks.cards.technique.backText' },
  { id: 'recipes', titleKey: 'home.whyItWorks.cards.recipes.title', descriptionKey: 'home.whyItWorks.cards.recipes.backText' },
  { id: 'science', titleKey: 'home.whyItWorks.cards.science.title', descriptionKey: 'home.whyItWorks.cards.science.backText' },
];

const WhyItWorks: React.FC = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const featureRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    featureRefs.current.forEach((feature, i) => {
      gsap.fromTo(
        feature,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: i * 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: feature,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });
  }, []);

  return (
    <section ref={sectionRef} className="why-it-works">
      <div className="why-it-works__wrapper">
        <div className="why-it-works__container">
          <div className="why-it-works__arabic-text">لماذا يعمل</div>
          <h2 className="why-it-works__title">WHY IT WORKS</h2>
          <div className="why-it-works__subtitle">{t('home.whyItWorks.subtitle')}</div>

          <div className="why-it-works__features">
            {features.map((feature, i) => (
              <div
                key={feature.id}
                className="why-it-works__feature"
                ref={(el) => { if (el) featureRefs.current[i] = el; }}
              >
                <div className="why-it-works__feature-number">{`0${i + 1}`}</div>
                <h3 className="why-it-works__feature-title">{t(feature.titleKey)}</h3>
                <p className="why-it-works__feature-description">{t(feature.descriptionKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyItWorks;
