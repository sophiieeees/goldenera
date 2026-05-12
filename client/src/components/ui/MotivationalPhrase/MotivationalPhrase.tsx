import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useTranslation } from 'react-i18next';
import './MotivationalPhrase.scss';

const MotivationalPhrase: React.FC = () => {
  const { t } = useTranslation();

  const tickerRef = useRef<HTMLDivElement>(null);

  const quotes = [
    {
      text: `${t('home.phrases.phrase1.part1')} ${t(
        'home.phrases.phrase1.part2'
      )}`,
      color: 'black'
    },
    { text: t('home.phrases.phrase2'), color: 'golden' },
    {
      text: `${t('home.phrases.phrase3.part1')} ${t(
        'home.phrases.phrase3.part2'
      )}`,
      color: 'black'
    },
    { text: t('home.phrases.phrase4'), color: 'golden' },
    {
      text: `${t('home.phrases.phrase5.part1')} ${t(
        'home.phrases.phrase5.part2'
      )}`,
      color: 'black'
    },
    { text: t('home.phrases.phrase6'), color: 'golden' }
  ];

  useEffect(() => {
    if (!tickerRef.current) return;

    const ticker = tickerRef.current;

    // limpiar clones anteriores
    const oldClones = ticker.querySelectorAll('.clone');
    oldClones.forEach((clone) => clone.remove());

    // duplicar contenido
    Array.from(ticker.children).forEach((item) => {
      const clone = item.cloneNode(true) as HTMLElement;
      clone.classList.add('clone');
      ticker.appendChild(clone);
    });

    const totalWidth = ticker.scrollWidth / 2;

    const animation = gsap.fromTo(
      ticker,
      { x: 0 },
      {
        x: -totalWidth,
        duration: 40,
        ease: 'none',
        repeat: -1
      }
    );

    return () => {
      animation.kill();
    };
  }, [t]);

  return (
    <section className="motivational-phrase-section">
      <div className="motivational-ticker" ref={tickerRef}>
        {quotes.map((quote, index) => (
          <span
            key={index}
            className={`motivational-phrase-item ${
              quote.color === 'golden'
                ? 'text-golden'
                : 'text-black'
            }`}
          >
            {quote.text}
          </span>
        ))}
      </div>
    </section>
  );
};

export default MotivationalPhrase;
