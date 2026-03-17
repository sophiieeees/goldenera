// client/src/components/ui/MotivationalPhrase/MotivationalPhrase.tsx
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import './MotivationalPhrase.scss';

gsap.registerPlugin(ScrollTrigger);

interface Quote {
  id: number;
  text: string;
  color: 'white' | 'black' | 'golden';
}

const MotivationalPhrase: React.FC = () => {
  const { t, i18n } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoPlayRef = useRef<NodeJS.Timeout>();

  // Frases en strings
  const quotes: Quote[] = [
    { id: 1, text: `${t('home.phrases.phrase1.part1')} ${t('home.phrases.phrase1.part2')}`, color: 'golden' },
    { id: 2, text: t('home.phrases.phrase2'), color: 'black' },
    { id: 3, text: `${t('home.phrases.phrase3.part1')} ${t('home.phrases.phrase3.part2')}`, color: 'golden' },
    { id: 4, text: t('home.phrases.phrase4'), color: 'black' },
    { id: 5, text: `${t('home.phrases.phrase5.part1')} ${t('home.phrases.phrase5.part2')}`, color: 'golden' },
    { id: 6, text: t('home.phrases.phrase6'), color: 'black' },
  ];

  // Fade-in al hacer scroll
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(sectionRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Cambio automático de frases
  useEffect(() => {
    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
    }, 4000);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [quotes.length]);

  return (
    <section ref={sectionRef} className="motivational-phrase-section">
      <div className="motivational-phrase-line">
        {quotes.map((quote, index) => (
          <span
            key={quote.id}
            className={`motivational-phrase-item ${quote.color} ${index === currentIndex ? 'active' : ''}`}
          >
            {quote.text}
          </span>
        ))}
      </div>
    </section>
  );
};

export default MotivationalPhrase;
