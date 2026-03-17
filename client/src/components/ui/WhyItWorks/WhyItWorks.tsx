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
      <div className="why-it-works__features">
  <div className="why-it-works__feature">
    <h3 className="why-it-works__feature-title">{t('home.whyItWorks.cards.technique.title')}</h3>
    <p className="why-it-works__feature-description">{t('home.whyItWorks.cards.technique.backText')}</p>
  </div>

  <div className="why-it-works__feature">
    <h3 className="why-it-works__feature-title">{t('home.whyItWorks.cards.recipes.title')}</h3>
    <p className="why-it-works__feature-description">{t('home.whyItWorks.cards.recipes.backText')}</p>
  </div>

  <div className="why-it-works__feature">
    <h3 className="why-it-works__feature-title">{t('home.whyItWorks.cards.science.title')}</h3>
    <p className="why-it-works__feature-description">{t('home.whyItWorks.cards.science.backText')}</p>
  </div>
</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyItWorks;
