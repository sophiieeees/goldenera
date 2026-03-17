import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from 'gsap/TextPlugin';
import './WhyItWorks.scss';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

interface CardData {
  id: string;
  titleKey: string;
  frontTextKey: string;
  backTextKey: string;
  citationKey: string;
}

const WhyItWorks: React.FC = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const typewriterRef = useRef<HTMLDivElement>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const cards: CardData[] = [
    {
      id: "technique",
      titleKey: "home.whyItWorks.cards.technique.title",
      frontTextKey: "home.whyItWorks.cards.technique.frontText",
      backTextKey: "home.whyItWorks.cards.technique.backText",
      citationKey: "home.whyItWorks.cards.technique.citation"
    },
    {
      id: "recipes",
      titleKey: "home.whyItWorks.cards.recipes.title",
      frontTextKey: "home.whyItWorks.cards.recipes.frontText",
      backTextKey: "home.whyItWorks.cards.recipes.backText",
      citationKey: "home.whyItWorks.cards.recipes.citation"
    },
    {
      id: "science",
      titleKey: "home.whyItWorks.cards.science.title",
      frontTextKey: "home.whyItWorks.cards.science.frontText",
      backTextKey: "home.whyItWorks.cards.science.backText",
      citationKey: "home.whyItWorks.cards.science.citation"
    }
  ];

  const typewriterPhrases = [
    { text: 'TRANSFORM YOUR BODY', color: 'black' },
    { text: 'UNLOCK YOUR POTENTIAL', color: 'primary' },
    { text: 'BECOME UNSTOPPABLE', color: 'black' },
    { text: 'GOLDEN ERA AWAITS', color: 'primary' }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out', scrollTrigger: { trigger: titleRef.current, start: 'top 80%', toggleActions: 'play none none reverse' } }
      );

      if (typewriterRef.current) {
        let tl = gsap.timeline({ repeat: -1, scrollTrigger: { trigger: typewriterRef.current, start: 'top 80%', toggleActions: 'play pause resume pause' } });

        typewriterPhrases.forEach((phrase) => {
          tl.set(typewriterRef.current, { className: `why-it-works__typewriter why-it-works__typewriter--${phrase.color}`, opacity: 0 })
            .to(typewriterRef.current, { opacity: 1, duration: 0.5, ease: 'power2.inOut' })
            .to(typewriterRef.current, { text: { value: phrase.text, delimiter: '' }, duration: phrase.text.length * 0.08, ease: 'none' })
            .to(typewriterRef.current, { opacity: 1, duration: 2 })
            .to(typewriterRef.current, { opacity: 0, duration: 0.5, ease: 'power2.inOut' });
        });
      }

      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1, delay: 0.5, ease: 'power2.out', scrollTrigger: { trigger: subtitleRef.current, start: 'top 85%', toggleActions: 'play none none reverse' } }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleCardClick = (cardId: string) => setExpandedCard(expandedCard === cardId ? null : cardId);

  return (
    <section ref={sectionRef} className="why-it-works">
      <div className="why-it-works__wrapper">
        <div ref={containerRef} className="why-it-works__container">
          <div className="why-it-works__arabic-text">لماذا يعمل</div>

          <h2 ref={titleRef} className="why-it-works__title">WHY IT WORKS</h2>

          <div ref={typewriterRef} className="why-it-works__typewriter why-it-works__typewriter--primary">GOLDEN ERA AWAITS</div>

          <div ref={subtitleRef} className="why-it-works__text-content">
            <span className="why-it-works__subtitle">{t('home.whyItWorks.subtitle')}</span>
            <span className="why-it-works__hint"><br/><br/>{t('home.whyItWorks.clickCard')}</span>
          </div>
        </div>

        <div className="why-it-works__cards">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`why-it-works__card ${expandedCard === card.id ? 'why-it-works__card--expanded' : ''}`}
              onClick={() => handleCardClick(card.id)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => { if (e.key === 'Enter') handleCardClick(card.id); }}
            >
              <div className="why-it-works__card-inner">
                <div className="why-it-works__card-front">
                  <div className="why-it-works__card-gradient" />
                  <div className="why-it-works__card-content">
                    <h3 className="why-it-works__card-title">{t(card.frontTextKey)}</h3>
                  </div>
                </div>
                <div className="why-it-works__card-back">
                  <h3 className="why-it-works__card-back-title">{t(card.titleKey)}</h3>
                  <p className="why-it-works__card-description">{t(card.backTextKey)}</p>
                  <div className="why-it-works__card-citation">{t(card.citationKey)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="why-it-works__stats">
          <div className="why-it-works__stat">
            <span className="why-it-works__stat-number">87%</span>
            <span className="why-it-works__stat-text">{t('home.whyItWorks.stats.improvement')}</span>
          </div>
          <div className="why-it-works__stat">
            <span className="why-it-works__stat-number">3.2x</span>
            <span className="why-it-works__stat-text">{t('home.whyItWorks.stats.effectiveness')}</span>
          </div>
          <div className="why-it-works__stat">
            <span className="why-it-works__stat-number">95%</span>
            <span className="why-it-works__stat-text">{t('home.whyItWorks.stats.adherence')}</span>
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
