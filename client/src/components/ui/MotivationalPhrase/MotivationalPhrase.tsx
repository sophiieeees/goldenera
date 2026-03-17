import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import './MotivationalPhrase.scss';

gsap.registerPlugin(ScrollTrigger);

interface Quote {
  id: number;
  textParts: {
    text: string;
    color: 'white' | 'black' | 'golden';
  }[];
}

const MotivationalPhrase: React.FC = () => {
  const { t, i18n } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoPlayRef = useRef<NodeJS.Timeout>();

  const quotes: Quote[] = [
    { id: 1, textParts: [{ text: t('home.phrases.phrase1'), color: 'golden' }] },
    { id: 2, textParts: [{ text: t('home.phrases.phrase2'), color: 'black' }] },
    { id: 3, textParts: [{ text: t('home.phrases.phrase3'), color: 'golden' }] },
    { id: 4, textParts: [{ text: t('home.phrases.phrase4'), color: 'black' }] },
    { id: 5, textParts: [{ text: t('home.phrases.phrase5'), color: 'golden' }] },
    { id: 6, textParts: [{ text: t('home.phrases.phrase6'), color: 'black' }] },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(sectionRef.current,
        { opacity: 0, y: 50 },
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
      <div className="phrases-wrapper">
        <div
          className="phrases-track"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {quotes.map((quote) => (
            <div key={quote.id} className="phrase">
              {quote.textParts.map((part, idx) => (
                <span key={idx} className={`text-${part.color}`}>
                  {part.text}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MotivationalPhrase;
