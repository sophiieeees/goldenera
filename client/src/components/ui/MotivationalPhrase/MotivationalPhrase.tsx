// client/src/components/ui/MotivationalPhrase/MotivationalPhrase.tsx
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import './MotivationalPhrase.scss';

gsap.registerPlugin(ScrollTrigger);

const MotivationalPhrase: React.FC = () => {
  const { t } = useTranslation();
  const tickerRef = useRef<HTMLDivElement>(null);

  // Todas las frases en un solo array de strings
  const quotes: string[] = [
    `${t('home.phrases.phrase1.part1')} ${t('home.phrases.phrase1.part2')}`,
    t('home.phrases.phrase2'),
    `${t('home.phrases.phrase3.part1')} ${t('home.phrases.phrase3.part2')}`,
    t('home.phrases.phrase4'),
    `${t('home.phrases.phrase5.part1')} ${t('home.phrases.phrase5.part2')}`,
    t('home.phrases.phrase6')
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (tickerRef.current) {
        const tickerItems = tickerRef.current.children;

        // duplicamos las frases para efecto infinito
        const totalItems = Array.from(tickerItems);
        totalItems.forEach((item) => {
          const clone = item.cloneNode(true);
          tickerRef.current?.appendChild(clone);
        });
       // animación continua más lenta
        gsap.to(tickerRef.current, {
          xPercent: -50,
          ease: 'linear',
          duration: 120, // más lento
          repeat: -1
        });

    return () => ctx.revert();
  }, [quotes]);

    return (
    <section className="motivational-phrase-section">
      <div className="motivational-ticker" ref={tickerRef}>
        {quotes.map((quote, index) => (
          <span
            key={index}
            className={`motivational-phrase-item ${quote.color === 'golden' ? 'text-golden' : 'text-black'}`}
          >
            {quote.text}
          </span>
        ))}
      </div>
    </section>
  );
};

export default MotivationalPhrase;
